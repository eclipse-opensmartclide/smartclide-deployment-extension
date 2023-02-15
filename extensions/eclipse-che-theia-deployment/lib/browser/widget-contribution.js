"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceholderMenuNode = exports.SmartCLIDEDeploymentWidgetContribution = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const inversify_1 = require("@theia/core/shared/inversify");
const widget_widget_1 = require("./widget-widget");
const browser_1 = require("@theia/core/lib/browser");
const frontend_application_state_1 = require("@theia/core/lib/browser/frontend-application-state");
const common_1 = require("@theia/core/lib/common");
const output_channel_1 = require("@theia/output/lib/browser/output-channel");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const monaco_quick_input_service_1 = require("@theia/monaco/lib/browser/monaco-quick-input-service");
const protocol_1 = require("../common/protocol");
const command_1 = require("@theia/core/lib/common/command");
const fetchMethods_1 = require("../common/fetchMethods");
const SmartCLIDEDeploymentWidgetCommand = {
    id: 'command-deployment-widget.command',
    label: 'Deployment: Dashboard',
};
const CommandDeploymentDeploy = {
    id: 'command-deployment-deploy.command',
    label: 'Deployment: New deployment',
};
const CommandDeploymentStatus = {
    id: 'command-deployment-deploy-monitoring.command',
    label: 'Deployment: Last deployment status',
};
let SmartCLIDEDeploymentWidgetContribution = class SmartCLIDEDeploymentWidgetContribution extends browser_1.AbstractViewContribution {
    constructor() {
        super({
            widgetId: widget_widget_1.SmartCLIDEDeploymentWidget.ID,
            widgetName: widget_widget_1.SmartCLIDEDeploymentWidget.LABEL,
            defaultWidgetOptions: { area: 'main', mode: 'tab-before' },
            toggleCommandId: SmartCLIDEDeploymentWidgetCommand.id,
        });
    }
    registerCommands(commands) {
        commands.registerCommand(SmartCLIDEDeploymentWidgetCommand, {
            execute: () => this.openView({ activate: true, reveal: true }),
        });
        commands.registerCommand(CommandDeploymentDeploy, {
            execute: async () => {
                var _a, _b, _c;
                //// ---------- VARIABLES ------------ /////
                let settings = {
                    deployUrl: 'https://api.dev.smartclide.eu/deployment-service/deployments/',
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
                const channel = this.outputChannelManager.getChannel('SmartCLIDE');
                channel.clear();
                const currentProject = ((_b = (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.split('.')[0]) || '';
                if (!currentProject) {
                    this.messageService.error(`It is necessary to have at least one repository open.`);
                    return;
                }
                const currentPath = ((_c = this.workspaceService.workspace) === null || _c === void 0 ? void 0 : _c.resource.path.toString()) || '';
                const prevSettings = await this.smartCLIDEBackendService.fileRead(`${currentPath}/.smartclide-settings.json`);
                if (prevSettings.errno) {
                    this.smartCLIDEBackendService.fileWrite(`${currentPath}/.smartclide-settings.json`, JSON.stringify(settings));
                    const newSettings = await this.smartCLIDEBackendService.fileRead(`${currentPath}/.smartclide-settings.json`);
                    settings = newSettings && Object.assign({}, JSON.parse(newSettings));
                }
                else {
                    settings = Object.assign({}, JSON.parse(prevSettings));
                }
                if (!currentPath || currentPath === '') {
                    this.messageService.error(`There have been problems getting the route.`);
                    return;
                }
                const optionsUser = {
                    placeHolder: 'Enter User Name',
                    prompt: 'Enter User Name:',
                    ignoreFocusLost: true,
                };
                const optionsBranchName = {
                    placeHolder: 'Enter Branch Name',
                    prompt: 'Enter Branch Name:',
                    ignoreFocusLost: true,
                };
                const optionsGitLabToken = {
                    placeHolder: 'Enter GitLab Token',
                    prompt: 'Enter GitLab Token:',
                    ignoreFocusLost: true,
                };
                const optionsGitRepoUrl = {
                    placeHolder: 'Enter GitLab Url',
                    prompt: 'Enter GitLab Url:',
                    ignoreFocusLost: true,
                };
                const optionsK8sUrl = {
                    placeHolder: 'Enter Kubernetes Url',
                    prompt: 'Enter Kubernetes Url:',
                    ignoreFocusLost: true,
                };
                const optionsK8sToken = {
                    placeHolder: 'Enter Kubernetes Token',
                    prompt: 'Enter Kubernetes Token:',
                    ignoreFocusLost: true,
                };
                const user = !(settings === null || settings === void 0 ? void 0 : settings.username)
                    ? await this.monacoQuickInputService
                        .input(optionsUser)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.username;
                const branchName = !(settings === null || settings === void 0 ? void 0 : settings.branch)
                    ? await this.monacoQuickInputService
                        .input(optionsBranchName)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.branch;
                const k8s_url = !(settings === null || settings === void 0 ? void 0 : settings.k8s_url)
                    ? await this.monacoQuickInputService
                        .input(optionsK8sUrl)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.k8s_url;
                const k8sToken = !(settings === null || settings === void 0 ? void 0 : settings.k8sToken)
                    ? await this.monacoQuickInputService
                        .input(optionsK8sToken)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.k8sToken;
                const repository_url = !(settings === null || settings === void 0 ? void 0 : settings.repository_url)
                    ? await this.monacoQuickInputService
                        .input(optionsGitRepoUrl)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.repository_url;
                const gitLabToken = !(settings === null || settings === void 0 ? void 0 : settings.gitLabToken)
                    ? await this.monacoQuickInputService
                        .input(optionsGitLabToken)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.gitLabToken;
                settings.username = user;
                settings.repository_name = currentProject;
                settings.branch = branchName;
                settings.k8sToken = k8sToken;
                settings.k8s_url = k8s_url;
                settings.repository_url = repository_url;
                settings.gitLabToken = gitLabToken;
                //// ---------- CHECK ACTIVES DEPLOYMENTS  ------------ /////
                const prevDeploy = settings === null || settings === void 0 ? void 0 : settings.lastDeploy;
                if (prevDeploy && prevDeploy.length > 0 && prevDeploy !== '') {
                    const lastDEploy = await (0, fetchMethods_1.getDeploymentStatus)(settings.deployUrl, prevDeploy, settings.repository_url);
                    if (lastDEploy && (lastDEploy === null || lastDEploy === void 0 ? void 0 : lastDEploy.status) === 'active') {
                        const actionsConfirmPrevDeploy = ['Deploy new', 'Cancel'];
                        const actionDeploymentResult = await this.messageService
                            .warn(`There is an active deployment you want to stop it and create a new one or review it?`, ...actionsConfirmPrevDeploy)
                            .then(async (action) => {
                            if (action === 'Deploy new') {
                                await (0, fetchMethods_1.deleteDeployment)(settings.deployUrl, prevDeploy, settings.k8sToken);
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
                if (settings.k8s_url &&
                    settings.k8sToken &&
                    settings.repository_name &&
                    settings.gitLabToken &&
                    settings.branch &&
                    settings.replicas) {
                    this.messageService
                        .info(`Are you sure launch deploy to PROJECT: ${settings.repository_name}?`, ...actionsConfirmDeploy)
                        .then(async (action) => {
                        if (action === 'Deploy now') {
                            settings.lastDeploy = '';
                            this.smartCLIDEBackendService.fileWrite(`${currentPath}/.smartclide-settings.json`, JSON.stringify(settings));
                            channel.show();
                            channel.appendLine(`Start deploy ${settings.repository_name}...`);
                            const res = await (0, fetchMethods_1.postDeploy)(settings.deployUrl, settings.username, settings.repository_url, settings.repository_name, settings.k8s_url, settings.branch, settings.replicas, settings.container_port, settings.k8sToken, settings.gitLabToken);
                            if (res === null || res === void 0 ? void 0 : res.message) {
                                this.messageService.warn(res === null || res === void 0 ? void 0 : res.message);
                                channel.appendLine(res === null || res === void 0 ? void 0 : res.message, output_channel_1.OutputChannelSeverity.Info);
                            }
                            else if (res.id) {
                                channel.show();
                                channel.appendLine(`Deployment ${settings.repository_name} is already...`);
                                settings.lastDeploy = res.id;
                                this.smartCLIDEBackendService.fileWrite(`${currentPath}/.smartclide-settings.json`, JSON.stringify(settings));
                            }
                            else {
                                this.messageService.error('Something is worng restart process');
                                channel.appendLine('Something is worng restart process', output_channel_1.OutputChannelSeverity.Error);
                            }
                        }
                        else {
                            return;
                        }
                    })
                        .catch((err) => console.log('err', err));
                }
                else {
                    this.messageService.error('It is necessary to have at leasts one repository open.');
                    channel.appendLine('It is necessary to have at least one repository open.', output_channel_1.OutputChannelSeverity.Error);
                }
            },
        });
        commands.registerCommand(CommandDeploymentStatus, {
            execute: async () => {
                var _a, _b, _c;
                //// ---------- VARIABLES ------------ /////
                let settings = {
                    deployUrl: 'https://api.dev.smartclide.eu/deployment-service/deployments/',
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
                const channel = this.outputChannelManager.getChannel('SmartCLIDE');
                channel.clear();
                const currentProject = ((_b = (_a = this.workspaceService.workspace) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.split('.')[0]) || '';
                if (!currentProject) {
                    this.messageService.error('It is necessary to have at least one repository open.');
                    return;
                }
                const currentPath = ((_c = this.workspaceService.workspace) === null || _c === void 0 ? void 0 : _c.resource.path.toString()) || '';
                const prevSettings = await this.smartCLIDEBackendService.fileRead(`${currentPath}/.smartclide-settings.json`);
                if (prevSettings.errno) {
                    this.smartCLIDEBackendService.fileWrite(`${currentPath}/.smartclide-settings.json`, JSON.stringify(settings));
                    const newSettings = await this.smartCLIDEBackendService.fileRead(`${currentPath}/.smartclide-settings.json`);
                    settings = newSettings && Object.assign({}, JSON.parse(newSettings));
                }
                else {
                    settings = Object.assign({}, JSON.parse(prevSettings));
                }
                settings.repository_name = currentProject;
                if (!currentPath || currentPath === '') {
                    this.messageService.error(`There have been problems getting the route.`);
                    return;
                }
                //// ---------- FLOW ------------ /////
                const optionsToken = {
                    placeHolder: 'Enter Project Secrect Token',
                    prompt: 'Enter Project Secrect Token:',
                };
                //// ---------- FLOW ------------ /////
                const newToken = !(settings === null || settings === void 0 ? void 0 : settings.gitLabToken)
                    ? await this.monacoQuickInputService
                        .input(optionsToken)
                        .then((value) => value || '')
                    : settings === null || settings === void 0 ? void 0 : settings.gitLabToken;
                settings.gitLabToken = newToken;
                const actionsConfirmBuild = ['Check now', 'Cancel'];
                if (!settings.lastDeploy || settings.lastDeploy === '') {
                    channel.show();
                    channel.appendLine(`We have not found the last deployment ...`);
                    return;
                }
                //// ---------- PREPARE TO BUILD ------------ /////
                (settings === null || settings === void 0 ? void 0 : settings.gitLabToken)
                    ? this.messageService
                        .info(`PROJECT: ${settings.repository_name}`, ...actionsConfirmBuild)
                        .then(async (action) => {
                        if (action === 'Check now') {
                            channel.show();
                            channel.appendLine(`Checking status ${settings.repository_name}...`);
                            if (settings.lastDeploy && settings.k8sToken) {
                                const res = await (0, fetchMethods_1.getDeploymentStatus)(settings.deployUrl, settings.lastDeploy, settings.k8sToken);
                                this.smartCLIDEBackendService.fileWrite(`${currentPath}/.smartclide-settings.json`, JSON.stringify(settings));
                                if (!res.message) {
                                    channel.appendLine(`Status: Deployment are running...`, output_channel_1.OutputChannelSeverity.Warning);
                                }
                                else {
                                    channel.appendLine(`Status: ${res === null || res === void 0 ? void 0 : res.message}...`, output_channel_1.OutputChannelSeverity.Warning);
                                }
                            }
                        }
                        else {
                            return;
                        }
                    })
                        .catch((err) => this.messageService.error(err.message))
                    : this.messageService.error(`Error TOKEN are required`);
            },
        });
    }
    registerMenus(menus) {
        const subMenuPath = [...common_1.MAIN_MENU_BAR, 'deployments'];
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
    onStart() {
        if (!this.workspaceService.opened) {
            this.stateService.reachedState('initialized_layout').then(() => this.openView({
                activate: true,
                reveal: false,
            }));
        }
    }
    initializeLayout() {
        this.openView({ activate: true, reveal: true });
    }
};
__decorate([
    (0, inversify_1.inject)(frontend_application_state_1.FrontendApplicationStateService),
    __metadata("design:type", frontend_application_state_1.FrontendApplicationStateService)
], SmartCLIDEDeploymentWidgetContribution.prototype, "stateService", void 0);
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], SmartCLIDEDeploymentWidgetContribution.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_1.SmartCLIDEBackendService),
    __metadata("design:type", Object)
], SmartCLIDEDeploymentWidgetContribution.prototype, "smartCLIDEBackendService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.MessageService),
    __metadata("design:type", common_1.MessageService)
], SmartCLIDEDeploymentWidgetContribution.prototype, "messageService", void 0);
__decorate([
    (0, inversify_1.inject)(output_channel_1.OutputChannelManager),
    __metadata("design:type", output_channel_1.OutputChannelManager)
], SmartCLIDEDeploymentWidgetContribution.prototype, "outputChannelManager", void 0);
__decorate([
    (0, inversify_1.inject)(monaco_quick_input_service_1.MonacoQuickInputService),
    __metadata("design:type", monaco_quick_input_service_1.MonacoQuickInputService)
], SmartCLIDEDeploymentWidgetContribution.prototype, "monacoQuickInputService", void 0);
__decorate([
    (0, inversify_1.inject)(command_1.CommandService),
    __metadata("design:type", Object)
], SmartCLIDEDeploymentWidgetContribution.prototype, "commandService", void 0);
SmartCLIDEDeploymentWidgetContribution = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], SmartCLIDEDeploymentWidgetContribution);
exports.SmartCLIDEDeploymentWidgetContribution = SmartCLIDEDeploymentWidgetContribution;
class PlaceholderMenuNode {
    constructor(id, label, options) {
        this.id = id;
        this.label = label;
        this.options = options;
    }
    get icon() {
        var _a;
        return (_a = this.options) === null || _a === void 0 ? void 0 : _a.iconClass;
    }
    get sortString() {
        var _a;
        return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.order) || this.label;
    }
}
exports.PlaceholderMenuNode = PlaceholderMenuNode;
//# sourceMappingURL=widget-contribution.js.map