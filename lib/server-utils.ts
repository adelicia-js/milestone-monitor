"use server";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Faculty } from "./types";

/**
 * Server-side utility function to fetch faculty role by email
 * This replaces the fetchRole function from api/dbfunctions.tsx
 */
export async function fetchFacultyRole(email: string): Promise<Faculty | null> {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: userData, error } = await supabase
      .from("faculty")
      .select("*")
      .eq("faculty_email", email)
      .single();

    if (error) {
      console.error("Error fetching faculty role:", error);
      return null;
    }

    return userData as Faculty;
  } catch (error) {
    console.error("Error in fetchFacultyRole:", error);
    return null;
  }
}

/**
 * Server-side utility function to get faculty data for current authenticated user
 * This is an alternative version that gets the user from the session
 */
export async function getCurrentFacultyData(): Promise<Faculty | null> {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    return await fetchFacultyRole(user.email);
  } catch (error) {
    console.error("Error in getCurrentFacultyData:", error);
    return null;
  }
}