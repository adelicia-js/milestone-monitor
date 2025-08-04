import { ApiClient } from '../client';
import { Conference, Journal, Patent, Workshop, ApiResponse } from '../../types';

type CategoryType = 'Conference' | 'Journal' | 'Patent' | 'Workshop';
type CategoryData = Conference | Journal | Patent | Workshop;

interface ApprovalEntry {
  id: number;
  entry_type: CategoryType;
  title: string;
  faculty_id: string;
  is_verified: 'PENDING' | 'APPROVED' | 'REJECTED';
  [key: string]: any; // Allow additional fields specific to each category
}

interface PendingData {
  pending_conferences: Conference[];
  pending_journal: Journal[];
  pending_workshop: Workshop[];
  pending_patent: Patent[];
}

export class ApprovalApi extends ApiClient {
  
  // Get all pending entries across all categories
  async getAllPendingEntries(): Promise<ApiResponse<PendingData>> {
    try {
      const [
        conferencesResult,
        journalsResult,
        workshopsResult,
        patentsResult
      ] = await Promise.all([
        this.query<Conference>('conferences', {
          filters: { is_verified: 'PENDING' }
        }),
        this.query<Journal>('journal_publications', {
          filters: { is_verified: 'PENDING' }
        }),
        this.query<Workshop>('fdp_workshop_refresher_course', {
          filters: { is_verified: 'PENDING' }
        }),
        this.query<Patent>('patents', {
          filters: { is_verified: 'PENDING' }
        })
      ]);

      // Check for any errors
      const errors = [
        conferencesResult.error,
        journalsResult.error,
        workshopsResult.error,
        patentsResult.error
      ].filter(Boolean);

      if (errors.length > 0) {
        return { data: null, error: `Failed to fetch pending entries: ${errors.join(', ')}` };
      }

      const pendingData: PendingData = {
        pending_conferences: conferencesResult.data || [],
        pending_journal: journalsResult.data || [],
        pending_workshop: workshopsResult.data || [],
        pending_patent: patentsResult.data || []
      };

      return { data: pendingData, error: null };
    } catch (error) {
      console.error('Error in getAllPendingEntries:', error);
      return { data: null, error: 'Failed to fetch pending entries' };
    }
  }

  // Get pending entries by category
  async getPendingEntriesByCategory(category: CategoryType): Promise<ApiResponse<CategoryData[]>> {
    try {
      let tableName: string;
      
      switch (category) {
        case 'Conference':
          tableName = 'conferences';
          break;
        case 'Journal':
          tableName = 'journal_publications';
          break;
        case 'Workshop':
          tableName = 'fdp_workshop_refresher_course';
          break;
        case 'Patent':
          tableName = 'patents';
          break;
        default:
          return { data: null, error: `Unknown category: ${category}` };
      }

      return this.query<CategoryData>(tableName, {
        filters: { is_verified: 'PENDING' }
      });
    } catch (error) {
      console.error(`Error in getPendingEntriesByCategory for ${category}:`, error);
      return { data: null, error: `Failed to fetch pending ${category.toLowerCase()} entries` };
    }
  }

  // Approve an entry
  async approveEntry(data: ApprovalEntry): Promise<ApiResponse<CategoryData>> {
    try {
      let tableName: string;
      
      switch (data.entry_type) {
        case 'Conference':
          tableName = 'conferences';
          break;
        case 'Journal':
          tableName = 'journal_publications';
          break;
        case 'Workshop':
          tableName = 'fdp_workshop_refresher_course';
          break;
        case 'Patent':
          tableName = 'patents';
          break;
        default:
          return { data: null, error: `Unknown entry type: ${data.entry_type}` };
      }

      return this.update<CategoryData>(tableName, data.id, { is_verified: 'APPROVED' });
    } catch (error) {
      console.error('Error in approveEntry:', error);
      return { data: null, error: 'Failed to approve entry' };
    }
  }

  // Reject an entry
  async rejectEntry(data: ApprovalEntry): Promise<ApiResponse<CategoryData>> {
    try {
      let tableName: string;
      
      switch (data.entry_type) {
        case 'Conference':
          tableName = 'conferences';
          break;
        case 'Journal':
          tableName = 'journal_publications';
          break;
        case 'Workshop':
          tableName = 'fdp_workshop_refresher_course';
          break;
        case 'Patent':
          tableName = 'patents';
          break;
        default:
          return { data: null, error: `Unknown entry type: ${data.entry_type}` };
      }

      return this.update<CategoryData>(tableName, data.id, { is_verified: 'REJECTED' });
    } catch (error) {
      console.error('Error in rejectEntry:', error);
      return { data: null, error: 'Failed to reject entry' };
    }
  }

  // Bulk approve multiple entries
  async bulkApprove(entries: ApprovalEntry[]): Promise<ApiResponse<{ success: number; failed: number }>> {
    let success = 0;
    let failed = 0;

    for (const entry of entries) {
      const result = await this.approveEntry(entry);
      if (result.error) {
        failed++;
      } else {
        success++;
      }
    }

    return {
      data: { success, failed },
      error: failed > 0 ? `${failed} entries failed to approve` : null
    };
  }

  // Bulk reject multiple entries
  async bulkReject(entries: ApprovalEntry[]): Promise<ApiResponse<{ success: number; failed: number }>> {
    let success = 0;
    let failed = 0;

    for (const entry of entries) {
      const result = await this.rejectEntry(entry);
      if (result.error) {
        failed++;
      } else {
        success++;
      }
    }

    return {
      data: { success, failed },
      error: failed > 0 ? `${failed} entries failed to reject` : null
    };
  }

  // Get approval statistics
  async getApprovalStats(): Promise<ApiResponse<{
    total_pending: number;
    pending_by_category: {
      conferences: number;
      journals: number;
      workshops: number;
      patents: number;
    };
  }>> {
    try {
      const pendingResult = await this.getAllPendingEntries();
      
      if (pendingResult.error || !pendingResult.data) {
        return { data: null, error: pendingResult.error || 'Failed to get approval stats' };
      }

      const data = pendingResult.data;
      const stats = {
        total_pending: (
          data.pending_conferences.length +
          data.pending_journal.length +
          data.pending_workshop.length +
          data.pending_patent.length
        ),
        pending_by_category: {
          conferences: data.pending_conferences.length,
          journals: data.pending_journal.length,
          workshops: data.pending_workshop.length,
          patents: data.pending_patent.length,
        }
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error in getApprovalStats:', error);
      return { data: null, error: 'Failed to get approval statistics' };
    }
  }
}