import { ApiClient } from '../client';
import { ApiResponse } from '../../types';


export class UploadApi extends ApiClient {
  private async uploadFile(path: string, file: File): Promise<ApiResponse<string>> {
    return this.uploadToStorage('staff-media', path, file);
  }

  async uploadConferenceMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    const file = formData.get('file') as File;
    const path = `conferenceMedia/${facultyId}/${facultyId}_${eventDate}.${
      file.type.split('/')[1]
    }`;
    return this.uploadFile(path, file);
  }

  async uploadWorkshopMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    const file = formData.get('file') as File;
    const path = `workshopMedia/${facultyId}/${facultyId}_${eventDate}.${
      file.type.split('/')[1]
    }`;
    return this.uploadFile(path, file);
  }

  async uploadPatentMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    const file = formData.get('file') as File;
    const path = `patentMedia/${facultyId}/${facultyId}_${eventDate}.${
      file.type.split('/')[1]
    }`;
    return this.uploadFile(path, file);
  }

  async uploadJournalMedia(
    facultyId: string,
    formData: FormData,
    eventDate: string
  ): Promise<ApiResponse<string>> {
    const file = formData.get('file') as File;
    const path = `journalMedia/${facultyId}/${facultyId}_${eventDate}.${
      file.type.split('/')[1]
    }`;
    return this.uploadFile(path, file);
  }
} 