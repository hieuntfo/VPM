
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LabelList
} from 'recharts';
import GaugeChart from './GaugeChart';
import KPICard from './KPICard';

interface LeadershipDashboardProps {
  data: UserBehavior[];
}

const ChartContainer: React.FC<{ title: string, children: React.ReactNode, note?: string, explanation?: string }> = ({ title, children, note, explanation }) => (
    <div className="bg-gray-800/40 border border-gray-700/50 p-6 rounded-xl shadow-lg h-[400px] flex flex-col group relative">
        <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {explanation && (
                <div className="group/info relative">
                    <button className="text-gray-500 hover:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    </button>
                    <div className="absolute top-0 right-full mr-3 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg text-xs text-gray-400 shadow-2xl z-50 hidden group-hover/info:block">
                        {explanation}
                    </div>
                </div>
            )}
        </div>
        {note && <p className="text-xs text-gray-500 mb-4 font-medium italic">{note}</p>}
        <div className="flex-grow">{children}</div>
    </div>
);

const LeadershipDashboard: React.FC<LeadershipDashboardProps> = ({ data }) => {
    const funnelData = useMemo(() => {
        const counts = {
            L3: data.filter(d => d.current_segment === 'L3').length,
            L4: data.filter(d => d.current_segment === 'L4').length,
            L5: data.filter(d => d.current_segment === 'L5').length,
        };
        return [
            { name: 'Trung thành (L3)', value: counts.L3, fill: '#3B82F6' },
            { name: 'Chủ chốt (L4)', value: counts.L4, fill: '#10B981' },
            { name: 'Đại sứ (L5)', value: counts.L5, fill: '#F59E0B' },
        ];
    }, [data]);

    const movementTrend = useMemo(() => {
        const months = Array.from(new Set(data.map(d => d.report_date.substring(0, 7)))).sort();
        return months.map(m => {
            const monthlyData = data.filter(d => d.report_date.startsWith(m));
            return {
                month: m,
                upLevels: monthlyData.filter(d => {
                    const curr = parseInt(d.current_segment.replace('L', ''));
                    const prev = parseInt(d.previous_segment.replace('L', ''));
                    return curr > prev;
                }).length
            };
        });
    }, [data]);

    const stats = useMemo(() => {
        const churnCount = data.filter(d => d.is_churn_risk).length;
        const churnRate = data.length > 0 ? (churnCount / data.length) * 100 : 0;
        
        // Giả lập Loyalty Index: (Sessions * AvgDuration) / 100
        const totalLoyalty = data.reduce((acc, curr) => acc + (curr.total_sessions * curr.avg_session_duration), 0);
        const avgLoyalty = data.length > 0 ? totalLoyalty / (data.length * 10) : 0;

        return { churnRate, avgLoyalty };
    }, [data]);

    if (data.length === 0) return <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">Dữ liệu đang được cập nhật...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                    title="Chỉ số Trung thành (AI)" 
                    value={stats.avgLoyalty.toFixed(0)} 
                    color="text-blue-400"
                    description="Chỉ số tổng hợp từ tần suất truy cập và thời gian đọc. > 500 được coi là người dùng 'nghiện' nội dung."
                />
                <KPICard 
                    title="Tỷ lệ Rủi ro Rời bỏ" 
                    value={`${stats.churnRate.toFixed(1)}%`} 
                    color={stats.churnRate > 15 ? 'text-red-400' : 'text-green-400'}
                    description="Tỷ lệ người dùng có dấu hiệu giảm tương tác đột ngột trong 7 ngày qua."
                />
                <KPICard 
                    title="Hiệu quả Nâng hạng" 
                    value="+12.5%" 
                    color="text-emerald-400"
                    subtitle="So với tháng trước"
                    description="Tỷ lệ tăng trưởng của nhóm user thăng cấp từ L3 lên L4/L5."
                />
                <KPICard 
                    title="Độ phủ Cá nhân hóa" 
                    value="98.2%" 
                    color="text-purple-400"
                    description="Tỷ lệ người dùng trong tệp L3-L5 nhận được ít nhất 1 gợi ý cá nhân hóa mỗi phiên."
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                    <ChartContainer 
                        title="Phễu Chuyển đổi Phân khúc" 
                        note="Cơ cấu tập User trung thành"
                        explanation="Biểu đồ này cho biết sức khỏe của tệp độc giả. Mục tiêu là biến hình tam giác ngược thành hình trụ (tăng tỷ lệ L5)."
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={funnelData} margin={{left: 40, right: 40}}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} tick={{fontSize: 11}} />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={35}>
                                    <LabelList dataKey="value" position="right" fill="#94A3B8" fontSize={11} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                <div className="lg:col-span-1">
                    <ChartContainer 
                        title="Tải trang / User" 
                        note="Mục tiêu duy trì > 85"
                        explanation="Số trang xem trung bình của một user trong tháng. Đây là chỉ số quan trọng nhất để đánh giá độ 'cuốn' của nội dung."
                    >
                        <GaugeChart value={82.4} target={85} label="Pages/User" />
                    </ChartContainer>
                </div>
                <div className="lg:col-span-1">
                     <ChartContainer 
                        title="Xu hướng Thăng hạng" 
                        note="Số user chuyển vùng L3 ➔ L5"
                        explanation="Đường biểu diễn số lượng user nâng cấp trải nghiệm thành công. Tăng trưởng ở đây chứng minh AI đang giáo dục hành vi đọc tốt."
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={movementTrend}>
                                <defs>
                                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" hide />
                                <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', fontSize: '12px'}} />
                                <Area type="monotone" dataKey="upLevels" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorUp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </ChartContainer>
                </div>
            </div>
        </div>
    );
};

export default LeadershipDashboard;
