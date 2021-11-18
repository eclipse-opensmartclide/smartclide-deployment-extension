import { ContainerModule } from '@theia/core/shared/inversify';
import { SmartCLIDEDeploymentWidget } from './smartclide-deployment-widget-widget';
import { SmartCLIDEDeploymentWidgetContribution } from './smartclide-deployment-widget-contribution';
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
} from '@theia/core/lib/browser';

export default new ContainerModule((bind) => {
  bindViewContribution(bind, SmartCLIDEDeploymentWidgetContribution);
  bind(FrontendApplicationContribution).toService(
    SmartCLIDEDeploymentWidgetContribution
  );
  bind(SmartCLIDEDeploymentWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: SmartCLIDEDeploymentWidget.ID,
      createWidget: () =>
        ctx.container.get<SmartCLIDEDeploymentWidget>(
          SmartCLIDEDeploymentWidget
        ),
    }))
    .inSingletonScope();
});
