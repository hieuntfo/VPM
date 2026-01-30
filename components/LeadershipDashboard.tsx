
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GaugeChart from './GaugeChart';

interface LeadershipDashboardProps {
  data: UserBehavior[];
}

const ChartContainer: React.FC<{ title: string, children: React.ReactNode, note?: string }> = ({ title, children, note }) => (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-96 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        {note && <p className="text-xs text-gray-500 mb-4">{note}</p>}
        <div className="flex-grow">{children}</div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-2 border border-gray-600 rounded">
        <p className="label text-white font-semibold">{`Tháng: ${label}`}</p>
        {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
                {`${pld.name}: ${pld.value.toLocaleString()} users`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};


const LeadershipDashboard: React.FC<LeadershipDashboardProps> = ({ data }) => {

    const movementData = useMemo(() => {
        const monthlyMovements = data.reduce((acc, curr) => {
            const month = curr.report_date.substring(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { month, 'L3 ➔ L4': 0, 'L3 ➔ L5': 0 };
            }
            if (curr.previous_segment === 'L3') {
                if (curr.current_segment === 'L4') {
                    acc[month]['L3 ➔ L4'] += 1;
                } else if (curr.current_segment === 'L5') {
                    acc[month]['L3 ➔ L5'] += 1;
                }
            }
            return acc;
        }, {} as Record<string, { month: string; 'L3 ➔ L4': number; 'L3 ➔ L5': number; }>);

        return Object.values(monthlyMovements).sort((a, b) => a.month.localeCompare(b.month));
    }, [data]);

    const pagesPerUserData = useMemo(() => {
        // Mocked data as `pages` metric is not available in the source
        const totalUsers = new Set(data.map(d => d.user_id_masked)).size;
        if (totalUsers === 0) return { value: 0, target: 85 };
        // This is a rough estimation for demonstration
        const totalSessions = data.reduce((acc, curr) => acc + curr.total_sessions, 0);
        const avgSessionsPerUser = totalSessions / totalUsers;
        const assumedPagesPerSession = 5.5; 
        const pagesPerUser = avgSessionsPerUser * assumedPagesPerSession;
        return { value: Math.min(pagesPerUser, 95), target: 85 }; // Cap value for visual reasons
    }, [data]);
    

    if (data.length === 0) {
        return <div className="text-center py-10 text-gray-400">Không có dữ liệu để hiển thị.</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
                <ChartContainer title="User Movement Trend (L3 upwards)">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={movementData} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="month" stroke="#A0AEC0" />
                            <YAxis stroke="#A0AEC0" />
                            <Tooltip content={<CustomTooltip/>}/>
                            <Legend />
                            <Line type="monotone" name="L3 ➔ L4" dataKey="L3 ➔ L4" stroke="#38B2AC" strokeWidth={2} />
                            <Line type="monotone" name="L3 ➔ L5" dataKey="L3 ➔ L5" stroke="#805AD5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
            <div className="lg:col-span-2">
                 <ChartContainer 
                    title="Pages / User"
                    note="Dữ liệu giả lập để minh họa."
                 >
                    <GaugeChart
                        value={pagesPerUserData.value}
                        target={pagesPerUserData.target}
                        label="Pages/User"
                    />
                 </ChartContainer>
            </div>
        </div>
    );
};

export default LeadershipDashboard;
