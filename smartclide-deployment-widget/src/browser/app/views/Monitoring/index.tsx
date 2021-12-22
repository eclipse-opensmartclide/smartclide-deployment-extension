import React, { useState, useEffect } from 'react';
import { Container, Spinner, Button } from 'react-bootstrap';

import SynchronizedAreaChart from '../../components/charts/SynchronizedAreaChart';

interface MonitoringProps {}
const Monitoring: React.FC<MonitoringProps> = () => {
  const [process, setProcess] = useState<boolean>(Math.random() < 0.5);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    // Mock
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return !loading ? (
    <Container id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h5 className="text-white">
        Deployment is {process ? 'runnig' : 'stoped'}
      </h5>
      {process ? (
        <SynchronizedAreaChart />
      ) : (
        <Button onClick={() => setProcess(true)} variant="danger">
          Deploy now!
        </Button>
      )}
    </Container>
  ) : (
    <div className="text-center" style={{ minHeight: 200 }}>
      <Spinner animation="border" variant="light" />
    </div>
  );
};

export default Monitoring;
