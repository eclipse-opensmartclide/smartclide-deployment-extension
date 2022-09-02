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
    console.log('containers', containers);
    containers &&
      containers?.map((container) => {
        setContainersData((prev): Serie[] => {
          if (!prev) {
            return [
              {
                name: container?.name,
                series: {
                  cpu: [
                    parseInt(truncateEndString(container?.usage?.cpu, 1)) /
                      1000,
                  ],
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
                  cpu: [
                    parseInt(truncateEndString(container?.usage?.cpu, 1)) /
                      1000,
                  ],
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
              return prev?.map((item) => {
                if (item?.name === container?.name) {
                  // Set array length to 6 elemt max
                  item?.series?.cpu?.length >= 6 && item?.series?.cpu.shift();
                  item?.series?.memory?.length >= 6 &&
                    item?.series?.memory.shift();

                  // Add to prev item new data
                  const editedItem = {
                    name: container?.name,
                    series: {
                      cpu: [
                        ...item?.series?.cpu,
                        parseInt(truncateEndString(container?.usage?.cpu, 1)) /
                          1000,
                      ],
                      memory: [
                        ...item?.series?.memory,
                        parseInt(
                          truncateEndString(container?.usage?.memory, 2)
                        ),
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
        containersData && (
          <>
            <ChartSynchronizedArea data={containersData} />
            <hr></hr>
          </>
        )
      ) : (
        <Spinner isVisible={loadingChart} />
      )}
      {!loadingPrice ? (
        <>
          <h4>Costs</h4>
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
        </>
      ) : (
        <Spinner isVisible={loadingPrice} />
      )}
    </div>
  ) : (
    <Spinner isVisible={loadingChart && loadingPrice} />
  );
};

export default Monitoring;
