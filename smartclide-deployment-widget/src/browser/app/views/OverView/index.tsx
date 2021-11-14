import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

interface OverViewProps {}

const OverView: React.FC<OverViewProps> = () => {
  return (
    <>
      <Row className="items-center">
        <Col md={{ span: 4, offset: 1 }}>
          <Card text="white" className="Cards-bg--blue-deep m-4 text-center">
            <Card.Body>
              <h2 className="text-white">
                <i className="fa fa-briefcase" aria-hidden="true"></i>
                <br />
                25
              </h2>
              <Card.Text>Projects</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 4, offset: 2 }}>
          <Card text="white" className="Cards-bg--blue-sea m-4 text-center">
            <Card.Body>
              <h2 className="text-white">
                <i className="fa fa-building" aria-hidden="true"></i>
                <br />
                33
              </h2>
              <Card.Text>Stacks</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 4, offset: 1 }}>
          <Card text="white" className="Cards-bg--blue-sky m-4 text-center">
            <Card.Body>
              <h2 className="text-white">
                <i className="fa fa-server" aria-hidden="true"></i>
                <br />2
              </h2>
              <Card.Text>Deployments</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={{ span: 4, offset: 2 }}>
          <Card text="white" className="Cards-bg--blue-aqua m-4 text-center">
            <Card.Body>
              <h2 className="text-white">
                <i className="fa fa-dashboard" aria-hidden="true"></i>
                <br />
                21
              </h2>
              <Card.Text>Deployments Running</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OverView;
