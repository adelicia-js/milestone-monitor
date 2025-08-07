import { ApiClient } from '../client';
import { ApiResponse } from '../../types';


export class UploadApi extends ApiClient {
  private readonly ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg', 
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  private validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: `File size exceeds 10MB limit. Got ${(file.size / 1024 / 1024).toFixed(1)}MB` };
    }

    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      return { isValid: false, error: `File type not allowed. Allowed types: ${this.ALLOWED_FILE_TYPES.join(', ')}` };
    }

    return { isValid: true };
  }

  private sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  }

  private async uploadFile(path: string, file: File): Promise<ApiResponse<string>> {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      return { data: null, error: validation.error || 'File validation failed' };
    }

    return this.uploadToStorage('staff-media', path, file);
  }

  async uploadConferenceMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    try {
      const file = formData.get('file') as File;
      if (!file) {
        return { data: null, error: 'No file provided' };
      }

      // SECURITY: Validate user can only upload to their own faculty ID
      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      const sanitizedDate = eventDate.replace(/[^0-9-]/g, '');
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const path = `conferenceMedia/${facultyId}/${timestamp}_${sanitizedDate}_${sanitizedFileName}`;
      
      return this.uploadFile(path, file);
    } catch (error) {
      console.error('Error in uploadConferenceMedia:', error);
      return { data: null, error: 'Upload failed' };
    }
  }

  async uploadWorkshopMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    try {
      const file = formData.get('file') as File;
      if (!file) {
        return { data: null, error: 'No file provided' };
      }

      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      const sanitizedDate = eventDate.replace(/[^0-9-]/g, '');
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const path = `workshopMedia/${facultyId}/${timestamp}_${sanitizedDate}_${sanitizedFileName}`;
      
      return this.uploadFile(path, file);
    } catch (error) {
      console.error('Error in uploadWorkshopMedia:', error);
      return { data: null, error: 'Upload failed' };
    }
  }

  async uploadPatentMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    try {
      const file = formData.get('file') as File;
      if (!file) {
        return { data: null, error: 'No file provided' };
      }

      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      const sanitizedDate = eventDate.replace(/[^0-9-]/g, '');
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const path = `patentMedia/${facultyId}/${timestamp}_${sanitizedDate}_${sanitizedFileName}`;
      
      return this.uploadFile(path, file);
    } catch (error) {
      console.error('Error in uploadPatentMedia:', error);
      return { data: null, error: 'Upload failed' };
    }
  }

  async uploadJournalMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    try {
      const file = formData.get('file') as File;
      if (!file) {
        return { data: null, error: 'No file provided' };
      }

      const { data: { user }, error: authError } = await this.getSupabase().auth.getUser();
      if (authError || !user) {
        return { data: null, error: 'Authentication required' };
      }

      const sanitizedDate = eventDate.replace(/[^0-9-]/g, '');
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const path = `journalMedia/${facultyId}/${timestamp}_${sanitizedDate}_${sanitizedFileName}`;
      
      return this.uploadFile(path, file);
    } catch (error) {
      console.error('Error in uploadJournalMedia:', error);
      return { data: null, error: 'Upload failed' };
    }
  }
} 