import { injectable, inject } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import {
  AbstractViewContribution,
  FrontendApplication,
} from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';

import {
  Command,
  MAIN_MENU_BAR,
  MenuNode,
  SubMenuOptions,
  CommandRegistry,
  MessageService,
} from '@theia/core/lib/common';

import {
  OutputChannelManager,
  OutputChannelSeverity,
} from '@theia/output/lib/browser/output-channel';
import { InputOptions } from '@theia/core/lib/browser/';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { Git } from '@theia/git/lib/common';
import { GitRepositoryProvider } from '@theia/git/lib/browser/git-repository-provider';
import { MonacoQuickInputService } from '@theia/monaco/lib/browser/monaco-quick-input-service';
import { SmartCLIDEBackendService } from '../common/protocol';

import {
  postBuild,
  getBuildStatus,
  postDeploy,
  getDeployStatus,
} from '../common/fetchMethods';

const SmartCLIDEDeploymentWidgetCommand: Command = {
  id: 'command-deployment-widget.command',
  label: 'Deployment: Dashboard',
};

const CommandBuild: Command = {
  id: 'command-deployment-build.command',
  label: 'Deployment: New Build',
};

const CommandBuildStatus: Command = {
  id: 'command-deployment-build-status.command',
  label: 'Deployment: Build Status',
};

const CommandDeploymentDeploy: Command = {
  id: 'command-deployment-deploy.command',
  label: 'Deployment: New Deploy',
};
const CommandDeploymentStatus: Command = {
  id: 'command-deployment-deploy-monitoring.command',
  label: 'Deployment: Deployment Status',
};

interface Settings {
  repoUser: string;
  repoUrl: string;
  project: string;
  token: string;
  branch: string;
  yml: string;
  image: string;
  port: string;
  replicas: string;
  apiHost: string;
}
@injectable()
export class SmartCLIDEDeploymentWidgetContribution extends AbstractViewContribution<SmartCLIDEDeploymentWidget> {
  /**
   * `AbstractViewContribution` handles the creation and registering
   *  of the widget including commands, menus, and keybindings.
   *
   * We can pass `defaultWidgetOptions` which define widget properties such as
   * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
   *
   */

