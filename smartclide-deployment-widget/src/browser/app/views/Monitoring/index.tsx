import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';

// import { fetchBuild, fetchBuildStatus } from '../../../common/fetchMethods';
import SynchronizedAreaChart from '../../components/charts/SynchronizedAreaChart';

interface MonitoringProps {}
const Monitoring: React.FC<MonitoringProps> = () => {
  return (
    <Row>
      <Col md={6} lg={7}>
        <h4 className="text-white">Proccess</h4>
        <SynchronizedAreaChart />
      </Col>
      <Col md={6} lg={5}>
        <h4 className="text-white">Details</h4>
        <ListGroup variant="flush">
          <ListGroup.Item
            variant="dark"
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Image</div>
              Cras justo odio
            </div>
          </ListGroup.Item>
          <ListGroup.Item
            variant="dark"
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Hostaname</div>
              Cras justo odio
            </div>
          </ListGroup.Item>
          <ListGroup.Item
            variant="dark"
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Port</div>
              Cras justo odio
            </div>
          </ListGroup.Item>
          <ListGroup.Item
            variant="dark"
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Lorem</div>
              Lorem ipsum dolor sit amet.
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
};

export default Monitoring;
