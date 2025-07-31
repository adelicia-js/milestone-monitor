"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Faculty } from "@/lib/types";
import { ReportFilters } from "@/lib/hooks/useReport";
import { Search, Calendar, Users, FileType, CheckCircle, Filter } from "lucide-react";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ModernFiltersProps {
  staffDetails: Faculty[] | null;
  staffDepartment: string | null;
  onFiltersChange: (filters: ReportFilters) => void;
  loading?: boolean;
  error?: string | null;
}

export default function ModernFilters({
  staffDetails,
  staffDepartment,
  onFiltersChange,
  loading,
  error
}: ModernFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("2001-01-01");
  const [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10));
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    onFiltersChange({
      searchQuery,
      startDate,
      endDate,
      selectedStaff,
      selectedType,
      selectedStatus,
      department: staffDepartment,
    });
  }, [
    searchQuery,
    startDate,
    endDate,
    selectedStaff,
    selectedType,
    selectedStatus,
    staffDepartment
  ]);

  if (loading) {
    return (
      <FilterCard>
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading filters...</LoadingText>
        </LoadingState>
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
      <GenericHeaderContainer>
        <GenericHeader>
          <Filter size={18} />
          Filters
        </GenericHeader>
      </GenericHeaderContainer>

      <FiltersContent>
        <FilterGroup>
          <FilterLabel>
            <Search size={16} />
            Search
          </FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search by title, name..."
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
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </DateInputs>
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
            <option value="conferences">Conferences</option>
            <option value="journal_publications">Journals</option>
            <option value="patents">Patents</option>
            <option value="fdp_workshop_refresher_course">Workshops</option>
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
  width: 100%;
  height: fit-content;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
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
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
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
`;

const DateInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateInput = styled.input`
  padding: 0.75rem;
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
`;

const Select = styled.select`
  padding: 0.75rem;
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
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(4, 103, 112, 0.2);
  border-top: 2px solid rgba(4, 103, 112, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.9rem;
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