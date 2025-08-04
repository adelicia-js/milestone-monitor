"use client";

import React, { useState } from "react";
import styled from "styled-components";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import { Faculty } from "@/lib/types";
import { GenericHeader } from "@/components/ui/GenericStyles";
import { Plus } from "lucide-react";
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
  error,
}: StaffManagementWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Faculty | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const handleAddNew = () => {
    setEditingStaff(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEdit = (staff: Faculty) => {
    setEditingStaff(staff);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleModalSubmit = (staffData: any) => {
    if (modalMode === "edit") {
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
        <HeaderWrapper>
          <HeaderText>Staff Management</HeaderText>
          <AddButton onClick={handleAddNew}>
            <Plus size={18} />
            Add Staff
          </AddButton>
        </HeaderWrapper>

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

const HeaderWrapper = styled.div`
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: fit-content;
`;

const HeaderText = styled(GenericHeader)`
  z-index: 20;
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
`;

const AddButton = styled.button`
  z-index: 20;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    120deg,
    rgba(0, 131, 143, 0.65),
    rgba(179, 217, 217, 0.7)
  );
  border: 0.1px solid rgba(0, 131, 143, 0.27);
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
    background: linear-gradient(
      135deg,
      rgba(0, 131, 143, 0.2),
      rgba(0, 131, 143, 1)
    );
  }

  &:active {
    transform: translateY(0);
  }
`;

const TableWrapper = styled.div`
  margin-top: 1.5rem;
  flex: 1;
  overflow: hidden;
`;
