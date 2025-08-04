"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { DisplayData } from "@/lib/hooks/useReport";
import { Faculty } from "@/lib/types";
import { CheckCircle, Clock, XCircle, Download } from "lucide-react";
import ExportModal from "./ExportModal";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";
import Loader from "@/components/ui/Loader";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ReportsTableProps {
  tableData: DisplayData[];
  staffDetails: Faculty[] | null;
  loading?: boolean;
  error?: string | null;
}

export default function ReportsTable({
  tableData,
  staffDetails,
  loading,
  error,
}: ReportsTableProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={16} color="#059669" />;
      case "pending":
        return <Clock size={16} color="#d97706" />;
      case "rejected":
        return <XCircle size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#059669";
      case "pending":
        return "#d97706";
      case "rejected":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getfacultyname = (id: string) => {
    const faculty = staffDetails?.find((f: Faculty) => f.faculty_id === id);
    return faculty ? faculty.faculty_name : "Unknown Faculty";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <TableCard>
        <LoadingContainer>
          <Loader customHeight="h-fit" />
          <LoadingText>Loading reports data...</LoadingText>
        </LoadingContainer>
      </TableCard>
    );
  }

  if (error) {
    return (
      <TableCard>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>Error loading reports: {error}</ErrorMessage>
        </ErrorState>
      </TableCard>
    );
  }

  return (
    <>
      <TableCard>
        {tableData.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyMessage>No data found</EmptyMessage>
            <EmptySubtext>
              Try adjusting your filters to see more results.
            </EmptySubtext>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Faculty ID</TableHeaderCell>
                  <TableHeaderCell>Faculty Name</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Entry Type</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{ wordWrap: "break-word", maxWidth: "100px" }}
                    >
                      {row.faculty_id}
                    </TableCell>
                    <TableCell>
                      <FacultyName>
                        {getfacultyname(row.faculty_id)}
                      </FacultyName>
                    </TableCell>
                    <TableCell>
                      <TitleCell>{row.title}</TitleCell>
                    </TableCell>
                    <TableCell>
                      <EntryTypeBadge>{row.entry_type}</EntryTypeBadge>
                    </TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>

                    <TableCell>
                      <StatusWrapper>
                        {getStatusIcon(row.status)}
                        <StatusText color={getStatusColor(row.status)}>
                          {row.status}
                        </StatusText>
                      </StatusWrapper>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        )}

        {tableData.length > 0 && (
          <FloatingExportButton onClick={() => setIsExportModalOpen(true)}>
            <Download size={20} />
            Export
          </FloatingExportButton>
        )}
      </TableCard>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={tableData}
        staffDetails={staffDetails}
      />
    </>
  );
}

const TableCard = styled.div`
  font-family: ${bodyText.style.fontFamily};
  position: relative;
  height: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  background-color: rgba(244, 253, 252, 0.75);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  flex: 1;
  padding: 0;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  backdrop-filter: blur(10px);
  overflow: auto;

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
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 2px solid rgba(4, 103, 112, 0.2);
  white-space: nowrap;
  vertical-align: middle;
  height: 60px; /* Fixed header height */
`;

const TableCell = styled.td`
  padding: 1rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  vertical-align: middle; /* Changed from top to middle for better alignment */
  height: 70px; /* Fixed cell height for consistent alignment */
`;

const FacultyName = styled.span`
  display: inline-block;
  max-width: 180px;
  font-weight: 500;
  color: rgba(4, 103, 112, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TitleCell = styled.div`
  max-width: 250px;
  word-wrap: break-word;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EntryTypeBadge = styled.span`
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
  text-transform: capitalize;
  white-space: nowrap;
  min-width: 80px;
  text-align: center;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
`;

const StatusText = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-weight: 500;
  text-transform: capitalize;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  height: 100%;
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
`;

const ErrorMessage = styled.p`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(239, 68, 68, 0.8);
  font-size: 1rem;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  height: 100%;
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
  font-size: 0.9rem;
  color: rgba(107, 114, 128, 0.8);
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
  margin: 0;
`;

const FloatingExportButton = styled.button`
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.2),
    rgba(0, 131, 143, 1)
  );
  color: white;
  border-radius: 1.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  z-index: 100;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(-1px) scale(1);
  }

  &:focus {
    outline: 2px solid rgba(4, 103, 112, 0.3);
    outline-offset: 2px;
  }
`;
