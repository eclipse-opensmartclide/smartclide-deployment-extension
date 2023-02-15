import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { Serie } from '../../../../common/ifaces'

interface ChartSynchronizedAreaProps {
  data: Serie[] | undefined
}
const ChartSynchronizedArea: React.FC<ChartSynchronizedAreaProps> = ({
  data,
}) => {
  return data ? (
    <div className="d-flex space-bettwen center mt-1">
      {data.map((container, index) => {
        const serie = container.series.cpu.map((value, index) => {
          return { cpu: value, memory: container.series.memory[index] }
        })

        return (
          <div key={`${index}-asdasd`} className="w-100 pr-2">
            <h4>{container.name}</h4>
            <ResponsiveContainer width={'100%'} height={200}>
              <AreaChart
                width={600}
                height={200}
                data={serie}
                syncId="anyId"
                margin={{
                  top: 10,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis type="number" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#333333',
                    color: '#ccccc',
                  }}
                  label={true}
                  labelFormatter={() => ''}
                />
                <Area
                  isAnimationActive={true}
                  type="monotone"
                  dataKey="memory"
                  stroke="#d8848c"
                  fill="#d8848c"
                  unit="Ki"
                />
                <Area
                  isAnimationActive={true}
                  type="monotone"
                  dataKey="cpu"
                  unit="kn"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  ) : (
    <p>Non data provive</p>
  )
}

export default ChartSynchronizedArea
