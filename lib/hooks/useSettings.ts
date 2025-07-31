import { useState, useCallback, useEffect } from "react";
import { settingsApi } from "../api";
import { Faculty } from "../types";
import { SettingsFormData, ProfileUpdateData, PasswordUpdateData } from "../api/settings/settingsApi";

export const useSettings = () => {
  const [profile, setProfile] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load user profile
  const loadProfile = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  // Update profile field
  const updateProfileField = useCallback(async (field: keyof ProfileUpdateData, value: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await settingsApi.updateProfileField(field, value);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }

      setProfile(result.data);
      setSuccess(`${field.replace('faculty_', '').replace('_', ' ')} updated successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      return { success: true, data: result.data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update ${field}`;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update full profile
  const updateFullProfile = useCallback(async (formData: SettingsFormData) => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  // Update password
  const updatePassword = useCallback(async (passwordData: PasswordUpdateData) => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  // Upload profile picture
  const uploadProfilePicture = useCallback(async (file: File) => {
    setLoading(true);
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
      setLoading(false);
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