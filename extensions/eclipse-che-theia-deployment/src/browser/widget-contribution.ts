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
  constructor() {
    super({
      widgetId: SmartCLIDEDeploymentWidget.ID,
      widgetName: SmartCLIDEDeploymentWidget.LABEL,
      defaultWidgetOptions: { area: 'main', mode: 'tab-before' },
      toggleCommandId: SmartCLIDEDeploymentWidgetCommand.id,
    });
  }

  registerCommands(commands: CommandRegistry): void {
    //// ---------- VARIABLES ------------ /////
    let settings: Settings = {
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
    commands.registerCommand(SmartCLIDEDeploymentWidgetCommand, {
      execute: () => {
        //Handle TOKEN_INFO message from parent
        const handleTokenInfo = (data: any) => {
          switch (data.type) {
            case messageTypes.KEYCLOAK_TOKEN:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content;
              break;
            case messageTypes.COMM_END:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              break;
            case messageTypes.COMM_START_REPLY:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content.token;
              settings.stateServiceID = data.content.serviceID;
              break;
            default:
              break;
          }
        };

        //Send a message to inform SmartCLIDE IDE
        const frontCommMsg = buildMessage(messageTypes.COMM_START);

        frontCommMsg && handleTokenInfo(frontCommMsg);
        if (!frontCommMsg) {
          this.messageService.error(`Error retrieve inform SmartCLIDE IDE.`);
          return;
        }
        this.openView({ activate: true, reveal: true });
      },
    });
    commands.registerCommand(CommandDeploymentDeploy, {
      execute: async () => {
        //Handle TOKEN_INFO message from parent
        const handleTokenInfo = (data: any) => {
          switch (data.type) {
            case messageTypes.KEYCLOAK_TOKEN:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content;
              break;
            case messageTypes.COMM_END:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              break;
            case messageTypes.COMM_START_REPLY:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content.token;
              settings.stateServiceID = data.content.serviceID;
              break;
            default:
              break;
          }
        };

        //Send a message to inform SmartCLIDE IDE
        const frontCommMsg = buildMessage(messageTypes.COMM_START);

        frontCommMsg && handleTokenInfo(frontCommMsg);
        if (!frontCommMsg) {
          this.messageService.error(`Error retrieve inform SmartCLIDE IDE.`);
          return;
        }

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

        const user = !settings?.username
          ? await this.monacoQuickInputService
              .input(optionsUser)
              .then((value): string => value || '')
          : settings?.username;

        const branchName = !settings?.branch
          ? await this.monacoQuickInputService
              .input(optionsBranchName)
              .then((value): string => value || '')
          : settings?.branch;

        const k8s_url = !settings?.k8s_url
          ? await this.monacoQuickInputService
              .input(optionsK8sUrl)
              .then((value): string => value || '')
          : settings?.k8s_url;

        const k8sToken = !settings?.k8sToken
          ? await this.monacoQuickInputService
              .input(optionsK8sToken)
              .then((value): string => value || '')
          : settings?.k8sToken;

        const repository_url = !settings?.repository_url
          ? await this.monacoQuickInputService
              .input(optionsGitRepoUrl)
              .then((value): string => value || '')
          : settings?.repository_url;

        const gitLabToken = !settings?.gitLabToken
          ? await this.monacoQuickInputService
              .input(optionsGitLabToken)
              .then((value): string => value || '')
          : settings?.gitLabToken;

        settings.username = user;
        settings.repository_name = currentProject;
        settings.branch = branchName;
        settings.k8sToken = k8sToken;
        settings.k8s_url = k8s_url;
        settings.repository_url = repository_url;
        settings.gitLabToken = gitLabToken;

        //// ---------- CHECK ACTIVES DEPLOYMENTS  ------------ /////
        const prevDeploy = settings?.lastDeploy;

        if (prevDeploy && prevDeploy.length > 0 && prevDeploy !== '') {
          const lastDeploy: any = await getDeploymentStatus(
            settings.deployUrl,
            settings.stateServiceID,
            settings.stateKeycloakToken,
            prevDeploy,
            settings.repository_url
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
                    settings.deployUrl,
                    settings.stateServiceID,
                    settings.stateKeycloakToken,
                    prevDeploy,
                    settings.k8sToken
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

        //// ---------- PREPARE TO BUILD ------------ /////
        const actionsConfirmDeploy = ['Deploy now', 'Cancel'];
        if (
          settings.k8s_url &&
          settings.k8sToken &&
          settings.repository_name &&
          settings.gitLabToken &&
          settings.branch &&
          settings.replicas
        ) {
          this.messageService
            .info(
              `Are you sure launch deploy to PROJECT: ${settings.repository_name}?`,
              ...actionsConfirmDeploy
            )
            .then(async (action) => {
              if (action === 'Deploy now') {
                settings.lastDeploy = '';
                this.smartCLIDEBackendService.fileWrite(
                  `${currentPath}/.smartclide-settings.json`,
                  JSON.stringify(settings)
                );
                channel.show();
                channel.appendLine(
                  `Start deploy ${settings.repository_name}...`
                );
                const res: Record<string, any> = await postDeploy(
                  settings.deployUrl,
                  settings.stateServiceID,
                  settings.stateKeycloakToken,
                  settings.username,
                  settings.repository_url,
                  settings.repository_name,
                  settings.k8s_url,
                  settings.branch,
                  settings.replicas,
                  settings.container_port,
                  settings.k8sToken,
                  settings.gitLabToken
                );
                if (res?.message) {
                  this.messageService.warn(res?.message);
                  channel.appendLine(res?.message, OutputChannelSeverity.Info);
                } else if (res.id) {
                  channel.show();
                  channel.appendLine(
                    `Deployment ${settings.repository_name} is already...`
                  );
                  settings.lastDeploy = res.id;
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
        //Handle TOKEN_INFO message from parent
        const handleTokenInfo = (data: any) => {
          switch (data.type) {
            case messageTypes.KEYCLOAK_TOKEN:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content;
              break;
            case messageTypes.COMM_END:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              break;
            case messageTypes.COMM_START_REPLY:
              console.log(
                'service-creation: RECEIVED',
                JSON.stringify(data, undefined, 4)
              );
              settings.stateKeycloakToken = data.content.token;
              settings.stateServiceID = data.content.serviceID;
              break;
            default:
              break;
          }
        };

        //Send a message to inform SmartCLIDE IDE
        const frontCommMsg = buildMessage(messageTypes.COMM_START);

        frontCommMsg && handleTokenInfo(frontCommMsg);
        if (!frontCommMsg) {
          this.messageService.error(`Error retrieve inform SmartCLIDE IDE.`);
          return;
        }

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

        settings.repository_name = currentProject;

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
              .info(
                `PROJECT: ${settings.repository_name}`,
                ...actionsConfirmBuild
              )
              .then(async (action) => {
                if (action === 'Check now') {
                  channel.show();
                  channel.appendLine(
                    `Checking status ${settings.repository_name}...`
                  );
                  if (settings.lastDeploy && settings.k8sToken) {
                    const res: any = await getDeploymentStatus(
                      settings.deployUrl,
                      settings.stateServiceID,
                      settings.stateKeycloakToken,
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
