import { ApiClient } from '../client';
import { Journal, ApiResponse } from '../../types';

interface JournalCreateData {
  faculty_id: string;
  paper_title: string;
  journal_name: string;
  month_and_year_of_publication: string;
  issn_number: string;
  indexed_in: string;
  link?: string;
  upload_image?: string;
}

interface JournalWithFiles extends JournalCreateData {
  files?: {
    upload_image?: File;
  };
}

export class JournalApi extends ApiClient {
  async getJournalsByFaculty(facultyId: string): Promise<ApiResponse<Journal[]>> {
    return this.query<Journal>('journal_publications', {
      filters: { faculty_id: facultyId },
    });
  }

  async getJournalsByEmail(email: string): Promise<ApiResponse<Journal[]>> {
    // First get the faculty_id from the email
    const facultyResult = await this.query<{ faculty_id: string }>('faculty', {
      filters: { faculty_email: email },
    });

    if (facultyResult.error || !facultyResult.data?.[0]) {
      return { data: [], error: facultyResult.error || 'Faculty not found' };
    }

    const facultyId = facultyResult.data[0].faculty_id;
    
    // Then get journals using the actual faculty_id
    return this.query<Journal>('journal_publications', {
      filters: { faculty_id: facultyId },
    });
  }

  async getJournalsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Journal[]>> {
    return this.query<Journal>('journal_publications', {
      filters: {
        month_and_year_of_publication: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async getJournalsByIndexedIn(indexedIn: string): Promise<ApiResponse<Journal[]>> {
    return this.query<Journal>('journal_publications', {
      filters: { indexed_in: indexedIn },
    });
  }

  async getJournalsByVerificationStatus(
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Promise<ApiResponse<Journal[]>> {
    return this.query<Journal>('journal_publications', {
      filters: { is_verified: status },
    });
  }

  async addJournal(data: JournalWithFiles): Promise<ApiResponse<Journal>> {
    try {
      // Handle file upload first if present
      let imagePath = data.upload_image;

      if (data.files?.upload_image) {
        const imageResult = await this.uploadToStorage(
          'journal_images',
          `journals/${data.faculty_id}/${Date.now()}_publication`,
          data.files.upload_image
        );
        if (imageResult.error) {
          return { data: null, error: imageResult.error };
        }
        imagePath = imageResult.data;
      }

      // Create journal record
      const journalData: Omit<Journal, 'id'> = {
        faculty_id: data.faculty_id,
        paper_title: data.paper_title,
        journal_name: data.journal_name,
        month_and_year_of_publication: data.month_and_year_of_publication,
        issn_number: data.issn_number,
        indexed_in: data.indexed_in,
        link: data.link,
        upload_image: imagePath,
        is_verified: 'PENDING'
      };

      return this.insert<Journal>('journal_publications', journalData);
    } catch (error) {
      console.error('Error in addJournal:', error);
      return { data: null, error: 'Failed to add journal publication' };
    }
  }

  async createJournal(journal: Omit<Journal, 'id'>): Promise<ApiResponse<Journal>> {
    return this.insert<Journal>('journal_publications', journal);
  }

  async updateJournal(
    id: number,
    updates: Partial<Journal>
  ): Promise<ApiResponse<Journal>> {
    return this.update<Journal>('journal_publications', id, updates);
  }

  async deleteJournal(id: number): Promise<ApiResponse<Journal>> {
    return this.delete<Journal>('journal_publications', id);
  }

  async approveJournal(id: number): Promise<ApiResponse<Journal>> {
    return this.update<Journal>('journal_publications', id, { is_verified: 'APPROVED' });
  }

  async rejectJournal(id: number): Promise<ApiResponse<Journal>> {
    return this.update<Journal>('journal_publications', id, { is_verified: 'REJECTED' });
  }
} 