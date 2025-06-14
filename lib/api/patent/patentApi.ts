import { ApiClient } from '../client';
import { Patent, ApiResponse } from '../../types';

export class PatentApi extends ApiClient {
  async getPatentsByFaculty(facultyId: string): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { faculty_id: facultyId },
    });
  }

  async getPatentsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: {
        patent_date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getPatentsByType(type: string): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { patent_type: type },
    });
  }

  async getPatentsByStatus(status: string): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { status },
    });
  }

  async getPatentsByApplicationNo(applicationNo: string): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { application_no: applicationNo },
    });
  }

  async getPatentsByVerificationStatus(
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { is_verified: status },
    });
  }

  async createPatent(patent: Omit<Patent, 'id'>): Promise<ApiResponse<Patent>> {
    return this.insert<Patent>('patents', patent);
  }

  async updatePatent(
    id: number,
    updates: Partial<Patent>
  ): Promise<ApiResponse<Patent>> {
    return this.update<Patent>('patents', id, updates);
  }

  async deletePatent(id: number): Promise<ApiResponse<Patent>> {
    return this.delete<Patent>('patents', id);
  }

  async approvePatent(id: number): Promise<ApiResponse<Patent>> {
    return this.update<Patent>('patents', id, { is_verified: 'APPROVED' });
  }

  async rejectPatent(id: number): Promise<ApiResponse<Patent>> {
    return this.update<Patent>('patents', id, { is_verified: 'REJECTED' });
  }
} 