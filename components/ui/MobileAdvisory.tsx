"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import { Monitor, AlertTriangle } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

export default function MobileAdvisory() {
  return (
    <AdvisoryWrapper>
      <AdvisoryContent>
        <IconWrapper>
          <AlertTriangle size={20} />
          <Monitor size={24} />
        </IconWrapper>
        <Message>
          <Title>Best Experience on Laptop/Desktop</Title>
          <Description>
            For optimal performance and full functionality, we recommend using this application on a laptop or desktop computer.
          </Description>
        </Message>
      </AdvisoryContent>
    </AdvisoryWrapper>
  );
}

const AdvisoryWrapper = styled.div`
  display: none;
  
  @media (max-width: 1023px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95));
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(245, 158, 11, 0.3);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const AdvisoryContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: rgba(146, 64, 14, 0.9);
  flex-shrink: 0;
`;

const Message = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h3`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(146, 64, 14, 0.9);
  margin: 0 0 0.25rem 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Description = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  color: rgba(146, 64, 14, 0.8);
  margin: 0;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;