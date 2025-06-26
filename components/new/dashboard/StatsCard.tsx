"use client";

import React, {useState} from "react";
import styled from "styled-components";
import StatsDoughNutChart from "@/components/dashboard/StatsDoughNutChart";
import {
  GenericCard,
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function StatsCard() {
  const [view, setNextView] = useState(0);

  return (
    <Card>
      {view === 0 ? (
        <StatsWrapper>
          <GenericHeaderContainer>
            <GenericHeader>Your Stats</GenericHeader>
          </GenericHeaderContainer>
          <DoughnutChartWrapper>
            <StatsDoughNutChart />
          </DoughnutChartWrapper>
          <RightButton onClick={() => setNextView(1)}>
            <ChevronRight />
          </RightButton>
        </StatsWrapper>
      ) : (
        <StatsWrapper>
          <GenericHeaderContainer>
            <GenericHeader>Recent Activity</GenericHeader>
          </GenericHeaderContainer>
          <LeftButton onClick={() => setNextView(0)}>
            <ChevronLeft />
          </LeftButton>
        </StatsWrapper>
      )}
    </Card>
  );
}

const Card = styled(GenericCard)`
  position: relative;
  padding: 0.5rem;

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
    /* Desktop styles */
  }
`;

const StatsWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const DoughnutChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  /* Media Queries */
  @media (max-width: 600px) {
    /* Mobile styles */
  }

  @media (min-width: 601px) and (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (min-width: 1025px) {
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  color: rgba(0, 131, 143, 0.53);
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 100%;

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  & svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    color: rgba(0, 131, 143, 0.99);
    background: linear-gradient(
      120deg,
      rgba(175, 209, 214, 0.45),
      rgba(179, 224, 228, 0.45)
    );
  }

  &:hover svg {
  }
`;

const RightButton = styled(IconWrapper)`
  top: 45%;
  right: 0.5rem;
`;

const LeftButton = styled(IconWrapper)`
  top: 45%;
  left: 0.5rem;
`;
