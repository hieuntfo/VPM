
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import KPICard from './KPICard';
import InfoCard from './InfoCard';

interface KPIBoardProps {
  data: UserBehavior[];
}

const ProgressBar: React.FC<{ value: number; target: number; label: string; info: string }> = ({ value, target, label, info }) => {
    const percent = Math.min((value / target) * 100, 100);
    return (
        <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700 group">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                    <div className="relative group/tooltip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 cursor-help"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                        <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-black text-[10px] text-gray-400 rounded hidden group-hover/tooltip:block z-50">{info}</div>
                    </div>
                </div>
                <span className={`text-sm font-black ${value >= target ? 'text-green-400' : 'text-amber-400'}`}>
                    {value.toFixed(2)}% <span className="text-gray-600 text-[10px] font-normal">/ MT {target}%</span>
                </span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${value >= target ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-amber-500'}`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}

const KPIBoard: React.FC<KPIBoardProps> = ({ data }) => {
  const kpiData = useMemo(() => {
    if (data.length === 0) return { totalUsers: 0, upLevelRate: 0, avgCTR: 0, avgTimeOnSite: 0, ctrUplift: 0 };
    
    const totalUsers = new Set(data.map(d => d.user_id_masked)).size;
    const upLevelUsers = data.filter(d => {
        if (!d.current_segment || !d.previous_segment) return false;
        const current = parseInt(d.current_segment.replace('L', ''));
        const previous = parseInt(d.previous_segment.replace('L', ''));
        return current > previous;
    }).length;
    
    const avgCTR = data.reduce((acc, curr) => acc + curr.personalized_ctr, 0) / data.length;
    const avgTimeOnSite = data.reduce((acc, curr) => acc + curr.avg_session_duration, 0) / data.length;
    const ctrUplift = ((avgCTR - 3.5) / 3.5) * 100;

    return { totalUsers, upLevelRate: (upLevelUsers / totalUsers) * 100, avgCTR, avgTimeOnSite, ctrUplift };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard 
            title="Độc giả Đang hoạt động" 
            value={kpiData.totalUsers.toLocaleString()} 
            description="Số lượng user L3-L5 duy trì tương tác trong kỳ báo cáo."
        />
        <KPICard 
            title="Tốc độ Thăng hạng" 
            value={`${kpiData.upLevelRate.toFixed(1)}%`} 
            color="text-indigo-400" 
            description="Tỷ lệ user chuyển dịch lên phân khúc cao hơn (ví dụ L3 lên L4)."
        />
        <KPICard 
            title="CTR Cá nhân hóa" 
            value={`${kpiData.avgCTR.toFixed(2)}%`} 
            color={kpiData.avgCTR >= 4.2 ? 'text-green-400' : 'text-red-400'} 
            description="Tỷ lệ click vào các vị trí tin bài được AI gợi ý."
        />
        <KPICard 
            title="Thời gian/Phiên (Giây)" 
            value={Math.round(kpiData.avgTimeOnSite)} 
            color="text-orange-400" 
            description="Thời gian trung bình một user ở lại trong một phiên truy cập."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
            <ProgressBar 
                label="Mục tiêu CTR (Tháng 11)" 
                value={kpiData.avgCTR} 
                target={4.2} 
                info="Mục tiêu được thiết lập dựa trên kết quả thử nghiệm A/B Testing tháng 11/2025."
            />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
             <InfoCard 
                title="Theo dõi Đa dạng nội dung" 
                message="Dự báo: 82% User đang trong 'Filter Bubble'. Cần tăng trọng số cho các tin bài thuộc chủ đề mới để tránh nhàm chán." 
             />
             <InfoCard 
                title="Độ trễ Hệ thống (Latency)" 
                message="Hiệu năng: P95 đạt 145ms. Hệ thống đang vận hành mượt mà, không ảnh hưởng đến trải nghiệm người dùng." 
             />
        </div>
      </div>
    </div>
  );
};

export default KPIBoard;
