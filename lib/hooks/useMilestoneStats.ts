import { useState, useEffect } from 'react';
import { facultyApi } from '../api';
import { createBrowserClient } from '@supabase/ssr';

export const useMilestoneStats = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<number[]>([0, 0, 0, 0]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.email) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      // Fetch milestone statistics
      const { data, error: statsError } = await facultyApi.getMilestoneStatistics(user.email);
      
      if (statsError) {
        setError(statsError);
        setIsLoading(false);
        return;
      }

      setStatistics(data || [0, 0, 0, 0]);
    } catch (err) {
      console.error('Error fetching milestone statistics:', err);
      setError('Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
};