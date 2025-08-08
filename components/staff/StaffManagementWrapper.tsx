"use client";

import React, { useState } from "react";
import styled from "styled-components";
import StaffTable from "./StaffTable";
import StaffModal from "./StaffModal";
import DeleteModal from "@/components/categories/DeleteModal";
import { Faculty } from "@/lib/types";
import { GenericHeader } from "@/components/ui/GenericStyles";
import { Inter } from "next/font/google";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface StaffManagementWrapperProps {
  staffList: Faculty[];
  currentUserDept: string;
  onAddStaff: (staffData: Faculty & { password?: string }) => void;
  onEditStaff: (staffData: Faculty & { password?: string }) => void;
  onDeleteStaff: (staffId: string) => void;
  loading?: boolean;
  error?: string | null;
  currentUser?: Faculty;
}

export default function StaffManagementWrapper({
  staffList,
  currentUserDept,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  loading,
  error,
  currentUser,
}: StaffManagementWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Faculty | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStaff, setDeletingStaff] = useState<Faculty | null>(null);

  const handleEdit = (staff: Faculty) => {
    setEditingStaff(staff);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleModalSubmit = (staffData: Faculty & { password?: string }) => {
    if (modalMode === "edit") {
      onEditStaff(staffData);
    } else {
      onAddStaff(staffData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleDelete = (staffId: string) => {
    const staff = staffList.find((s) => s.faculty_id === staffId);
    if (staff) {
      setDeletingStaff(staff);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingStaff) {
      onDeleteStaff(deletingStaff.faculty_id);
    }
    setIsDeleteModalOpen(false);
    setDeletingStaff(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingStaff(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  return (
    <>
      <MobileAdvisory />
      <Layout>
        <Container>
          <HeaderWrapper>
            <HeaderText>Staff Management</HeaderText>
            <HeaderDesc>
              Manage your staff members, add new staff, or edit existing ones.
            </HeaderDesc>
          </HeaderWrapper>

          <StaffTable
            staffList={staffList}
            onAddNew={() => {
              setModalMode("add");
              setEditingStaff(null);
              setIsModalOpen(true);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            error={error}
            currentUser={currentUser}
          />
        </Container>

        <StaffModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          mode={modalMode}
          initialData={editingStaff}
          defaultDepartment={currentUserDept}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Staff Member"
          message="Are you sure you want to delete this staff member?"
          itemName={deletingStaff?.faculty_name}
          isLoading={loading}
        />
      </Layout>
    </>
  );
}

const Layout = styled.main`
  z-index: 0;
  position: absolute;
  height: 100vh;
  width: calc(100vw - 8vw);
  left: 8vw;
  padding: 1rem;
  background-color: rgba(140, 242, 233, 0.35);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0.5rem;
  }
`;

const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1.5rem;
`;

const HeaderWrapper = styled.div`
  font-family: ${bodyText.style.fontFamily};
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
`;

const HeaderText = styled(GenericHeader)`
  z-index: 20;
  font-size: 1.5rem;
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
`;

const HeaderDesc = styled.p`
  margin-top: -0.25rem;
  color: rgba(4, 103, 112, 0.99);
  font-size: 1rem;
  font-weight: 300;
`;
