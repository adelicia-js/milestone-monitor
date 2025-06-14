import { ApiClient } from '../client';
import { Workshop, ApiResponse } from '../../types';

export class WorkshopApi extends ApiClient {
  async getWorkshopsByFaculty(facultyId: string): Promise<ApiResponse<Workshop[]>> {
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