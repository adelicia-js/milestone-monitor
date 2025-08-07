"use client";

import React from "react";
import styled from "styled-components";
import { Inter } from "next/font/google";
import {AlertTriangle, Laptop, Tablet, Smartphone } from "lucide-react";

const bodyText = Inter({
  weight: "400",
  subsets: ["latin"],
});

const headingText = Inter({
  weight: "700",
  subsets: ["latin"],
});

export default function MobileAdvisory() {
  return (
    <AdvisoryWrapper>
      <AdvisoryOverlay>
        <AdvisoryContent>
          <IconWrapper>
            <AlertTriangle size={48} />
          </IconWrapper>
          
          <MainMessage>
            <Title>Desktop Access Required</Title>
            <Subtitle>This application is designed for desktop computers only</Subtitle>
          </MainMessage>

          <DeviceIcons>
            <DeviceIconWrapper>
              <Smartphone size={32} />
              <DeviceLabel>Phone</DeviceLabel>
              <StatusIcon>❌</StatusIcon>
            </DeviceIconWrapper>
            <DeviceIconWrapper>
              <Tablet size={32} />
              <DeviceLabel>Tablet</DeviceLabel>
              <StatusIcon>❌</StatusIcon>
            </DeviceIconWrapper>
            <DeviceIconWrapper className="supported">
              <Laptop size={34} />
              <DeviceLabel>Desktop/Laptop</DeviceLabel>
              <StatusIcon>✅</StatusIcon>
            </DeviceIconWrapper>
          </DeviceIcons>

          <Description>
            For the best experience and full functionality, please access this application from a desktop computer or laptop with a minimum screen width of 1024px.
          </Description>

          <Features>
            <FeatureTitle>Why Desktop Only?</FeatureTitle>
            <FeatureList>
              <FeatureItem>• Complex data tables and forms</FeatureItem>
              <FeatureItem>• Multi-panel interfaces</FeatureItem>
              <FeatureItem>• File upload and management</FeatureItem>
              <FeatureItem>• Advanced reporting features</FeatureItem>
            </FeatureList>
          </Features>
        </AdvisoryContent>
      </AdvisoryOverlay>
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
    bottom: 0;
    z-index: 99999;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    overflow-y: auto;
    padding: 1rem;
    
    @media (max-width: 480px) {
      padding: 0.75rem;
    }
  }
`;

const AdvisoryOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh; /* For mobile browsers with dynamic viewport */
  width: 100%;
  padding: 1rem 0;
`;

const AdvisoryContent = styled.div`
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(10px);
  
  @media (max-width: 640px) {
    max-width: 420px;
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 1.75rem 1.25rem;
    border-radius: 12px;
    margin: 0;
  }
  
  @media (max-width: 360px) {
    padding: 1.5rem 1rem;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #dc2626;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
    
    svg {
      width: 40px;
      height: 40px;
    }
  }
  
  @media (max-width: 360px) {
    margin-bottom: 1rem;
    
    svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const MainMessage = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
  }
`;

const Title = styled.h1`
  font-family: ${headingText.style.fontFamily};
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
  
  @media (max-width: 640px) {
    font-size: 1.625rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 0.375rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.375rem;
  }
`;

const Subtitle = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: 640px) {
    font-size: 1.05rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.95rem;
  }
`;

const DeviceIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1.75rem;
  margin: 1.5rem 0;
  
  @media (max-width: 640px) {
    gap: 1.5rem;
    margin: 1.25rem 0;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin: 1rem 0;
  }
  
  @media (max-width: 360px) {
    gap: 0.75rem;
    margin: 0.75rem 0;
  }
`;

const DeviceIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.4;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 80px;
  
  &.supported {
    opacity: 1;
    transform: scale(1.05);
  }
  
  svg {
    color: #64748b;
    flex-shrink: 0;
  }
  
  &.supported svg {
    color: #059669;
  }
  
  @media (max-width: 480px) {
    gap: 0.375rem;
    max-width: 70px;
    
    svg {
      width: 28px;
      height: 28px;
    }
    
    &.supported {
      transform: scale(1.02);
    }
  }
  
  @media (max-width: 360px) {
    gap: 0.25rem;
    max-width: 60px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const DeviceLabel = styled.span`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.7rem;
  }
`;

const StatusIcon = styled.span`
  font-size: 0.9rem;
  line-height: 1;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
`;

const Description = styled.p`
  font-family: ${bodyText.style.fontFamily};
  font-size: 1rem;
  color: #475569;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  
  @media (max-width: 640px) {
    font-size: 0.95rem;
    margin-bottom: 1.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  @media (max-width: 360px) {
    font-size: 0.85rem;
  }
`;

const Features = styled.div`
  text-align: left;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  padding: 1.25rem;
  border-left: 4px solid #3b82f6;
  
  @media (max-width: 640px) {
    padding: 1.125rem;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px;
    border-left-width: 3px;
  }
  
  @media (max-width: 360px) {
    padding: 0.875rem;
  }
`;

const FeatureTitle = styled.h3`
  font-family: ${headingText.style.fontFamily};
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  
  @media (max-width: 640px) {
    font-size: 1.05rem;
    margin-bottom: 0.875rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.95rem;
  }
`;

const FeatureList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const FeatureItem = styled.li`
  font-family: ${bodyText.style.fontFamily};
  font-size: 0.9rem;
  color: #475569;
  margin: 0.5rem 0;
  line-height: 1.4;
  
  @media (max-width: 640px) {
    font-size: 0.875rem;
    margin: 0.425rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin: 0.375rem 0;
    line-height: 1.3;
  }
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
    margin: 0.325rem 0;
  }
`;