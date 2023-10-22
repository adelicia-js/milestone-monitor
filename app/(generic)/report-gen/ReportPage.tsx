"use client";
import React from "react";
import Filters from "./Filters";
import GeneralTable from "./GeneralTable";
import { useState, useEffect } from "react";
import { getDataForReport } from "@/app/api/dbfunctions";

const ReportPage = ({ staff_details }) => {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    startDate: undefined,
    endDate: new Date().toJSON().slice(0, 10),
    selectedStaff: "",
    selectedType: "all",
    selectedStatus: "PENDING",
  });
  const [data, setData] = useState<any[]>([]);
  console.log("logging from reportpage ", staff_details);
  return (
    <div className="flex bg-[#cbfef8] ">
      <div className="w-4/5">
        <h1 className="text-3xl font-semibold my-4 text-center">
          Report Geneartion
        </h1>
        <GeneralTable data={data} staffDetails={staff_details} />

        <div className="flex place-content-evenly ">
          <button className=" text-white px-4 py-2 rounded bg-lime-700">
            Download full report
          </button>
          <button
            className="bg-lime-700 text-white px-4 py-2 rounded"
            onClick={() => getDataForReport(undefined, undefined, "all")}
          >
            Download smol report
          </button>
        </div>
      </div>
      <Filters
        staffDetails={staff_details}
        onFiltersChange={(filters: typeof filterState) => {
          // console.log("filters before state update", filters);
          setFilterState(filters);
          // console.log("data passed from filters to report page ", filters);

          getDataForReport(
            filters.startDate,
            filters.endDate,
            filters.selectedType,
            filters.searchQuery,
            filters.selectedStatus,
            filters.selectedStaff
          ).then((data) => {
            setData(data.disp_data || []);
            console.log("data being sent to table ie data in report ", data);
          });
        }}
      />
    </div>
  );
};

export default ReportPage;
