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
import { MonacoQuickInputService } from '@theia/monaco/lib/browser/monaco-quick-input-service';
import { SmartCLIDEBackendService } from '../common/protocol';
import { Git, Repository } from '@theia/git/lib/common';
import { GitRepositoryProvider } from '@theia/git/lib/browser/git-repository-provider';

import { postDeploy, getDeploymentStatus } from '../common/fetchMethods';
import { Settings } from './../common/ifaces';

/// TODO: remove this mock data
// import { mockSettings } from './../common/secrets';

const SmartCLIDEDeploymentWidgetCommand: Command = {
  id: 'command-deployment-widget.command',
  label: 'Deployment: Dashboard',
};

const CommandDeploymentDeploy: Command = {
  id: 'command-deployment-deploy.command',
  label: 'Deployment: New deployment',
};
const CommandDeploymentStatus: Command = {
  id: 'command-deployment-deploy-monitoring.command',
  label: 'Deployment: Last deployment status',
};

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
          user: '',
          gitRepoUrl: '',
          project: '',
          k8sUrl: '',
          hostname: '',
          branch: '',
          replicas: 1,
          deploymentPort: 8080,
          k8sToken: '',
          gitLabToken: '',
          lastDeploy: '',
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
        // settings = mockSettings;

        //// ---------- RETRIEVE USER DATA ------------ /////
        const localUri: Repository | undefined =
          this.gitRepositoryProvider.selectedRepository;

        const branchName =
          (localUri &&
            (await this.git.branch(localUri, { type: 'current' }))?.name) ||
          'main';

        const optionsUser: InputOptions = {
          placeHolder: 'Enter User Name',
          prompt: 'Enter User Name:',
        };

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

        const user = !settings?.user
          ? await this.monacoQuickInputService
              .input(optionsUser)
              .then((value): string => value || '')
          : settings?.user;

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

        settings.user = user;
        settings.project = currentProject;
        settings.branch = branchName;
        settings.k8sToken = k8sToken;
        settings.k8sUrl = k8sUrl;
        settings.gitLabToken = gitLabToken;

        //// ---------- PREPARE TO BUILD ------------ /////
        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        if (
          settings.k8sUrl &&
          settings.k8sToken &&
          settings.project &&
          settings.gitLabToken &&
          settings.branch &&
          settings.replicas
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
                  settings.user,
                  settings.gitRepoUrl,
                  settings.project,
                  settings.k8sUrl,
                  settings.hostname,
                  settings.branch,
                  settings.replicas,
                  settings.deploymentPort,
                  settings.k8sToken,
                  settings.gitLabToken
                );
                if (res?.message) {
                  this.messageService.warn(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Info);
                } else if (res._id) {
                  settings.lastDeploy = res._id;
                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.smartclide-settings.json`,
                    JSON.stringify(settings)
                  );
                } else {
                  this.messageService.error(
                    'Something is worng restart process'
                  );
                  channel.appendLine(
                    'Something is worng restart process',
                    OutputChannelSeverity.Error
                  );
                }
              } else {
                return;
              }
            })
            .catch((err) => console.log('err', err));
        } else {
          this.messageService.error(
            'It is necessary to have at least one repository open.'
          );
          channel.appendLine(
            'It is necessary to have at least one repository open.',
            OutputChannelSeverity.Error
          );
        }
      },
    });
    commands.registerCommand(CommandDeploymentStatus, {
      execute: async () => {
        //// ---------- VARIABLES ------------ /////
        let settings: Settings = {
          user: '',
          gitRepoUrl: '',
          project: '',
          k8sUrl: '',
          hostname: '',
          branch: '',
          replicas: 1,
          deploymentPort: 8080,
          k8sToken: '',
          gitLabToken: '',
          lastDeploy: '',
        };

        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || '';

        if (!currentProject) {
          this.messageService.error(
            'It is necessary to have at least one repository open.'
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

        if (!settings.lastDeploy || settings.lastDeploy === '') {
          channel.show();
          channel.appendLine(`We have not found the last deployment ...`);
          return;
        }

        //// ---------- PREPARE TO BUILD ------------ /////
        settings?.gitLabToken
          ? this.messageService
              .info(`PROJECT: ${settings.project}`, ...actionsConfirmBuild)
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(`Checking status ${settings.project}...`);
                  if (settings.lastDeploy && settings.k8sToken) {
                    const res: any = await getDeploymentStatus(
                      settings.lastDeploy,
                      settings.k8sToken
                    );
                    this.smartCLIDEBackendService.fileWrite(
                      `${currentPath}/.smartclide-settings.json`,
                      JSON.stringify(settings)
                    );
                    if (!res.message) {
                      channel.appendLine(
                        `Status: Deployment are running...`,
                        OutputChannelSeverity.Warning
                      );
                    } else {
                      channel.appendLine(
                        `Status: ${res?.message}...`,
                        OutputChannelSeverity.Warning
                      );
                    }
                  }
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
      label: 'Last deployment status',
      order: '2',
    });
    menus.registerMenuAction(subMenuPath, {
      commandId: CommandDeploymentDeploy.id,
      label: 'New deployment',
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
