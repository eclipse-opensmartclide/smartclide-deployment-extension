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

import { ContainerMetrics } from '../../../../common/ifaces';
interface ChartSynchronizedAreaProps {
  data: ContainerMetrics | undefined;
}
// let interval: any;
const ChartSynchronizedArea: React.FC<ChartSynchronizedAreaProps> = (props) => {
  const { data } = props;

  const [cpu, setCpu] = useState<string[]>(['0']);
  const [memory, setMemory] = useState<string[]>(['0']);

  useEffect(() => {
    data?.usage?.memory &&
      setMemory((prev: string[]) => {
        return [...prev, data?.usage?.memory];
      });
    return () => {
      setMemory([]);
    };
  }, [data?.usage?.memory]);

  useEffect(() => {
    data?.usage?.cpu &&
      setCpu((prev: string[]) => {
        return [...prev, data?.usage?.cpu];
      });
    return () => {
      setCpu([]);
    };
  }, [data?.usage?.cpu]);

  return memory && data?.name && cpu ? (
    <>
      {data?.name && <p className="text-white mb-0">{data?.name}</p>}
      {memory && memory.length > 0 && (
        <>
          <p className="text-white mb-0 text-left">RAM</p>
          <ResponsiveContainer width={'100%'} height={200}>
            <AreaChart
              width={600}
              height={200}
              data={memory}
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
        </>
      )}
      {cpu && (
        <>
          <p className="text-white mb-0 text-left">CPU</p>
          <ResponsiveContainer width={'100%'} height={200}>
            <AreaChart
              width={600}
              height={200}
              data={cpu}
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
        </>
      )}
    </>
  ) : (
    <></>
  );
};

export default ChartSynchronizedArea;
