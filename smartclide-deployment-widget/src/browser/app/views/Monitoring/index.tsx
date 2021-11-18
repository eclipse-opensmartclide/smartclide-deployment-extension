import React from 'react';
import { Row, Col } from 'react-bootstrap';

// import { fetchBuild, fetchBuildStatus } from '../../../common/fetchMethods';
import SynchronizedAreaChart from '../../components/charts/SynchronizedAreaChart';

interface MonitoringProps {}
const Monitoring: React.FC<MonitoringProps> = () => {
  return (
    <Row>
      <Col md={6}>
        <h4 className="text-white">Monitoring List</h4>
        <SynchronizedAreaChart />
      </Col>
    </Row>
  );
};

export default Monitoring;
