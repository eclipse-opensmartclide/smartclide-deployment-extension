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
import { JsonRpcServer } from '@theia/core/lib/common/messaging';

export const SmartCLIDEBackendService = Symbol('SmartCLIDEBackendService');
export const SMARTCLIDE_BACKEND_PATH = '/services/smartclideBackend';

export interface SmartCLIDEBackendService {
  fileRead(filePath: string): any;
  fileWrite(filePath: string, content: any): any;
}
export const SmartCLIDEBackendWithClientService = Symbol('BackendWithClient');
export const SMARTCLIDE_BACKEND_WITH_CLIENT_PATH = '/services/withClient';

export interface SmartCLIDEBackendWithClientService
  extends JsonRpcServer<BackendClient> {
  greet(): Promise<string>;
}
export const BackendClient = Symbol('BackendClient');
export interface BackendClient {
  getName(): Promise<string>;
}
