import React, { useState, useEffect } from 'react';

import Dashboard from './domain/Dashboard';

// import Monitoring from './domain/Monitoring';
import Spinner from './componets/Spinner';

import { useBackendContext } from './contexts/BackendContext';

interface AppProps {
  commandRegistry?: any;
  workspaceService?: any;
  backendService?: any;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  const { workspaceService, backendService, commandRegistry } = props;

  const [loading, setLoading] = useState<boolean>(true);

  const { backend, setBackend } = useBackendContext();

  useEffect(() => {
    setBackend({
      workspaceService,
      commandRegistry,
      backendService,
    });
  }, []);

  useEffect(() => {
    backend && setLoading(false);
  }, [backend]);

  return !loading ? (
    <>
      <div id="SmartCLIDE-Widget-Bar">{/* <Monitoring /> */}</div>
      <div id="SmartCLIDE-Widget-App">
        <Dashboard />
      </div>
    </>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default App;
