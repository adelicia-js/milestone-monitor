import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { FacultyApi } from '../api/faculty/facultyApi';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
        toast.error("Invalid email or password, please try again!");
        setIsLoading(false);
        return;
      }

      // Check if user has faculty data
      const { data: facultyData, error: facultyError } = await facultyApi.getFacultyByEmail(email);

      if (facultyError) {
        console.error("Error checking faculty data:", facultyError);
        toast.error("Error accessing faculty data. Please try again.");
        setIsLoading(false);
        return;
      }

      // If no faculty data exists, create it
      if (!facultyData) {
        const { error: createError } = await facultyApi.createDefaultFacultyData(email);
        if (createError) {
          console.error("Error creating faculty data:", createError);
          toast.error("Error creating faculty profile. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      toast.success("Signed in successfully!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
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