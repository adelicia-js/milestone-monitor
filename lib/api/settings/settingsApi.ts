import { ApiClient } from '../client';
import { Faculty, ApiResponse } from '../../types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface ProfileUpdateData {
  faculty_name?: string;
  faculty_phone?: string;
  faculty_google_scholar?: string;
  faculty_linkedin?: string;
}

export interface PasswordUpdateData {
  newPassword: string;
  confirmPassword: string;
}

export interface SettingsFormData {
  faculty_name: string;
  faculty_phone: string;
  faculty_google_scholar: string;
  faculty_linkedin: string;
}

export class SettingsApi extends ApiClient {
  
  // Get current user's profile data
  async getCurrentUserProfile(): Promise<ApiResponse<Faculty>> {
    try {
      const supabase = createClientComponentClient();
      
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Get faculty data using email
      const facultyResult = await this.query<Faculty>('faculty', {
        filters: { faculty_email: user.email }
      });

      if (facultyResult.error || !facultyResult.data?.[0]) {
        return { data: null, error: facultyResult.error || 'Faculty profile not found' };
      }

      return { data: facultyResult.data[0], error: null };
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return { data: null, error: 'Failed to get user profile' };
    }
  }

  // Update current user's profile
  async updateProfile(updates: ProfileUpdateData): Promise<ApiResponse<Faculty>> {
    try {
      const supabase = createClientComponentClient();
      
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Validate the updates
      const validatedUpdates = this.validateProfileUpdates(updates);
      if (!validatedUpdates.isValid) {
        return { data: null, error: validatedUpdates.error || null };
      }

      // Update faculty record using email
      return this.updateByField<Faculty>('faculty', 'faculty_email', user.email!, updates);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { data: null, error: 'Failed to update profile' };
    }
  }

  // Update individual profile field
  async updateProfileField(field: keyof ProfileUpdateData, value: string): Promise<ApiResponse<Faculty>> {
    try {
      const updates = { [field]: value.trim() || null };
      return this.updateProfile(updates);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      return { data: null, error: `Failed to update ${field}` };
    }
  }

  // Update user password (client-side only)
  async updatePassword(passwordData: PasswordUpdateData): Promise<ApiResponse<any>> {
    try {
      // Validate password data
      const validation = this.validatePasswordUpdate(passwordData);
      if (!validation.isValid) {
        return { data: null, error: validation.error || null };
      }

      const supabase = createClientComponentClient();

      // Update password using Supabase client
      const { data, error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        return { data: null, error: error.message };
      }

      return { data: data, error: null };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      return { data: null, error: 'Failed to update password' };
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<ApiResponse<string>> {
    try {
      const supabase = createClientComponentClient();
      
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Validate file
      const fileValidation = this.validateProfilePicture(file);
      if (!fileValidation.isValid) {
        return { data: null, error: fileValidation.error || null };
      }

      // Get faculty ID for file naming
      const profileResult = await this.getCurrentUserProfile();
      if (profileResult.error || !profileResult.data) {
        return { data: null, error: 'Could not get user profile for upload' };
      }

      const facultyId = profileResult.data.faculty_id;
      const fileExt = file.name.split('.').pop();
      const fileName = `profilePictures/${facultyId}.${fileExt}`;

      // Check for existing files and delete them (matching old behavior)
      const { data: existingFiles, error: listError } = await supabase.storage
        .from('staff-media')
        .list('profilePictures', {
          limit: 100,
          offset: 0,
          search: facultyId
        });

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(file => `profilePictures/${file.name}`);
        await supabase.storage
          .from('staff-media')
          .remove(filesToDelete);
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('staff-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        return { data: null, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('staff-media')
        .getPublicUrl(fileName);

      // Update faculty record with profile picture URL (if you have this field)
      // await this.updateProfile({ profile_picture: publicUrl });

      return { data: publicUrl, error: null };
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      return { data: null, error: 'Failed to upload profile picture' };
    }
  }

  // Bulk update profile (for form submissions)
  async updateFullProfile(formData: SettingsFormData): Promise<ApiResponse<Faculty>> {
    try {
      const updates: ProfileUpdateData = {
        faculty_name: formData.faculty_name.trim() || undefined,
        faculty_phone: formData.faculty_phone.trim() || undefined,
        faculty_google_scholar: formData.faculty_google_scholar.trim() || undefined,
        faculty_linkedin: formData.faculty_linkedin.trim() || undefined,
      };

      // Remove undefined values
      Object.keys(updates).forEach(key => {
        if (updates[key as keyof ProfileUpdateData] === undefined) {
          delete updates[key as keyof ProfileUpdateData];
        }
      });

      return this.updateProfile(updates);
    } catch (error) {
      console.error('Error in updateFullProfile:', error);
      return { data: null, error: 'Failed to update profile' };
    }
  }

  // Validation methods
  private validateProfileUpdates(updates: ProfileUpdateData): { isValid: boolean; error?: string } {
    // Validate name
    if (updates.faculty_name !== undefined) {
      if (updates.faculty_name.trim().length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters long' };
      }
      if (updates.faculty_name.trim().length > 100) {
        return { isValid: false, error: 'Name must be less than 100 characters' };
      }
    }

    // Validate phone
    if (updates.faculty_phone !== undefined && updates.faculty_phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(updates.faculty_phone.replace(/[\s\-\(\)]/g, ''))) {
        return { isValid: false, error: 'Please enter a valid phone number' };
      }
    }

    // Validate URLs
    if (updates.faculty_google_scholar !== undefined && updates.faculty_google_scholar.trim()) {
      if (!this.isValidURL(updates.faculty_google_scholar)) {
        return { isValid: false, error: 'Please enter a valid Google Scholar URL' };
      }
    }

    if (updates.faculty_linkedin !== undefined && updates.faculty_linkedin.trim()) {
      if (!this.isValidURL(updates.faculty_linkedin)) {
        return { isValid: false, error: 'Please enter a valid LinkedIn URL' };
      }
    }

    return { isValid: true };
  }

  private validatePasswordUpdate(passwordData: PasswordUpdateData): { isValid: boolean; error?: string } {
    if (!passwordData.newPassword || passwordData.newPassword.trim().length === 0) {
      return { isValid: false, error: 'Password is required' };
    }

    if (passwordData.newPassword.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }

    if (passwordData.newPassword.length > 128) {
      return { isValid: false, error: 'Password must be less than 128 characters' };
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }

    return { isValid: true };
  }

  private validateProfilePicture(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Please upload a JPEG, PNG, or WebP image' };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    return { isValid: true };
  }

  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}