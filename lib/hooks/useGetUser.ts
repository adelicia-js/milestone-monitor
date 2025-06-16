import { useState, useCallback } from "react";
import { AuthApi } from "../api";
import { User } from "@supabase/auth-helpers-nextjs";
import { Faculty } from "../types";

export const useGetUser = () => {
  const authApi = new AuthApi();

  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Faculty | null>(null);
  const [isHOD, setIsHOD] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setUserError(null);

    const { data: userResponse, error: userError } = await authApi.getUser();

    if (userError) {
      setUserError(userError);
      setLoading(false);
      console.error("Error fetching user:", userError);
      return { data: null, error: userError };
    }

    setUser(userResponse);

    if (userResponse?.email) {
      const { data: userDetails, error: userDetailsError } =
        await authApi.getUserDetails(userResponse.email);

      if (userDetailsError) {
        setUserDetailsError(userDetailsError);
        setLoading(false);
        console.error("Error fetching user role:", userDetailsError);
        return { data: null, error: userDetailsError };
      }

      setUserDetails(userDetails);

      if (userDetails) {
        if (userDetails.faculty_role === "hod") {
          setIsHOD(true);
        } else if (userDetails.faculty_role === "editor") {
          setIsEditor(true);
        }
      }
    }
  }, []);

  return {
    loading,
    user,
    userError,
    userDetails,
    isHOD,
    isEditor,
    userDetailsError,
    fetchUserDetails,
  };
};
