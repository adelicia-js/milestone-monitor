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
    // Department is required for efficient filtering
    if (!department) {
      return {
        data: { full_data: [], disp_data: [] },
        error: 'Department is required for report generation',
      };
    }

    // First, get all faculty IDs from the department
    const { data: facultyList } = await this.query<{ faculty_id: string }>('faculty', {
      filters: { faculty_department: department },
    });
    
    const departmentFacultyIds = (facultyList || []).map(f => f.faculty_id);
    
    if (departmentFacultyIds.length === 0) {
      return {
        data: { full_data: [], disp_data: [] },
        error: null,
      };
    }

    // Now fetch data only for faculty in this department
    const [conferences, journals, workshops, patents] = await Promise.all([
      this.getConferencesByDepartment(departmentFacultyIds, startDate, endDate),
      this.getJournalsByDepartment(departmentFacultyIds, startDate, endDate),
      this.getWorkshopsByDepartment(departmentFacultyIds, startDate, endDate),
      this.getPatentsByDepartment(departmentFacultyIds, startDate, endDate),
    ]);

    // Filter by title, status, and specific faculty (department already filtered at query level)
    const filterData = (data: EntryData[]) => {
      return data.filter((item) => {
        const titleMatch = !title || 
          (item.paper_title?.toLowerCase().includes(title.toLowerCase()) ||
           item.title?.toLowerCase().includes(title.toLowerCase()) ||
           item.patent_name?.toLowerCase().includes(title.toLowerCase()));
        const statusMatch = !status || item.is_verified === status;
        const facultyMatch = !facultyId || item.faculty_id === facultyId;
        return titleMatch && statusMatch && facultyMatch;
      });
    };

    const filteredConferences = filterData((conferences.data || []) as unknown as EntryData[]);
    const filteredJournals = filterData((journals.data || []) as unknown as EntryData[]);
    const filteredWorkshops = filterData((workshops.data || []) as unknown as EntryData[]);
    const filteredPatents = filterData((patents.data || []) as unknown as EntryData[]);

    // Add entry types
    filteredConferences.forEach(c => c.entry_type = 'conference');
    filteredJournals.forEach(j => j.entry_type = 'journal');
    filteredWorkshops.forEach(w => w.entry_type = 'workshop');
    filteredPatents.forEach(p => p.entry_type = 'patent');

    // Create display data
    const createDisplayData = (data: EntryData[]) => {
      return data.map(item => ({
        title: item.paper_title || item.title || item.patent_name || 'Untitled',
        faculty_id: item.faculty_id,
        faculty_name: item.faculty_name,
        entry_type: item.entry_type || 'unknown',
        date: item.conf_date || item.month_and_year_of_publication || item.date || item.patent_date || 'No date',
        status: item.is_verified,
      }));
    };

    const conferenceDisplayData = createDisplayData(filteredConferences);
    const journalDisplayData = createDisplayData(filteredJournals);
    const workshopDisplayData = createDisplayData(filteredWorkshops);
    const patentDisplayData = createDisplayData(filteredPatents);

    let fullData: EntryData[] = [];
    let displayData: ReportData['disp_data'] = [];

    switch (filterType) {
      case 'Conferences':
        fullData = filteredConferences;
        displayData = conferenceDisplayData;
        break;
      case 'Journals':
        fullData = filteredJournals;
        displayData = journalDisplayData;
        break;
      case 'Workshops':
        fullData = filteredWorkshops;
        displayData = workshopDisplayData;
        break;
      case 'Patents':
        fullData = filteredPatents;
        displayData = patentDisplayData;
        break;
      default:
        fullData = [
          ...filteredConferences,
          ...filteredJournals,
          ...filteredWorkshops,
          ...filteredPatents,
        ];
        displayData = [
          ...conferenceDisplayData,
          ...journalDisplayData,
          ...workshopDisplayData,
          ...patentDisplayData,
        ];
    }

    return {
      data: {
        full_data: fullData,
        disp_data: displayData,
      },
      error: null,
    };
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