import { JsonRpcServer } from "@theia/core/lib/common/messaging";

export const SmartCLIDEBackendService = Symbol("HelloBackendService");
export const SMARTCLIDE_BACKEND_PATH = "/services/helloBackend";

export interface SmartCLIDEBackendService {
  fileRead(filePath: string): any;
  fileReadYaml(filePath: string): any;
  fileWrite(filePath: string, content: any): any;
}
export const SmartCLIDEBackendWithClientService = Symbol("BackendWithClient");
export const SMARTCLIDE_BACKEND_WITH_CLIENT_PATH = "/services/withClient";

export interface SmartCLIDEBackendWithClientService
  extends JsonRpcServer<BackendClient> {
  greet(): Promise<string>;
}
export const BackendClient = Symbol("BackendClient");
export interface BackendClient {
  getName(): Promise<string>;
}
