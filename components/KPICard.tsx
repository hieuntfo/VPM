
import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, color = 'text-white' }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-sm font-medium text-gray-400 uppercase">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
};

export default KPICard;
