import { ContainerModule } from '@theia/core/shared/inversify';
import { SmartclideDeploymentWidgetWidget } from './smartclide-deployment-widget-widget';
import { SmartclideDeploymentWidgetContribution } from './smartclide-deployment-widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, SmartclideDeploymentWidgetContribution);
    bind(FrontendApplicationContribution).toService(SmartclideDeploymentWidgetContribution);
    bind(SmartclideDeploymentWidgetWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: SmartclideDeploymentWidgetWidget.ID,
        createWidget: () => ctx.container.get<SmartclideDeploymentWidgetWidget>(SmartclideDeploymentWidgetWidget)
    })).inSingletonScope();
});
