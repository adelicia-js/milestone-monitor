import { ApiClient } from '../client';
import { ApiResponse } from '../../types';

interface BaseEntry {
  faculty_id: string;
  faculty_name: string;
  is_verified: string;
  entry_type?: string;
}

interface EntryData extends BaseEntry {
  paper_title?: string;
  title?: string;
  patent_name?: string;
  conf_date?: string;
  month_and_year_of_publication?: string;
  date?: string;
  patent_date?: string;
}

interface ReportData {
  full_data: EntryData[];
  disp_data: {
    title: string;
    faculty_id: string;
    faculty_name: string;
    entry_type: string;
    date: string;
    status: string;
  }[];
}

interface QueryResult {
  data: unknown[] | null;
  error: string | null;
}

export class ReportApi extends ApiClient {
  async getReportData(
    startDate: string = '2001-01-01',
    endDate: string = new Date().toISOString().split('T')[0],
    filterType: string = 'all',
    title: string = '',
    status: string = 'PENDING',
    facultyId: string | null = '',
    department: string | null = '',
  ): Promise<ApiResponse<ReportData>> {
    try {
      console.log('CLIENT getReportData: Calling server route with:', {
        startDate, endDate, filterType, title, status, facultyId, department
      });
      
      const response = await fetch('/api/admin/department-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          filterType,
          title,
          status,
          facultyId,
          department
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('SERVER getReportData response not ok:', result);
        return { data: { full_data: [], disp_data: [] }, error: result.error || 'Failed to generate report' };
      }

      console.log('SERVER getReportData success:', result.data);
      return { data: result.data, error: result.error };
    } catch (error) {
      console.error('Error in getReportData:', error);
      return { data: { full_data: [], disp_data: [] }, error: 'Failed to generate report' };
    }
  }

  // Helper methods to fetch data filtered by faculty IDs
  private async getConferencesByDepartment(
    facultyIds: string[],
    startDate: string,
    endDate: string
  ): Promise<QueryResult> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from('conferences')
      .select('*')
      .in('faculty_id', facultyIds)
      .gte('conf_date', startDate)
      .lte('conf_date', endDate);
    
    return { data, error: error?.message || null };
  }

  private async getJournalsByDepartment(
    facultyIds: string[],
    startDate: string,
    endDate: string
  ): Promise<QueryResult> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from('journal_publications')
      .select('*')
      .in('faculty_id', facultyIds)
      .gte('month_and_year_of_publication', startDate)
      .lte('month_and_year_of_publication', endDate);
    
    return { data, error: error?.message || null };
  }

  private async getWorkshopsByDepartment(
    facultyIds: string[],
    startDate: string,
    endDate: string
  ): Promise<QueryResult> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from('fdp_workshop_refresher_course')
      .select('*')
      .in('faculty_id', facultyIds)
      .gte('date', startDate)
      .lte('date', endDate);
    
    return { data, error: error?.message || null };
  }

  private async getPatentsByDepartment(
    facultyIds: string[],
    startDate: string,
    endDate: string
  ): Promise<QueryResult> {
    const supabase = this.getSupabase();
    const { data, error } = await supabase
      .from('patents')
      .select('*')
      .in('faculty_id', facultyIds)
      .gte('patent_date', startDate)
      .lte('patent_date', endDate);
    
    return { data, error: error?.message || null };
  }
} 