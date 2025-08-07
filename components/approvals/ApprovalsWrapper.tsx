"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { GenericHeader } from "@/components/ui/GenericStyles";
import {
  Users,
  BookOpen,
  Lightbulb,
  Briefcase,
  LayoutGridIcon,
} from "lucide-react";
import ApprovalsTable from "./ApprovalsTable";
import ApprovalModal from "./ApprovalModal";
import { ApprovalEntry, Faculty } from "@/lib/types";
import { PendingData } from "@/app/(modify)/modify/approvals/types";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ApprovalsWrapperProps {
  pendingData: PendingData;
  userData: Faculty;
  onApprove: (data: ApprovalEntry) => Promise<void>;
  onReject: (data: ApprovalEntry) => Promise<void>;
  success?: string | null;
  error?: string | null;
  onClearMessages?: () => void;
  loading?: boolean;
  processingEntry?: string | null;
  processingAction?: 'approve' | 'reject' | null;
  tableLoading?: boolean;
}

type TabType = "all" | "conferences" | "journals" | "patents" | "workshops";

interface TabConfig {
  key: TabType;
  label: string;
  icon: React.ReactNode;
  count: number;
  data: ApprovalEntry[];
}

export default function ApprovalsWrapper({
  pendingData,
  userData: _, // eslint-disable-line @typescript-eslint/no-unused-vars
  onApprove,
  onReject,
  success,
  error,
  onClearMessages,
  loading,
  processingEntry,
  processingAction,
  tableLoading,
}: ApprovalsWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabType>("conferences");
  const [selectedEntry, setSelectedEntry] = useState<ApprovalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine all data for the "All" tab
  const allData = [
    ...(pendingData.pending_conferences || []),
    ...(pendingData.pending_journal || []),
    ...(pendingData.pending_patent || []),
    ...(pendingData.pending_workshop || []),
  ];

  const tabs: TabConfig[] = [
    {
      key: "conferences",
      label: "Conferences",
      icon: <Users size={16} />,
      count: pendingData.pending_conferences?.length || 0,
      data: (pendingData.pending_conferences || []) as unknown as ApprovalEntry[],
    },
    {
      key: "journals",
      label: "Journals",
      icon: <BookOpen size={16} />,
      count: pendingData.pending_journal?.length || 0,
      data: (pendingData.pending_journal || []) as unknown as ApprovalEntry[],
    },
    {
      key: "patents",
      label: "Patents",
      icon: <Lightbulb size={16} />,
      count: pendingData.pending_patent?.length || 0,
      data: (pendingData.pending_patent || []) as unknown as ApprovalEntry[],
    },
    {
      key: "workshops",
      label: "Workshops",
      icon: <Briefcase size={16} />,
      count: pendingData.pending_workshop?.length || 0,
      data: (pendingData.pending_workshop || []) as unknown as ApprovalEntry[],
    },
    {
      key: "all",
      label: "All",
      icon: <LayoutGridIcon size={16} />,
      count: allData.length,
      data: allData as unknown as ApprovalEntry[],
    },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab);
  const totalPending = tabs
    .filter((tab) => tab.label !== "All")
    .reduce((sum, tab) => sum + tab.count, 0);

  const handleViewDetails = (entry: ApprovalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleApprove = async (entry: ApprovalEntry) => {
    await onApprove(entry);
    // Only close modal after operation completes
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleReject = async (entry: ApprovalEntry) => {
    await onReject(entry);
    // Only close modal after operation completes
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <>
      <MobileAdvisory />
      <Layout>
      <Container>
        <HeaderWrapper>
          <HeaderText>Record Approvals</HeaderText>
          <StatsBadge>Total Pending: {totalPending}</StatsBadge>
        </HeaderWrapper>

        {/* Notification Messages */}
        {error && (
          <MessageCard variant="error">
            <MessageIcon>
              <AlertCircle size={18} />
            </MessageIcon>
            <MessageText>{error}</MessageText>
            {onClearMessages && (
              <CloseButton onClick={onClearMessages}>
                <X size={16} />
              </CloseButton>
            )}
          </MessageCard>
        )}

        {success && (
          <MessageCard variant="success">
            <MessageIcon>
              <CheckCircle size={18} />
            </MessageIcon>
            <MessageText>{success}</MessageText>
            {onClearMessages && (
              <CloseButton onClick={onClearMessages}>
                <X size={16} />
              </CloseButton>
            )}
          </MessageCard>
        )}

        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              <TabIcon>{tab.icon}</TabIcon>
              <TabLabel>{tab.label}</TabLabel>
              {tab.count > 0 && <TabBadge>{tab.count}</TabBadge>}
            </Tab>
          ))}
        </TabsContainer>

        <ContentWrapper>
          <ApprovalsTable
            data={activeTabData?.data || []}
            category={activeTab}
            onViewDetails={handleViewDetails}
            emptyMessage={
              activeTab === "all"
                ? "No pending entries found"
                : `No pending ${activeTab} found`
            }
            loading={tableLoading}
          />
        </ContentWrapper>
      </Container>

      <ApprovalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEntry(null);
        }}
        entry={selectedEntry}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={loading}
        processingEntry={processingEntry}
        processingAction={processingAction}
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
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    padding: 2rem;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const HeaderWrapper = styled.div`
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  
  @media (max-width: 1024px) {
    gap: 0.75rem;
    top: 1rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    top: 0.75rem;
  }
`;

const HeaderText = styled(GenericHeader)`
  z-index: 20;
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
  
  @media (max-width: 1024px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const StatsBadge = styled.div`
  padding: 0.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(4, 103, 112, 0.1),
    rgba(6, 95, 70, 0.1)
  );
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
`;

const TabsContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid rgba(56, 68, 68, 0.1);
  padding-bottom: 0.5rem;
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem 0.75rem 0 0;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.5s ease, color 0.5s ease;
  white-space: nowrap;
  position: relative;

  ${(props) =>
    props.active
      ? `
    background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
    color: rgba(4, 103, 112, 0.9);
    border-bottom: 3px solid rgba(4, 103, 112, 0.8);
  `
      : `
    background: rgba(255, 255, 255, 0.5);
    color: rgba(107, 114, 128, 0.8);
    
    &:hover {
      background: rgba(4, 103, 112, 0.05);
      color: rgba(4, 103, 112, 0.7);
    }
  `}
`;

const TabIcon = styled.span`
  display: flex;
  align-items: center;
`;

const TabLabel = styled.span`
  font-size: clamp(0.8rem, 0.6222rem + 0.2778vw, 0.9rem);
`;

const TabBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  background: rgba(4, 103, 112, 0.8);
  color: white;
  border-radius: 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const MessageCard = styled.div<{ variant: "success" | "error" }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid;
  margin-top: 1rem;
  margin-bottom: 0.5rem;

  ${(props) =>
    props.variant === "success" &&
    `
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
    color: rgba(22, 163, 74, 0.9);
  `}

  ${(props) =>
    props.variant === "error" &&
    `
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: rgba(220, 38, 38, 0.9);
  `}

  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MessageText = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;
