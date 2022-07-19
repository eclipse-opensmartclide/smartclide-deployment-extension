import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';
import PriceCard from '../componets/Card/Price';

import {
  MetricsResponseData,
  PriceMetrics,
  ProviderMetrics,
  Serie,
} from '../../../common/ifaces';

const Monitoring: React.FC<MetricsResponseData> = (props) => {
  const { containers, price } = props;

  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(true);
  const [containersData, setContainersData] = useState<Serie[]>();
  const [priceData, setPriceData] = useState<PriceMetrics>();

  useEffect(() => {
    setLoadingChart(false);
    containers &&
      containers?.map((container) => {
        setContainersData((prev): Serie[] => {
          if (!prev) {
            return [
              {
                name: container?.name,
                series: {
                  cpu: [container?.usage?.cpu],
                  memory: [container?.usage?.memory],
                },
              },
            ];
          } else {
            const containerNames = prev.map((i) => i.name);
            if (containerNames.indexOf(container?.name) === -1) {
              const newContainer = {
                name: container?.name,
                series: {
                  cpu: [container?.usage?.cpu],
                  memory: [container?.usage?.memory],
                },
              };
              return [...prev, newContainer];
            } else {
              const editedPrev = prev?.map((item) => {
                if (item?.name === container?.name) {
                  const editedItem = {
                    name: container?.name,
                    series: {
                      cpu: [...item?.series?.cpu, container?.usage?.cpu],
                      memory: [
                        ...item?.series?.memory,
                        container?.usage?.memory,
                      ],
                    },
                  };
                  return editedItem;
                }
                return item;
              });
              return editedPrev;
            }
          }
        });
      });
  }, [containers]);

  useEffect(() => {
    setLoadingPrice(false);
    setPriceData(price);
  }, [price]);

  useEffect(() => {
    console.log('containersData', containersData);
  }, [containersData]);

  return !loadingChart && !loadingPrice ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h4 className="text-white">Deployment is running</h4>
      {!loadingChart ? (
        <div className="d-flex mt-1">
          {containersData &&
            containersData?.map((container, index) => {
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
              price={priceData?.current_provider?.price}
              cost_type={priceData?.current_provider?.cost_type}
              name={priceData?.current_provider?.name}
              current={true}
            />
          )}
          {priceData &&
            priceData?.competitor_provider &&
            priceData?.competitor_provider?.map(
              (data: ProviderMetrics, index: number) => {
                const { price, cost_type, name } = data;
                return (
                  <PriceCard
                    key={index}
                    price={price}
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
