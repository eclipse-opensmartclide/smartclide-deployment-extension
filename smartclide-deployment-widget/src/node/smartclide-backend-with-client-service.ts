import { injectable } from '@theia/core/shared/inversify';
import {
  BackendClient,
  SmartCLIDEBackendWithClientService,
} from '../common/protocol';

@injectable()
export class SmartCLIDEBackendWithClientServiceImpl
  implements SmartCLIDEBackendWithClientService
{
  private client?: BackendClient;
  greet(): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      this.client
        ? this.client
            .getName()
            .then((greet) => resolve('SmartCLIDE SAY ' + greet))
        : reject('No Client')
    );
  }
  dispose(): void {
    // do nothing
  }
  setClient(client: BackendClient): void {
    this.client = client;
  }
}
