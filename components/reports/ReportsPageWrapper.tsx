"use client";

import React from "react";
import styled from "styled-components";
import ReportFilters from "./ReportFilters";
import ReportsTable from "./ReportsTable";
import { Faculty } from "@/lib/types";
import { DisplayData, ReportFiltersI } from "@/lib/hooks/useReport";
import { GenericHeader } from "@/components/ui/GenericStyles";
import MobileAdvisory from "@/components/ui/MobileAdvisory";

interface ReportsPageWrapperProps {
  facultyList: Faculty[] | null;
  facultyDept: string | null;
  facultyDataLoading: boolean;
  facultyDataError: string | null;
  reportData: DisplayData[];
  reportDataLoading: boolean;
  reportError: string | null;
  onFiltersChange: (filters: ReportFiltersI) => void;
}

export default function ReportsPageWrapper({
  facultyList,
  facultyDept,
  facultyDataLoading,
  facultyDataError,
  reportData,
  reportDataLoading,
  reportError,
  onFiltersChange,
}: ReportsPageWrapperProps) {
  return (
    <>
      <MobileAdvisory />
      <Layout>
        <Container>
          <ReportsHeader>
            <HeaderText>Your Reports</HeaderText>
          </ReportsHeader>
          <ContentWrapper>
            <ReportsTable
              tableData={reportData}
              staffDetails={facultyList}
              loading={reportDataLoading}
              error={reportError}
            />
            <ReportFilters
              staffDetails={facultyList}
              staffDepartment={facultyDept}
              onFiltersChange={onFiltersChange}
              loading={facultyDataLoading}
              error={facultyDataError}
            />
          </ContentWrapper>
        </Container>
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

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding: 2rem;
  }

  @media (min-width: 1280px) {
    padding: 3rem;
  }
`;

const ReportsHeader = styled.div`
  position: absolute;
  top: 1.5rem;
  display: flex;
  align-items: center;
  width: fit-content;
`;

const HeaderText = styled(GenericHeader)`
  font-size: 1.05rem;
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    margin-top: 1.5rem;
  }

  @media (min-width: 1280px) {
    margin-top: 0.5rem;
  }
`;