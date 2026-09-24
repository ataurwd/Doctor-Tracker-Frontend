"use client";

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ConditionPieChartProps {
  data: Array<{ condition: string; count: number }>;
}

const COLORS: Record<string, string> = {
  Critical: '#EF4444',
  Stable: '#10B981',
  Recovering: '#1E46EB',       // Bold Blue
  'Routine Checkup': '#67BAF4', // Light Blue
  'Under Observation': '#F59E0B',
};

export const ConditionPieChart: React.FC<ConditionPieChartProps> = ({ data }) => {
  const chartData = data.filter((item) => item.count > 0);

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-xs text-slate-400">
        No condition data available
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="condition"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.condition] || '#94A3B8'}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              fontSize: '12px',
              fontWeight: 600,
            }}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
