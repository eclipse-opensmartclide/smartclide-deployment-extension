import { ContainerModule } from "@theia/core/shared/inversify";
import { SmartclideDeploymentWidget } from "./smartclide-deployment-widget-widget";
import { SmartclideDeploymentWidgetContribution } from "./smartclide-deployment-widget-contribution";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
} from "@theia/core/lib/browser";

export default new ContainerModule((bind) => {
  bindViewContribution(bind, SmartclideDeploymentWidgetContribution);
  bind(FrontendApplicationContribution).toService(
    SmartclideDeploymentWidgetContribution
  );
  bind(SmartclideDeploymentWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: SmartclideDeploymentWidget.ID,
      createWidget: () =>
        ctx.container.get<SmartclideDeploymentWidget>(
          SmartclideDeploymentWidget
        ),
    }))
    .inSingletonScope();
});
