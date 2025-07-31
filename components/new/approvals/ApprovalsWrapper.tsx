"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import { CheckCircle, Users, BookOpen, Lightbulb, Briefcase } from "lucide-react";
import ApprovalsTable from "./ApprovalsTable";
import ApprovalModal from "./ApprovalModal";
import {
  PendingConference,
  PendingJournal,
  PendingWorkshop,
  PendingPatent,
  PendingData,
} from "@/app/(modify)/modify/approvals/types";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ApprovalsWrapperProps {
  pendingData: PendingData;
  userData: any;
  onApprove: (data: any) => void;
  onReject: (data: any, reason: string) => void;
}

type TabType = 'conferences' | 'journals' | 'patents' | 'workshops';

interface TabConfig {
  key: TabType;
  label: string;
  icon: React.ReactNode;
  count: number;
  data: any[];
}

export default function ApprovalsWrapper({
  pendingData,
  userData,
  onApprove,
  onReject
}: ApprovalsWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabType>('conferences');
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs: TabConfig[] = [
    {
      key: 'conferences',
      label: 'Conferences',
      icon: <Users size={16} />,
      count: pendingData.pending_conferences?.length || 0,
      data: pendingData.pending_conferences || []
    },
    {
      key: 'journals',
      label: 'Journals',
      icon: <BookOpen size={16} />,
      count: pendingData.pending_journal?.length || 0,
      data: pendingData.pending_journal || []
    },
    {
      key: 'patents',
      label: 'Patents',
      icon: <Lightbulb size={16} />,
      count: pendingData.pending_patent?.length || 0,
      data: pendingData.pending_patent || []
    },
    {
      key: 'workshops',
      label: 'Workshops',
      icon: <Briefcase size={16} />,
      count: pendingData.pending_workshop?.length || 0,
      data: pendingData.pending_workshop || []
    }
  ];

  const activeTabData = tabs.find(tab => tab.key === activeTab);
  const totalPending = tabs.reduce((sum, tab) => sum + tab.count, 0);

  const handleViewDetails = (entry: any) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleApprove = (entry: any) => {
    onApprove(entry);
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  const handleReject = (entry: any, reason: string) => {
    onReject(entry, reason);
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <Layout>
      <Container>
        <Header>
          <HeaderContent>
            <GenericHeaderContainer>
              <GenericHeader>
                <CheckCircle size={20} />
                Approvals
              </GenericHeader>
            </GenericHeaderContainer>
            <StatsBadge>
              Total Pending: {totalPending}
            </StatsBadge>
          </HeaderContent>
        </Header>

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
            emptyMessage={`No pending ${activeTab} found`}
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
      />
    </Layout>
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
`;

const Container = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatsBadge = styled.div`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
  color: rgba(4, 103, 112, 0.9);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 500;
  width: fit-content;
`;

const TabsContainer = styled.div`
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
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;

  ${props => props.active ? `
    background: linear-gradient(135deg, rgba(4, 103, 112, 0.1), rgba(6, 95, 70, 0.1));
    color: rgba(4, 103, 112, 0.9);
    border-bottom: 3px solid rgba(4, 103, 112, 0.8);
  ` : `
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
  font-size: 0.9rem;
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