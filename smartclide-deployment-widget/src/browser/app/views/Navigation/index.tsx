import React from 'react';

import { ButtonGroup, Button } from 'react-bootstrap';
import { useBackendContext } from '../../contexts/BackendContext';

interface NavigationProps {
  currentView: string;
  viewList: Record<string, string>[];
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const { currentView, setCurrentView, viewList } = props;
  const { backend } = useBackendContext();
  const { commandRegistry } = backend;

  // console.log('commandRegistry', commandRegistry);
  return (
    <>
      <ButtonGroup aria-label="navigation">
        {viewList?.map((view, idx) => (
          <Button
            className={currentView === view.value ? 'active' : ''}
            onClick={() => setCurrentView(view.value)}
            key={idx}
          >
            {view.name}
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup className="me-2" aria-label="Actions">
        <Button
          onClick={() =>
            commandRegistry.executeCommand('command-deployment-build.command')
          }
        >
          New Build
        </Button>
        <Button
          onClick={() =>
            commandRegistry.executeCommand('command-deployment-deploy.command')
          }
        >
          New Deploy
        </Button>
      </ButtonGroup>
    </>
  );
};

export default Navigation;
