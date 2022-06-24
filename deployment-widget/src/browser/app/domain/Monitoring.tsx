/*******************************************************************************
 * Copyright (C) 2021-2022 Wellness TechGroup
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 * 
 * Contributors:
 *   onelifedesigning - initial API and implementation
 ******************************************************************************/
import React, { useState, useEffect } from 'react';

import Spinner from '../componets/Spinner';
import ChartSynchronizedArea from '../componets/ChartSynchronizedArea';
import PriceCard from '../componets/Card/Price';

import {
  MetricsResponseData,
  UsageMetrics,
  CostMetrics,
} from '../../../common/ifaces';

const Monitoring: React.FC<MetricsResponseData> = (props) => {
  const { usage, cost } = props;

  const [loadingChart, setLoadingChart] = useState<boolean>(true);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(true);
  const [usageData, setUsageData] = useState<UsageMetrics[]>();
  const [costData, setCostData] = useState<CostMetrics[]>();

  useEffect(() => {
    setLoadingChart(false);
    setUsageData((prev) => (prev ? [...prev, usage] : [usage]));
  }, [usage]);

  useEffect(() => {
    setLoadingPrice(false);
    setCostData(cost);
  }, [cost]);

  useEffect(() => {
    console.log('usageData', usageData);
  }, [usageData]);

  useEffect(() => {
    console.log('costData', costData);
  }, [costData]);

  return !loadingChart && !loadingPrice ? (
    <div id="SmartCLIDE-Widget-Monitorig" className="text-center">
      <h4 className="text-white">Deployment is running</h4>
      {!loadingChart ? (
        <ChartSynchronizedArea data={usageData} />
      ) : (
        <Spinner isVisible={loadingChart} />
      )}
      {!loadingPrice ? (
        <div className="d-flex mt-1">
          {costData?.map((costData: CostMetrics, index: number) => {
            const { cost, cost_type, name, current } = costData;
            return (
              <PriceCard
                key={index}
                cost={cost}
                cost_type={cost_type}
                name={name}
                current={current}
              />
            );
          })}
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
