"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Eye, Calendar } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";
import { ApprovalEntry } from "@/lib/types";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ApprovalsTableProps {
  data: ApprovalEntry[];
  category: string;
  onViewDetails: (entry: ApprovalEntry) => void;
  emptyMessage: string;
  loading?: boolean;
}

export default function ApprovalsTable({
  data,
  category,
  onViewDetails,
  emptyMessage,
  loading = false,
}: ApprovalsTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getTableColumns = () => {
    switch (category) {
      case "all":
        return [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "title", label: "Title" },
          { key: "date", label: "Date" },
          { key: "entry_type", label: "Type" },
        ];
      case "conferences":
        return [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "paper_title", label: "Paper Title" },
          { key: "conf_name", label: "Conference Name" },
          { key: "conf_date", label: "Date" },
          { key: "type", label: "Type" },
        ];
      case "journals":
        return [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "paper_title", label: "Paper Title" },
          { key: "journal_name", label: "Journal Name" },
          { key: "month_and_year_of_publication", label: "Publication Date" },
          { key: "indexed_in", label: "Indexed In" },
        ];
      case "patents":
        return [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "patent_name", label: "Patent Name" },
          { key: "patent_type", label: "Type" },
          { key: "application_no", label: "Application No" },
          { key: "status", label: "Status" },
        ];
      case "workshops":
        return [
          { key: "faculty_id", label: "Faculty ID" },
          { key: "title", label: "Title" },
          { key: "organized_by", label: "Organized By" },
          { key: "date", label: "Date" },
          { key: "number_of_days", label: "Duration (Days)" },
        ];
      default:
        return [];
    }
  };

  const renderCellValue = (item: ApprovalEntry, columnKey: string) => {
    // Handle unified fields for "all" category
    if (category === "all") {
      if (columnKey === "title") {
        return item.title || "N/A";
      }
      if (columnKey === "date") {
        // Map to the appropriate date field based on entry type
        const dateField =
          item.entry_type === "Conference"
            ? "conf_date"
            : item.entry_type === "Journal"
            ? "month_and_year_of_publication"
            : item.entry_type === "Patent"
            ? "patent_date"
            : "date"; // Workshop
        return formatDate(String(item[dateField] || ""));
      }
      if (columnKey === "entry_type") {
        return item.entry_type || "N/A";
      }
    }

    const value = String(item[columnKey] || "");

    if (!value) return "N/A";

    // Format dates
    if (
      columnKey.includes("date") ||
      columnKey === "month_and_year_of_publication"
    ) {
      return formatDate(value);
    }

    // Format specific fields
    if (columnKey === "number_of_days") {
      return `${value} days`;
    }

    return value.toString();
  };

  if (!data || data.length === 0) {
    return (
      <TableCard>
        <EmptyState>
          <EmptyIcon>📋</EmptyIcon>
          <EmptyMessage>{emptyMessage}</EmptyMessage>
          <EmptySubtext>
            All entries in this category have been processed.
          </EmptySubtext>
        </EmptyState>
      </TableCard>
    );
  }

  const columns = getTableColumns();

  return (
    <TableCard>
      {loading && (
        <LoadingContainer>
          <Loader customHeight="h-fit" />
          <LoadingText>Updating table...</LoadingText>
        </LoadingContainer>
      )}
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell key={column.key}>
                  {column.label}
                </TableHeaderCell>
              ))}
              <TableHeaderCell>Submitted</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.id || index}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key === "faculty_id" ? (
                      <FacultyId>{renderCellValue(item, column.key)}</FacultyId>
                    ) : column.key.includes("title") ||
                      column.key.includes("name") ? (
                      <TitleCell>{renderCellValue(item, column.key)}</TitleCell>
                    ) : column.key === "type" ||
                      column.key === "indexed_in" ||
                      column.key === "status" ? (
                      <Badge>{renderCellValue(item, column.key)}</Badge>
                    ) : (
                      renderCellValue(item, column.key)
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <DateWrapper>
                    <Calendar size={14} />
                    {formatDate(String(item.created_at || ""))}
                  </DateWrapper>
                </TableCell>
                <TableCell>
                  <ActionButton onClick={() => onViewDetails(item)}>
                    <Eye size={16} />
                    Review
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </TableCard>
  );
}

const TableCard = styled.div`
  height: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  box-shadow: 0 4px 15px rgba(4, 103, 112, 0.15);
  backdrop-filter: blur(10px);

  /* Custom scrollbar styling similar to reports and recent activity */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 131, 143, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 131, 143, 0.25);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 131, 143, 0.4);
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 131, 143, 0.25) rgba(0, 131, 143, 0.1);
  scroll-behavior: smooth;

  /* Ensure smooth scrolling on smaller screens */
  @media (max-width: 1024px) {
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0;
  background: rgba(244, 253, 252, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(140, 242, 233, 0.2);
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  font-size: clamp(0.8rem, 0.6222rem + 0.2778vw, 0.9rem);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 2px solid rgba(4, 103, 112, 0.2);
  white-space: nowrap;
  vertical-align: middle;
  height: 60px;

  @media (max-width: 1024px) {
    padding: 0.75rem;
    font-size: 0.8rem;
    height: 50px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.75rem;
    height: 45px;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: clamp(0.75rem, 0.5278rem + 0.3472vw, 0.875rem);
  color: rgba(31, 41, 55, 0.9);
  vertical-align: middle;
  height: 70px;

  @media (max-width: 1024px) {
    padding: 0.75rem;
    height: 60px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    height: 50px;
  }
`;

const FacultyId = styled.span`
  font-weight: 600;
  color: rgba(4, 103, 112, 0.8);
  font-family: monospace;
  white-space: nowrap;
`;

const TitleCell = styled.div`
  max-width: 250px;
  word-wrap: break-word;
  line-height: 1.3;

  @media (max-width: 1024px) {
    max-width: 200px;
  }

  @media (max-width: 768px) {
    max-width: 150px;
  }
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(4, 103, 112, 0.1),
    rgba(6, 95, 70, 0.1)
  );
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  min-width: 70px;
  text-align: center;
`;

const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(107, 114, 128, 0.8);
  font-size: clamp(0.75rem, 0.4333rem + 0.4167vw, 0.85rem);
  white-space: nowrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.2),
    rgba(0, 131, 143, 1)
  );
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  font-size: clamp(0.75rem, 0.4333rem + 0.4167vw, 0.85rem);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 100px;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 0.5rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.5;
`;

const EmptyMessage = styled.h3`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.8);
  margin: 0;
`;

const EmptySubtext = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(107, 114, 128, 0.8);
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
  margin: 0;
`;
