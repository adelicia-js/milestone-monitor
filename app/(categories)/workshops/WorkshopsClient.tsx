"use client";

import React from "react";
import CategoryPageWrapper from "@/components/new/categories/CategoryPageWrapper";
import { workshopApi } from "@/lib/api";

interface WorkshopsClientProps {
  data: any[];
  facultyData: any;
}

export default function WorkshopsClient({ data, facultyData }: WorkshopsClientProps) {
  const displayFields = [
    { key: 'title', label: 'Workshop/Course Title', type: 'text' as const },
    { key: 'organized_by', label: 'Organized By', type: 'text' as const },
    { key: 'date', label: 'Date', type: 'date' as const },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'number_of_days', label: 'Duration (Days)', type: 'text' as const },
    { key: 'is_verified', label: 'Approval Status', type: 'status' as const },
  ];

  const formFields = [
    {
      key: 'title',
      label: 'Workshop/Course Title',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the title of the workshop or course'
    },
    {
      key: 'organized_by',
      label: 'Organized By',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the organizing institution/body'
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date' as const,
      required: true
    },
    {
      key: 'number_of_days',
      label: 'Duration (Days)',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter duration in days'
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'FDP', label: 'Faculty Development Program (FDP)' },
        { value: 'Workshop', label: 'Workshop' },
        { value: 'Refresher Course', label: 'Refresher Course' },
        { value: 'Training Program', label: 'Training Program' },
        { value: 'Seminar', label: 'Seminar' }
      ]
    }
  ];

  const handleAddNew = async (formData: any) => {
    try {
      const workshopData = {
        faculty_id: facultyData.faculty_id,
        title: formData.title,
        date: formData.date,
        type: formData.type,
        number_of_days: formData.number_of_days,
        organized_by: formData.organized_by
      };
      
      const result = await workshopApi.addWorkshop(workshopData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error adding workshop:', error);
      alert('Failed to add workshop. Please try again.');
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const updates = {
        title: formData.title,
        date: formData.date,
        type: formData.type,
        number_of_days: formData.number_of_days,
        organized_by: formData.organized_by
      };
      
      const result = await workshopApi.updateWorkshop(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating workshop:', error);
      alert('Failed to update workshop. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Workshops"
      data={data}
      fields={displayFields}
      formFields={formFields}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      emptyMessage="No workshops found. Start by adding your first workshop or training program!"
    />
  );
}