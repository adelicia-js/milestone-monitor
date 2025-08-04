import { useState, useEffect } from 'react';
import { ConferenceApi, JournalApi, WorkshopApi, PatentApi } from '../api';
import { Conference, Journal, Workshop, Patent } from '../types';

export interface RecentActivity {
  id: string;
  type: 'conference' | 'journal' | 'workshop' | 'patent';
  category: 'upload' | 'approval' | 'edit' | 'pending' | 'rejection';
  title: string;
  description: string;
  timestamp: string;
  entity: Conference | Journal | Workshop | Patent;
}

export const useRecentActivity = (facultyId?: string, limit: number = 10) => {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conferenceApi = new ConferenceApi();
  const journalApi = new JournalApi();
  const workshopApi = new WorkshopApi();
  const patentApi = new PatentApi();

  const fetchRecentActivities = async () => {
    if (!facultyId) return;
    
    setLoading(true);
    setError(null);

    try {
      // Fetch recent data from all categories
      const [conferences, journals, workshops, patents] = await Promise.all([
        conferenceApi.getConferencesByFaculty(facultyId),
        journalApi.getJournalsByFaculty(facultyId),
        workshopApi.getWorkshopsByFaculty(facultyId),
        patentApi.getPatentsByFaculty(facultyId)
      ]);

      const allActivities: RecentActivity[] = [];

      // Process conferences
      if (conferences.data) {
        conferences.data.forEach((conf) => {
          const activity: RecentActivity = {
            id: `conference-${conf.id}`,
            type: 'conference',
            category: getActivityCategory(conf.is_verified),
            title: getCategoryTitle('conference', conf.is_verified),
            description: `${conf.paper_title} - ${conf.conf_name}`,
            timestamp: formatTimestamp(conf.conf_date),
            entity: conf
          };
          allActivities.push(activity);
        });
      }

      // Process journals
      if (journals.data) {
        journals.data.forEach((journal) => {
          const activity: RecentActivity = {
            id: `journal-${journal.id}`,
            type: 'journal',
            category: getActivityCategory(journal.is_verified),
            title: getCategoryTitle('journal', journal.is_verified),
            description: `${journal.paper_title} - ${journal.journal_name}`,
            timestamp: formatTimestamp(journal.month_and_year_of_publication),
            entity: journal
          };
          allActivities.push(activity);
        });
      }

      // Process workshops
      if (workshops.data) {
        workshops.data.forEach((workshop) => {
          const activity: RecentActivity = {
            id: `workshop-${workshop.id}`,
            type: 'workshop',
            category: getActivityCategory(workshop.is_verified),
            title: getCategoryTitle('workshop', workshop.is_verified),
            description: `${workshop.title} - ${workshop.organized_by}`,
            timestamp: formatTimestamp(workshop.date),
            entity: workshop
          };
          allActivities.push(activity);
        });
      }

      // Process patents
      if (patents.data) {
        patents.data.forEach((patent) => {
          const activity: RecentActivity = {
            id: `patent-${patent.id}`,
            type: 'patent',
            category: getActivityCategory(patent.is_verified),
            title: getCategoryTitle('patent', patent.is_verified),
            description: `${patent.patent_name} - ${patent.status}`,
            timestamp: formatTimestamp(patent.patent_date),
            entity: patent
          };
          allActivities.push(activity);
        });
      }

      // Sort by most recent and limit results
      const sortedActivities = allActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);

      setActivities(sortedActivities);
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setError('Failed to load recent activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [facultyId, limit]);

  return {
    activities,
    loading,
    error,
    refetch: fetchRecentActivities
  };
};

// Helper functions
const getActivityCategory = (status: 'PENDING' | 'APPROVED' | 'REJECTED'): RecentActivity['category'] => {
  switch (status) {
    case 'APPROVED':
      return 'approval';
    case 'REJECTED':
      return 'rejection';
    case 'PENDING':
    default:
      return 'pending';
  }
};

const getCategoryTitle = (type: string, status: 'PENDING' | 'APPROVED' | 'REJECTED'): string => {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  
  switch (status) {
    case 'APPROVED':
      return `${typeLabel} Approved`;
    case 'REJECTED':
      return `${typeLabel} Rejected`;
    case 'PENDING':
    default:
      return `${typeLabel} Pending`;
  }
};

const formatTimestamp = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  } catch {
    return dateString;
  }
};