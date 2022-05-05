import React, { useState, useEffect } from 'react';
import Button from '../componets/Button';
import Spinner from '../componets/Spinner';

// import SynchronizedAreaChart from '../../components/charts/SynchronizedAreaChart';

interface MonitoringProps {}

const Monitoring: React.FC<MonitoringProps> = () => {
  const [process, setProcess] = useState<boolean>(Math.random() < 0.5);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    return () => {
      clearTimeout(timmer);
    };
  }, []);

  return !isVisible ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h4 className="text-white">
        Dont have running any deployment {process ? 'runnig' : 'stoped'}
      </h4>
      {process ? (
        <p>Chart</p>
      ) : (
        <Button className="btn-primary" onClick={() => setProcess(true)}>
          Deploy last build!
        </Button>
      )}
    </div>
  ) : (
    <Spinner isVisible={isVisible} />
  );
};

export default Monitoring;
