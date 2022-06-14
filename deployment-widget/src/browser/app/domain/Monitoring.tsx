import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';
import PriceCard from '../componets/Card/Price';

import { MetricsResponseData } from '../../../common/ifaces';

const Monitoring: React.FC<MetricsResponseData> = (props) => {
  const { usage, cost } = props;
  console.log('usage, cost', usage, cost);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timmer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => {
      clearTimeout(timmer);
    };
  }, []);

  return !loading ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h4 className="text-white">Deployment is running</h4>
      <ChartSynchronizedArea />
      <div className="d-flex mt-1">
        <PriceCard cost={0.5234} cost_type="CPU" name="Azure" current={true} />
        <PriceCard
          cost={0.2234}
          cost_type="Fixed"
          name="Amazon Web Service"
          current={false}
        />
        <PriceCard
          cost={10.0234}
          cost_type="Fixed"
          name="Google Cloud"
          current={false}
        />
      </div>
    </div>
  ) : (
    <Spinner isVisible={loading} />
  );
};

export default Monitoring;
