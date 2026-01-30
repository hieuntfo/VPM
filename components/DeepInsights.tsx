
import React, { useMemo } from 'react';
import type { UserBehavior } from '../types';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Legend, ComposedChart, Line, Bar
} from 'recharts';

interface DeepInsightsProps {
  data: UserBehavior[];
}

const ChartWrapper: React.FC<{ title: string; children: React.ReactNode; info: string; warning?: string }> = ({ title, children, info, warning }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl shadow-xl flex flex-col h-[480px]">
    <div className="mb-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        {title}
        <span className="group relative cursor-help">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
           <div className="hidden group-hover:block absolute left-full ml-2 w-56 p-3 bg-gray-900 border border-gray-700 text-[11px] text-gray-400 rounded-lg shadow-2xl z-50">
             {info}
           </div>
        </span>
      </h3>
      {warning && <p className="text-[10px] text-amber-500/80 mt-1 font-semibold uppercase">{warning}</p>}
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

const DeepInsights: React.FC<DeepInsightsProps> = ({ data }) => {
  const scatterData = useMemo(() => {
    return data.slice(0, 100).map(u => ({
      x: u.personalized_ctr,
      y: u.avg_session_duration / 60, // minutes
      id: u.user_id_masked,
      segment: u.current_segment
    }));
  }, [data]);

  const topicQualityData = useMemo(() => {
    const topics: Record<string, { count: number; totalDuration: number }> = {};
    data.forEach(u => {
      if (!topics[u.top_interest_topic]) {
        topics[u.top_interest_topic] = { count: 0, totalDuration: 0 };
      }
      topics[u.top_interest_topic].count += 1;
      topics[u.top_interest_topic].totalDuration += u.avg_session_duration;
    });

    return Object.entries(topics)
      .map(([name, val]) => ({
        name,
        users: val.count,
        avgDuration: Math.round(val.totalDuration / val.count)
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 8);
  }, [data]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartWrapper 
          title="Ma trận Hiệu quả Nội dung AI" 
          info="Trục X (CTR) đo độ hấp dẫn của tiêu đề. Trục Y (Duration) đo chất lượng nội dung. User tập trung ở góc trên-phải là dấu hiệu thuật toán gợi ý 'đúng và trúng'."
          warning="Cảnh báo: User ở góc dưới-phải là Clickbait (Click nhiều nhưng thoát nhanh)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" dataKey="x" name="CTR" unit="%" stroke="#9CA3AF" label={{ value: 'Tỷ lệ Click (CTR %)', position: 'insideBottom', offset: -10, fill: '#6B7280', fontSize: 10 }} />
              <YAxis type="number" dataKey="y" name="Thời lượng" unit="m" stroke="#9CA3AF" label={{ value: 'Số phút đọc', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 10 }} />
              <ZAxis type="category" dataKey="id" name="User ID" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{backgroundColor: '#111827', borderColor: '#374151'}} />
              <Scatter name="Độc giả" data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.6} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper 
          title="Độ sâu Tương tác theo Chủ đề" 
          info="So sánh sự phổ biến (Cột xanh) và Độ đậm đặc tương tác (Đường xanh lá). Những chủ đề có đường xanh lá cao hơn cột xanh là 'Chủ đề ngách chất lượng cao'."
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={topicQualityData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{fontSize: 10}} />
              <YAxis yAxisId="left" stroke="#3B82F6" tick={{fontSize: 10}} label={{ value: 'Số lượng User', angle: -90, position: 'insideLeft', fill: '#3B82F6', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{fontSize: 10}} label={{ value: 'Giây đọc trung bình', angle: 90, position: 'insideRight', fill: '#10B981', fontSize: 10 }} />
              <Tooltip contentStyle={{backgroundColor: '#111827', borderColor: '#374151', color: '#F3F4F6'}} />
              <Legend verticalAlign="top" height={36}/>
              <Bar yAxisId="left" dataKey="users" name="Lượng độc giả" fill="#3B82F6" barSize={25} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgDuration" name="Thời gian trung bình" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981'}} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="bg-indigo-900/10 border border-indigo-500/20 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
        </div>
        <h4 className="text-indigo-400 font-black mb-3 flex items-center gap-2 uppercase tracking-tighter">
           ⚡ Chiến lược Gợi ý AI (Đề xuất)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <p className="text-gray-300 text-sm font-bold">1. Phá vỡ Bong bóng thông tin (Filter Bubble)</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Hiện tại 82% người dùng bị lặp lại 2 chủ đề quen thuộc. Hệ thống nên chèn thêm 1 tin thuộc <strong>Chủ đề ngách chất lượng cao</strong> (Đường xanh lá cao ở biểu đồ trên) vào vị trí thứ 4 trên dòng thời gian.
                </p>
            </div>
            <div className="space-y-2">
                <p className="text-gray-300 text-sm font-bold">2. Tối ưu hóa Golden Hour (20h - 22h)</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Đây là thời điểm người dùng có <strong>Duration</strong> cao nhất. AI cần ưu tiên gợi ý các bài viết chuyên sâu (Long-form) thay vì tin vắn để tận dụng tối đa sự tập trung của độc giả.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeepInsights;
