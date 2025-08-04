"use client";

import React, { useState } from "react";
import ApprovalsWrapper from "@/components/new/approvals/ApprovalsWrapper";
import { PendingData } from "@/app/(modify)/modify/approvals/types";
import { approvalApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ApprovalsClientProps {
  pending_data: PendingData;
  userData: any;
}

export default function ApprovalsClient({
  pending_data,
  userData
}: ApprovalsClientProps) {
  const router = useRouter();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  // Process the data to add entry_type and title fields (same as original logic)
  const processedData = { ...pending_data };

  // Add entry_type and title to conferences
  for (const conf of processedData.pending_conferences) {
    (conf as any)["entry_type"] = "Conference";
    (conf as any)["title"] = (conf as any)["paper_title"];
  }

  // Add entry_type and title to journals
  for (const jour of processedData.pending_journal) {
    (jour as any)["entry_type"] = "Journal";
    (jour as any)["title"] = (jour as any)["paper_title"];
  }

  // Add entry_type to workshops (title already exists)
  for (const workshop of processedData.pending_workshop) {
    (workshop as any)["entry_type"] = "Workshop";
  }

  // Add entry_type and title to patents
  for (const patent of processedData.pending_patent) {
    (patent as any)["entry_type"] = "Patent";
    (patent as any)["title"] = (patent as any)["patent_name"];
  }

  const handleApprove = async (data: any) => {
    clearMessages();
    try {
      const result = await approvalApi.approveEntry(data);
      if (result.error) {
        throw new Error(result.error);
      }
      setSuccess(`${data.entry_type} entry approved successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      console.error('Error approving entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve entry. Please try again.';
      setError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleReject = async (data: any) => {
    clearMessages();
    try {
      const result = await approvalApi.rejectEntry(data);
      if (result.error) {
        throw new Error(result.error);
      }
      setSuccess(`${data.entry_type} entry rejected successfully.`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      console.error('Error rejecting entry:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject entry. Please try again.';
      setError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <ApprovalsWrapper
      pendingData={processedData}
      userData={userData}
      onApprove={handleApprove}
      onReject={handleReject}
      success={success}
      error={error}
      onClearMessages={clearMessages}
    />
  );
}