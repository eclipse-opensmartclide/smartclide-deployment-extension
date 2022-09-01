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

const truncateEndString = (str: string, chars: number = 0): string => {
  if ((!str && str.length <= 0) || (!chars && typeof chars !== 'number')) {
    return '';
  }
  return str.substring(0, str.length - chars);
};
const getEndString = (str: string, chars: number = 0): string => {
  if ((!str && str.length <= 0) || (!chars && typeof chars !== 'number')) {
    return '';
  }
  return str.substring(str.length - chars, str.length);
};

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
                  cpu: [parseInt(truncateEndString(container?.usage?.cpu, 1))],
                  memory: [
                    parseInt(truncateEndString(container?.usage?.memory, 2)),
                  ],
                },
                units: {
                  cpu: getEndString(container?.usage?.cpu, 1),
                  memory: getEndString(container?.usage?.memory, 2),
                },
              },
            ];
          } else {
            const containerNames = prev.map((i) => i.name);
            if (containerNames.indexOf(container?.name) === -1) {
              const newContainer = {
                name: container?.name,
                series: {
                  cpu: [parseInt(truncateEndString(container?.usage?.cpu, 1))],
                  memory: [
                    parseInt(truncateEndString(container?.usage?.memory, 2)),
                  ],
                },
                units: {
                  cpu: getEndString(container?.usage?.cpu, 1),
                  memory: getEndString(container?.usage?.memory, 2),
                },
              };
              return [...prev, newContainer];
            } else {
              const editedPrev = prev?.map((item) => {
                if (item?.name === container?.name) {
                  item?.series?.cpu?.length >= 6 && item?.series?.cpu.shift();
                  item?.series?.memory?.length >= 6 &&
                    item?.series?.memory.shift();

                  const editedItem = {
                    name: container?.name,
                    series: {
                      cpu: [
                        ...item?.series?.cpu,
                        truncateEndString(container?.usage?.cpu, 1),
                      ],
                      memory: [
                        ...item?.series?.memory,
                        truncateEndString(container?.usage?.memory, 2),
                      ],
                    },
                    units: {
                      cpu: getEndString(container?.usage?.cpu, 1),
                      memory: getEndString(container?.usage?.memory, 2),
                    },
                  };
                  return editedItem;
                }
                return item;
              });
              console.log('editedPrev', editedPrev);
              // return editedPrev;
            }
          }
        });
      });
  }, [containers]);

  useEffect(() => {
    setLoadingPrice(false);
    setPriceData(price);
  }, [price]);

  return !loadingChart && !loadingPrice ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      {!loadingChart ? (
        containersData && <ChartSynchronizedArea data={containersData} />
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
