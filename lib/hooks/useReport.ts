import { useState, useCallback } from 'react';
import { ReportApi } from '../api';

interface ReportFilters {
  searchQuery: string;
  startDate: string;
  endDate: string;
  selectedStaff: string;
  selectedType: string;
  selectedStatus: string;
}

interface DisplayData {
  title: string;
  faculty_id: string;
  faculty_name: string;
  entry_type: string;
  date: string;
  status: string;
}

interface EntryData {
  faculty_id: string;
  faculty_name: string;
  is_verified: string;
  entry_type?: string;
  paper_title?: string;
  title?: string;
  patent_name?: string;
  conf_date?: string;
  month_and_year_of_publication?: string;
  date?: string;
  patent_date?: string;
}

export const useReport = () => {
  const [data, setData] = useState<DisplayData[]>([]);
  const [fullData, setFullData] = useState<EntryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = useCallback(async (filters: ReportFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const reportApi = new ReportApi();
      const response = await reportApi.getReportData(
        filters.startDate || '2001-01-01',
        filters.endDate || new Date().toISOString().split('T')[0],
        filters.selectedType || 'all',
        filters.searchQuery,
        filters.selectedStatus || 'PENDING',
        filters.selectedStaff || null
      );

      if (response.error) {
        throw new Error(response.error);
      }

      setData(response.data?.disp_data || []);
      setFullData(response.data?.full_data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching report data');
      setData([]);
      setFullData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    fullData,
    loading,
    error,
    fetchReportData,
  };
}; 