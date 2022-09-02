import React, { useEffect } from 'react';
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
  useEffect(() => {
    console.log('data', data);
  }, [data]);
  const data2 = [
    {
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return data ? (
    <>
      <ResponsiveContainer width={'100%'} height={200}>
        <AreaChart
          width={600}
          height={200}
          data={data2}
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
