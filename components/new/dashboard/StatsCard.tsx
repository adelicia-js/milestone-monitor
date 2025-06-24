"use client";

import React from "react";
import styled from "styled-components";
import DoughNutWrapper from "@/components/dashboard/DoughNutWrapper";

export default function StatsCard() {
  return (
    <Card>
      <DoughNutWrapper />
      <CardHeadingContainer>
      </CardHeadingContainer>
    </Card>
  );
}

const Card = styled.div`
  height: 100%;
  width: 50%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.79);
  display: flex;
  flex-direction: row;
  padding: 0.5rem;
`;

const CardHeadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`
