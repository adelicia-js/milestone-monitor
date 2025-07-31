import { useState, useCallback } from "react";
import { conferenceApi, journalApi, patentApi, workshopApi } from "../api";
import { Conference, Journal, Patent, Workshop } from "../types";

type CategoryType = 'conferences' | 'journals' | 'patents' | 'workshops';
type CategoryData = Conference | Journal | Patent | Workshop;

export const useCategory = (categoryType: CategoryType) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiForCategory = () => {
    switch (categoryType) {
      case 'conferences':
        return conferenceApi;
      case 'journals':
        return journalApi;
      case 'patents':
        return patentApi;
      case 'workshops':
        return workshopApi;
      default:
        throw new Error(`Unknown category type: ${categoryType}`);
    }
  };

  const fetchCategoryData = useCallback(async (facultyEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const api = getApiForCategory();
      let result;

      switch (categoryType) {
        case 'conferences':
          result = await (api as typeof conferenceApi).getConferencesByEmail(facultyEmail);
          break;
        case 'journals':
          result = await (api as typeof journalApi).getJournalsByEmail(facultyEmail);
          break;
        case 'patents':
          result = await (api as typeof patentApi).getPatentsByEmail(facultyEmail);
          break;
        case 'workshops':
          result = await (api as typeof workshopApi).getWorkshopsByEmail(facultyEmail);
          break;
      }

      if (result.error) {
        setError(result.error);
        setData([]);
      } else {
        setData(result.data || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [categoryType]);

  return {
    data,
    loading,
    error,
    fetchCategoryData,
    refetch: (facultyEmail: string) => fetchCategoryData(facultyEmail)
  };
};