import { injectable, inject } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import {
  AbstractViewContribution,
  FrontendApplication,
} from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';

import { BASE_URL } from '../common/constants';

import {
  Command,
  MAIN_MENU_BAR,
  MenuNode,
  SubMenuOptions,
  CommandRegistry,
  MessageService,
} from '@theia/core';

import {
  OutputChannelManager,
  OutputChannelSeverity,
} from '@theia/output/lib/browser/output-channel';

import { InputOptions } from '@theia/core/lib/browser';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { MonacoQuickInputService } from '@theia/monaco/lib/browser/monaco-quick-input-service';
import { SmartCLIDEBackendService } from '../common/protocol';
import { Git, Repository } from '@theia/git/lib/common';
import { GitRepositoryProvider } from '@theia/git/lib/browser/git-repository-provider';
import { postDeploy, getDeployStatus } from '../common/fetchMethods';

const SmartCLIDEDeploymentWidgetCommand: Command = {
  id: 'command-deployment-widget.command',
  label: 'Deployment: Dashboard',
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
  k8sUrl: string;
  k8sToken: string;
  project: string;
  gitLabToken: string;
  branch: string;
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
    commands.registerCommand(CommandDeploymentDeploy, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          k8sUrl: '',
          k8sToken: '',
          project: '',
          gitLabToken: '',
          branch: '',
          replicas: '1',
          apiHost: BASE_URL,
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

        //// ---------- RETRIEVE USER DATA ------------ /////
        const localUri: Repository | undefined =
          this.gitRepositoryProvider.selectedRepository;

        const branchName =
          (localUri &&
            (await this.git.branch(localUri, { type: 'current' }))?.name) ||
          'main';

        const optionsGitLabToken: InputOptions = {
          placeHolder: 'Enter GitLab Token',
          prompt: 'Enter GitLab Token:',
        };

        const optionsK8sUrl: InputOptions = {
          placeHolder: 'Enter Kubernetes Url',
          prompt: 'Enter Kubernetes Url:',
        };
        const optionsK8sToken: InputOptions = {
          placeHolder: 'Enter Kubernetes Token',
          prompt: 'Enter Kubernetes Token:',
        };

        const k8sUrl = !settings?.k8sUrl
          ? await this.monacoQuickInputService
              .input(optionsK8sUrl)
              .then((value): string => value || '')
          : settings?.k8sUrl;

        const k8sToken = !settings?.k8sToken
          ? await this.monacoQuickInputService
              .input(optionsK8sToken)
              .then((value): string => value || '')
          : settings?.k8sToken;

        const gitLabToken = !settings?.gitLabToken
          ? await this.monacoQuickInputService
              .input(optionsGitLabToken)
              .then((value): string => value || '')
          : settings?.gitLabToken;

        settings.project = currentProject;
        settings.branch = branchName;
        settings.k8sToken = k8sToken;
        settings.k8sUrl = k8sUrl;
        settings.gitLabToken = gitLabToken;

        //// ---------- PREPARE TO BUILD ------------ /////
        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        let interval: any;
        if (
          settings.k8sUrl &&
          settings.k8sToken &&
          settings.project &&
          settings.gitLabToken &&
          settings.branch &&
          settings.replicas &&
          settings.apiHost
        ) {
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
                  settings.k8sUrl,
                  settings.k8sToken,
                  settings.project,
                  settings.gitLabToken,
                  settings.branch,
                  settings.replicas,
                  settings.apiHost
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
                      settings.k8sUrl,
                      settings.k8sToken,
                      settings.project,
                      settings.gitLabToken,
                      settings.branch,
                      settings.apiHost
                    );
                    console.log('resp', resp.status);

                    if (resp?.status === 'success') {
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
          k8sUrl: '',
          k8sToken: '',
          project: '',
          gitLabToken: '',
          branch: '',
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
        const newToken = !settings?.gitLabToken
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : settings?.gitLabToken;

        settings.gitLabToken = newToken;

        const actionsConfirmBuild = ['Check now', 'Cancel'];

        //// ---------- PREPARE TO BUILD ------------ /////
        settings?.gitLabToken
          ? this.messageService
              .info(`PROJECT: ${settings.project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(`Checking status ${settings.project}...`);

                  const res: Record<string, any> = await getDeployStatus(
                    settings.k8sUrl,
                    settings.k8sToken,
                    settings.project,
                    settings.gitLabToken,
                    settings.branch,
                    settings.apiHost
                  );

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
      order: '3',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandDeploymentStatus.id,
      label: 'Deployment Status',
      order: '2',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandDeploymentDeploy.id,
      label: 'New Deploy',
      order: '1',
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