  @inject(FrontendApplicationStateService)
  protected readonly stateService: FrontendApplicationStateService;
  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;
  @inject(SmartCLIDEBackendService)
  protected readonly smartCLIDEBackendService: SmartCLIDEBackendService;
  @inject(MessageService) private readonly messageService: MessageService;
  @inject(OutputChannelManager)
  private readonly outputChannelManager: OutputChannelManager;
  @inject(MonacoQuickInputService)
  private readonly monacoQuickInputService: MonacoQuickInputService;
  @inject(Git)
  protected readonly git: Git;
  @inject(GitRepositoryProvider)
  protected readonly gitRepositoryProvider: GitRepositoryProvider;
  constructor() {
    super({
      widgetId: SmartCLIDEDeploymentWidget.ID,
      widgetName: SmartCLIDEDeploymentWidget.LABEL,
      defaultWidgetOptions: { area: 'main', mode: 'tab-before' },
      toggleCommandId: SmartCLIDEDeploymentWidgetCommand.id,
    });
  }
  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SmartCLIDEDeploymentWidgetCommand, {
      execute: () => this.openView({ activate: true, reveal: true }),
    });
    commands.registerCommand(CommandBuild, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          repoUser: '',
          repoUrl: '',
          project: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          replicas: '1',
          apiHost: '',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        const currentRepository = this.gitRepositoryProvider.selectedRepository;

        const curentBranch =
          currentRepository &&
          ((await this.git.branch(currentRepository, { type: 'current' }))
            ?.name ||
            '');

        if (!currentProject || !currentRepository || !curentBranch) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.smartclide-settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        const optionsApiHost: InputOptions = {
          placeHolder: 'Api Host url ',
          prompt: 'Enter Api Host Url:',
          value: settings.apiHost,
        };

        const apiHost = !settings?.apiHost
          ? await this.monacoQuickInputService
              .input(optionsApiHost)
              .then((value): string => value || '')
          : settings?.apiHost;

        settings.apiHost = apiHost;

        const optionsRepoUrl: InputOptions = {
          placeHolder: 'Repository url ',
          prompt: 'Enter Repository Url:',
          value: settings.repoUrl,
        };

        const repoUrl = !settings?.repoUrl
          ? await this.monacoQuickInputService
              .input(optionsRepoUrl)
              .then((value): string => value || '')
          : settings?.repoUrl;
        settings.repoUrl = repoUrl;

        settings.repoUser = new URL(settings?.repoUrl).pathname.split('/')[1];

        settings.project = currentProject;
        settings.branch = curentBranch;

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }
        const currentYaml = await this.smartCLIDEBackendService.fileReadYaml(
          `${currentPath}/.gitlab-ci.yml`
        );

        if (!currentYaml || currentYaml?.errno) {
          const actionsConfirmYaml = ['Create', 'Cancel'];

          const templateYaml = {
            image: 'docker:latest',
            services: ['docker:dind'],
            stages: ['build'],
            variables: {
              CONTAINER_IMAGE: `${settings.repoUser}/${settings.project}`,
            },
            build: {
              stage: 'build',
              script: [
                'docker login',
                `docker build -t ${settings.repoUser}/${settings.project} .`,
                `docker push ${settings.repoUser}/${settings.project}`,
              ],
            },
            // deploy: { services: '' },
          };

          await this.messageService
            .info(
              `You need a valid .gitlab-ci.yml file, the root repository.`,
              ...actionsConfirmYaml
            )
            .then(async (action) => {
              if (action === 'Create') {
                this.smartCLIDEBackendService.fileWriteYaml(
                  `${currentPath}/.gitlab-ci.yml`,
                  JSON.parse(JSON.stringify(templateYaml))
                );
                const newCurrentYaml =
                  await this.smartCLIDEBackendService.fileReadYaml(
                    `${currentPath}/.gitlab-ci.yml`
                  );
                settings.yml = JSON.stringify(newCurrentYaml);
              } else {
                return;
              }
            });
        } else {
          settings.yml = JSON.stringify(currentYaml);
        }
        if (settings.yml?.length === 0) {
          return;
        }

        //// ---------- FLOW ------------ /////

        //// ---------- MOCK PREPARE TO BUILD ------------ /////
        settings.image = `${settings.repoUser}/${currentProject}`;
        this.smartCLIDEBackendService.fileWrite(
          `${currentPath}/.smartclide-settings.json`,
          JSON.stringify(settings)
        );
        channel.show();
        // UNCOMMENT TO MOCK IF API DOWNS
        // channel.appendLine(`Mock Start build ${settings.project}...`);
        // console.log("postBuild", postBuild);

        //// ---------- PROCESS PREPARE BUILD ------------ /////
        const actionsConfirmBuild = ['Build now', 'Cancel'];
        let interval: any;
        settings?.token
          ? this.messageService
              .info(
                `Are you sure launch build to PROJECT: ${settings.project}?`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === 'Build now') {
                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.smartclide-settings.json`,
                    JSON.stringify(settings)
                  );
                  channel.show();
                  channel.appendLine(`Start build ${settings.project}...`);
                  const res: Record<string, any> = await postBuild(
                    settings.apiHost,
                    settings.project,
                    settings.token,
                    settings.branch,
                    settings.yml
                  );
                  console.log('res?.status', res?.status);
                  if (res?.status === 'running') {
                    this.messageService.warn('Job building...');
                    channel.appendLine(
                      'Job building...',
                      OutputChannelSeverity.Info
                    );
                    interval = setInterval(async () => {
                      const resp: Record<string, any> = await getBuildStatus(
                        settings.apiHost,
                        settings.project,
                        settings.token
                      );
                      console.log('resp?.status', resp?.status);
                      if (resp?.status === 'success') {
                        if (resp.image) {
                          settings.image = res?.image;
                          this.smartCLIDEBackendService.fileWrite(
                            `${currentPath}/.smartclide-settings.json`,
                            JSON.stringify(settings)
                          );
                        }
                        clearInterval(interval);
                        this.messageService.info('Job ready to deploy');
                        channel.appendLine(
                          'Job ready to deploy',
                          OutputChannelSeverity.Info
                        );
                      }
                      if (resp?.status === 'error') {
                        console.log('error fecth', resp);
                        clearInterval(interval);
                        this.messageService.error(resp?.message);
                        channel.appendLine(
                          resp?.message,
                          OutputChannelSeverity.Error
                        );
                      }
                    }, 8000);
                  }
                  if (res?.status === 'error') {
                    console.log('error fecth', res);
                    this.messageService.error(res?.message);
                    channel.appendLine(
                      res?.message,
                      OutputChannelSeverity.Error
                    );
                  }
                } else {
                  return;
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(
              `Error PROJECT and SECRECT TOKEN are required`
            );
      },
    });
    commands.registerCommand(CommandBuildStatus, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          repoUser: '',
          project: '',
          repoUrl: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          replicas: '1',
          apiHost: '',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.smartclide-settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        settings.project = currentProject;

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        const actionsConfirmBuild = ['Check now', 'Cancel'];

        //// ---------- PREPARE TO BUILD ------------ /////
        settings?.token
          ? this.messageService
              .info(`PROJECT: ${settings.project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(`Checking status ${settings.project}...`);

                  const res: Record<string, any> = await getBuildStatus(
                    settings.apiHost,
                    settings.project,
                    settings.token
                  );

                  settings.image = res.image || 'mock';

                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.smartclide-settings.json`,
                    JSON.stringify(settings)
                  );

                  channel.appendLine(
                    `Status: ${res?.status || res?.detail}...`,
                    OutputChannelSeverity.Warning
                  );
                } else {
                  return;
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(`Error TOKEN are required`);
      },
    });

    commands.registerCommand(CommandDeploymentDeploy, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          repoUser: '',
          repoUrl: '',
          project: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          replicas: '1',
          apiHost: '',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.smartclide-settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        //// ---------- PREPARE TO BUILD ------------ /////
        settings?.token;
        const optionsPort: InputOptions = {
          placeHolder: 'Enter Deploy Port',
          prompt: 'Enter Deploy Port:',
        };

        const port = !settings?.port
          ? await this.monacoQuickInputService
              .input(optionsPort)
              .then((value): string => value || '')
          : settings?.port;

        settings.port = port;

        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        let interval: any;
        if (settings?.image && settings?.token && settings.port) {
          this.messageService
            .info(
              `Are you sure launch deploy to PROJECT: ${settings.project}?`,
              ...actionsConfirmDeploy
            )
            .then(async (action) => {
              if (action === 'Deploy now') {
                this.smartCLIDEBackendService.fileWrite(
                  `${currentPath}/.smartclide-settings.json`,
                  JSON.stringify(settings)
                );
                channel.show();
                channel.appendLine(`Start deploy ${settings.project}...`);
                const res: Record<string, any> = await postDeploy(
                  settings.apiHost,
                  settings.image,
                  settings.token,
                  settings.port,
                  settings.image,
                  settings.replicas
                );

                if (res?.status === 'running') {
                  this.messageService.warn(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Info);
                  setTimeout(() => {
                    this.messageService.warn('Job building...');
                    channel.appendLine(
                      'Job building...',
                      OutputChannelSeverity.Warning
                    );
                  }, 2000);
                  interval = setInterval(async () => {
                    const resp: Record<string, any> = await getDeployStatus(
                      settings.apiHost,
                      settings.project,
                      settings.token
                    );
                    console.log('resp', resp.status);

                    if (resp?.status === 'success') {
                      if (resp.image) {
                        settings.image = res.image;
                        this.smartCLIDEBackendService.fileWrite(
                          `${currentPath}/.smartclide-settings.json`,
                          JSON.stringify(settings)
                        );
                      }
                      clearInterval(interval);
                      this.messageService.info('Job ready to deploy');
                      channel.appendLine(
                        'Job ready to deploy',
                        OutputChannelSeverity.Info
                      );
                    }
                    if (resp?.status === 'error') {
                      console.log('error fecth', resp);
                      clearInterval(interval);
                      this.messageService.error(resp?.message);
                      channel.appendLine(
                        resp?.message,
                        OutputChannelSeverity.Error
                      );
                    }
                  }, 8000);
                }
                if (res?.status === 'error') {
                  console.log('error fecth', res);
                  this.messageService.error(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Error);
                }
              } else {
                return;
              }
            });
        } else {
          this.messageService.error(
            'Error you need to have at least one build image'
          );
          channel.appendLine(
            'Error you need to have at least one build image',
            OutputChannelSeverity.Error
          );
        }
      },
    });
    commands.registerCommand(CommandDeploymentStatus, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          repoUser: '',
          project: '',
          repoUrl: '',
          token: '',
          branch: '',
          yml: '',
          image: '',
          port: '',
          replicas: '1',
          apiHost: '',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        );

        if (prevSettings.errno) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.smartclide-settings.json`,
            JSON.stringify(settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          settings = newSettings && { ...JSON.parse(newSettings) };
        } else {
          settings = { ...JSON.parse(prevSettings) };
        }

        settings.project = currentProject;

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        //// ---------- FLOW ------------ /////

        const optionsToken: InputOptions = {
          placeHolder: 'Enter Project Secrect Token',
          prompt: 'Enter Project Secrect Token:',
        };

        //// ---------- FLOW ------------ /////
        const newToken = !settings?.token
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.token;

        settings.token = newToken;

        const actionsConfirmBuild = ['Check now', 'Cancel'];

        //// ---------- PREPARE TO BUILD ------------ /////
        settings?.token
          ? this.messageService
              .info(`PROJECT: ${settings.project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(`Checking status ${settings.project}...`);

                  const res: Record<string, any> = await getDeployStatus(
                    settings.apiHost,
                    settings.project,
                    settings.token
                  );

                  settings.image = res.image || 'mock';

                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.smartclide-settings.json`,
                    JSON.stringify(settings)
                  );

                  channel.appendLine(
                    `Status: ${res?.status || res?.detail}...`,
                    OutputChannelSeverity.Warning
                  );
                } else {
                  return;
                }
              })
              .catch((err) => this.messageService.error(err.message))
          : this.messageService.error(`Error TOKEN are required`);
      },
    });
  }
  registerMenus(menus: MenuModelRegistry): void {
    const subMenuPath = [...MAIN_MENU_BAR, 'deployments'];
    menus.registerSubmenu(subMenuPath, 'Deployments', {
      order: '5',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: SmartCLIDEDeploymentWidgetCommand.id,
      label: 'Dashboard',
      order: '4',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandDeploymentStatus.id,
      label: 'Deployment Status',
      order: '3',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandDeploymentDeploy.id,
      label: 'New Deploy',
      order: '2',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandBuildStatus.id,
      label: 'Build Status',
      order: '1',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandBuild.id,
      label: 'New Build',
      order: '0',
    });
  }

  onStart(app: FrontendApplication): void {
    if (!this.workspaceService.opened) {
      this.stateService.reachedState('initialized_layout').then(() =>
        this.openView({
          activate: true,
          reveal: false,
        })
      );
    }
  }
  initializeLayout(app: FrontendApplication): void {
    this.openView({ activate: true, reveal: true });
  }
}

export class PlaceholderMenuNode implements MenuNode {
  constructor(
    readonly id: string,
    public readonly label: string,
    protected options?: SubMenuOptions
  ) {}

  get icon(): string | undefined {
    return this.options?.iconClass;
  }

  get sortString(): string {
    return this.options?.order || this.label;
  }
}
