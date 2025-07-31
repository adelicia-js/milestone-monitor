"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { DisplayData } from "@/lib/hooks/useReport";
import { Faculty } from "@/lib/types";
import { CheckCircle, Clock, XCircle, Download, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import ExportModal from "./ExportModal";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ModernReportsTableProps {
  tableData: DisplayData[];
  staffDetails: Faculty[] | null;
  loading?: boolean;
  error?: string | null;
}

export default function ModernReportsTable({
  tableData,
  staffDetails,
  loading,
  error
}: ModernReportsTableProps) {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle size={16} color="#059669" />;
      case 'pending':
        return <Clock size={16} color="#d97706" />;
      case 'rejected':
        return <XCircle size={16} color="#dc2626" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'rejected':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getfacultyname = (id: string) => {
    const faculty = staffDetails?.find((f: Faculty) => f.faculty_id === id);
    return faculty ? faculty.faculty_name : "Unknown Faculty";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatEntryType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'conferences': 'Conference',
      'journal_publications': 'Journal',
      'patents': 'Patent',
      'fdp_workshop_refresher_course': 'Workshop'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <TableCard>
        <LoadingState>
          <LoadingSpinner />
          <LoadingText>Loading reports data...</LoadingText>
        </LoadingState>
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
        <TableHeader>
          <GenericHeaderContainer>
            <GenericHeader>Reports Data</GenericHeader>
          </GenericHeaderContainer>
          <ExportButton onClick={() => setIsExportModalOpen(true)}>
            <Download size={18} />
            Export
          </ExportButton>
        </TableHeader>

        {tableData.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📊</EmptyIcon>
            <EmptyMessage>No data found</EmptyMessage>
            <EmptySubtext>Try adjusting your filters to see more results.</EmptySubtext>
          </EmptyState>
        ) : (
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Faculty ID</TableHeaderCell>
                  <TableHeaderCell>Faculty Name</TableHeaderCell>
                  <TableHeaderCell>Entry Type</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.faculty_id}</TableCell>
                    <TableCell>
                      <FacultyName>{getfacultyname(row.faculty_id)}</FacultyName>
                    </TableCell>
                    <TableCell>
                      <EntryTypeBadge>{formatEntryType(row.entry_type)}</EntryTypeBadge>
                    </TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>
                      <TitleCell>{row.title}</TitleCell>
                    </TableCell>
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
  height: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0;
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
`;

const TableCell = styled.td`
  padding: 1rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: rgba(31, 41, 55, 0.9);
  vertical-align: top;
`;

const FacultyName = styled.span`
  font-weight: 500;
  color: rgba(4, 103, 112, 0.8);
`;

const TitleCell = styled.div`
  max-width: 300px;
  word-wrap: break-word;
  line-height: 1.4;
`;

const EntryTypeBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusText = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: 500;
  text-transform: capitalize;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(4, 103, 112, 0.2);
  border-top: 3px solid rgba(4, 103, 112, 0.8);
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
  font-size: 1rem;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
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
  gap: 1rem;
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