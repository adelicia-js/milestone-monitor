import { ApiClient } from '../client';
import { Conference, ApiResponse } from '../../types';

export class ConferenceApi extends ApiClient {
  async getConferencesByFaculty(facultyId: string): Promise<ApiResponse<Conference[]>> {
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