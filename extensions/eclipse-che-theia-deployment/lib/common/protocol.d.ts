import { JsonRpcServer } from '@theia/core/lib/common/messaging';
export declare const SmartCLIDEBackendService: unique symbol;
export declare const SMARTCLIDE_BACKEND_PATH = "/services/smartclideBackend";
export interface SmartCLIDEBackendService {
    fileRead(filePath: string): any;
    fileWrite(filePath: string, content: any): any;
}
export declare const SmartCLIDEBackendWithClientService: unique symbol;
export declare const SMARTCLIDE_BACKEND_WITH_CLIENT_PATH = "/services/withClient";
export interface SmartCLIDEBackendWithClientService extends JsonRpcServer<BackendClient> {
    greet(): Promise<string>;
}
export declare const BackendClient: unique symbol;
export interface BackendClient {
    getName(): Promise<string>;
}
//# sourceMappingURL=protocol.d.ts.map