import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Counter from '../../components/counter';

interface OverViewProps {}

const OverView: React.FC<OverViewProps> = () => {
  return (
    <>
      <Row className="items-center">
        <Col sm={6} lg={3}>
          <Card text="white" className="Cards-color--blue-deep m-2 text-center">
            <Card.Body>
              <i className="fa fa-briefcase" aria-hidden="true"></i>
              <Counter endCount={'3'} />
              <Card.Text>Projects</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card text="white" className="Cards-color--blue-sea m-2 text-center">
            <Card.Body>
              <i className="fa fa-building" aria-hidden="true"></i>
              <Counter endCount={'6'} />
              <Card.Text>Builds</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card text="white" className="Cards-color--blue-sky m-2 text-center">
            <Card.Body>
              <i className="fa fa-server" aria-hidden="true"></i>
              <Counter endCount={'4'} />
              <Card.Text>Deployments</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card text="white" className="Cards-color--blue-aqua m-2 text-center">
            <Card.Body>
              <i className="fa fa-dashboard" aria-hidden="true"></i>
              <Counter endCount={'1'} />
              <Card.Text>Running</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OverView;
