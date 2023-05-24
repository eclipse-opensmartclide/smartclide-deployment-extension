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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var SmartCLIDEDeploymentWidget_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartCLIDEDeploymentWidget = void 0;
const react_1 = __importDefault(require("react"));
const inversify_1 = require("@theia/core/shared/inversify");
const react_widget_1 = require("@theia/core/lib/browser/widgets/react-widget");
const BackendContext_1 = require("./app/contexts/BackendContext");
const protocol_1 = require("../common/protocol");
const common_1 = require("@theia/core/lib/common");
const workspace_service_1 = require("@theia/workspace/lib/browser/workspace-service");
const app_1 = __importDefault(require("./app"));
require("../../src/browser/app/style/index.css");
require("../../src/browser/app/style/nav/index.css");
require("../../src/browser/app/style/spinner/index.css");
require("../../src/browser/app/style/button/index.css");
require("../../src/browser/app/style/card/index.css");
require("../../src/browser/app/style/table/index.css");
require("../../src/browser/app/style/select/index.css");
let SmartCLIDEDeploymentWidget = SmartCLIDEDeploymentWidget_1 = class SmartCLIDEDeploymentWidget extends react_widget_1.ReactWidget {
    async init() {
        this.id = SmartCLIDEDeploymentWidget_1.ID;
        this.title.label = SmartCLIDEDeploymentWidget_1.LABEL;
        this.title.caption = SmartCLIDEDeploymentWidget_1.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'codicon icon-deployment-extension'; // example widget icon.
        this.update();
    }
    render() {
        return (react_1.default.createElement(BackendContext_1.BackendContextProvider, null,
            react_1.default.createElement(app_1.default, { commandRegistry: this.commandRegistry, workspaceService: this.workspaceService, backendService: this.smartCLIDEBackendService })));
    }
};
SmartCLIDEDeploymentWidget.ID = 'command-deployment-widget:widget';
SmartCLIDEDeploymentWidget.LABEL = 'Deployment';
__decorate([
    (0, inversify_1.inject)(workspace_service_1.WorkspaceService),
    __metadata("design:type", workspace_service_1.WorkspaceService)
], SmartCLIDEDeploymentWidget.prototype, "workspaceService", void 0);
__decorate([
    (0, inversify_1.inject)(protocol_1.SmartCLIDEBackendService),
    __metadata("design:type", Object)
], SmartCLIDEDeploymentWidget.prototype, "smartCLIDEBackendService", void 0);
__decorate([
    (0, inversify_1.inject)(common_1.CommandRegistry),
    __metadata("design:type", common_1.CommandRegistry)
], SmartCLIDEDeploymentWidget.prototype, "commandRegistry", void 0);
__decorate([
    (0, inversify_1.postConstruct)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SmartCLIDEDeploymentWidget.prototype, "init", null);
SmartCLIDEDeploymentWidget = SmartCLIDEDeploymentWidget_1 = __decorate([
    (0, inversify_1.injectable)()
], SmartCLIDEDeploymentWidget);
exports.SmartCLIDEDeploymentWidget = SmartCLIDEDeploymentWidget;
//# sourceMappingURL=widget-widget.js.map