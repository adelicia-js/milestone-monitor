"use client";
import React from "react";
import Filters from "./Filters";
import GeneralTable from "./GeneralTable";
import { useState } from "react";
import { saveAs } from "file-saver";
import { smolDataHeadersCSV } from "./CSVHeaders";
import { Urbanist } from "next/font/google";
import { useReport } from "@/lib/hooks/useReport";
import Loader from "@/components/ui/Loader";

const generalFont = Urbanist({
  weight: "400",
  subsets: ["latin"],
});

const ReportPage = ({ staff_details }: any) => {
  const [filterState, setFilterState] = useState({
    searchQuery: "",
    startDate: "2001-01-01",
    endDate: new Date().toJSON().slice(0, 10),
    selectedStaff: "",
    selectedType: "",
    selectedStatus: "",
  });

  const { data, fullData, loading, error, fetchReportData } = useReport();

  const convertToCSV = (data: any[]) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const fieldValue = row[header];
        const csvValue =
          typeof fieldValue === "string" ? `"${fieldValue}"` : fieldValue;
        return csvValue;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const downloadCSV = (data: any[], filename: string) => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const handleLightReportDownload = () => {
    if (data.length <= 0) {
      alert("No data to download");
      return;
    }

    // Convert data to CSV format with the specified headers
    const csvRows = [];
    const headers = smolDataHeadersCSV.map((h) => h.label);
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = smolDataHeadersCSV.map((header) => {
        const fieldValue = row[header.key];
        const csvValue =
          typeof fieldValue === "string" ? `"${fieldValue}"` : fieldValue;
        return csvValue;
      });
      csvRows.push(values.join(","));
    }

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "light-report.csv");
  };

  const handleFirstLinkClick = () => {
    if (fullData.length <= 0) {
      alert("No data to download");
      return;
    }
    const conferenceData = fullData.filter(
      (d: any) => d.entry_type === "conference"
    );
    const journalData = fullData.filter((d: any) => d.entry_type === "journal");
    const workshopData = fullData.filter(
      (d: any) => d.entry_type === "workshop"
    );
    const patentData = fullData.filter((d: any) => d.entry_type === "patent");

    if (filterState.selectedType === "Conferences") {
      downloadCSV(conferenceData, "confdata.csv");
    } else if (filterState.selectedType === "Patents") {
      downloadCSV(patentData, "patentdata.csv");
    } else if (filterState.selectedType === "Workshops") {
      downloadCSV(workshopData, "workshopdata.csv");
    } else if (filterState.selectedType === "Journals") {
      downloadCSV(journalData, "journaldata.csv");
    } else {
      if (conferenceData.length > 0) {
        downloadCSV(conferenceData, "confdata.csv");
      }
      if (journalData.length > 0) {
        downloadCSV(journalData, "journaldata.csv");
      }
      if (workshopData.length > 0) {
        downloadCSV(workshopData, "workshopdata.csv");
      }
      if (patentData.length > 0) {
        downloadCSV(patentData, "patentdata.csv");
      }
    }
  };

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

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            <GeneralTable data={data} staffDetails={staff_details} />

            <div
              className={`${generalFont.className} flex place-content-evenly`}
            >
              <button
                onClick={handleFirstLinkClick}
                className="tracking-wide text-white px-4 py-2 rounded bg-teal-700 hover:bg-teal-500 hover:font-bold shadow-md shadow-teal-500/50 hover:shadow-lg hover:shadow-teal-500/70"
              >
                Download Full Report
              </button>

              <button
                onClick={handleLightReportDownload}
                className="tracking-wide text-white px-4 py-2 rounded bg-teal-700 hover:bg-teal-500 hover:font-bold shadow-md shadow-teal-500/50 hover:shadow-lg hover:shadow-teal-500/70"
              >
                Download Light Report
              </button>
            </div>
          </>
        )}
      </div>
      <Filters
        staffDetails={staff_details}
        onFiltersChange={(filters: typeof filterState) => {
          setFilterState(filters);
          fetchReportData(filters);
        }}
      />
    </div>
  );
};

export default ReportPage;
