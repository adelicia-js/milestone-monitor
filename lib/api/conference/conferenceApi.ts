import { ApiClient } from '../client';
import { Conference, ApiResponse } from '../../types';

interface ConferenceCreateData {
  faculty_id: string;
  paper_title: string;
  conf_name: string;
  conf_date: string;
  type: string;
  proceedings: boolean;
  proceeding_fp?: string;
}

interface ConferenceWithFiles extends ConferenceCreateData {
  files?: {
    proceedings?: File;
  };
}

export class ConferenceApi extends ApiClient {
  async getConferencesByFaculty(facultyId: string): Promise<ApiResponse<Conference[]>> {
    return this.query<Conference>('conferences', {
      filters: { faculty_id: facultyId },
    });
  }

  async getConferencesByEmail(email: string): Promise<ApiResponse<Conference[]>> {
    // First get the faculty_id from the email
    const facultyResult = await this.query<{ faculty_id: string }>('faculty', {
      filters: { faculty_email: email },
    });

    if (facultyResult.error || !facultyResult.data?.[0]) {
      return { data: [], error: facultyResult.error || 'Faculty not found' };
    }

    const facultyId = facultyResult.data[0].faculty_id;
    
    // Then get conferences using the actual faculty_id
    return this.query<Conference>('conferences', {
      filters: { faculty_id: facultyId },
    });
  }

  async getConferencesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Conference[]>> {
    return this.query<Conference>('conferences', {
      filters: {
        conf_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getConferencesByType(type: string): Promise<ApiResponse<Conference[]>> {
    return this.query<Conference>('conferences', {
      filters: { type },
    });
  }

  async getConferencesByVerificationStatus(
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<ApiResponse<Conference[]>> {
    return this.query<Conference>('conferences', {
      filters: { is_verified: status },
    });
  }

  async addConference(data: ConferenceWithFiles): Promise<ApiResponse<Conference>> {
    try {
      // Handle file uploads first if present
      let proceedingPath = data.proceeding_fp;

      if (data.files?.proceedings) {
        const proceedingResult = await this.uploadToStorage(
          'proceedings',
          `conferences/${data.faculty_id}/${Date.now()}_proceedings`,
          data.files.proceedings
        );
        if (proceedingResult.error) {
          return { data: null, error: proceedingResult.error };
        }
        proceedingPath = proceedingResult.data || undefined;
      }

      // Create conference record
      const conferenceData: Omit<Conference, 'id'> = {
        faculty_id: data.faculty_id,
        paper_title: data.paper_title,
        conf_name: data.conf_name,
        conf_date: data.conf_date,
        type: data.type,
        proceedings: data.proceedings,
        proceeding_fp: proceedingPath,
        is_verified: 'PENDING'
      };

      return this.insert<Conference>('conferences', conferenceData);
    } catch (error) {
      console.error('Error in addConference:', error);
      return { data: null, error: 'Failed to add conference' };
    }
  }

  async createConference(conference: Omit<Conference, 'id'>): Promise<ApiResponse<Conference>> {
    return this.insert<Conference>('conferences', conference);
  }

  async updateConference(
    id: number,
    updates: Partial<Conference>
  ): Promise<ApiResponse<Conference>> {
    return this.update<Conference>('conferences', id, updates);
  }

  async deleteConference(id: number): Promise<ApiResponse<Conference>> {
    return this.delete<Conference>('conferences', id);
  }

  async approveConference(id: number): Promise<ApiResponse<Conference>> {
    return this.update<Conference>('conferences', id, { is_verified: 'APPROVED' });
  }

  async rejectConference(id: number): Promise<ApiResponse<Conference>> {
    return this.update<Conference>('conferences', id, { is_verified: 'REJECTED' });
  }
} 