import React from 'react';
import Button from '../Button';

interface NavigationProps {
  currentView: string;
  viewList: Record<string, string>[];
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const { currentView, setCurrentView, viewList } = props;

  return (
    <div className="Navigation--flex">
      {viewList?.map((view, idx) => (
        <React.Fragment key={idx}>
          <Button
            className={currentView === view.value ? 'btn-primary active' : ''}
            onClick={() => setCurrentView(view.value)}
          >
            {view.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Navigation;
