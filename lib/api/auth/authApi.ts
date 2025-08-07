import { ApiClient } from "../client";
import { Faculty, ApiResponse } from "../../types";
import { User } from "@supabase/supabase-js";

export class AuthApi extends ApiClient {
  // SECURITY: Staff creation moved to server-side API route (/api/admin/create-user)
  // This method is deprecated and should not be used
  async createStaff(): Promise<ApiResponse<Faculty>> {
    return { 
      data: null, 
      error: 'Staff creation must be done through server-side API. Use FacultyApi.addStaff() instead.' 
    };
  }

  async updatePassword(password: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await this.getSupabase().auth.updateUser({
        password,
      });

      if (error) {
        console.error("Error updating password:", error);
        return { data: null, error: error.message };
      }

      return { data: undefined, error: null };
    } catch (error) {
      console.error("Error updating password:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  async getUserDetails(email: string): Promise<ApiResponse<Faculty>> {
    try {
      const { data: userData, error: userError } = await this.getSupabase()
        .from("faculty")
        .select()
        .eq("faculty_email", email)
        .single();

      if (userError) {
        console.error("Error fetching user role:", userError);
        return { data: null, error: userError.message };
      }

      return { data: userData as Faculty, error: null };
    } catch (error) {
      console.error("Error fetching user role:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }

  async getUser (): Promise<ApiResponse<User>> {
    try {
      const { data: userData, error: userError } = await this.getSupabase()
        .auth
        .getUser();

      if (userError) {
        console.error("Error fetching user:", userError);
        return { data: null, error: userError.message };
      }

      return { data: userData.user, error: null };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
  }
}
