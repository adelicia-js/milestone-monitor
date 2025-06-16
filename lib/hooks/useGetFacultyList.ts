import { useState } from "react";
import { AuthApi, FacultyApi } from "../api";
import { User } from "@supabase/auth-helpers-nextjs";
import { Faculty } from "../types";

export const useGetFacultyList = () => {
  const authApi = new AuthApi();
  const facultyApi = new FacultyApi();

  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Faculty | null>(null);
  const [facultyList, setFacultyList] = useState<Faculty[] | null>([]);
  const [userError, setUserError] = useState<string | null>(null);
  const [userRoleError, setUserRoleError] = useState<string | null>(null);
  const [facultyError, setFacultyError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStaffDetails = async () => {
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
      const { data: userRole, error: userRoleError } =
        await authApi.getUserDetails(userResponse.email);

      if (userRoleError) {
        setUserRoleError(userRoleError);
        setLoading(false);
        console.error("Error fetching user role:", userRoleError);
        return { data: null, error: userRoleError };
      }
      setUserRole(userRole);

      const { data: facultyResponse, error: facultyError } =
        await facultyApi.getFacultyByDepartment(userResponse.email);

      if (facultyError) {
        setFacultyError(facultyError);
        setLoading(false);
        console.error("Error fetching faculty:", facultyError);
        return { data: null, error: facultyError };
      }
      setFacultyList(facultyResponse);
      setLoading(false);
    }
  };

  return {
    loading,
    user,
    userError,
    userRole,
    userRoleError,
    facultyList,
    facultyError,
    fetchStaffDetails,
  };
};
