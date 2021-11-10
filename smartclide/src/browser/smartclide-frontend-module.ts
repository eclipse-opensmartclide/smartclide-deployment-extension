import { ContainerModule } from '@theia/core/shared/inversify';
import { SmartclideWidget } from './smartclide-widget';
import { SmartclideContribution } from './smartclide-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, SmartclideContribution);
    bind(FrontendApplicationContribution).toService(SmartclideContribution);
    bind(SmartclideWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: SmartclideWidget.ID,
        createWidget: () => ctx.container.get<SmartclideWidget>(SmartclideWidget)
    })).inSingletonScope();
});
