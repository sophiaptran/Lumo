"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

type PieChartsProps = {
  data: { name: string; value: number }[]
  colors: Record<string, string>
  title?: string
}

export const PieCharts = ({ data, colors, title }: PieChartsProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="text-white h-full flex flex-col">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      
      <div className="flex-1 flex items-center justify-between gap-6">
        {/* Pie Chart */}
        <div className="flex-shrink-0" style={{ width: '180px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => {
                  const color = colors[entry.name] || `hsl(${(index*37)%360} 85% 60%)`
                  return <Cell key={`cell-${index}`} fill={color} />
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {data.map((item) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
            return (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[item.name] || `hsl(${(data.findIndex(d=>d.name===item.name)*37)%360} 85% 60%)` }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-70">{percentage}%</span>
                  <span className="text-sm font-semibold w-16 text-right">{currencyFmt.format(Number(item.value))}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Total Spending</span>
          <span className="text-xl font-bold">{currencyFmt.format(Number(total))}</span>
        </div>
      </div>
    </div>
  );
}