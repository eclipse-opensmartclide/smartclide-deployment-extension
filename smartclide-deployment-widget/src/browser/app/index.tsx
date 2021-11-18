import React, { useState } from 'react';

import { Container, Col, Row } from 'react-bootstrap';
import Navigation from './views/Navigation';
import OverView from './views/OverView';
import Stacks from './views/Stacks';
import Containers from './views/Containers';
import Monitoring from './views/Monitoring';
import Deployments from './views/Deployments';

const viewList: Record<string, string>[] = [
  { name: 'Overview', value: 'overview' },
  { name: 'Stacks', value: 'stacks' },
  { name: 'Containers', value: 'containers' },
  { name: 'Deployments', value: 'deployments' },
  { name: 'Monitoring', value: 'monitoring' },
];

const App: React.FC = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<string>('overview');

  return (
    <>
      <Container id="SmartCLIDE-Widget-App">
        <Navigation
          viewList={viewList}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />
        <Row className="items-center">
          <Col md={12} className="mt-4">
            {currentView === 'overview' && <OverView />}
            {currentView === 'stacks' && <Stacks />}
            {currentView === 'containers' && <Containers />}
            {currentView === 'deployments' && <Deployments />}
            {currentView === 'monitoring' && <Monitoring />}
          </Col>
        </Row>
      </Container>
      <div id="SmartCLIDE-Widget-Icon" className="text-white">
        <div className="Arrows-animated"></div>
        <p className="text-white text-center">
          <small>Drag to open!!</small>
        </p>
      </div>
    </>
  );
};

export default App;
