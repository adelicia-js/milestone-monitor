"use client";

import React from "react";
import styled from "styled-components";
import DashboardHeader from "./DashboardHeader";
import ProfileCard from "./ProfileCard";
import StatsCard from "./StatsCard";
import QuickActionsCard from "./QuickActionsCard";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

export default function DashboardPageWrapper() {
  return (
    <>
      <MobileAdvisory />
      <Layout>
        <CardContainer1>
          <DashboardHeader />
          <CardContainer2>
            <ProfileCard />
            <StatsCard />
          </CardContainer2>
          <QuickActionsCard />
        </CardContainer1>
      </Layout>
    </>
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
  gap: 1.5rem;

  @media (min-width: 1024px) {
    margin-top: 1rem;
    padding: 2rem;
  }

  @media (min-width: 1280px) {
    margin-top: 0;
    padding: 3rem;
  }
`;

const CardContainer2 = styled.section`
  height: 65%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
`;
