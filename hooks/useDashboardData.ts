
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchData } from '../services/dataService';
import type { UserBehavior } from '../types';

interface CachedData {
  data: UserBehavior[];
  timestamp: number;
}

export const useDashboardData = (url: string) => {
  const [data, setData] = useState<UserBehavior[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<CachedData | null>(null);

  const fetchAndSetData = useCallback(async (forceRefresh: boolean = false) => {
    setLoading(true);
    setError(null);

    const now = Date.now();
    if (!forceRefresh && cache.current && (now - cache.current.timestamp < 60000)) {
      setData(cache.current.data);
      setLoading(false);
      return;
    }

    try {
      const result = await fetchData(url);
      cache.current = { data: result, timestamp: now };
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchAndSetData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAndSetData]);

  const refreshData = useCallback(() => {
    fetchAndSetData(true);
  }, [fetchAndSetData]);

  return { data, loading, error, refreshData };
};
