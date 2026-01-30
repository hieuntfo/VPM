
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DeepDiveChartsProps {
  data: UserBehavior[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-600 rounded">
        <p className="label text-white">{`${label}`}</p>
        <p className="intro text-cyan-400">{`Số user: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ChartContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-96">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        {children}
    </div>
);


const DeepDiveCharts: React.FC<DeepDiveChartsProps> = ({ data }) => {
  const segmentData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      acc[curr.current_segment] = (acc[curr.current_segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, users]) => ({ name, users })).sort((a,b) => a.name.localeCompare(b.name));
  }, [data]);

  const goldenHourData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      const hour = curr.golden_hour;
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    return Array.from({ length: 24 }, (_, i) => ({
      name: `${i}h`,
      users: counts[i] || 0,
    }));
  }, [data]);

  const topTopicsData = useMemo(() => {
    const counts = data.reduce((acc, curr) => {
      acc[curr.top_interest_topic] = (acc[curr.top_interest_topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts)
      .map(([name, users]) => ({ name, users }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 5);
  }, [data]);

  if (data.length === 0) {
    return <div className="text-center py-10 text-gray-400">Không có dữ liệu để hiển thị.</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <ChartContainer title="Phân bố User theo Phân khúc">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={segmentData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="users" fill="#38B2AC" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <ChartContainer title="Khung giờ vàng">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={goldenHourData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" tick={{fontSize: 12}} interval={1} />
            <YAxis stroke="#A0AEC0" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="users" fill="#805AD5" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="lg:col-span-2">
        <ChartContainer title="Top 5 Chủ đề quan tâm nhất">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topTopicsData} margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis type="number" stroke="#A0AEC0" />
                <YAxis dataKey="name" type="category" stroke="#A0AEC0" width={150} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="users" fill="#D53F8C" />
            </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </div>

    </div>
  );
};

export default DeepDiveCharts;
