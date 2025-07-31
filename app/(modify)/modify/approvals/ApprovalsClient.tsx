"use client";

import React from "react";
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

  // Process the data to add entry_type and title fields (same as original logic)
  const processedData = { ...pending_data };

  // Add entry_type and title to conferences
  for (const conf of processedData.pending_conferences) {
    conf["entry_type"] = "Conference";
    conf["title"] = conf["paper_title"];
  }

  // Add entry_type and title to journals
  for (const jour of processedData.pending_journal) {
    jour["entry_type"] = "Journal";
    jour["title"] = jour["paper_title"];
  }

  // Add entry_type to workshops (title already exists)
  for (const workshop of processedData.pending_workshop) {
    workshop["entry_type"] = "Workshop";
  }

  // Add entry_type and title to patents
  for (const patent of processedData.pending_patent) {
    patent["entry_type"] = "Patent";
    patent["title"] = patent["patent_name"];
  }

  const handleApprove = async (data: any) => {
    try {
      const result = await approvalApi.approveEntry(data);
      if (result.error) {
        throw new Error(result.error);
      }
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      console.error('Error approving entry:', error);
      alert('Failed to approve entry. Please try again.');
    }
  };

  const handleReject = async (data: any, reason: string) => {
    try {
      const result = await approvalApi.rejectEntry(data, reason);
      if (result.error) {
        throw new Error(result.error);
      }
      router.refresh(); // Refresh to get updated data
    } catch (error) {
      console.error('Error rejecting entry:', error);
      alert('Failed to reject entry. Please try again.');
    }
  };

  return (
    <ApprovalsWrapper
      pendingData={processedData}
      userData={userData}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}