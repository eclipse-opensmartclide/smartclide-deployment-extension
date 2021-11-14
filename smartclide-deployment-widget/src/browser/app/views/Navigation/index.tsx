import React from 'react';

import { ButtonGroup, ToggleButton } from 'react-bootstrap';

interface NavigationProps {
  currentView: string;
  viewList: Record<string, string>[];
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const { currentView, setCurrentView, viewList } = props;

  return (
    <ButtonGroup>
      {viewList?.map((view, idx) => (
        <ToggleButton
          key={idx}
          id={`view-${idx}`}
          type="radio"
          variant={currentView === view.value ? 'primary' : 'light'}
          name="view"
          value={view.value}
          checked={currentView === view.value}
          onChange={(e) => setCurrentView(e.currentTarget.value)}
        >
          {view.name}
        </ToggleButton>
      ))}
    </ButtonGroup>
  );
};

export default Navigation;
