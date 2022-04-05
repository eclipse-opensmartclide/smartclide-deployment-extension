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

const initialData: DataChart[] = [
  {
    memory: 4000,
    cpu: 20,
  },
  {
    memory: 3000,
    cpu: 27,
  },
  {
    memory: 2000,
    cpu: 57,
  },
  {
    memory: 2780,
    cpu: 62,
  },
  {
    memory: 1890,
    cpu: 69,
  },
  {
    memory: 2390,
    cpu: 18,
  },
  {
    memory: 3490,
    cpu: 42,
  },
];

interface SynchronizedAreaChartProps {}
interface DataChart {
  memory: number;
  cpu: number;
}
let interval: any;
const SynchronizedAreaChart: React.FC<SynchronizedAreaChartProps> = () => {
  const [data, setData] = useState<DataChart[]>(initialData);
  useEffect(() => {
    interval = setInterval(() => {
      setData((prev) => {
        prev.length >= 6 && prev.shift();
        return [
          ...prev,
          {
            memory: Math.round(Math.random() * (6000 - 1000 + 1) + 1000),
            cpu: Math.round(Math.random() * 100) + 1,
          },
        ];
      });
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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

export default SynchronizedAreaChart;
