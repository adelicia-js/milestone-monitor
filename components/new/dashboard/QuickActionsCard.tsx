"use client";

import React from "react";
import styled from "styled-components";

export default function QuickActionsCard() {
  return <Card>Quick Actions</Card>;
}

const Card = styled.div`
  height: 35%;
  width: 100%;
  border: 0.1px solid rgba(56, 68, 68, 0.28);
  border-radius: 1rem;
  box-shadow: 2px 4px 6px -1px rgba(48, 55, 55, 0.35);
  background-color: rgba(244, 253, 252, 0.79);
`;
