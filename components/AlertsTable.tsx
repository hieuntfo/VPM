
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';

interface AlertsTableProps {
  data: UserBehavior[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ data }) => {
  const churnRiskUsers = useMemo(() => {
    return data.filter(user => user.is_churn_risk);
  }, [data]);

  if (churnRiskUsers.length === 0) {
    return <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">Không có người dùng nào trong diện cảnh báo rủi ro.</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phân khúc hiện tại</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">CTR Cá nhân hóa (%)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Chủ đề quan tâm</th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {churnRiskUsers.map((user) => (
                    <tr key={user.user_id_masked} className="bg-red-900/20 hover:bg-red-900/40">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-300">{user.user_id_masked}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-300">{user.current_segment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-300">{user.personalized_ctr.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-300">{user.top_interest_topic}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default AlertsTable;
