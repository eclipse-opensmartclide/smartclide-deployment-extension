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
