/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable, inject } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import { AbstractViewContribution } from '@theia/core/lib/browser';

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
import { CommandService } from '@theia/core/lib/common/command';

import {
  messageTypes,
  buildMessage,
} from '@unparallel/smartclide-frontend-comm';

import {
  postDeploy,
  getDeploymentStatus,
  deleteDeployment,
} from '../common/fetchMethods';

import { Settings } from './../common/ifaces';

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
  @inject(CommandService) protected readonly commandService: CommandService;
  public settings!: Settings;

  //Handle TOKEN_INFO message from parent
  handleTokenInfo = ({ data }: any) => {
    switch (data.type) {
      case messageTypes.KEYCLOAK_TOKEN:
        console.log(
          'service-creation: RECEIVED',
          JSON.stringify(data, undefined, 4)
        );
        this.settings.stateKeycloakToken = data.content.token;
        break;
      case messageTypes.COMM_END:
        console.log(
          'service-creation: RECEIVED',
          JSON.stringify(data, undefined, 4)
        );
        window.removeEventListener('message', this.handleTokenInfo);
        break;
      case messageTypes.COMM_START_REPLY:
        console.log(
          'service-creation: RECEIVED',
          JSON.stringify(data, undefined, 4)
        );
        this.settings.stateKeycloakToken = data.content.token;
        this.settings.stateServiceID = data.content.serviceID;
        break;
      default:
        break;
    }
  };

  constructor() {
    super({
      widgetId: SmartCLIDEDeploymentWidget.ID,
      widgetName: SmartCLIDEDeploymentWidget.LABEL,
      defaultWidgetOptions: { area: 'main', mode: 'tab-before' },
      toggleCommandId: SmartCLIDEDeploymentWidgetCommand.id,
    });
    //// ---------- VARIABLES ------------ /////
    this.settings = {
      deployUrl: 'https://api.dev.smartclide.eu/deployment-service',
      stateKeycloakToken: '',
      stateServiceID: '',
      username: '',
      repository_url: '',
      repository_name: '',
      k8s_url: '',
      container_port: 6543,
      branch: '',
      replicas: 1,
      k8sToken: '',
      gitLabToken: '',
      lastDeploy: '',
    };
    //Add even listener to get the Keycloak Token
    window.addEventListener('message', this.handleTokenInfo);

    //Send a message to inform SmartCLIDE IDE
    let message = buildMessage(messageTypes.COMM_START);
    window.parent.postMessage(message, '*');
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SmartCLIDEDeploymentWidgetCommand, {
      execute: () => {
        this.openView({ activate: true, reveal: true });
      },
    });
    commands.registerCommand(CommandDeploymentDeploy, {
      execute: async () => {
        const channel = this.outputChannelManager.getChannel('SmartCLIDE');
        channel.clear();

        const currentProject: string | undefined =
          this.workspaceService.workspace?.name?.split('.')[0] || undefined;

        if (!currentProject) {
          this.messageService.error(
            `It is necessary to have at least one repository open.`
          );
          return;
        }

        const currentPath =
          this.workspaceService.workspace?.resource.path.toString() || '';

        if (!currentPath || currentPath === '') {
          this.messageService.error(
            `There have been problems getting the route.`
          );
          return;
        }

        const prevSettings = await this.smartCLIDEBackendService.fileRead(
          `${currentPath}/.smartclide-settings.json`
        );

        if (prevSettings.errno || !prevSettings) {
          this.smartCLIDEBackendService.fileWrite(
            `${currentPath}/.smartclide-settings.json`,
            JSON.stringify(this.settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          this.settings = newSettings && {
            ...JSON.parse(newSettings),
          };
        } else {
          this.settings = { ...JSON.parse(prevSettings) };
        }

        const optionsUser: InputOptions = {
          placeHolder: 'Enter User Name',
          prompt: 'Enter User Name:',
          ignoreFocusLost: true,
        };

        const optionsBranchName: InputOptions = {
          placeHolder: 'Enter Branch Name',
          prompt: 'Enter Branch Name:',
          ignoreFocusLost: true,
        };

        const optionsGitLabToken: InputOptions = {
          placeHolder: 'Enter GitLab Token',
          prompt: 'Enter GitLab Token:',
          ignoreFocusLost: true,
        };

        const optionsGitRepoUrl: InputOptions = {
          placeHolder: 'Enter GitLab Url',
          prompt: 'Enter GitLab Url:',
          ignoreFocusLost: true,
        };

        const optionsK8sUrl: InputOptions = {
          placeHolder: 'Enter Kubernetes Url',
          prompt: 'Enter Kubernetes Url:',
          ignoreFocusLost: true,
        };

        const optionsK8sToken: InputOptions = {
          placeHolder: 'Enter Kubernetes Token',
          prompt: 'Enter Kubernetes Token:',
          ignoreFocusLost: true,
        };

        const user = !this.settings?.username
          ? await this.monacoQuickInputService
              .input(optionsUser)
              .then((value): string => value || '')
          : this.settings?.username;

        const branchName = !this.settings?.branch
          ? await this.monacoQuickInputService
              .input(optionsBranchName)
              .then((value): string => value || '')
          : this.settings?.branch;

        const k8s_url = !this.settings?.k8s_url
          ? await this.monacoQuickInputService
              .input(optionsK8sUrl)
              .then((value): string => value || '')
          : this.settings?.k8s_url;

        const k8sToken = !this.settings?.k8sToken
          ? await this.monacoQuickInputService
              .input(optionsK8sToken)
              .then((value): string => value || '')
          : this.settings?.k8sToken;

        const repository_url = !this.settings?.repository_url
          ? await this.monacoQuickInputService
              .input(optionsGitRepoUrl)
              .then((value): string => value || '')
          : this.settings?.repository_url;

        const gitLabToken = !this.settings?.gitLabToken
          ? await this.monacoQuickInputService
              .input(optionsGitLabToken)
              .then((value): string => value || '')
          : this.settings?.gitLabToken;

        this.settings.username = user;
        this.settings.repository_name = currentProject;
        this.settings.branch = branchName;
        this.settings.k8sToken = k8sToken;
        this.settings.k8s_url = k8s_url;
        this.settings.repository_url = repository_url;
        this.settings.gitLabToken = gitLabToken;

        //// ---------- CHECK ACTIVES DEPLOYMENTS  ------------ /////
        const prevDeploy = this.settings?.lastDeploy;

        if (prevDeploy && prevDeploy.length > 0 && prevDeploy !== '') {
          console.log('service-creation: PREV DEPLOY', prevDeploy);
          const lastDeploy: any = await getDeploymentStatus(
            this.settings.deployUrl,
            this.settings.stateServiceID,
            this.settings.stateKeycloakToken,
            prevDeploy,
            this.settings.repository_url
          );
          if (lastDeploy && lastDeploy?.status === 'active') {
            const actionsConfirmPrevDeploy = ['Deploy new', 'Cancel'];
            const actionDeploymentResult = await this.messageService
              .warn(
                `There is an active deployment you want to stop it and create a new one or review it?`,
                ...actionsConfirmPrevDeploy
              )
              .then(async (action) => {
                if (action === 'Deploy new') {
                  await deleteDeployment(
                    this.settings.deployUrl,
                    this.settings.stateServiceID,
                    this.settings.stateKeycloakToken,
                    prevDeploy,
                    this.settings.k8sToken
                  );
                }
                return action;
              })
              .catch((err) => err);
            if (actionDeploymentResult !== 'Deploy new') {
              return;
            }
          }
        }
        this.settings.lastDeploy = '';
        this.smartCLIDEBackendService.fileWrite(
          `${currentPath}/.smartclide-settings.json`,
          JSON.stringify(this.settings)
        );
        //// ---------- PREPARE TO BUILD ------------ /////
        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        if (
          this.settings.k8s_url &&
          this.settings.k8sToken &&
          this.settings.repository_name &&
          this.settings.gitLabToken &&
          this.settings.branch &&
          this.settings.replicas
        ) {
          this.messageService
            .info(
              `Are you sure launch deploy to PROJECT: ${this.settings.repository_name}?`,
              ...actionsConfirmDeploy
            )
            .then(async (action) => {
              if (action === 'Deploy now') {
                this.settings.lastDeploy = '';
                this.smartCLIDEBackendService.fileWrite(
                  `${currentPath}/.smartclide-settings.json`,
                  JSON.stringify(this.settings)
                );
                console.log('PREPARE TO BUILD');
                channel.show();
                channel.appendLine(
                  `Start deploy ${this.settings.repository_name}...`
                );
                const res: Record<string, any> = await postDeploy(
                  this.settings.deployUrl,
                  this.settings.stateServiceID,
                  this.settings.stateKeycloakToken,
                  this.settings.username,
                  this.settings.repository_url,
                  this.settings.repository_name,
                  this.settings.k8s_url,
                  this.settings.branch,
                  this.settings.replicas,
                  this.settings.container_port,
                  this.settings.k8sToken,
                  this.settings.gitLabToken
                );
                if (res?.message) {
                  this.messageService.warn(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Info);
                } else if (res?.id) {
                  channel.show();
                  channel.appendLine(
                    `Deployment ${this.settings.repository_name} is already...`
                  );
                  this.settings.lastDeploy = res?.id;
                  this.smartCLIDEBackendService.fileWrite(
                    `${currentPath}/.smartclide-settings.json`,
                    JSON.stringify(this.settings)
                  );
                } else {
                  this.messageService.error(
                    'Something is worng restart process'
                  );
                  channel.appendLine(
                    'Something is worng restart process',
                    OutputChannelSeverity.Error
                  );
                  return;
                }
                this.messageService.error('Something is worng restart process');
                channel.appendLine(
                  'Something is worng restart process',
                  OutputChannelSeverity.Error
                );
                return;
              }
              return;
            })
            .catch((err) => console.log('err', err));
        } else {
          this.messageService.error(
            'It is necessary to have at leasts one repository open.'
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
            JSON.stringify(this.settings)
          );
          const newSettings = await this.smartCLIDEBackendService.fileRead(
            `${currentPath}/.smartclide-settings.json`
          );
          this.settings = newSettings && {
            ...JSON.parse(JSON.stringify(newSettings)),
          };
        } else {
          this.settings = { ...JSON.parse(JSON.stringify(prevSettings)) };
        }

        this.settings.repository_name = currentProject;

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
        const newToken = !this.settings?.gitLabToken
          ? await this.monacoQuickInputService
              .input(optionsToken)
              .then((value): string => value || '')
          : this.settings?.gitLabToken;

        this.settings.gitLabToken = newToken;

        const actionsConfirmBuild = ['Check now', 'Cancel'];

        if (!this.settings.lastDeploy || this.settings.lastDeploy === '') {
          channel.show();
          channel.appendLine(`We have not found the last deployment ...`);
          return;
        }

        //// ---------- PREPARE TO BUILD ------------ /////
        this.settings?.gitLabToken
          ? this.messageService
              .info(
                `PROJECT: ${this.settings.repository_name}`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(
                    `Checking status ${this.settings.repository_name}...`
                  );
                  if (this.settings.lastDeploy && this.settings.k8sToken) {
                    const res: any = await getDeploymentStatus(
                      this.settings.deployUrl,
                      this.settings.stateServiceID,
                      this.settings.stateKeycloakToken,
                      this.settings.lastDeploy,
                      this.settings.k8sToken
                    );
                    this.smartCLIDEBackendService.fileWrite(
                      `${currentPath}/.smartclide-settings.json`,
                      JSON.stringify(this.settings)
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

  onStart(): void {
    if (!this.workspaceService.opened) {
      this.stateService.reachedState('initialized_layout').then(() =>
        this.openView({
          activate: true,
          reveal: false,
        })
      );
    }
  }
  initializeLayout(): void {
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
