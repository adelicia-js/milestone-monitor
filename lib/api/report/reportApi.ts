import { ApiClient } from '../client';
import { ApiResponse } from '../../types';
import { ConferenceApi } from '../conference/conferenceApi';
import { JournalApi } from '../journal/journalApi';
import { WorkshopApi } from '../workshop/workshopApi';
import { PatentApi } from '../patent/patentApi';

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

export class ReportApi extends ApiClient {
  async getReportData(
    startDate: string = '2001-01-01',
    endDate: string = new Date().toISOString().split('T')[0],
    filterType: string = 'all',
    title: string = '',
    status: string = 'PENDING',
    facultyId: string | null = ''
  ): Promise<ApiResponse<ReportData>> {
    const conferenceApi = new ConferenceApi();
    const journalApi = new JournalApi();
    const workshopApi = new WorkshopApi();
    const patentApi = new PatentApi();

    const [conferences, journals, workshops, patents] = await Promise.all([
      conferenceApi.getConferencesByDateRange(startDate, endDate),
      journalApi.getJournalsByDateRange(startDate, endDate),
      workshopApi.getWorkshopsByDateRange(startDate, endDate),
      patentApi.getPatentsByDateRange(startDate, endDate),
    ]);

    // Filter by title and status
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
} 