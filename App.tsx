
import React, { useState, useMemo } from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import type { UserBehavior, FilterState } from './types';
import Sidebar from './components/Sidebar';
import KPIBoard from './components/KPIBoard';
import DeepDiveCharts from './components/DeepDiveCharts';
import AlertsTable from './components/AlertsTable';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import { DATA_URL } from './constants';

type Tab = 'overview' | 'deepdive' | 'alerts';

const App: React.FC = () => {
  const { data: rawData, loading, error, refreshData } = useDashboardData(DATA_URL);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filters, setFilters] = useState<FilterState>({
    report_date: 'all',
    current_segment: 'all',
    top_interest_topic: 'all',
  });

  const filterOptions = useMemo(() => {
    if (!rawData) return { dates: [], segments: [], topics: [] };
    const dates = ['all', ...Array.from(new Set(rawData.map(d => d.report_date)))];
    const segments = ['all', ...Array.from(new Set(rawData.map(d => d.current_segment)))];
    const topics = ['all', ...Array.from(new Set(rawData.map(d => d.top_interest_topic)))];
    return { dates, segments, topics };
  }, [rawData]);

  const filteredData = useMemo(() => {
    if (!rawData) return [];
    return rawData.filter(item => {
      const dateMatch = filters.report_date === 'all' || item.report_date === filters.report_date;
      const segmentMatch = filters.current_segment === 'all' || item.current_segment === filters.current_segment;
      const topicMatch = filters.top_interest_topic === 'all' || item.top_interest_topic === filters.top_interest_topic;
      return dateMatch && segmentMatch && topicMatch;
    });
  }, [rawData, filters]);

  const renderContent = () => {
    if (loading && !rawData) return <Loader />;
    if (error) return <ErrorDisplay message={error} />;
    if (!rawData) return null;

    switch (activeTab) {
      case 'overview':
        return <KPIBoard data={filteredData} />;
      case 'deepdive':
        return <DeepDiveCharts data={filteredData} />;
      case 'alerts':
        return <AlertsTable data={filteredData} />;
      default:
        return null;
    }
  };

  const TabButton = ({ tabId, label }: { tabId: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar filters={filters} setFilters={setFilters} options={filterOptions} />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-0">
            📊 VnExpress Personalization Monitor
          </h1>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center"
          >
            {loading ? <Loader small /> : <RefreshCwIcon className="w-4 h-4 mr-2" />}
            Refresh Data
          </button>
        </header>

        <div className="mb-6">
          <div className="flex space-x-2 border-b border-gray-700 pb-2">
            <TabButton tabId="overview" label="Tổng quan (Overview)" />
            <TabButton tabId="deepdive" label="Phân tích Hành vi (Deep Dive)" />
            <TabButton tabId="alerts" label="Cảnh báo Rủi ro (Alerts)" />
          </div>
        </div>
        
        <div className="w-full">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

const RefreshCwIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);


export default App;
