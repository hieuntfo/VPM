
import React from 'react';
import type { FilterState, FilterOptions } from '../types';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, options }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const FilterSelect = ({ name, label, value, options }: { name: keyof FilterState, label: string, value: string, options: string[] }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleFilterChange}
        className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map(option => (
          <option key={option} value={option}>{option === 'all' ? 'Tất cả' : option}</option>
        ))}
      </select>
    </div>
  );

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-gray-800 p-4 md:p-6 flex-shrink-0">
      <h2 className="text-xl font-semibold text-white mb-6">Bộ lọc</h2>
      <FilterSelect name="report_date" label="Ngày báo cáo" value={filters.report_date} options={options.dates} />
      <FilterSelect name="current_segment" label="Phân khúc" value={filters.current_segment} options={options.segments} />
      <FilterSelect name="top_interest_topic" label="Chủ đề quan tâm" value={filters.top_interest_topic} options={options.topics} />
    </aside>
  );
};

export default Sidebar;
