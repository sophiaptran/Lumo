"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MonthlyBarGraph = ({ data }) => {
  const defaultData = [
    { month: 'Jan', amount: 850 },
    { month: 'Feb', amount: 920 },
    { month: 'Mar', amount: 780 },
    { month: 'Apr', amount: 900 },
    { month: 'May', amount: 1100 },
    { month: 'Jun', amount: 950 },
  ];

  const chartData = data || defaultData;
  const barColors = ['#8B5CF6', '#3B82F6', '#14B8A6', '#22D3EE', '#8B5CF6', '#3B82F6'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-2 shadow-lg">
          <p className="text-white text-sm font-semibold">{payload[0].payload.month}</p>
          <p className="text-white/70 text-xs">${payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="month" 
            stroke="#ffffff40"
            tick={{ fill: '#ffffff70', fontSize: 12 }}
            axisLine={{ stroke: '#ffffff20' }}
            interval={0}
            tickMargin={8}
          />
          <YAxis 
            stroke="#ffffff40"
            tick={{ fill: '#ffffff70', fontSize: 12 }}
            axisLine={{ stroke: '#ffffff20' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
          <Bar 
            dataKey="amount" 
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};