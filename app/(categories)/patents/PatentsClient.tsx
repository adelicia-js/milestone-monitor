"use client";

import React from "react";
import CategoryPageWrapper from "@/components/new/categories/CategoryPageWrapper";
import { patentApi } from "@/lib/api";

interface PatentsClientProps {
  data: any[];
  facultyData: any;
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
    },
    {
      key: 'image',
      label: 'Patent Certificate',
      type: 'file' as const,
      required: false
    }
  ];

  const handleAddNew = async (formData: any) => {
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
      alert('Failed to add patent. Please try again.');
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const updates = {
        patent_name: formData.patent_name,
        patent_date: formData.patent_date,
        patent_type: formData.patent_type,
        application_no: formData.application_no,
        status: formData.status,
        patent_link: formData.patent_link,
        is_verified: 'PENDING',
      };
      
      const result = await patentApi.updatePatent(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating patent:', error);
      alert('Failed to update patent. Please try again.');
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const result = await patentApi.deletePatent(item.id);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error deleting patent:', error);
      alert('Failed to delete patent. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Your Patents"
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