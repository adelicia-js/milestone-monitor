"use client";
import React, { useEffect } from "react";
import Filters from "./Filters";
import GeneralTable from "./GeneralTable";
import { useState } from "react";
import { Urbanist } from "next/font/google";
import { useReport } from "@/lib/hooks/useReport";
import Loader from "@/components/ui/Loader";
import { Faculty } from "@/lib/types";

const generalFont = Urbanist({
  weight: "400",
  subsets: ["latin"],
});

interface ReportPageProps {
  facultyList: Faculty[] | null;
  facultyDept: string | null;
  facultyDataLoading: boolean;
  facultyDataError: string | null;
}

const ReportPage = (props: ReportPageProps) => {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    startDate: "2001-01-01",
    endDate: new Date().toJSON().slice(0, 10),
    selectedStaff: "",
    selectedType: "",
    selectedStatus: "",
    department: props.facultyDept,
  });

  const { data, loading: reportDataLoading, error, fetchReportData } = useReport();

  useEffect(() => {
    if (props.facultyDept) {
      fetchReportData({ ...filterState, department: props.facultyDept });
    }
  }, [props.facultyDept]);

  return (
    <div
      className={`${generalFont.className} h-[90vh] grid grid-cols-6 bg-[#cbfef8]`}
    >
      <div className="col-start-1 col-end-5">
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {props.facultyDataLoading || reportDataLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            <GeneralTable data={data} staffDetails={props.facultyList} />
          </>
        )}
      </div>
      <Filters
        staffDetails={props.facultyList}
        onFiltersChange={(filters: typeof filterState) => {
          const updatedFilters = { ...filters, department: props.facultyDept || "" };
          setFilterState(updatedFilters);
          fetchReportData(updatedFilters);
        }}
      />
    </div>
  );
};

export default ReportPage;
