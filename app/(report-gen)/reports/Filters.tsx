"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Faculty } from "@/lib/types";
import { ReportFilters } from "@/lib/hooks/useReport";

interface FacultyProps {
  staffDetails: Faculty[] | null;
  staffDepartment: string | null;
  onFiltersChange: (filters: ReportFilters) => void;
}

const Filters = (props: FacultyProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    props.onFiltersChange({
      searchQuery,
      startDate,
      endDate,
      selectedStaff,
      selectedType,
      selectedStatus,
      department: props.staffDepartment,
    });
  }, [
    searchQuery,
    startDate,
    endDate,
    selectedStaff,
    selectedType,
    selectedStatus,
  ]);

  if (!props.staffDetails) return null;

  return (
    <div className="col-start-5 col-end-7 flex items-center justify-center">
      <div className="p-4 rounded-lg shadow-md shadow-teal-800/20 w-fit bg-teal-400/40">
        <h1 className="text-xl uppercase font-bold tracking-wide my-2 text-center text-teal-700">
          Filters
        </h1>
        <div className="mb-4 relative flex flex-row items-center">
          <input
            type="text"
            placeholder="Search title . . ."
            className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-gray-500 absolute right-3 top-[0.6rem]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="tracking-wide block text-sm font-bold text-teal-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="tracking-wide block text-sm font-bold text-teal-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="tracking-wide block text-sm font-bold text-teal-700 mb-2">
            Select Staff
          </label>
          <select
            className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="">All</option>
            {props.staffDetails.map((f: Faculty) => (
              <option key={f.faculty_id} value={f.faculty_id}>
                {f.faculty_name}
              </option>
            ))}
            {/* Populate entry type options dynamically */}
          </select>
        </div>
        <div className="mb-6">
          <label className="tracking-wide block text-sm font-bold text-teal-700 mb-2">
            Select Type
          </label>
          <select
            className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All</option>
            <option value="Conferences">Conferences</option>
            <option value="Patents">Patents</option>
            <option value="Workshops">Workshops</option>
            <option value="Journals">Journals</option>
            {/* Populate entry type options dynamically */}
          </select>
        </div>
        <div className="mb-6">
          <label className="tracking-wide block text-sm font-bold text-teal-700  mb-2">
            Select Verification Status
          </label>
          <select
            className="bg-[#cbfef8]/70 text-gray-500 w-full py-2 px-4 border-2 border-teal-500/30 rounded-lg focus:outline-none focus:border-teal-400 hover:border-teal-400"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Verified</option>
            <option value="REJECTED">Unverified</option>
            {/* Populate entry type options dynamically */}
          </select>
        </div>
      </div>
    </div>
  );
};
export default Filters;
