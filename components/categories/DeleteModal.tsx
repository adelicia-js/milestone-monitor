"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { AlertTriangle, X, Trash2 } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false
}: DeleteModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderContent>
            <IconWrapper>
              <AlertTriangle size={24} />
            </IconWrapper>
            <ModalTitle>{title}</ModalTitle>
          </HeaderContent>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Message>{message}</Message>
          {itemName && (
            <ItemName>&quot;{itemName}&quot;</ItemName>
          )}
          <WarningText>This action cannot be undone.</WarningText>
        </ModalBody>

        <ModalFooter>
          <CancelButton type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </CancelButton>
          <DeleteButton onClick={handleConfirm} disabled={isLoading}>
            <Trash2 size={16} />
            {isLoading ? 'Deleting...' : 'Delete'}
          </DeleteButton>
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
  background: rgba(254, 252, 252, 0.95);
  backdrop-filter: blur(10px);
  border: 0.1px solid rgba(220, 38, 38, 0.2);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(220, 38, 38, 0.1);
  background: rgba(239, 68, 68, 0.05);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: rgba(239, 68, 68, 0.8);
`;

const ModalTitle = styled.h2`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(239, 68, 68, 0.9);
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.5rem;
  background: rgba(107, 114, 128, 0.1);
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(107, 114, 128, 0.2);
    color: rgba(107, 114, 128, 1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const Message = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.95rem;
  color: rgba(31, 41, 55, 0.8);
  margin: 0 0 1rem 0;
  line-height: 1.5;
`;

const ItemName = styled.div`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  background: rgba(4, 103, 112, 0.05);
  border: 1px solid rgba(4, 103, 112, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin: 0 0 1rem 0;
  word-break: break-all;
`;

const WarningText = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.85rem;
  color: rgba(239, 68, 68, 0.7);
  margin: 0;
  font-weight: 500;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  background: rgba(239, 68, 68, 0.02);
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(107, 114, 128, 0.3);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  color: rgba(107, 114, 128, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: rgba(107, 114, 128, 0.1);
    border-color: rgba(107, 114, 128, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;