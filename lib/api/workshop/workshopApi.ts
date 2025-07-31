import { ApiClient } from '../client';
import { Workshop, ApiResponse } from '../../types';

interface WorkshopCreateData {
  faculty_id: string;
  title: string;
  date: string;
  type: string;
  number_of_days: number;
  organized_by: string;
}

export class WorkshopApi extends ApiClient {
  async getWorkshopsByFaculty(facultyId: string): Promise<ApiResponse<Workshop[]>> {
    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: { faculty_id: facultyId },
    });
  }

  async getWorkshopsByEmail(email: string): Promise<ApiResponse<Workshop[]>> {
    // First get the faculty_id from the email
    const facultyResult = await this.query<{ faculty_id: string }>('faculty', {
      filters: { faculty_email: email },
    });

    if (facultyResult.error || !facultyResult.data?.[0]) {
      return { data: [], error: facultyResult.error || 'Faculty not found' };
    }

    const facultyId = facultyResult.data[0].faculty_id;
    
    // Then get workshops using the actual faculty_id
    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: { faculty_id: facultyId },
    });
  }

  async getWorkshopsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Workshop[]>> {
    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getWorkshopsByType(type: string): Promise<ApiResponse<Workshop[]>> {
    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: { type },
    });
  }

  async getWorkshopsByVerificationStatus(
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<ApiResponse<Workshop[]>> {
    return this.query<Workshop>('fdp_workshop_refresher_course', {
      filters: { is_verified: status },
    });
  }

  async addWorkshop(data: WorkshopCreateData): Promise<ApiResponse<Workshop>> {
    try {
      // Create workshop record
      const workshopData: Omit<Workshop, 'id'> = {
        faculty_id: data.faculty_id,
        title: data.title,
        date: data.date,
        type: data.type,
        number_of_days: data.number_of_days,
        organized_by: data.organized_by,
        is_verified: 'PENDING'
      };

      return this.insert<Workshop>('fdp_workshop_refresher_course', workshopData);
    } catch (error) {
      console.error('Error in addWorkshop:', error);
      return { data: null, error: 'Failed to add workshop' };
    }
  }

  async createWorkshop(workshop: Omit<Workshop, 'id'>): Promise<ApiResponse<Workshop>> {
    return this.insert<Workshop>('fdp_workshop_refresher_course', workshop);
  }

  async updateWorkshop(
    id: number,
    updates: Partial<Workshop>
  ): Promise<ApiResponse<Workshop>> {
    return this.update<Workshop>('fdp_workshop_refresher_course', id, updates);
  }

  async deleteWorkshop(id: number): Promise<ApiResponse<Workshop>> {
    return this.delete<Workshop>('fdp_workshop_refresher_course', id);
  }

  async approveWorkshop(id: number): Promise<ApiResponse<Workshop>> {
    return this.update<Workshop>('fdp_workshop_refresher_course', id, { is_verified: 'APPROVED' });
  }

  async rejectWorkshop(id: number): Promise<ApiResponse<Workshop>> {
    return this.update<Workshop>('fdp_workshop_refresher_course', id, { is_verified: 'REJECTED' });
  }
} 