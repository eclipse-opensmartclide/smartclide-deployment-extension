"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("@theia/core/shared/inversify");
const widget_widget_1 = require("./widget-widget");
const widget_contribution_1 = require("./widget-contribution");
const browser_1 = require("@theia/core/lib/browser");
const browser_2 = require("@theia/core/lib/browser");
const protocol_1 = require("../common/protocol");
exports.default = new inversify_1.ContainerModule((bind) => {
    (0, browser_1.bindViewContribution)(bind, widget_contribution_1.SmartCLIDEDeploymentWidgetContribution);
    bind(browser_1.FrontendApplicationContribution).toService(widget_contribution_1.SmartCLIDEDeploymentWidgetContribution);
    bind(widget_widget_1.SmartCLIDEDeploymentWidget).toSelf();
    bind(browser_1.WidgetFactory)
        .toDynamicValue((ctx) => ({
        id: widget_widget_1.SmartCLIDEDeploymentWidget.ID,
        createWidget: () => ctx.container.get(widget_widget_1.SmartCLIDEDeploymentWidget),
    }))
        .inSingletonScope();
    bind(protocol_1.SmartCLIDEBackendService)
        .toDynamicValue((ctx) => {
        const connection = ctx.container.get(browser_2.WebSocketConnectionProvider);
        return connection.createProxy(protocol_1.SMARTCLIDE_BACKEND_PATH);
    })
        .inSingletonScope();
});
//# sourceMappingURL=widget-frontend-module.js.map