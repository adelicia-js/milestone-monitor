"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import CategoryHeader from "./CategoryHeader";
import CategoryGrid from "./CategoryGrid";
import CategoryModal from "./CategoryModal";
import DeleteModal from "./DeleteModal";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

interface FormField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "file" | "number";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface CategoryPageWrapperProps<T, TForm = Omit<T, "id" | "is_verified">> {
  title: string;
  description: string;
  data: T[];
  fields: Array<{
    key: string;
    label: string;
    type?: "text" | "date" | "status" | "badge";
  }>;
  formFields: FormField[];
  onAddNew: (data: TForm) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function CategoryPageWrapper<
  T extends {
    id?: number;
    paper_title?: string;
    journal_name?: string;
    title?: string;
    patent_name?: string;
  },
  TForm = Omit<T, "id" | "is_verified">
>({
  title,
  description,
  data,
  fields,
  formFields,
  onAddNew,
  onEdit,
  onDelete,
  emptyMessage,
  isLoading = false,
}: CategoryPageWrapperProps<T, TForm>) {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<T | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);

  // Check for action=add query parameter and open modal
  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setEditingData(null);
      setIsModalOpen(true);
      // Clean up URL after opening modal
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  const handleAddNew = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (data: T) => {
    setEditingData(data);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData: TForm | T) => {
    if (editingData) {
      onEdit?.(formData as T);
    } else {
      onAddNew(formData as TForm);
    }
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleDelete = (data: T) => {
    setDeletingItem(data);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingItem && onDelete) {
      onDelete(deletingItem);
    }
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
  };

  return (
    <>
      <MobileAdvisory />
      <Layout>
        <Container>
          <CategoryHeader
            title={title}
            description={description}
          />
          <ContentWrapper>
            <CategoryGrid
              data={data}
              fields={fields}
              onAddNew={handleAddNew}
              onEdit={onEdit ? handleEdit : undefined}
              onDelete={onDelete ? handleDelete : undefined}
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
              : `Add New ${title.replace("Your ", "").slice(0, -1)}`
          }
          fields={formFields}
          initialData={editingData || {}}
          isLoading={isLoading}
        />

        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Item"
          message="Are you sure you want to delete this item?"
          itemName={
            deletingItem?.paper_title ||
            deletingItem?.journal_name ||
            deletingItem?.title ||
            deletingItem?.patent_name ||
            "this item"
          }
          isLoading={isLoading}
        />
      </Layout>
    </>
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
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0.75rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.section`
  margin-top: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
`;
