import { Conference, Journal, Patent, Workshop } from '@/lib/types';

export interface PendingData {
  pending_conferences: Conference[];
  pending_journal: Journal[];
  pending_workshop: Workshop[];
  pending_patent: Patent[];
}