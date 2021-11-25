import React, { useState, useEffect } from 'react';

import { Container, Col, Row, Spinner } from 'react-bootstrap';

import Navigation from './views/Navigation';
import Dashboard from './views/Dashboard';
import Builds from './views/Builds';
import Deployments from './views/Deployments';
import Monitoring from './views/Monitoring';

import { useBackendContext } from './contexts/BackendContext';

const viewList: Record<string, string>[] = [
  { name: 'Dashboard', value: 'dashboard' },
  { name: 'Builds', value: 'builds' },
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
      <div id="SmartCLIDE-Widget-Bar" className="text-white">
        <Monitoring />
      </div>
      <Container id="SmartCLIDE-Widget-App">
        <Row className="items-center">
          <Col md={12}>
            <Navigation
              viewList={viewList}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </Col>
          <Col md={12} className="mt-4">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'builds' && <Builds />}
            {currentView === 'deployments' && <Deployments />}
          </Col>
        </Row>
      </Container>
    </>
  ) : (
    <div className="text-center" style={{ minHeight: 200 }}>
      <Spinner animation="border" variant="light" />
    </div>
  );
};

export default App;
