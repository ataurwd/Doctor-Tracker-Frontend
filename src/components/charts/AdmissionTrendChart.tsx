"use client";

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
import { TrendItem } from '../../types';

interface AdmissionTrendChartProps {
  data: TrendItem[];
}

export const AdmissionTrendChart: React.FC<AdmissionTrendChartProps> = ({ data }) => {
  // Format short date for XAxis
  const formattedData = data.map((item) => {
    const d = new Date(item.date);
    return {
      ...item,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
  });

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="admissionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1E46EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#67BAF4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="displayDate"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
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
          <Area
            type="monotone"
            dataKey="admissions"
            name="New Admissions"
            stroke="#1E46EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#admissionGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
