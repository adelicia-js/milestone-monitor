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
    staffDepartment,
  ]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStartDate("2001-01-01");
    setEndDate(new Date().toJSON().slice(0, 10));
    setSelectedStaff("");
    setSelectedType("");
    setSelectedStatus("");
  };

  if (loading) {
    return (
      <FilterCard>
        <LoadingContainer>
          <Loader customHeight="h-fit"/>
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
