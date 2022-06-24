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
import React, { useState, createContext, useContext } from 'react';
interface BackendContextInterface {
  backendService?: any;
  commandRegistry?: any;
  workspaceService?: any;
}
export const BackendContext = createContext<any | null>(null);

export const useBackendContext = () => useContext(BackendContext);

export const BackendContextProvider = ({ children }: any) => {
  const [backend, setBackend] = useState<BackendContextInterface | null>(null);

  const value = { backend, setBackend };

  return (
    <BackendContext.Provider value={value}>{children}</BackendContext.Provider>
  );
};
