"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Faculty } from "@/lib/types";
import { Edit, Trash2, Crown, User, PencilRulerIcon, Plus } from "lucide-react";
import Loader from "@/components/ui/Loader";
import { LoadingContainer, LoadingText } from "@/components/ui/GenericStyles";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface StaffTableProps {
  staffList: Faculty[];
  onAddNew?: () => void;
  onEdit: (staff: Faculty) => void;
  onDelete: (staffId: string) => void;
  loading?: boolean;
  error?: string | null;
  currentUser?: Faculty;
}

export default function StaffTable({
  staffList,
  onAddNew,
  onEdit,
  onDelete,
  loading,
  error,
  currentUser,
}: StaffTableProps) {
  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case "hod":
        return <Crown color="#d97706" style={{ marginBottom: "1%" }} />;
      case "editor":
        return (
          <PencilRulerIcon color="#059669" style={{ marginBottom: "1%" }} />
        );
      default:
        return <User color="#6b7280" style={{ marginBottom: "1%" }} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "hod":
        return "#d97706";
      case "editor":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <TableCard>
        <LoadingContainer>
          <Loader customHeight="h-fit" />
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
          <EmptySubtext>
            Add your first staff member using the &quot;Add Staff&quot; button
            above.
          </EmptySubtext>
        </EmptyState>
      </TableCard>
    );
  }

  return (
    <TableCard>
      <TableHeaderArea>
        <TableTitle>Staff Data</TableTitle>
        <AddButton onClick={onAddNew}>
          <Plus size={18} />
          Add Staff
        </AddButton>
      </TableHeaderArea>
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
                <TableCell>{staff.faculty_phone || "N/A"}</TableCell>
                <TableCell>
                  <DepartmentBadge>{staff.faculty_department}</DepartmentBadge>
                </TableCell>
                <TableCell>
                  <RoleWrapper>
                    <RoleIconWrapper>
                      {getRoleIcon(staff.faculty_role)}
                    </RoleIconWrapper>
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
                    {!(
                      currentUser &&
                      currentUser.faculty_id === staff.faculty_id &&
                      currentUser.faculty_role.toLowerCase() === "hod"
                    ) && (
                      <ActionButton
                        onClick={() => onDelete(staff.faculty_id)}
                        variant="delete"
                        title="Delete Staff"
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    )}
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
  margin-top: 2rem;
  background-color: rgba(244, 253, 252, 0.75);
  height: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;

  /* Custom scrollbar styling similar to other tables */
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
`;

const TableCell = styled.td`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  vertical-align: middle;
  font-size: clamp(0.75rem, 0.5278rem + 0.3472vw, 0.875rem);

  @media (min-width: 1024px) {
    padding: 0.75rem;
  }

  @media (min-width: 1280px) {
    padding: 1rem;
  }
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
`;

const DepartmentBadge = styled.span`
  display: inline-block;
  background: linear-gradient(
    135deg,
    rgba(4, 103, 112, 0.1),
    rgba(6, 95, 70, 0.1)
  );
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  font-weight: 500;

  @media (min-width: 1024px) {
    padding: 0.25rem 0.5rem;
  }

  @media (min-width: 1280px) {
    padding: 0.25rem 0.75rem;
  }
`;

const RoleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RoleIconWrapper = styled.span`
  & svg {
    @media (min-width: 1024px) {
      width: 1rem;
      height: 1rem;
    }

    @media (min-width: 1280px) {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
`;

const RoleText = styled.span<{ color: string }>`
  font-size: clamp(0.75rem, 0.5278rem + 0.3472vw, 0.875rem);
  color: ${(props) => props.color};
  font-weight: 600;
  font-size: 0.85rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant: "edit" | "delete" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) =>
    props.variant === "edit" &&
    `
   background: linear-gradient(135deg, rgba(122, 194, 226, 0.8), rgba(37, 99, 235, 0.8));
    color: white;
    
    &:hover {
      transform: scale(1.05);
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.95), rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 1));
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
  `}

  ${(props) =>
    props.variant === "delete" &&
    `
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

const TableHeaderArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
  background: linear-gradient(
    135deg,
    rgba(4, 103, 112, 0.05),
    rgba(6, 95, 70, 0.05)
  );

  @media (min-width: 1024px) {
    padding: 1rem;
  }

  @media (min-width: 1280px) {
    padding: 1.25rem 1.5rem;
  }
`;

const TableTitle = styled.h2`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;

  @media (max-width: 1024px) {
    font-size: 1.15rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.2),
    rgba(0, 131, 143, 1)
  );
  color: white;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 1024px) {
    padding: 0.6rem 1.2rem;
    gap: 0.4rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    gap: 0.3rem;
  }
`;
