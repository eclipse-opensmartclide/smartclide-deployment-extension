import React, { useState, useEffect } from 'react';

import { Container, Col, Row } from 'react-bootstrap';
import Navigation from './views/Navigation';
import OverView from './views/OverView';
import Builds from './views/Builds';
import Deployments from './views/Deployments';
import Monitoring from './views/Monitoring';
import { useBackendContext } from './contexts/BackendContext';

const viewList: Record<string, string>[] = [
  { name: 'Overview', value: 'overview' },
  { name: 'Builds', value: 'builds' },
  { name: 'Deployments', value: 'deployments' },
  { name: 'Monitoring', value: 'monitoring' },
];

interface AppProps {
  workspaceService: any;
  backendService: any;
}

const App: React.FC<AppProps> = (props): JSX.Element => {
  const { workspaceService, backendService } = props;

  const [currentView, setCurrentView] = useState<string>('overview');

  const { setBackend } = useBackendContext();

  useEffect(() => {
    setBackend({
      workspaceService,
      backendService,
    });
  }, []);

  return (
    <>
      <div id="SmartCLIDE-Widget-Icon" className="text-white">
        <div className="Arrows-animated"></div>
        <p className="text-white text-center">
          <small>Drag to main tab!!</small>
        </p>
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
            {currentView === 'overview' && <OverView />}
            {currentView === 'builds' && <Builds />}
            {currentView === 'deployments' && <Deployments />}
            {currentView === 'monitoring' && <Monitoring />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
