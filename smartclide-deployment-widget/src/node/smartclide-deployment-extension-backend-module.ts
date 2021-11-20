import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core";
import { ContainerModule } from "@theia/core/shared/inversify";
import {
  BackendClient,
  SmartCLIDEBackendWithClientService,
  SmartCLIDEBackendService,
  SMARTCLIDE_BACKEND_PATH,
  SMARTCLIDE_BACKEND_WITH_CLIENT_PATH,
} from "../common/protocol";
import { SmartCLIDEBackendWithClientServiceImpl } from "./smartclide-backend-with-client-service";
import { SmartCLIDEBackendServiceImpl } from "./smartclide-backend-service";

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

  bind(SmartCLIDEBackendWithClientService)
    .to(SmartCLIDEBackendWithClientServiceImpl)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      (ctx) =>
        new JsonRpcConnectionHandler<BackendClient>(
          SMARTCLIDE_BACKEND_WITH_CLIENT_PATH,
          (client) => {
            const server =
              ctx.container.get<SmartCLIDEBackendWithClientServiceImpl>(
                SmartCLIDEBackendWithClientService
              );
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
          }
        )
    )
    .inSingletonScope();
});
