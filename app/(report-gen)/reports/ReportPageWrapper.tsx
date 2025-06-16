"use client";
import React, { useEffect } from "react";
import { useGetFacultyList } from "@/lib/hooks/useGetFacultyList";
import ReportPage from "./ReportPage";
import { useRouter } from "next/navigation";

export default function ReportPageWrapper() {
  const router = useRouter();
  const {
    loading: facultyDataLoading,
    user,
    userError,
    userRole,
    userRoleError,
    facultyList,
    facultyError,
    fetchStaffDetails,
  } = useGetFacultyList();

  useEffect(() => {
    fetchStaffDetails();
  }, []);

  useEffect(() => {
    if (!facultyDataLoading && !user) {
      router.push("/login");
    } else if (userError || userRoleError || facultyError) {
      router.push("/404");
    } else if (
      !facultyDataLoading &&
      userRole &&
      userRole.faculty_role !== "hod" &&
      userRole.faculty_role !== "editor"
    ) {
      router.push("/404");
    }
  }, [facultyDataLoading, user, userRole, userError, userRoleError, facultyError, router]);

  return <ReportPage facultyDataLoading={facultyDataLoading} facultyList={facultyList} />;
}