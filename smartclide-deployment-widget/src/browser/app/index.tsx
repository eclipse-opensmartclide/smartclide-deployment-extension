import React, { useState, useEffect } from 'react';

import Dashboard from './domain/Dashboard';
import Deployment from './domain/Deployment';

import Navigation from './componets/Navigation';

// import Monitoring from './views/Monitoring';

import { useBackendContext } from './contexts/BackendContext';

const viewList: Record<string, string>[] = [
  { name: 'Dashboard', value: 'dashboard' },
  { name: 'Deployments', value: 'deployments' },
];

interface AppProps {
  commandRegistry?: any;
  workspaceService?: any;
  backendService?: any;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  const { workspaceService, backendService, commandRegistry } = props;

  const [currentView, setCurrentView] = useState<string>('dashboard');
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
        <Navigation
          viewList={viewList}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'deployments' && <Deployment />}
      </div>
    </>
  ) : (
    <div style={{ minHeight: 200 }}>Loading</div>
  );
};

export default App;
