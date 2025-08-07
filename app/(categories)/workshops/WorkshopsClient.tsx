"use client";

import React from "react";
import CategoryPageWrapper from "@/components/categories/CategoryPageWrapper";
import { workshopApi } from "@/lib/api";
import { Workshop, Faculty, WorkshopFormData } from "@/lib/types";
import toast from 'react-hot-toast';

interface WorkshopsClientProps {
  data: Workshop[];
  facultyData: Faculty;
}

export default function WorkshopsClient({ data, facultyData }: WorkshopsClientProps) {
  const displayFields = [
    { key: 'title', label: 'Workshop Title', type: 'text' as const },
    { key: 'organized_by', label: 'Organized By', type: 'text' as const },
    { key: 'date', label: 'Date', type: 'date' as const },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'number_of_days', label: 'Duration (Days)', type: 'text' as const },
    { key: 'is_verified', label: 'Approval Status', type: 'status' as const },
  ];

  const formFields = [
    {
      key: 'title',
      label: 'Workshop Title',
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

  const handleAddNew = async (formData: WorkshopFormData) => {
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
      toast.error('Failed to add workshop. Please try again.');
    }
  };

  const handleEdit = async (formData: Workshop) => {
    try {
      const updates = {
        title: formData.title,
        date: formData.date,
        type: formData.type,
        number_of_days: formData.number_of_days,
        organized_by: formData.organized_by,
        is_verified: 'PENDING' as const
      };
      
      if (!formData.id) {
        throw new Error('Workshop ID is required for updates');
      }
      const result = await workshopApi.updateWorkshop(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating workshop:', error);
      toast.error('Failed to update workshop. Please try again.');
    }
  };

  const handleDelete = async (item: Workshop) => {
    try {
      if (!item.id) {
        throw new Error('Workshop ID is required for deletion');
      }
      const result = await workshopApi.deleteWorkshop(item.id);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      toast.error('Failed to delete workshop. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Your Workshops"
      data={data}
      fields={displayFields}
      formFields={formFields}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      onDelete={handleDelete}
      emptyMessage="No workshops found. Start by adding your first workshop or training program!"
    />
  );
}