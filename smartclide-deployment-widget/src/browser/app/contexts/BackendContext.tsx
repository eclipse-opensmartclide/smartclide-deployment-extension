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
