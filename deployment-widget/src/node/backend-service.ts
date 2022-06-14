import * as fs from 'fs';
import { injectable } from '@theia/core/shared/inversify';
import { SmartCLIDEBackendService } from '../common/protocol';

@injectable()
export class SmartCLIDEBackendServiceImpl implements SmartCLIDEBackendService {
  fileRead(filename: string): any {
    try {
      const data: any = fs.readFileSync(filename, 'utf8');
      return data;
    } catch (err) {
      return err;
    }
  }

  fileWrite(filePath: string, content: any): any {
    try {
      fs.writeFileSync(filePath, content);
      return 'success';
    } catch (err) {
      return 'error';
    }
  }
}
