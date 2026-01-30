
import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  color?: string;
  subtitle?: string;
  description?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, color = 'text-white', subtitle, description }) => {
  return (
    <div className="bg-gray-800/60 border border-gray-700 p-6 rounded-xl shadow-lg flex flex-col group relative transition-all hover:bg-gray-800">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        {description && (
          <div className="relative">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-500 cursor-help hover:text-blue-400 transition-colors"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-[10px] text-gray-300 rounded shadow-2xl z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-gray-700">
              {description}
            </div>
          </div>
        )}
      </div>
      <p className={`text-3xl font-black mt-1 ${color}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-gray-500 mt-2 font-medium uppercase">{subtitle}</p>}
    </div>
  );
};

export default KPICard;
