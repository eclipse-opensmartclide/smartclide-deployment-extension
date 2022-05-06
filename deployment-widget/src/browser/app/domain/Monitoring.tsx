import React, { useState, useEffect } from 'react';
import Button from '../componets/Button';
import Spinner from '../componets/Spinner';

import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';

// import SynchronizedAreaChart from '../../components/charts/SynchronizedAreaChart';

interface MonitoringProps {}

const Monitoring: React.FC<MonitoringProps> = () => {
  const [process, setProcess] = useState<boolean>(Math.random() < 0.5);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => {
      clearTimeout(timmer);
    };
  }, []);

  return !loading ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      {process ? (
        <h4 className="text-white">Deployment {'id'} is running</h4>
      ) : (
        <h4 className="text-white">Dont have running any deployment</h4>
      )}
      {process ? (
        <ChartSynchronizedArea />
      ) : (
        <Button className="btn-primary" onClick={() => setProcess(true)}>
          Deploy last build!
        </Button>
      )}
    </div>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default Monitoring;
