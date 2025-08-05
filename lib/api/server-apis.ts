// Server-side API classes for use in Next.js server components
// These use createServerComponentClient with proper cookie context

import { ServerApiClient } from './server-client';
import { Faculty, Workshop, Conference, Journal, Patent, ApprovalEntry, ApiResponse } from '../types';

// Server-side Faculty API
export class ServerFacultyApi extends ServerApiClient {
  async getFacultyByEmail(email: string): Promise<ApiResponse<Faculty>> {
    const response = await this.query<Faculty>('faculty', {
      filters: { faculty_email: email },
    });
    return {
      data: response.data?.[0] || null,
      error: response.error,
    };
  }

  async getFacultyByDepartment(department: string): Promise<ApiResponse<Faculty[]>> {
    return this.query<Faculty>('faculty', {
      filters: { faculty_department: department },
    });
  }

  async getStaffByDepartment(department: string): Promise<ApiResponse<Faculty[]>> {
    return this.query<Faculty>('faculty', {
      filters: { faculty_department: department },
      order: { column: 'faculty_name', ascending: true },
    });
  }
}

// Server-side Workshop API
export class ServerWorkshopApi extends ServerApiClient {
  async getWorkshopsByEmail(email: string): Promise<ApiResponse<Workshop[]>> {
    // First get the faculty_id for this email
    const supabase = this.getSupabase();
    const { data: faculty } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('faculty_email', email)
      .single();

    if (!faculty) {
      return { data: [], error: null };
    }

    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: { faculty_id: faculty.faculty_id },
      order: { column: 'date', ascending: false },
    });
  }
}

// Server-side Conference API  
export class ServerConferenceApi extends ServerApiClient {
  async getConferencesByEmail(email: string): Promise<ApiResponse<Conference[]>> {
    const supabase = this.getSupabase();
    const { data: faculty } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('faculty_email', email)
      .single();

    if (!faculty) {
      return { data: [], error: null };
    }

    return this.query<Conference>('conferences', {
      filters: { faculty_id: faculty.faculty_id },
      order: { column: 'conf_date', ascending: false },
    });
  }
}

// Server-side Journal API
export class ServerJournalApi extends ServerApiClient {
  async getJournalsByEmail(email: string): Promise<ApiResponse<Journal[]>> {
    const supabase = this.getSupabase();
    const { data: faculty } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('faculty_email', email)
      .single();

    if (!faculty) {
      return { data: [], error: null };
    }

    return this.query<Journal>('journal_publications', {
      filters: { faculty_id: faculty.faculty_id },
      order: { column: 'month_and_year_of_publication', ascending: false },
    });
  }
}

// Server-side Patent API
export class ServerPatentApi extends ServerApiClient {
  async getPatentsByEmail(email: string): Promise<ApiResponse<Patent[]>> {
    const supabase = this.getSupabase();
    const { data: faculty } = await supabase
      .from('faculty')
      .select('faculty_id')
      .eq('faculty_email', email)
      .single();

    if (!faculty) {
      return { data: [], error: null };
    }

    return this.query<Patent>('patents', {
      filters: { faculty_id: faculty.faculty_id },
      order: { column: 'patent_date', ascending: false },
    });
  }
}

// Server-side Approval API
export class ServerApprovalApi extends ServerApiClient {
  async getPendingEntriesByDepartment(department: string): Promise<ApiResponse<{
    pending_conferences: Conference[];
    pending_journal: Journal[];
    pending_workshop: Workshop[];
    pending_patent: Patent[];
  }>> {
    try {
      const supabase = this.getSupabase();

      // Get all faculty IDs from the specified department
      const { data: deptFaculty, error: facultyError } = await supabase
        .from('faculty')
        .select('faculty_id')
        .eq('faculty_department', department);

      if (facultyError) {
        console.error('Error fetching department faculty:', facultyError);
        return { data: null, error: facultyError.message };
      }

      const facultyIds = deptFaculty?.map(f => f.faculty_id) || [];

      if (facultyIds.length === 0) {
        return {
          data: {
            pending_conferences: [],
            pending_journal: [],
            pending_workshop: [],
            pending_patent: [],
          },
          error: null
        };
      }

      // Fetch pending entries for all department faculty
      const [conferences, journals, workshops, patents] = await Promise.all([
        supabase
          .from('conferences')
          .select('*')
          .in('faculty_id', facultyIds)
          .eq('is_verified', 'PENDING'),
        supabase
          .from('journal_publications')
          .select('*')
          .in('faculty_id', facultyIds)
          .eq('is_verified', 'PENDING'),
        supabase
          .from('fdp_workshop_refresher_course')
          .select('*')
          .in('faculty_id', facultyIds)
          .eq('is_verified', 'PENDING'),
        supabase
          .from('patents')
          .select('*')
          .in('faculty_id', facultyIds)
          .eq('is_verified', 'PENDING'),
      ]);

      return {
        data: {
          pending_conferences: conferences.data || [],
          pending_journal: journals.data || [],
          pending_workshop: workshops.data || [],
          pending_patent: patents.data || [],
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching pending entries:', error);
      return { data: null, error: 'Failed to fetch pending entries' };
    }
  }
}

// Create server-side API instances
export const serverFacultyApi = new ServerFacultyApi();
export const serverWorkshopApi = new ServerWorkshopApi();
export const serverConferenceApi = new ServerConferenceApi();
export const serverJournalApi = new ServerJournalApi();
export const serverPatentApi = new ServerPatentApi();
export const serverApprovalApi = new ServerApprovalApi();