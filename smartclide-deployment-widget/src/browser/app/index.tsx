import React, { useState } from 'react';

import { Container, Col, Row } from 'react-bootstrap';
import Stacks from './views/Stacks';
import OverView from './views/OverView';
import Navigation from './views/Navigation';

const viewList: Record<string, string>[] = [
  { name: 'Overview', value: 'overview' },
  { name: 'Stacks', value: 'stacks' },
  { name: 'Containers', value: 'containers' },
  { name: 'Images', value: 'images' },
  { name: 'Deploy', value: 'deploy' },
];

const App: React.FC = (): JSX.Element => {
  const [currentView, setCurrentView] = useState<string>('overview');

  return (
    <>
      <Container id="SmartCLIDE-Widget-App">
        <Row className="items-center">
          <Col xs={6} md={4} lg={2}>
            <div className="Logo">{''}</div>
          </Col>
          <Col xs={6} md={8} lg={3}>
            <h5 className="text-white mb-0">SmartCLIDE Deployment Widget</h5>
          </Col>
          <Col md={12} lg={7} className="text-md-center text-lg-end mt-md-3">
            <Navigation
              viewList={viewList}
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </Col>
          <Col md={12} className="mt-4">
            {currentView === 'overview' && <OverView />}
            {currentView === 'stacks' && <Stacks />}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
