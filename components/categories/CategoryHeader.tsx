"use client";

import React from "react";
import styled from "styled-components";
import { GenericHeader } from "@/components/ui/GenericStyles";
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

export default function CategoryHeader({
  title,
  onAddNew,
}: CategoryHeaderProps) {
  return (
    <HeaderWrapper>
      <HeaderText>{title}</HeaderText>
      <AddButton onClick={onAddNew}>
        <Plus size={20} />
        <ButtonText>Add New</ButtonText>
      </AddButton>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: fit-content;

  @media (max-width: 1024px) {
    gap: 1rem;
    top: 1rem;
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    top: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
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

const AddButton = styled.button`
  z-index: 20;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(0, 131, 143, 0.2),
    rgba(0, 131, 143, 1)
  );
  border: 0.1px solid rgba(0, 131, 143, 0.27);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-family: ${bodyText.style.fontFamily};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    padding: 0.6rem 1.2rem;
    gap: 0.4rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    gap: 0.3rem;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px -1px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonText = styled.span`
  font-size: 0.9rem;
  letter-spacing: 0.3px;

  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;
