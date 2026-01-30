
import type { UserBehavior } from '../types';

export const fetchData = async (url: string): Promise<UserBehavior[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tsvData = await response.text();
    return parseTSV(tsvData);
  } catch (error) {
    console.error("Failed to fetch or parse data:", error);
    throw new Error("Không thể tải dữ liệu, vui lòng kiểm tra đường truyền");
  }
};

const parseTSV = (tsv: string): UserBehavior[] => {
  const lines = tsv.trim().split('\n');
  const headers = lines[0].split('\t').map(h => h.trim());
  const data: UserBehavior[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    if (values.length !== headers.length) continue;

    const entry: any = {};
    headers.forEach((header, index) => {
      entry[header] = values[index];
    });

    data.push({
      report_date: entry.report_date,
      user_id_masked: entry.user_id_masked,
      current_segment: entry.current_segment,
      previous_segment: entry.previous_segment,
      total_sessions: parseInt(entry.total_sessions, 10) || 0,
      avg_session_duration: parseInt(entry.avg_session_duration, 10) || 0,
      personalized_ctr: parseFloat(entry.personalized_ctr) || 0,
      top_interest_topic: entry.top_interest_topic,
      golden_hour: parseInt(entry.golden_hour, 10) || 0,
      is_churn_risk: entry.is_churn_risk.toLowerCase() === 'true',
    });
  }
  return data;
};
