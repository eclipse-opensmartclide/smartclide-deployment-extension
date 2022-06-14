import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';
import PriceCard from '../componets/Card/Price';

import { MetricsResponseData, UsageMetrics } from '../../../common/ifaces';

const Monitoring: React.FC<MetricsResponseData> = (props) => {
  const { usage, cost } = props;

  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [usageData, setUsageData] = useState<UsageMetrics[]>();
  const [costData, setCostData] = useState<UsageMetrics[]>();

  useEffect(() => {
    setLoadingChart(false);
    setUsageData((prev) => (prev ? [...prev, usage] : [usage]));
  }, [usage]);

  useEffect(() => {
    console.log('usageData', usageData);
  }, [usageData]);

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
    <Spinner isVisible={loading || } />
  );
};

export default Monitoring;
