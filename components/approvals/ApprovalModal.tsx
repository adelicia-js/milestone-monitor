"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {
  X,
  Check,
  XCircle,
  Calendar,
  User,
  FileText,
  ExternalLink,
  Download,
  Loader2,
} from "lucide-react";
import { ApprovalEntry } from "@/lib/types";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: ApprovalEntry | null;
  onApprove: (entry: ApprovalEntry) => Promise<void>;
  onReject: (entry: ApprovalEntry) => Promise<void>;
  loading?: boolean;
  processingEntry?: string | null;
  processingAction?: 'approve' | 'reject' | null;
}

export default function ApprovalModal({
  isOpen,
  onClose,
  entry,
  onApprove,
  onReject,
  loading = false,
  processingEntry,
  processingAction,
}: ApprovalModalProps) {

  const handleApprove = async () => {
    if (entry && !loading) await onApprove(entry);
  };

  const handleReject = async () => {
    if (entry && !loading) await onReject(entry);
  };
  
  // Check if this specific entry is being processed
  const isProcessingThisEntry = (entry && processingEntry === `${entry.entry_type}-${entry.id}`) || false;
  const isApprovingThisEntry = isProcessingThisEntry && processingAction === 'approve';
  const isRejectingThisEntry = isProcessingThisEntry && processingAction === 'reject';

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const renderEntryDetails = () => {
    if (!entry) return null;

    switch (entry.entry_type) {
      case "Conference":
        return (
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Paper Title:</DetailLabel>
              <DetailValue>{entry.paper_title || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Conference Name:</DetailLabel>
              <DetailValue>{entry.conf_name || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Conference Date:</DetailLabel>
              <DetailValue>{formatDate(String(entry.conf_date || ''))}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Conference Type:</DetailLabel>
              <DetailValue>{entry.type || "N/A"}</DetailValue>
            </DetailItem>
            {entry.proceedings && (
              <DetailItem>
                <DetailLabel>Proceedings:</DetailLabel>
                <LinkValue href={String(entry.proceedings || '')} target="_blank">
                  View Proceedings <ExternalLink size={14} />
                </LinkValue>
              </DetailItem>
            )}
            {entry.certificate && (
              <DetailItem>
                <DetailLabel>Certificate:</DetailLabel>
                <FileValue>
                  <Download size={14} />
                  Certificate Available
                </FileValue>
              </DetailItem>
            )}
          </DetailsGrid>
        );

      case "Journal":
        return (
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Paper Title:</DetailLabel>
              <DetailValue>{entry.paper_title || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Journal Name:</DetailLabel>
              <DetailValue>{entry.journal_name || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>ISSN Number:</DetailLabel>
              <DetailValue>{entry.issn_number || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Publication Date:</DetailLabel>
              <DetailValue>
                {entry.month_and_year_of_publication || "N/A"}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Indexed In:</DetailLabel>
              <DetailValue>{entry.indexed_in || "N/A"}</DetailValue>
            </DetailItem>
            {entry.link && (
              <DetailItem>
                <DetailLabel>Publication Link:</DetailLabel>
                <LinkValue href={String(entry.link || '')} target="_blank">
                  View Publication <ExternalLink size={14} />
                </LinkValue>
              </DetailItem>
            )}
            {entry.upload_image && (
              <DetailItem>
                <DetailLabel>Supporting Document:</DetailLabel>
                <FileValue>
                  <Download size={14} />
                  Document Available
                </FileValue>
              </DetailItem>
            )}
          </DetailsGrid>
        );

      case "Patent":
        return (
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Patent Name:</DetailLabel>
              <DetailValue>{entry.patent_name || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Patent Type:</DetailLabel>
              <DetailValue>{entry.patent_type || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Application Number:</DetailLabel>
              <DetailValue>{entry.application_no || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Status:</DetailLabel>
              <DetailValue>{entry.status || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Patent Date:</DetailLabel>
              <DetailValue>{formatDate(String(entry.patent_date || ''))}</DetailValue>
            </DetailItem>
            {entry.patent_link && (
              <DetailItem>
                <DetailLabel>Patent Link:</DetailLabel>
                <LinkValue href={String(entry.patent_link || '')} target="_blank">
                  View Patent <ExternalLink size={14} />
                </LinkValue>
              </DetailItem>
            )}
            {entry.image && (
              <DetailItem>
                <DetailLabel>Patent Document:</DetailLabel>
                <FileValue>
                  <Download size={14} />
                  Document Available
                </FileValue>
              </DetailItem>
            )}
          </DetailsGrid>
        );

      case "Workshop":
        return (
          <DetailsGrid>
            <DetailItem>
              <DetailLabel>Title:</DetailLabel>
              <DetailValue>{entry.title || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Organized By:</DetailLabel>
              <DetailValue>{entry.organized_by || "N/A"}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Date:</DetailLabel>
              <DetailValue>{formatDate(entry.date)}</DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Duration:</DetailLabel>
              <DetailValue>
                {entry.number_of_days ? `${entry.number_of_days} days` : "N/A"}
              </DetailValue>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Type:</DetailLabel>
              <DetailValue>{entry.type || "N/A"}</DetailValue>
            </DetailItem>
          </DetailsGrid>
        );

      default:
        return <DetailValue>Entry details not available</DetailValue>;
    }
  };

  if (!isOpen || !entry) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderInfo>
            <ModalTitle>Review {entry.entry_type} Entry</ModalTitle>
            <EntryMeta>
              <MetaItem>
                <User size={14} />
                Faculty ID: {entry.faculty_id}
              </MetaItem>
              <MetaItem>
                <Calendar size={14} />
                Submitted: {formatDate(String(entry.created_at || ''))}
              </MetaItem>
            </EntryMeta>
          </HeaderInfo>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>
              <FileText size={16} />
              Entry Details
            </SectionTitle>
            {renderEntryDetails()}
          </Section>

        </ModalBody>

        <ModalFooter>
          <RejectButton 
            onClick={handleReject} 
            disabled={loading}
            isProcessing={isRejectingThisEntry}
          >
            {isRejectingThisEntry ? (
              <LoaderIcon size={16} />
            ) : (
              <XCircle size={16} />
            )}
            {isRejectingThisEntry ? "Rejecting..." : "Reject"}
          </RejectButton>
          <ApproveButton 
            onClick={handleApprove} 
            disabled={loading}
            isProcessing={isApprovingThisEntry}
          >
            {isApprovingThisEntry ? (
              <LoaderIcon size={16} />
            ) : (
              <Check size={16} />
            )}
            {isApprovingThisEntry ? "Approving..." : "Approve"}
          </ApproveButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: rgba(244, 253, 252, 0.95);
  backdrop-filter: blur(10px);
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(56, 68, 68, 0.1);
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalTitle = styled.h2`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
`;

const EntryMeta = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.85rem;
  color: rgba(107, 114, 128, 0.8);
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: rgba(239, 68, 68, 1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0 0 1rem 0;
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const DetailLabel = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  font-size: 0.9rem;
  min-width: 150px;
`;

const DetailValue = styled.span`
  font-family: ${bodyText.style.fontFamily};
  color: rgba(31, 41, 55, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
`;

const LinkValue = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  color: rgba(4, 103, 112, 0.8);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: rgba(4, 103, 112, 1);
    text-decoration: underline;
  }
`;

const FileValue = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  color: rgba(107, 114, 128, 0.8);
  font-size: 0.9rem;
`;


const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(56, 68, 68, 0.1);
`;


const ApproveButton = styled.button<{ disabled?: boolean; isProcessing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(177, 204, 144),
    rgba(22, 163, 74, 0.9)
  );
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${props => props.isProcessing && `
    background: linear-gradient(
      135deg,
      rgba(156, 163, 175),
      rgba(107, 114, 128)
    );
  `}

  &:hover {
    ${props => !props.disabled && !props.isProcessing && `
      background: linear-gradient(135deg, rgba(74, 222, 128, 0.95), rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 1));
      box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: translateY(-1px);
    `}
  }
`;

const RejectButton = styled.button<{ disabled?: boolean; isProcessing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(228, 150, 148, 0.8),
    rgba(220, 38, 38, 0.8)
  );
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${props => props.isProcessing && `
    background: linear-gradient(
      135deg,
      rgba(156, 163, 175),
      rgba(107, 114, 128)
    );
  `}

  &:hover {
    ${props => !props.disabled && !props.isProcessing && `
      background: linear-gradient(
        135deg,
        rgba(248, 113, 113, 0.95),
        rgba(239, 68, 68, 0.9),
        rgba(220, 38, 38, 1)
      );
      transform: translateY(-1px);
    `}
  }
`;

const LoaderIcon = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
