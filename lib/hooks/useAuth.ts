import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { FacultyApi } from '../api/faculty/facultyApi';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const facultyApi = new FacultyApi();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        alert("Invalid email or password, please try again!");
        return;
      }

      // Check if user has faculty data
      const { data: facultyData, error: facultyError } = await facultyApi.getFacultyByEmail(email);

      if (facultyError) {
        console.error("Error checking faculty data:", facultyError);
        alert("Error accessing faculty data. Please try again.");
        return;
      }

      // If no faculty data exists, create it
      if (!facultyData) {
        const { error: createError } = await facultyApi.createDefaultFacultyData(email);
        if (createError) {
          console.error("Error creating faculty data:", createError);
          alert("Error creating faculty profile. Please try again.");
          return;
        }
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error("Signup error:", error);
        alert("Error signing up, please try again!");
        return;
      }

      alert("Sign up successful! Please check your email for verification.");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error signing out. Please try again.");
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading,
  };
}; 