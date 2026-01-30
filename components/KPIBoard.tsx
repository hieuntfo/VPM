
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import KPICard from './KPICard';
import InfoCard from './InfoCard';

interface KPIBoardProps {
  data: UserBehavior[];
}

const KPIBoard: React.FC<KPIBoardProps> = ({ data }) => {
  const kpiData = useMemo(() => {
    if (data.length === 0) {
      return {
        totalUsers: 0,
        upLevelRate: 0,
        avgCTR: 0,
        avgTimeOnSite: 0,
        ctrUplift: 0,
      };
    }

    const totalUsers = new Set(data.map(d => d.user_id_masked)).size;

    const upLevelUsers = data.filter(d => {
        if (!d.current_segment || !d.previous_segment) return false;
        const current = parseInt(d.current_segment.replace('L', ''), 10);
        const previous = parseInt(d.previous_segment.replace('L', ''), 10);
        return !isNaN(current) && !isNaN(previous) && current > previous;
    }).length;
    const upLevelRate = totalUsers > 0 ? (upLevelUsers / totalUsers) * 100 : 0;
    
    const totalCTR = data.reduce((acc, curr) => acc + curr.personalized_ctr, 0);
    const avgCTR = data.length > 0 ? totalCTR / data.length : 0;

    const totalDuration = data.reduce((acc, curr) => acc + curr.avg_session_duration, 0);
    const avgTimeOnSite = data.length > 0 ? totalDuration / data.length : 0;

    const baselineCTR = 3.5; // Assumed baseline for non-personalized content
    const ctrUplift = avgCTR > 0 ? ((avgCTR - baselineCTR) / baselineCTR) * 100 : 0;

    return { totalUsers, upLevelRate, avgCTR, avgTimeOnSite, ctrUplift };
  }, [data]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        <KPICard title="Tổng User Active" value={kpiData.totalUsers.toLocaleString()} />
        <KPICard title="Tỷ lệ Chuyển đổi (Up-level)" value={`${kpiData.upLevelRate.toFixed(1)}%`} />
        <KPICard
          title="CTR Cá nhân hóa TB"
          value={`${kpiData.avgCTR.toFixed(2)}%`}
          color={kpiData.avgCTR < 4.2 ? 'text-red-400' : 'text-green-400'}
        />
        <KPICard
            title="CTR Uplift (vs Non-Personalized)"
            value={`+${kpiData.ctrUplift.toFixed(1)}%`}
            color={kpiData.ctrUplift > 0 ? 'text-green-400' : 'text-red-400'}
            subtitle="So với baseline 3.5%"
        />
        <KPICard title="Avg Time on Site" value={formatDuration(kpiData.avgTimeOnSite)} />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <InfoCard 
          title="Diversity Score" 
          message="Chỉ số chưa thể đo lường. Cần nguồn dữ liệu có đầy đủ các chủ đề đã hiển thị trong một phiên để tính toán 'Filter Bubble'." 
        />
        <InfoCard 
          title="Latency (Độ trễ)" 
          message="Chỉ số chưa thể đo lường. Cần nguồn dữ liệu ghi nhận thời gian phản hồi của API gợi ý tin bài để đảm bảo < 200ms." 
        />
      </div>
    </>
  );
};

export default KPIBoard;
