import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';
import PriceCard from '../componets/Card/Price';

import {
  MetricsResponseData,
  ContainerMetrics,
  PriceMetrics,
  ProviderMetrics,
} from '../../../common/ifaces';

const Monitoring: React.FC<MetricsResponseData> = (props) => {
  const { containers, price } = props;

  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(true);
  const [containersData, setContainersData] = useState<ContainerMetrics[]>();
  const [priceData, setPriceData] = useState<PriceMetrics>();

  useEffect(() => {
    setLoadingChart(false);
    containers &&
      setContainersData((prev) =>
        prev ? [...prev, ...containers] : [...containers]
      );
  }, [containers]);

  useEffect(() => {
    setLoadingPrice(false);
    setPriceData(price);
  }, [price]);

  useEffect(() => {
    console.log('containersData', containersData);
  }, [containersData]);

  useEffect(() => {
    console.log('priceData', priceData);
  }, [priceData]);

  return !loadingChart && !loadingPrice ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h4 className="text-white">Deployment is running</h4>
      {!loadingChart ? (
        <div className="d-flex mt-1">
          {containersData?.map((container, index) => {
            return <ChartSynchronizedArea key={index} data={container} />;
          })}
        </div>
      ) : (
        <Spinner isVisible={loadingChart} />
      )}
      {!loadingPrice ? (
        <div className="d-flex mt-1">
          {priceData && priceData?.current_provider && (
            <PriceCard
              cost={priceData?.current_provider?.cost}
              cost_type={priceData?.current_provider?.cost_type}
              name={priceData?.current_provider?.name}
              current={false}
            />
          )}
          {priceData &&
            priceData?.competitor_provider &&
            priceData?.competitor_provider?.map(
              (data: ProviderMetrics, index: number) => {
                const { cost, cost_type, name } = data;
                return (
                  <PriceCard
                    key={index}
                    cost={cost}
                    cost_type={cost_type}
                    name={name}
                    current={false}
                  />
                );
              }
            )}
        </div>
      ) : (
        <Spinner isVisible={loadingPrice} />
      )}
    </div>
  ) : (
    <Spinner isVisible={loadingChart && loadingPrice} />
  );
};

export default Monitoring;
