import { useState, useCallback } from "react";
import { AuthApi, FacultyApi } from "../api";
import type { User } from "@supabase/supabase-js";
import { Faculty } from "../types";

export const useGetFacultyList = () => {
  const authApi = new AuthApi();
  const facultyApi = new FacultyApi();

  const [user, setUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<Faculty | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[] | null>([]);
  const [facultyDept, setFacultyDept] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [facultyError, setFacultyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStaffDetails = useCallback(async () => {
    setLoading(true);
    setUserError(null);
    setFacultyError(null);

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

      if (userDetails?.faculty_department) {
        setFacultyDept(userDetails.faculty_department);
        const { data: facultyResponse, error: facultyError } =
          await facultyApi.getFacultyByDepartment(userDetails.faculty_department);

        if (facultyError) {
          setFacultyError(facultyError);
          setLoading(false);
          console.error("Error fetching faculty:", facultyError);
          return { data: null, error: facultyError };
        }
        setFacultyList(facultyResponse);
        setLoading(false);
      }
    }
  }, []);

  return {
    loading,
    user,
    userError,
    userDetails,
    userDetailsError,
    facultyList,
    facultyError,
    facultyDept,
    fetchStaffDetails,
  };
};
