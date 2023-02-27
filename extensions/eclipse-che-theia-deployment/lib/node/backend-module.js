"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@theia/core");
const inversify_1 = require("@theia/core/shared/inversify");
const protocol_1 = require("../common/protocol");
const backend_service_1 = require("./backend-service");
exports.default = new inversify_1.ContainerModule((bind) => {
    bind(protocol_1.SmartCLIDEBackendService)
        .to(backend_service_1.SmartCLIDEBackendServiceImpl)
        .inSingletonScope();
    bind(core_1.ConnectionHandler)
        .toDynamicValue((ctx) => new core_1.JsonRpcConnectionHandler(protocol_1.SMARTCLIDE_BACKEND_PATH, () => {
        return ctx.container.get(protocol_1.SmartCLIDEBackendService);
    }))
        .inSingletonScope();
});
//# sourceMappingURL=backend-module.js.map