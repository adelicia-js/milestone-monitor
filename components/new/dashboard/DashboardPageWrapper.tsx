"use client";

import React from "react";
import styled from "styled-components";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import QuickActionsCard from "./QuickActionsCard";

export default function DashboardPageWrapper() {
  return (
    <Layout>
      <CardContainer1>
        <CardContainer2>
          <ProfileCard />
          <StatsCard/>
        </CardContainer2>
        <QuickActionsCard/>
      </CardContainer1>
    </Layout>
  );
}

const Layout = styled.main`
  z-index: 0;
  position: absolute;
  height: 100vh;
  width: 92vw;
  left: 8vw;
  padding: 1rem;
  background-color: rgba(140, 242, 233, 0.35);
`;

const CardContainer1 = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 3rem;
  gap: 1.5rem;
`;

const CardContainer2 = styled.section`
  height: 65%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
`;

