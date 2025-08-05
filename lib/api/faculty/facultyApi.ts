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
    try {
      const { data, error } = await this.getSupabase()
        .from('faculty')
        .delete()
        .eq('faculty_email', email)
        .select()
        .single();

      if (error) {
        console.error('Error deleting faculty:', error);
        return { data: null, error: error.message };
      }

      return { data: data as Faculty, error: null };
    } catch (error) {
      console.error('Error in deleteFaculty:', error);
      return { data: null, error: 'Failed to delete faculty' };
    }
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
      faculty_id: `FAC${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 
      faculty_name: 'New Faculty',
      faculty_department: 'General',
      faculty_role: 'faculty',
      faculty_phone: null,
      faculty_email: email,
      faculty_google_scholar: null
    };

    return this.insert<Faculty>('faculty', defaultFaculty);
  }

  // Staff Management Operations

  async addStaff(staffData: {
    faculty_name: string;
    faculty_id: string;
    faculty_department: string;
    faculty_role: string;
    faculty_phone: string | null;
    faculty_email: string;
    password: string;
  }): Promise<ApiResponse<Faculty>> {
    try {
      // Use secure server-side API endpoint for user creation
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { data: null, error: errorData.error || 'Failed to create staff member' };
      }

      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error in addStaff:', error);
      return { data: null, error: 'Failed to add staff member' };
    }
  }

  async updateStaff(
    email: string,
    updates: Partial<Faculty>
  ): Promise<ApiResponse<Faculty>> {
    return this.updateFaculty(email, updates);
  }

  async deleteStaff(email: string): Promise<ApiResponse<Faculty>> {
    try {
      // First delete the faculty record
      const facultyResult = await this.deleteFaculty(email);
      
      if (facultyResult.error) {
        return facultyResult;
      }

      // Optionally, you could also delete the auth user here if needed
      // But typically we might want to keep the auth record for audit purposes
      
      return facultyResult;
    } catch (error) {
      console.error('Error in deleteStaff:', error);
      return { data: null, error: 'Failed to delete staff member' };
    }
  }

  async getStaffByDepartment(department: string): Promise<ApiResponse<Faculty[]>> {
    return this.getFacultyByDepartment(department);
  }

  async getAllStaff(): Promise<ApiResponse<Faculty[]>> {
    return this.query<Faculty>('faculty', {});
  }

  async getStaffByRole(role: string): Promise<ApiResponse<Faculty[]>> {
    return this.query<Faculty>('faculty', {
      filters: { faculty_role: role }
    });
  }

  async bulkUpdateStaff(updates: Array<{
    email: string;
    data: Partial<Faculty>;
  }>): Promise<ApiResponse<{ success: number; failed: number }>> {
    let success = 0;
    let failed = 0;

    for (const update of updates) {
      const result = await this.updateStaff(update.email, update.data);
      if (result.error) {
        failed++;
      } else {
        success++;
      }
    }

    return {
      data: { success, failed },
      error: failed > 0 ? `${failed} staff updates failed` : null
    };
  }

  // Password management
  async updateStaffPassword(password: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      // This needs to be called from the client-side with the current user's session
      // Since it updates the current user's password
      return { data: null, error: 'Password updates must be handled on the client side' };
    } catch (error) {
      console.error('Error in updateStaffPassword:', error);
      return { data: null, error: 'Failed to update password' };
    }
  }

  // Dashboard Statistics
  async getMilestoneStatistics(email: string): Promise<ApiResponse<number[]>> {
    try {
      // First get the faculty data to get faculty_id
      const facultyResponse = await this.getFacultyByEmail(email);
      if (facultyResponse.error || !facultyResponse.data) {
        return { data: null, error: facultyResponse.error || 'Faculty not found' };
      }

      const facultyId = facultyResponse.data.faculty_id;
      const supabase = this.getSupabase();

      // Get counts for each table
      const [confResult, workshopResult, journalResult, patentResult] = await Promise.all([
        supabase
          .from('conferences')
          .select('*', { count: 'exact', head: true })
          .eq('faculty_id', facultyId),
        supabase
          .from('fdp_workshop_refresher_course')
          .select('*', { count: 'exact', head: true })
          .eq('faculty_id', facultyId),
        supabase
          .from('journal_publications')
          .select('*', { count: 'exact', head: true })
          .eq('faculty_id', facultyId),
        supabase
          .from('patents')
          .select('*', { count: 'exact', head: true })
          .eq('faculty_id', facultyId)
      ]);

      // Check for errors
      if (confResult.error || workshopResult.error || journalResult.error || patentResult.error) {
        const errors = [confResult.error, workshopResult.error, journalResult.error, patentResult.error]
          .filter(Boolean)
          .map(e => e?.message)
          .join(', ');
        return { data: null, error: `Database error: ${errors}` };
      }

      // Return counts as array [conferences, workshops, journals, patents]
      const statistics = [
        confResult.count || 0,
        workshopResult.count || 0,
        journalResult.count || 0,
        patentResult.count || 0
      ];

      return { data: statistics, error: null };
    } catch (error) {
      console.error('Error in getMilestoneStatistics:', error);
      return { data: null, error: 'Failed to fetch milestone statistics' };
    }
  }
} 