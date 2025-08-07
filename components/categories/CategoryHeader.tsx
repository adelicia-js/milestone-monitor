"use client";

import React from "react";
import styled from "styled-components";
import { GenericHeader } from "@/components/ui/GenericStyles";
import { Inter } from "next/font/google";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

interface CategoryHeaderProps {
  title: string;
  description: string;
}

export default function CategoryHeader({
  title,
  description,
}: CategoryHeaderProps) {
  return (
    <HeaderWrapper>
      <HeaderText>{title}</HeaderText>
      <HeaderDesc>{description}</HeaderDesc>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  font-family: ${bodyText.style.fontFamily};
  z-index: 20;
  top: 1.5rem;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;

  @media (max-width: 1024px) {
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
  font-size: 1.5rem;
  font-weight: 500;
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

const HeaderDesc = styled.p`
  margin-top: -0.25rem;
  color: rgba(4, 103, 112, 0.99);
  font-size: 1rem;
  font-weight: 300;
`;
