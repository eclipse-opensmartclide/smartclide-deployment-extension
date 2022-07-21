import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Serie } from '../../../../common/ifaces';

interface ChartSynchronizedAreaProps {
  data: Serie[] | undefined;
}
const ChartSynchronizedArea: React.FC<ChartSynchronizedAreaProps> = ({
  data,
}) => {
  return data ? (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <AreaChart
          width={600}
          height={200}
          data={[]}
          syncId="anyId"
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis />
          <YAxis type="number" domain={[0, 8000]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#333333',
              color: '#ccccc',
            }}
            label={false}
            labelFormatter={() => ''}
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="uv"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            fill="#8884d8"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="amt"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  ) : (
    <p>Non data provive</p>
  );
};

export default ChartSynchronizedArea;
