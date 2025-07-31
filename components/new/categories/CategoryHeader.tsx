"use client";

import React from "react";
import styled from "styled-components";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import { Plus } from "lucide-react";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryHeaderProps {
  title: string;
  onAddNew: () => void;
}

export default function CategoryHeader({ title, onAddNew }: CategoryHeaderProps) {
  return (
    <HeaderWrapper>
      <GenericHeaderContainer>
        <GenericHeader>{title}</GenericHeader>
      </GenericHeaderContainer>
      <AddButton onClick={onAddNew}>
        <Plus size={20} />
        <ButtonText>Add New</ButtonText>
      </AddButton>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(4, 103, 112, 0.9), rgba(6, 95, 70, 0.9));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, rgba(4, 103, 112, 1), rgba(6, 95, 70, 1));
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonText = styled.span`
  font-size: 0.9rem;
  letter-spacing: 0.3px;
`;