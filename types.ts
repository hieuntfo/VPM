
export interface UserBehavior {
  report_date: string;
  user_id_masked: string;
  current_segment: string;
  previous_segment: string;
  total_sessions: number;
  avg_session_duration: number; // in seconds
  personalized_ctr: number; // as a percentage, e.g., 4.5 for 4.5%
  top_interest_topic: string;
  golden_hour: number; // hour from 0-23
  is_churn_risk: boolean;
}

export interface FilterState {
  report_date: string;
  current_segment: string;
  top_interest_topic: string;
}

export interface FilterOptions {
  dates: string[];
  segments: string[];
  topics: string[];
}
