"use client";

import React, { useState } from "react";
import styled from "styled-components";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import { Faculty } from "@/lib/types";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import { Users, Plus } from "lucide-react";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface StaffManagementWrapperProps {
  staffList: Faculty[];
  currentUserDept: string;
  onAddStaff: (staffData: any) => void;
  onEditStaff: (staffData: any) => void;
  onDeleteStaff: (staffId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function StaffManagementWrapper({
  staffList,
  currentUserDept,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  loading,
  error
}: StaffManagementWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Faculty | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAddNew = () => {
    setEditingStaff(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (staff: Faculty) => {
    setEditingStaff(staff);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleModalSubmit = (staffData: any) => {
    if (modalMode === 'edit') {
      onEditStaff(staffData);
    } else {
      onAddStaff(staffData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderContent>
            <GenericHeaderContainer>
              <GenericHeader>
                <Users size={20} />
                Staff Management
              </GenericHeader>
            </GenericHeaderContainer>
            <DepartmentBadge>
              Department: {currentUserDept}
            </DepartmentBadge>
          </HeaderContent>
          <AddButton onClick={handleAddNew}>
            <Plus size={18} />
            Add Staff
          </AddButton>
        </Header>

        <TableWrapper>
          <StaffTable
            staffList={staffList}
            onEdit={handleEdit}
            onDelete={onDeleteStaff}
            loading={loading}
            error={error}
          />
        </TableWrapper>
      </Container>

      <StaffModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        mode={modalMode}
        initialData={editingStaff}
        defaultDepartment={currentUserDept}
      />
    </Layout>
  );
}

const Layout = styled.main`
  z-index: 0;
  position: absolute;
  height: 100vh;
  width: 92vw;
  left: 8vw;
  padding: 1rem;
  background-color: rgba(140, 242, 233, 0.35);
`;

const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DepartmentBadge = styled.div`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
`;

const AddButton = styled.button`
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
  overflow: hidden;
`;