"use client";

import React, { useState } from "react";
import ApprovalsWrapper from "@/components/approvals/ApprovalsWrapper";
import { PendingData } from "@/app/(modify)/modify/approvals/types";
import { approvalApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ApprovalEntry, Faculty } from "@/lib/types";
import toast from "react-hot-toast";

interface ApprovalsClientProps {
  pending_data: PendingData;
  userData: Faculty;
}

export default function ApprovalsClient({
  pending_data,
  userData,
}: ApprovalsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [processingEntry, setProcessingEntry] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [tableLoading, setTableLoading] = useState(false);

  // Process the data to add entry_type and title fields (same as original logic)
  const processedData = { ...pending_data };

  // Add entry_type and title to conferences
  for (const conf of processedData.pending_conferences) {
    Object.assign(conf, {
      entry_type: "Conference" as const,
      title: conf.paper_title,
      date: conf.conf_date,
    });
  }

  // Add entry_type and title to journals
  for (const jour of processedData.pending_journal) {
    Object.assign(jour, {
      entry_type: "Journal" as const,
      title: jour.paper_title,
      date: jour.month_and_year_of_publication,
    });
  }

  // Add entry_type to workshops (title already exists)
  for (const workshop of processedData.pending_workshop) {
    Object.assign(workshop, {
      entry_type: "Workshop" as const,
      date: workshop.date,
    });
  }

  // Add entry_type and title to patents
  for (const patent of processedData.pending_patent) {
    Object.assign(patent, {
      entry_type: "Patent" as const,
      title: patent.patent_name,
      date: patent.patent_date,
    });
  }

  const handleApprove = async (data: ApprovalEntry) => {
    if (loading) return; // Prevent multiple clicks

    const entryKey = `${data.entry_type}-${data.id}`;
    setLoading(true);
    setTableLoading(true);
    setProcessingEntry(entryKey);
    setProcessingAction("approve");

    try {
      const result = await approvalApi.approveEntry(data);
      if (result.error) {
        throw new Error(result.error);
      }

      setTableLoading(true);
      toast.success(`${data.entry_type} entry approved successfully!`);
      router.refresh(); // Refresh to get updated data
      // Note: tableLoading will be reset when component re-renders with new data
    } catch (error) {
      console.error("Error approving entry:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to approve entry. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTableLoading(false);
      setProcessingEntry(null);
      setProcessingAction(null);
      // tableLoading will be handled by component re-render
    }
  };

  const handleReject = async (data: ApprovalEntry) => {
    if (loading) return; // Prevent multiple clicks

    const entryKey = `${data.entry_type}-${data.id}`;
    setLoading(true);
    setTableLoading(true);
    setProcessingEntry(entryKey);
    setProcessingAction("reject");

    try {
      const result = await approvalApi.rejectEntry(data);
      if (result.error) {
        throw new Error(result.error);
      }

      setTableLoading(true);
      toast.success(`${data.entry_type} entry rejected successfully.`);
      router.refresh(); // Refresh to get updated data
      // Note: tableLoading will be reset when component re-renders with new data
    } catch (error) {
      console.error("Error rejecting entry:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reject entry. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setTableLoading(false);
      setProcessingEntry(null);
      setProcessingAction(null);
      // tableLoading will be handled by component re-render
    }
  };

  return (
    <ApprovalsWrapper
      pendingData={processedData}
      userData={userData}
      onApprove={handleApprove}
      onReject={handleReject}
      loading={loading}
      processingEntry={processingEntry}
      processingAction={processingAction}
      tableLoading={tableLoading}
    />
  );
}
