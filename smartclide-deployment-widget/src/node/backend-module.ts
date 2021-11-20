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
