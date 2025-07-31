import { ApiClient } from '../client';
import { Patent, ApiResponse } from '../../types';

interface PatentCreateData {
  faculty_id: string;
  patent_name: string;
  patent_date: string;
  patent_type: string;
  application_no: string;
  status: string;
  patent_link?: string;
  image?: string;
}

interface PatentWithFiles extends PatentCreateData {
  files?: {
    image?: File;
  };
}

export class PatentApi extends ApiClient {
  async getPatentsByFaculty(facultyId: string): Promise<ApiResponse<Patent[]>> {
    return this.query<Patent>('patents', {
      filters: { faculty_id: facultyId },
    });
  }

  async getPatentsByEmail(email: string): Promise<ApiResponse<Patent[]>> {
    // First get the faculty_id from the email
    const facultyResult = await this.query<{ faculty_id: string }>('faculty', {
      filters: { faculty_email: email },
    });

    if (facultyResult.error || !facultyResult.data?.[0]) {
      return { data: [], error: facultyResult.error || 'Faculty not found' };
    }

    const facultyId = facultyResult.data[0].faculty_id;
    
    // Then get patents using the actual faculty_id
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

  async addPatent(data: PatentWithFiles): Promise<ApiResponse<Patent>> {
    try {
      // Handle file upload first if present
      let imagePath = data.image;

      if (data.files?.image) {
        const imageResult = await this.uploadToStorage(
          'patent_images',
          `patents/${data.faculty_id}/${Date.now()}_patent`,
          data.files.image
        );
        if (imageResult.error) {
          return { data: null, error: imageResult.error };
        }
        imagePath = imageResult.data;
      }

      // Create patent record
      const patentData: Omit<Patent, 'id'> = {
        faculty_id: data.faculty_id,
        patent_name: data.patent_name,
        patent_date: data.patent_date,
        patent_type: data.patent_type,
        application_no: data.application_no,
        status: data.status,
        patent_link: data.patent_link,
        image: imagePath,
        is_verified: 'PENDING'
      };

      return this.insert<Patent>('patents', patentData);
    } catch (error) {
      console.error('Error in addPatent:', error);
      return { data: null, error: 'Failed to add patent' };
    }
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