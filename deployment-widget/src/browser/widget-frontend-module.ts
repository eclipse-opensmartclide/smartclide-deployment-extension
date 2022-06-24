/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import { ContainerModule } from '@theia/core/shared/inversify';
import { SmartCLIDEDeploymentWidget } from './widget-widget';
import { SmartCLIDEDeploymentWidgetContribution } from './widget-contribution';
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
} from '@theia/core/lib/browser';

import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import {
  SmartCLIDEBackendService,
  SMARTCLIDE_BACKEND_PATH,
} from '../common/protocol';

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

  bind(SmartCLIDEBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<SmartCLIDEBackendService>(
        SMARTCLIDE_BACKEND_PATH
      );
    })
    .inSingletonScope();
});
