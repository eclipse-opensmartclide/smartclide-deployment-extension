import { CommandContribution } from '@theia/core';
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { ContainerModule, injectable } from '@theia/core/shared/inversify';
import {
  BackendClient,
  SmartCLIDEBackendWithClientService,
  SmartCLIDEBackendService,
  SMARTCLIDE_BACKEND_PATH,
  SMARTCLIDE_BACKEND_WITH_CLIENT_PATH,
} from '../common/protocol';
import { SmartCLIDEDeploymentExtensionCommandContribution } from './smartclide-deployment-extension-contribution';

export default new ContainerModule((bind) => {
  bind(CommandContribution)
    .to(SmartCLIDEDeploymentExtensionCommandContribution)
    .inSingletonScope();
  bind(BackendClient).to(BackendClientImpl).inSingletonScope();

  bind(SmartCLIDEBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<SmartCLIDEBackendService>(
        SMARTCLIDE_BACKEND_PATH
      );
    })
    .inSingletonScope();

  bind(SmartCLIDEBackendWithClientService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<SmartCLIDEBackendWithClientService>(
        SMARTCLIDE_BACKEND_WITH_CLIENT_PATH,
        backendClient
      );
    })
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
  getName(): Promise<string> {
    return new Promise((resolve) => resolve('Client'));
  }
}
