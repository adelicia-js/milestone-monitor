import { useState, useCallback, useEffect } from "react";
import { settingsApi } from "../api";
import { Faculty } from "../types";
import { SettingsFormData, ProfileUpdateData, PasswordUpdateData } from "../api/settings/settingsApi";

interface LoadingStates {
  profile: boolean;
  profileField: boolean;
  fullProfile: boolean;
  password: boolean;
  profilePicture: boolean;
}

// Helper function to format field names for success messages
const formatFieldName = (field: string): string => {
  const fieldMap: Record<string, string> = {
    faculty_name: 'Name',
    faculty_phone: 'Phone number',
    faculty_linkedin: 'LinkedIn profile',
    faculty_google_scholar: 'Google Scholar profile',
  };
  
  return fieldMap[field] || field.replace('faculty_', '').replace('_', ' ');
};

export const useSettings = () => {
  const [profile, setProfile] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<LoadingStates>({
    profile: false,
    profileField: false,
    fullProfile: false,
    password: false,
    profilePicture: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user profile
  const loadProfile = useCallback(async () => {
    setLoading(prev => ({ ...prev, profile: true }));
    setError(null);

    try {
      const result = await settingsApi.getCurrentUserProfile();
      
      if (result.error) {
        setError(result.error);
        setProfile(null);
      } else {
        setProfile(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load profile';
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  }, []);

  // Update profile field
  const updateProfileField = useCallback(async (field: keyof ProfileUpdateData, value: string) => {
    setLoading(prev => ({ ...prev, profileField: true }));
    setError(null);
    setSuccess(null);

    try {
      const result = await settingsApi.updateProfileField(field, value);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setProfile(result.data);
      setSuccess(`${formatFieldName(field)} updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update ${field}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, profileField: false }));
    }
  }, []);

  // Update full profile
  const updateFullProfile = useCallback(async (formData: SettingsFormData) => {
    setLoading(prev => ({ ...prev, fullProfile: true }));
    setError(null);
    setSuccess(null);

    try {
      const result = await settingsApi.updateFullProfile(formData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setProfile(result.data);
      setSuccess('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, fullProfile: false }));
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (passwordData: PasswordUpdateData) => {
    setLoading(prev => ({ ...prev, password: true }));
    setError(null);
    setSuccess(null);

    try {
      const result = await settingsApi.updatePassword(passwordData);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setSuccess('Password updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  }, []);

  // Upload profile picture
  const uploadProfilePicture = useCallback(async (file: File) => {
    setLoading(prev => ({ ...prev, profilePicture: true }));
    setError(null);
    setSuccess(null);

    try {
      const result = await settingsApi.uploadProfilePicture(file);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setSuccess('Profile picture uploaded successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload profile picture';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, profilePicture: false }));
    }
  }, []);

  // Clear messages
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  // Auto-load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    success,
    loadProfile,
    updateProfileField,
    updateFullProfile,
    updatePassword,
    uploadProfilePicture,
    clearMessages,
  };
};