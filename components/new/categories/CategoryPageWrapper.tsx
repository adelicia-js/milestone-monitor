"use client";

import React, { useState } from "react";
import styled from "styled-components";
import CategoryHeader from "./CategoryHeader";
import CategoryGrid from "./CategoryGrid";
import CategoryModal from "./CategoryModal";

interface FormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "file" | "number";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface CategoryPageWrapperProps {
  title: string;
  data: any[];
  fields: Array<{
    key: string;
    label: string;
    type?: "text" | "date" | "status" | "badge";
  }>;
  formFields: FormField[];
  onAddNew: (data: any) => void;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function CategoryPageWrapper({
  title,
  data,
  fields,
  formFields,
  onAddNew,
  onEdit,
  onDelete,
  emptyMessage,
  isLoading = false,
}: CategoryPageWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (data: any) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData: any) => {
    if (editingData) {
      onEdit?.(formData);
    } else {
      onAddNew(formData);
    }
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  return (
    <Layout>
      <Container>
        <CategoryHeader title={title} onAddNew={handleAddNew} />
        <ContentWrapper>
          <CategoryGrid
            data={data}
            fields={fields}
            onEdit={onEdit ? handleEdit : undefined}
            onDelete={onDelete}
            emptyMessage={emptyMessage}
          />
        </ContentWrapper>
      </Container>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        title={
          editingData
            ? `Edit ${title.slice(0, -1)}`
            : `Add New ${title.slice(0, -1)}`
        }
        fields={formFields}
        initialData={editingData || {}}
        isLoading={isLoading}
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
`;

const ContentWrapper = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;
