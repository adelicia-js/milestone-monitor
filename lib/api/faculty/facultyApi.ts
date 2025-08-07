import { ApiClient } from '../client';
import { Faculty, ApiResponse } from '../../types';

export class FacultyApi extends ApiClient {
  async getFacultyByEmail(email: string): Promise<ApiResponse<Faculty>> {
    try {
      // SECURITY: Verify user can only access their own data
      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      // Only allow users to get their own faculty record, unless they're HOD/Editor
      const currentUserResult = await this.query<Faculty>('faculty', {
        filters: { faculty_email: user.email },
      });

      if (currentUserResult.error || !currentUserResult.data?.[0]) {
        return { data: null, error: 'User profile not found' };
      }

      const currentUser = currentUserResult.data[0];
      const isAuthorized = user.email === email || 
                          currentUser.faculty_role === 'hod' || 
                          currentUser.faculty_role === 'editor';

      if (!isAuthorized) {
        return { data: null, error: 'Unauthorized: Cannot access other users data' };
      }

      const response = await this.query<Faculty>('faculty', {
        filters: { faculty_email: email },
      });
      return {
        data: response.data?.[0] || null,
        error: response.error,
      };
    } catch (error) {
      console.error('Error in getFacultyByEmail:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
  }

  async getFacultyByDepartment(department: string): Promise<ApiResponse<Faculty[]>> {
    try {
      // SECURITY: Verify user is HOD or Editor to access department data
      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      const currentUserResult = await this.query<Faculty>('faculty', {
        filters: { faculty_email: user.email },
      });

      if (currentUserResult.error || !currentUserResult.data?.[0]) {
        return { data: null, error: 'User profile not found' };
      }

      const currentUser = currentUserResult.data[0];
      const isAuthorized = currentUser.faculty_role === 'hod' || currentUser.faculty_role === 'editor';

      if (!isAuthorized) {
        return { data: null, error: 'Unauthorized: Only HOD and Editors can access department data' };
      }

      return this.query<Faculty>('faculty', {
        filters: { faculty_department: department },
      });
    } catch (error) {
      console.error('Error in getFacultyByDepartment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
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
      // First check if the faculty exists
      const existsResult = await this.query<Faculty>('faculty', {
        filters: { faculty_email: email }
      });

      if (existsResult.error) {
        return { data: null, error: existsResult.error };
      }

      if (!existsResult.data || existsResult.data.length === 0) {
        return { data: null, error: 'Faculty member not found' };
      }

      const { data, error } = await this.getSupabase()
        .from('faculty')
        .delete()
        .eq('faculty_email', email)
        .select();

      if (error) {
        console.error('Error deleting faculty:', error);
        return { data: null, error: error.message };
      }

      // Return the first deleted record or null if none were deleted
      const deletedFaculty = data && data.length > 0 ? data[0] as Faculty : null;
      return { 
        data: deletedFaculty, 
        error: deletedFaculty ? null : 'No faculty record was deleted' 
      };
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
      faculty_id: this.generateFacultyId(),
      faculty_name: 'New Faculty',
      faculty_department: 'General',
      faculty_role: 'faculty',
      faculty_phone: null,
      faculty_email: email,
      faculty_google_scholar: null
    };

    return this.insert<Faculty>('faculty', defaultFaculty);
  }

  // Helper method to generate unique faculty ID
  private generateFacultyId(): string {
    return `FAC${Date.now().toString().slice(-4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  // Staff Management Operations

  async addStaff(staffData: {
    faculty_name: string;
    faculty_department: string;
    faculty_role: string;
    faculty_phone: string | null;
    faculty_email: string;
    password: string;
  }): Promise<ApiResponse<Faculty>> {
    try {
      // Auto-generate faculty ID
      const faculty_id = this.generateFacultyId();
      
      const staffDataWithId = {
        ...staffData,
        faculty_id
      };

      // Use secure server-side API endpoint for user creation
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(staffDataWithId)
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

  // Debug method to check what's actually in the database
  async debugFacultyRecord(identifier: string): Promise<ApiResponse<unknown>> {
    try {
      console.log('DEBUG: Looking for faculty with identifier:', identifier);
      
      // First, let's see ALL faculty records to understand the structure
      const allFaculty = await this.getSupabase()
        .from('faculty')
        .select('*')
        .limit(3);
      
      console.log('DEBUG: Sample faculty records:', allFaculty.data);
      
      // Try finding by faculty_id
      const byFacultyId = await this.getSupabase()
        .from('faculty')
        .select('*')
        .eq('faculty_id', identifier);
      
      console.log('DEBUG: Search by faculty_id result:', byFacultyId);
      
      return { data: { allFaculty: allFaculty.data, byFacultyId: byFacultyId.data }, error: null };
    } catch (error) {
      console.error('DEBUG Error:', error);
      return { data: null, error: 'Debug failed' };
    }
  }

  // Server-side delete method to bypass RLS issues
  async deleteStaff(facultyId: string): Promise<ApiResponse<Faculty>> {
    try {
      console.log('DELETE: Using server-side delete for faculty_id:', facultyId);
      
      // Use secure server-side API endpoint for deletion
      const response = await fetch(`/api/admin/delete-staff?faculty_id=${encodeURIComponent(facultyId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server delete failed:', errorData);
        return { data: null, error: errorData.error || 'Failed to delete staff member' };
      }

      const result = await response.json();
      console.log('DELETE: Server delete successful:', result);
      return { data: result.data, error: null };
      
    } catch (error) {
      console.error('Error in server-side deleteStaff:', error);
      return { data: null, error: 'Failed to delete staff member' };
    }
  }

  async getStaffByDepartment(department: string): Promise<ApiResponse<Faculty[]>> {
    try {
      // Simple query to get all faculty from the department
      return this.query<Faculty>('faculty', {
        filters: { faculty_department: department }
      });
    } catch (error) {
      console.error('Error in getStaffByDepartment:', error);
      return { data: null, error: 'An unexpected error occurred' };
    }
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
  async updateStaffPassword(_: string): Promise<ApiResponse<{ success: boolean }>> { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      // This needs to be called from the client-side with the current user's session
      // Since it updates the current user's password: _password
      return { data: null, error: 'Password updates must be handled on the client side' };
    } catch (error) {
      console.error('Error in updateStaffPassword:', error);
      return { data: null, error: 'Failed to update password: _password' };
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