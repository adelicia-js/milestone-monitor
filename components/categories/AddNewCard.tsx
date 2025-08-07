"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Plus } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface AddNewCardProps {
  onAddNew: () => void;
  title?: string;
}

export default function AddNewCard({ 
  onAddNew, 
  title = "Add New Entry" 
}: AddNewCardProps) {
  return (
    <AddCard onClick={onAddNew}>
      <AddContent>
        <PlusIconWrapper>
          <Plus size={32} />
        </PlusIconWrapper>
        <AddTitle>{title}</AddTitle>
        <AddSubtext>Click here to create a new entry</AddSubtext>
      </AddContent>
    </AddCard>
  );
}

const AddCard = styled.div`
  position: relative;
  border: 2px dashed rgba(0, 131, 143, 0.4);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.15);
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.05),
    rgba(0, 131, 143, 0.15)
  );
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px -2px rgba(0, 131, 143, 0.3);
    background: linear-gradient(
      135deg,
      rgba(0, 131, 143, 0.1),
      rgba(0, 131, 143, 0.25)
    );
    border-color: rgba(0, 131, 143, 0.6);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const AddContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const PlusIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.1),
    rgba(0, 131, 143, 0.5)
  );
  color: rgba(0, 131, 143, 0.9);
  transition: all 0.3s ease;

  ${AddCard}:hover & {
    background: linear-gradient(
      135deg,
      rgba(0, 131, 143, 0.5),
      rgba(0, 131, 143, 0.25)
    );
    color: white;
    transform: scale(1.1);
  }
`;

const AddTitle = styled.h3`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(4, 103, 112, 0.9);
  margin: 0;
  
  @media (max-width: 1024px) {
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const AddSubtext = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.85rem;
  color: rgba(107, 114, 128, 0.8);
  margin: 0;
  
  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;