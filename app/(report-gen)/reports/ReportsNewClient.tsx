"use client";

import React, { useEffect, useState } from "react";
import { useGetFacultyList } from "@/lib/hooks/useGetFacultyList";
import { useReport, ReportFiltersI } from "@/lib/hooks/useReport";
import { redirect } from "next/navigation";
import ReportsPageWrapper from "@/components/new/reports/ReportsPageWrapper";
import Loader from "@/components/ui/Loader";

export default function ReportsNewClient() {
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

  const { data, loading: reportDataLoading, error, fetchReportData } = useReport();

  const [filterState, setFilterState] = useState<ReportFiltersI>({
    searchQuery: "",
    startDate: "2001-01-01",
    endDate: new Date().toJSON().slice(0, 10),
    selectedStaff: "",
    selectedType: "",
    selectedStatus: "",
    department: null,
  });

  useEffect(() => {
    fetchStaffDetails();
  }, []);

  useEffect(() => {
    if (facultyDept) {
      setFilterState(prev => ({ ...prev, department: facultyDept }));
      fetchReportData({ ...filterState, department: facultyDept });
    }
  }, [facultyDept]);

  const handleFiltersChange = (filters: ReportFiltersI) => {
    setFilterState(filters);
    fetchReportData(filters);
  };

  // Authorization check
  if (
    !facultyDataLoading &&
    userDetails &&
    userDetails.faculty_role !== "hod" &&
    userDetails.faculty_role !== "editor"
  ) {
    alert("Unauthorized access");
    redirect("/");
  }

  // Show loading state while checking authorization
  if (facultyDataLoading && !userDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'rgba(140, 242, 233, 0.35)'
      }}>
        <Loader />
      </div>
    );
  }

  return (
    <ReportsPageWrapper
      facultyList={facultyList}
      facultyDept={facultyDept}
      facultyDataLoading={facultyDataLoading}
      facultyDataError={userError || userDetailsError || facultyError}
      reportData={data}
      reportDataLoading={reportDataLoading}
      reportError={error}
      onFiltersChange={handleFiltersChange}
    />
  );
}