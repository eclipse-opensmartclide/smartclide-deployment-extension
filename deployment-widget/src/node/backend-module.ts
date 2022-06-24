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
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { ContainerModule } from '@theia/core/shared/inversify';
import {
  SmartCLIDEBackendService,
  SMARTCLIDE_BACKEND_PATH,
} from '../common/protocol';
import { SmartCLIDEBackendServiceImpl } from './backend-service';

export default new ContainerModule((bind) => {
  bind(SmartCLIDEBackendService)
    .to(SmartCLIDEBackendServiceImpl)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler(SMARTCLIDE_BACKEND_PATH, () => {
          return ctx.container.get<SmartCLIDEBackendService>(
            SmartCLIDEBackendService
          );
        })
    )
    .inSingletonScope();
});
