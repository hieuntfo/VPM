
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import KPICard from './KPICard';

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
      };
    }

    const totalUsers = new Set(data.map(d => d.user_id_masked)).size;

    const upLevelUsers = data.filter(d => {
        const current = parseInt(d.current_segment.replace('L', ''), 10);
        const previous = parseInt(d.previous_segment.replace('L', ''), 10);
        return current > previous;
    }).length;
    const upLevelRate = totalUsers > 0 ? (upLevelUsers / totalUsers) * 100 : 0;
    
    const totalCTR = data.reduce((acc, curr) => acc + curr.personalized_ctr, 0);
    const avgCTR = totalCTR / data.length;

    const totalDuration = data.reduce((acc, curr) => acc + curr.avg_session_duration, 0);
    const avgTimeOnSite = totalDuration / data.length;

    return { totalUsers, upLevelRate, avgCTR, avgTimeOnSite };
  }, [data]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <KPICard title="Tổng User Active" value={kpiData.totalUsers.toLocaleString()} />
      <KPICard title="Tỷ lệ Chuyển đổi (Up-level)" value={`${kpiData.upLevelRate.toFixed(1)}%`} />
      <KPICard
        title="CTR Trung bình"
        value={`${kpiData.avgCTR.toFixed(2)}%`}
        color={kpiData.avgCTR < 4.2 ? 'text-red-400' : 'text-green-400'}
      />
      <KPICard title="Avg Time on Site" value={formatDuration(kpiData.avgTimeOnSite)} />
    </div>
  );
};

export default KPIBoard;
