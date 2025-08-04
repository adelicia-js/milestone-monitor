import { useState, useCallback } from "react";
import { facultyApi } from "../api";
import { Faculty } from "../types";

export const useStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllStaff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.getAllStaff();
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffByDepartment = useCallback(async (department: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.getStaffByDepartment(department);
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch department staff';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const addStaff = useCallback(async (staffData: {
    faculty_name: string;
    faculty_id: string;
    faculty_department: string;
    faculty_role: string;
    faculty_phone: string;
    faculty_email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.addStaff(staffData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add staff member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStaff = useCallback(async (email: string, updates: Partial<Faculty>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.updateStaff(email, updates);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update staff member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStaff = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.deleteStaff(email);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete staff member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const getStaffByRole = useCallback(async (role: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.getStaffByRole(role);
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch staff by role';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateStaff = useCallback(async (updates: Array<{
    email: string;
    data: Partial<Faculty>;
  }>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await facultyApi.bulkUpdateStaff(updates);
      
      if (result.error) {
        setError(result.error);
        return { data: result.data, error: result.error };
      }

      return { data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update staff';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllStaff,
    getStaffByDepartment,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaffByRole,
    bulkUpdateStaff,
  };
};