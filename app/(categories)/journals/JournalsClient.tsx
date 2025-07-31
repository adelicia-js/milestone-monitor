"use client";

import React from "react";
import CategoryPageWrapper from "@/components/new/categories/CategoryPageWrapper";
import { journalApi } from "@/lib/api";

interface JournalsClientProps {
  data: any[];
  facultyData: any;
}

export default function JournalsClient({ data, facultyData }: JournalsClientProps) {
  const displayFields = [
    { key: 'paper_title', label: 'Paper Title', type: 'text' as const },
    { key: 'journal_name', label: 'Journal Name', type: 'text' as const },
    { key: 'month_and_year_of_publication', label: 'Publication Date', type: 'text' as const },
    { key: 'issn_number', label: 'ISSN', type: 'text' as const },
    { key: 'indexed_in', label: 'Indexing', type: 'badge' as const },
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
      key: 'journal_name',
      label: 'Journal Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the name of the journal'
    },
    {
      key: 'month_and_year_of_publication',
      label: 'Publication Date',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., January 2024'
    },
    {
      key: 'issn_number',
      label: 'ISSN Number',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter the ISSN number'
    },
    {
      key: 'indexed_in',
      label: 'Indexing',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'SCI', label: 'SCI' },
        { value: 'SCIE', label: 'SCIE' },
        { value: 'Scopus', label: 'Scopus' },
        { value: 'UGC Care', label: 'UGC Care' },
        { value: 'Other', label: 'Other' }
      ]
    },
    {
      key: 'link',
      label: 'Publication Link',
      type: 'text' as const,
      placeholder: 'Enter publication URL (optional)'
    },
    {
      key: 'upload_image',
      label: 'Publication Certificate',
      type: 'file' as const,
      required: false
    }
  ];

  const handleAddNew = async (formData: any) => {
    try {
      const journalData = {
        faculty_id: facultyData.faculty_id,
        paper_title: formData.paper_title,
        journal_name: formData.journal_name,
        month_and_year_of_publication: formData.month_and_year_of_publication,
        issn_number: formData.issn_number,
        indexed_in: formData.indexed_in,
        link: formData.link,
        files: formData.files
      };
      
      const result = await journalApi.addJournal(journalData);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error adding journal:', error);
      alert('Failed to add journal publication. Please try again.');
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const updates = {
        paper_title: formData.paper_title,
        journal_name: formData.journal_name,
        month_and_year_of_publication: formData.month_and_year_of_publication,
        issn_number: formData.issn_number,
        indexed_in: formData.indexed_in,
        link: formData.link,
      };
      
      const result = await journalApi.updateJournal(formData.id, updates);
      if (result.error) {
        throw new Error(result.error);
      }
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating journal:', error);
      alert('Failed to update journal publication. Please try again.');
    }
  };

  return (
    <CategoryPageWrapper
      title="Journals"
      data={data}
      fields={displayFields}
      formFields={formFields}
      onAddNew={handleAddNew}
      onEdit={handleEdit}
      emptyMessage="No journal publications found. Start by adding your first publication!"
    />
  );
}