"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DoctorWorkloadItem } from '../../types';

interface DoctorWorkloadChartProps {
  data: DoctorWorkloadItem[];
}

export const DoctorWorkloadChart: React.FC<DoctorWorkloadChartProps> = ({ data }) => {
  // Take top 6 doctors and shorten names for clean XAxis display
  const chartData = data.slice(0, 6).map((doc) => ({
    ...doc,
    shortName: doc.name.replace('Dr. ', ''),
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="shortName"
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
            formatter={(val: any) => [`${val} patients`, 'Assigned Patients']}
            labelFormatter={(label: any) => `Dr. ${label}`}
          />
          <Bar
            dataKey="patientCount"
            fill="#1E46EB"
            radius={[6, 6, 0, 0]}
            name="Assigned Patients"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
