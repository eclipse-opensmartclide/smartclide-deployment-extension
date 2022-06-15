import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { UsageMetrics } from '../../../../common/ifaces';
interface ChartSynchronizedAreaProps {
  data: UsageMetrics[] | undefined;
}
// let interval: any;
const ChartSynchronizedArea: React.FC<ChartSynchronizedAreaProps> = (props) => {
  const { data } = props;

  return (
    <div>
      <p className="text-white mb-0 text-left">RAM</p>
      <ResponsiveContainer width={'100%'} height={200}>
        <AreaChart
          width={600}
          height={200}
          data={data}
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
            dataKey="memory"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="text-white mb-0 text-left">CPU</p>
      <ResponsiveContainer width={'100%'} height={200}>
        <AreaChart
          width={600}
          height={200}
          data={data}
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
          <YAxis type="number" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#333333',
              color: '#ccccc',
            }}
            label={false}
            labelFormatter={() => ''}
          />
          <Area
            type="monotone"
            dataKey="cpu"
            stroke="#82ca9d"
            fill="#82ca9d"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSynchronizedArea;
