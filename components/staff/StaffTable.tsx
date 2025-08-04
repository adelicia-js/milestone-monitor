"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Faculty } from "@/lib/types";
import { Edit, Trash2, Crown, User, PencilRulerIcon } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface StaffTableProps {
  staffList: Faculty[];
  onEdit: (staff: Faculty) => void;
  onDelete: (staffId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function StaffTable({
  staffList,
  onEdit,
  onDelete,
  loading,
  error
}: StaffTableProps) {
  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'hod':
        return <Crown size={16} color="#d97706" style={{ marginBottom: '1%' }}/>;
      case 'editor':
        return <PencilRulerIcon size={16} color="#059669" style={{ marginBottom: '1%' }}/>;
      default:
        return <User size={18} color="#6b7280" style={{ marginBottom: '1%' }}/>;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'hod':
        return '#d97706';
      case 'editor':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <TableCard>
        <LoadingContainer>
          <Loader customHeight="h-fit"/>
          <LoadingText>Loading staff data...</LoadingText>
        </LoadingContainer>
      </TableCard>
    );
  }

  if (error) {
    return (
      <TableCard>
        <ErrorState>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorMessage>Error loading staff: {error}</ErrorMessage>
        </ErrorState>
      </TableCard>
    );
  }

  if (!staffList || staffList.length === 0) {
    return (
      <TableCard>
        <EmptyState>
          <EmptyIcon>👥</EmptyIcon>
          <EmptyMessage>No staff members found</EmptyMessage>
          <EmptySubtext>Add your first staff member using the &quot;Add Staff&quot; button above.</EmptySubtext>
        </EmptyState>
      </TableCard>
    );
  }

  return (
    <TableCard>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Faculty ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Phone</TableHeaderCell>
              <TableHeaderCell>Department</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff) => (
              <TableRow key={staff.faculty_id}>
                <TableCell>
                  <FacultyId>{staff.faculty_id}</FacultyId>
                </TableCell>
                <TableCell>
                  <StaffName>{staff.faculty_name}</StaffName>
                </TableCell>
                <TableCell>
                  <EmailText>{staff.faculty_email}</EmailText>
                </TableCell>
                <TableCell>
                  {staff.faculty_phone || 'N/A'}
                </TableCell>
                <TableCell>
                  <DepartmentBadge>{staff.faculty_department}</DepartmentBadge>
                </TableCell>
                <TableCell>
                  <RoleWrapper>
                    {getRoleIcon(staff.faculty_role)}
                    <RoleText color={getRoleColor(staff.faculty_role)}>
                      {staff.faculty_role?.toUpperCase()}
                    </RoleText>
                  </RoleWrapper>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton 
                      onClick={() => onEdit(staff)} 
                      variant="edit"
                      title="Edit Staff"
                    >
                      <Edit size={16} />
                    </ActionButton>
                    <ActionButton 
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${staff.faculty_name}?`)) {
                          onDelete(staff.faculty_id);
                        }
                      }} 
                      variant="delete"
                      title="Delete Staff"
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </ActionButtons>
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
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
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
  vertical-align: middle;
`;

const FacultyId = styled.span`
  font-weight: 600;
  color: rgba(4, 103, 112, 0.8);
  font-family: monospace;
`;

const StaffName = styled.span`
  font-weight: 500;
  color: rgba(4, 103, 112, 0.9);
`;

const EmailText = styled.span`
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.85rem;
`;

const DepartmentBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
`;

const RoleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoleText = styled.span<{ color: string }>`
  color: ${props => props.color};
  font-weight: 600;
  font-size: 0.85rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'edit' && `
   background: linear-gradient(135deg, rgba(122, 194, 226, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}
  
  ${props => props.variant === 'delete' && `
    background: linear-gradient(135deg, rgba(228, 150, 148, 0.8), rgba(220, 38, 38, 0.8));
    color: white;
    
    &:hover {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(248, 113, 113, 0.95), rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 1));
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:active {
    transform: scale(0.95);
  }
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