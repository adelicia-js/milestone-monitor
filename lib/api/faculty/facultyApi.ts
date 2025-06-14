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

  async deleteFaculty(email: string): Promise<ApiResponse<Faculty>> {
    return this.deleteByEmail<Faculty>('faculty', email);
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

  async updateName(
    email: string,
    name: string
  ): Promise<ApiResponse<Faculty>> {
    return this.updateFaculty(email, { faculty_name: name });
  }

  async updateProfile(
    email: string,
    updates: {
      name?: string;
      phone?: string;
      googleScholar?: string;
    }
  ): Promise<ApiResponse<Faculty>> {
    const facultyUpdates: Partial<Faculty> = {};
    if (updates.name) facultyUpdates.faculty_name = updates.name;
    if (updates.phone) facultyUpdates.faculty_phone = updates.phone;
    if (updates.googleScholar) facultyUpdates.faculty_google_scholar = updates.googleScholar;

    return this.updateFaculty(email, facultyUpdates);
  }

  async createDefaultFacultyData(email: string): Promise<ApiResponse<Faculty>> {
    const defaultFaculty: Omit<Faculty, 'id'> = {
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