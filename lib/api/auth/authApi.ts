import { ApiClient } from "../client";
import { Faculty, ApiResponse } from "../../types";
import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

export class AuthApi extends ApiClient {
  private adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SERVICE_ROLE as string,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  async createStaff(
    name: string,
    staffId: string,
    department: string,
    role: string,
    phone: string,
    email: string,
    password: string
  ): Promise<ApiResponse<Faculty>> {
    try {
      // Create user in Supabase Auth
      const { error: authError } = await this.adminClient.auth.admin.createUser(
        {
          email,
          password,
          email_confirm: true,
        }
      );

      if (authError) {
        console.error("Error creating user:", authError);
        return { data: null, error: authError.message };
      }

      // Create faculty record
      const facultyData = {
        faculty_id: staffId,
        faculty_name: name,
        faculty_department: department,
        faculty_role: role,
        faculty_phone: phone,
        faculty_email: email,
      };

      return this.insert<Faculty>("faculty", facultyData);
    } catch (error) {
      console.error("Error creating staff:", error);
      return { data: null, error: "An unexpected error occurred" };
    }
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
