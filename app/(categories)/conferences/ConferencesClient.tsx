"use client";

import React from "react";
import CategoryPageWrapper from "@/components/new/categories/CategoryPageWrapper";
import { conferenceApi } from "@/lib/api";

interface ConferencesClientProps {
  data: any[];
  facultyData: any;
}

export default function ConferencesClient({ data, facultyData }: ConferencesClientProps) {
  const displayFields = [
    { key: 'paper_title', label: 'Paper Title', type: 'text' as const },
    { key: 'conf_name', label: 'Conference Name', type: 'text' as const },
    { key: 'conf_date', label: 'Date', type: 'date' as const },
    { key: 'type', label: 'Conference Type', type: 'badge' as const },
    { key: 'is_verified', label: 'Approval Status', type: 'status' as const },
  ];

  const formFields = [
    {
      key: 'paper_title',
      label: 'Paper Title',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the title of your paper'
    },
    {
      key: 'conf_name',
      label: 'Conference Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the name of the conference'
    },
    {
      key: 'conf_date',
      label: 'Conference Date',
      type: 'date' as const,
      required: true
    },
    {
      key: 'type',
      label: 'Conference Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'International', label: 'International' },
        { value: 'National', label: 'National' },
        { value: 'Regional', label: 'Regional' },
        { value: 'State', label: 'State' }
      ]
    },
    {
      key: 'proceedings',
      label: 'Has Proceedings',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    },
    {
      key: 'proceeding_fp',
      label: 'Proceedings Link',
      type: 'text' as const,
      placeholder: 'Enter proceedings URL (optional)'
    },
    {
      key: 'certificate',
      label: 'Certificate',
      type: 'file' as const,
      required: false
    }
  ];

  const handleAddNew = async (formData: any) => {
    try {
      const conferenceData = {
        faculty_id: facultyData.faculty_id,
        paper_title: formData.paper_title,
        conf_name: formData.conf_name,
        conf_date: formData.conf_date,
        type: formData.type,
        proceedings: formData.proceedings === 'true',
        proceeding_fp: formData.proceeding_fp,
        files: formData.files
      };
      
      const result = await conferenceApi.addConference(conferenceData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error adding conference:', error);
      alert('Failed to add conference. Please try again.');
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const updates = {
        paper_title: formData.paper_title,
        conf_name: formData.conf_name,
        conf_date: formData.conf_date,
        type: formData.type,
        proceedings: formData.proceedings === 'true',
        proceeding_fp: formData.proceeding_fp,
        is_verified: 'PENDING' as 'PENDING',
      };
      
      const result = await conferenceApi.updateConference(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating conference:', error);
      alert('Failed to update conference. Please try again.');
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const result = await conferenceApi.deleteConference(item.id);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error deleting conference:', error);
      alert('Failed to delete conference. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Your Conferences"
      data={data}
      fields={displayFields}
      formFields={formFields}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      emptyMessage="No conferences found. Start by adding your first conference paper!"
    />
  );
}