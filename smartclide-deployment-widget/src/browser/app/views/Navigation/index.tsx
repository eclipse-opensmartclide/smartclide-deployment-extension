import React from 'react';

import { Navbar, Container, Nav } from 'react-bootstrap';

interface NavigationProps {
  currentView: string;
  viewList: Record<string, string>[];
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

const Navigation: React.FC<NavigationProps> = (props) => {
  const { currentView, setCurrentView, viewList } = props;

  return (
    <Navbar variant="dark">
      <Container>
        <Navbar.Brand
          href="#0"
          className="Logo-header--background"
        ></Navbar.Brand>
        <Nav className="me-auto" activeKey={`#${currentView}`}>
          {viewList?.map((view, idx) => (
            <Nav.Link
              onClick={() => setCurrentView(view.value)}
              href={`#${view.value}`}
              key={idx}
            >
              {view.name}
            </Nav.Link>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
