"use client";

import React, { useEffect } from "react";
import { useGetFacultyList } from "@/lib/hooks/useGetFacultyList";
import ReportPage from "./ReportPage";
import { redirect } from "next/navigation";

export default function ReportPageWrapper() {
  const {
    loading: facultyDataLoading,
    userError,
    userDetails,
    userDetailsError,
    facultyList,
    facultyDept,
    facultyError,
    fetchStaffDetails,
  } = useGetFacultyList();

  useEffect(() => {
    fetchStaffDetails();
  }, []);

  if (
    !facultyDataLoading &&
    userDetails &&
    userDetails.faculty_role !== "hod" &&
    userDetails.faculty_role !== "editor"
  ) {
    alert("Unauthorized access");
    redirect("/");
  }

  return (
    <ReportPage
      facultyDataLoading={facultyDataLoading}
      facultyDataError={userError || userDetailsError || facultyError}
      facultyList={facultyList}
      facultyDept={facultyDept}
    />
  );
}
