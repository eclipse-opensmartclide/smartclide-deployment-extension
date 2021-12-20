import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Counter from '../../components/counter';
import Monitoring from '../Monitoring';

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <Row className="items-center align-items-start">
      <Col sm={6} lg={4}>
        <Card text="white" className="Cards-color--gray-ligth mb-2 text-left">
          <Card.Body>
            <Card.Subtitle>Details</Card.Subtitle>
            <hr className="white mt-1 mb-1" />
            <Card.Text>
              <b>project</b>: test-kubernetes
              <br />
              <b>branch</b>: master
              <br />
              <b>token</b>: ················
              <br />
              <b>yml file</b>: found
              <br />
              <b>image</b>: found
              <br />
            </Card.Text>
          </Card.Body>
        </Card>
        <Card text="white" className="Cards-color--blue-deep mb-2 text-center">
          <Card.Body>
            <i className="fa fa-building" aria-hidden="true"></i>
            <Counter endCount={'6'} />
            <Card.Text>Builds</Card.Text>
          </Card.Body>
        </Card>
        <Card text="white" className="Cards-color--blue-sky mb-2 text-center">
          <Card.Body>
            <i className="fa fa-server" aria-hidden="true"></i>
            <Counter endCount={'4'} />
            <Card.Text>Deployments</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col sm={6} lg={8}>
        <Monitoring />
      </Col>
    </Row>
  );
};

export default Dashboard;
