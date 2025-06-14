import { ApiClient } from '../client';
import { Faculty, ApiResponse } from '../../types';

export class FacultyApi extends ApiClient {
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

  async createFaculty(faculty: Omit<Faculty, 'id'>): Promise<ApiResponse<Faculty>> {
    return this.insert<Faculty>('faculty', faculty);
  }

  async updateFaculty(
    email: string,
    updates: Partial<Faculty>
  ): Promise<ApiResponse<Faculty>> {
    return this.updateByField<Faculty>('faculty', 'faculty_email', email, updates);
  }

  async deleteFaculty(email:string):Promise<ApiResponse<Faculty>>{
    return this.delete<Faculty>('faculty', email);
  }

  async updateGoogleScholar(
    email: string,
    googleScholar: string
  ): Promise<ApiResponse<Faculty>> {
    return this.updateFaculty(email, { faculty_google_scholar: googleScholar });
  }

  async updatePhoneNumber(
    email: string,
    phone: string
  ): Promise<ApiResponse<Faculty>> {
    return this.updateFaculty(email, { faculty_phone: phone });
  }

  async createDefaultFacultyData(email: string): Promise<ApiResponse<Faculty>> {
    const defaultFaculty: Omit<Faculty, 'id'> = {
      // Generate a unique ID with timestamp and random string (e.g. FAC1709123456789-a1b2c3)
      faculty_id: `FAC${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, 
      faculty_name: 'New Faculty',
      faculty_department: 'General',
      faculty_role: 'faculty',
      faculty_phone: null,
      faculty_email: email,
      faculty_google_scholar: null
    };

    return this.insert<Faculty>('faculty', defaultFaculty);
  }

} 