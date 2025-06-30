import { ApiClient } from '../client';
import { Journal, ApiResponse } from '../../types';

export class JournalApi extends ApiClient {
  async getJournalsByFaculty(facultyId: string): Promise<ApiResponse<Journal[]>> {
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