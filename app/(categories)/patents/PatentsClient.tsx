"use client";

import React from "react";
import CategoryPageWrapper from "@/components/categories/CategoryPageWrapper";
import { patentApi } from "@/lib/api";
import { Patent, Faculty, PatentFormData } from "@/lib/types";
import toast from 'react-hot-toast';

interface PatentsClientProps {
  data: Patent[];
  facultyData: Faculty;
}

export default function PatentsClient({ data, facultyData }: PatentsClientProps) {
  const displayFields = [
    { key: 'patent_name', label: 'Patent Title', type: 'text' as const },
    { key: 'application_no', label: 'Application Number', type: 'text' as const },
    { key: 'patent_date', label: 'Patent Date', type: 'date' as const },
    { key: 'status', label: 'Patent Status', type: 'badge' as const },
    { key: 'patent_type', label: 'Patent Type', type: 'badge' as const },
    { key: 'is_verified', label: 'Approval Status', type: 'status' as const },
  ];

  const formFields = [
    {
      key: 'patent_name',
      label: 'Patent Title',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the title of your patent'
    },
    {
      key: 'application_no',
      label: 'Application Number',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the application number'
    },
    {
      key: 'patent_date',
      label: 'Patent Date',
      type: 'date' as const,
      required: true
    },
    {
      key: 'status',
      label: 'Patent Status',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Filed', label: 'Filed' },
        { value: 'Published', label: 'Published' },
        { value: 'Granted', label: 'Granted' },
        { value: 'Rejected', label: 'Rejected' }
      ]
    },
    {
      key: 'patent_type',
      label: 'Patent Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'National', label: 'National' },
        { value: 'International', label: 'International' },
        { value: 'Provisional', label: 'Provisional' }
      ]
    },
    {
      key: 'patent_link',
      label: 'Patent Link',
      type: 'text' as const,
      placeholder: 'Enter patent URL (optional)'
    }
  ];

  const handleAddNew = async (formData: PatentFormData & { files?: { image?: File } }) => {
    try {
      const patentData = {
        faculty_id: facultyData.faculty_id,
        patent_name: formData.patent_name,
        patent_date: formData.patent_date,
        patent_type: formData.patent_type,
        application_no: formData.application_no,
        status: formData.status,
        patent_link: formData.patent_link,
        files: formData.files
      };
      
      const result = await patentApi.addPatent(patentData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error adding patent:', error);
      toast.error('Failed to add patent. Please try again.');
    }
  };

  const handleEdit = async (formData: Patent) => {
    try {
      const updates = {
        patent_name: formData.patent_name,
        patent_date: formData.patent_date,
        patent_type: formData.patent_type,
        application_no: formData.application_no,
        status: formData.status,
        patent_link: formData.patent_link,
        is_verified: 'PENDING' as const,
      };
      
      if (!formData.id) {
        throw new Error('Patent ID is required for updates');
      }
      const result = await patentApi.updatePatent(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating patent:', error);
      toast.error('Failed to update patent. Please try again.');
    }
  };

  const handleDelete = async (item: Patent) => {
    try {
      if (!item.id) {
        throw new Error('Patent ID is required for deletion');
      }
      const result = await patentApi.deletePatent(item.id);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error deleting patent:', error);
      toast.error('Failed to delete patent. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Innovation & Intellectual Property"
      description="Showcase your inventions, patent applications, and intellectual property contributions."
      data={data}
      fields={displayFields}
      formFields={formFields}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      emptyMessage="No patents found. Start by adding your first patent application!"
    />
  );
}