import { useState, useCallback } from "react";
import { approvalApi } from "../api";

export const useApprovals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllPendingEntries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.getAllPendingEntries();
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pending entries';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const approveEntry = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.approveEntry(data);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve entry';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectEntry = useCallback(async (data: any, reason?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.rejectEntry(data, reason);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject entry';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getApprovalStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.getApprovalStats();
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get approval stats';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkApprove = useCallback(async (entries: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.bulkApprove(entries);
      
      if (result.error) {
        setError(result.error);
        return { data: result.data, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk approve entries';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkReject = useCallback(async (entries: any[], reason?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await approvalApi.bulkReject(entries, reason);
      
      if (result.error) {
        setError(result.error);
        return { data: result.data, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk reject entries';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllPendingEntries,
    approveEntry,
    rejectEntry,
    getApprovalStats,
    bulkApprove,
    bulkReject,
  };
};