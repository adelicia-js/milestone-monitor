"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Faculty } from "@/lib/types";
import { ReportFiltersI } from "@/lib/hooks/useReport";
import {
  Search,
  Calendar,
  Users,
  FileType,
  CheckCircle,
  Filter,
  RotateCcw,
} from "lucide-react";
import Loader from "@/components/ui/Loader";
import {
  GenericHeader,
  LoadingContainer,
  LoadingText,
} from "@/components/ui/GenericStyles";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ReportFiltersProps {
  staffDetails: Faculty[] | null;
  staffDepartment: string | null;
  onFiltersChange: (filters: ReportFiltersI) => void;
  loading?: boolean;
  error?: string | null;
}

export default function ReportFilters({
  staffDetails,
  staffDepartment,
  onFiltersChange,
  loading,
  error,
}: ReportFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2001-01-01");
  const [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10));
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateError, setDateError] = useState("");

  // Validate date range
  const validateDateRange = (start: string, end: string) => {
    if (start && end && new Date(start) > new Date(end)) {
      setDateError("Start date cannot be after end date");
      return false;
    }
    setDateError("");
    return true;
  };

  // Handle start date change with validation
  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    validateDateRange(newStartDate, endDate);
  };

  // Handle end date change with validation
  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
    validateDateRange(startDate, newEndDate);
  };

  useEffect(() => {
    // Only trigger filters change if date range is valid
    if (validateDateRange(startDate, endDate)) {
      onFiltersChange({
        searchQuery,
        startDate,
        endDate,
        selectedStaff,
        selectedType,
        selectedStatus,
        department: staffDepartment,
      });
    }
  }, [
    searchQuery,
    startDate,
    endDate,
    selectedStaff,
    selectedType,
    selectedStatus,
    staffDepartment,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("2001-01-01");
    setEndDate(new Date().toJSON().slice(0, 10));
    setSelectedStaff("");
    setSelectedType("");
    setSelectedStatus("");
    setDateError("");
  };

  if (loading) {
    return (
      <FilterCard>
        <LoadingContainer>
          <Loader customHeight="h-fit" />
          <LoadingText>Loading filters...</LoadingText>
        </LoadingContainer>
      </FilterCard>
    );
  }

  if (error) {
    return (
      <FilterCard>
        <ErrorState>⚠️ Error loading filters</ErrorState>
      </FilterCard>
    );
  }

  if (!staffDetails) return null;

  return (
    <FilterCard>
      <FilterHeader>
        <HeaderContent>
          <Filter size={18} />
          <HeaderText>Filters</HeaderText>
        </HeaderContent>
        <ClearButton onClick={handleClearFilters} title="Clear all filters">
          <RotateCcw size={16} />
          Clear
        </ClearButton>
      </FilterHeader>

      <FiltersContent>
        <FilterGroup>
          <FilterLabel>
            <Search size={16} />
            Search
          </FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <Calendar size={16} />
            Date Range
          </FilterLabel>
          <DateInputs>
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              max={endDate}
            />
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate}
              max={new Date().toJSON().slice(0, 10)}
            />
          </DateInputs>
          {dateError && <DateError>{dateError}</DateError>}
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <Users size={16} />
            Faculty
          </FilterLabel>
          <Select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            <option value="">All Faculty</option>
            {staffDetails.map((staff) => (
              <option key={staff.faculty_id} value={staff.faculty_id}>
                {staff.faculty_name}
              </option>
            ))}
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <FileType size={16} />
            Entry Type
          </FilterLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Conferences">Conferences</option>
            <option value="Journals">Journals</option>
            <option value="Patents">Patents</option>
            <option value="Workshops">Workshops</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>
            <CheckCircle size={16} />
            Status
          </FilterLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
        </FilterGroup>
      </FiltersContent>
    </FilterCard>
  );
}

const FilterCard = styled.div`
  height: 100%;
  width: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  overflow: auto;

  @media (min-width: 1024px) {
    height: 80vh;
  }

  @media (min-width: 1280px) {
    height: 85vh;
  }

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 131, 143, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 131, 143, 0.2);
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 131, 143, 0.2);
  }

  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 131, 143, 0.3) rgba(0, 0, 0, 0.075);
`;

const FiltersContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const SearchInput = styled.input`
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  &::placeholder {
    color: rgba(107, 114, 128, 0.6);
  }

  @media (min-width: 1024px) {
    padding: 0.5rem;
  }

  @media (min-width: 1280px) {
    padding: 0.75rem;
  }
`;

const DateInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateInput = styled.input`
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }
    
  @media (min-width: 1024px) {
    padding: 0.5rem;
  }

  @media (min-width: 1280px) {
    padding: 0.75rem;
  }
`;

const Select = styled.select`
  border: 1px solid rgba(56, 68, 68, 0.2);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(4, 103, 112, 0.5);
    box-shadow: 0 0 0 3px rgba(4, 103, 112, 0.1);
    background: rgba(255, 255, 255, 0.95);
  }

  option {
    background: rgba(255, 255, 255, 0.95);
    color: rgba(31, 41, 55, 0.9);
  }

  @media (min-width: 1024px) {
    padding: 0.5rem;
  }

  @media (min-width: 1280px) {
    padding: 0.75rem;
  }
`;

const ErrorState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: rgba(239, 68, 68, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  text-align: center;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(4, 103, 112, 0.99);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: rgba(4, 103, 112, 0.99);
  }
`;

const HeaderText = styled(GenericHeader)`
  margin: 0;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(107, 114, 128, 0.1);
    border-color: rgba(107, 114, 128, 0.5);
    color: rgba(107, 114, 128, 1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(-180deg);
  }
`;

const DateError = styled.div`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.75rem;
  color: rgba(239, 68, 68, 0.8);
  margin-top: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: rgba(254, 242, 242, 0.8);
  border: 1px solid rgba(252, 165, 165, 0.4);
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "⚠️";
    font-size: 0.75rem;
  }
`;
