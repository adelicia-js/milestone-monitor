"use client";

import React from "react";
import styled from "styled-components";
import ModernFilters from "./ModernFilters";
import ModernReportsTable from "./ModernReportsTable";
import { Faculty } from "@/lib/types";
import { DisplayData, ReportFilters } from "@/lib/hooks/useReport";

interface ReportsPageWrapperProps {
  facultyList: Faculty[] | null;
  facultyDept: string | null;
  facultyDataLoading: boolean;
  facultyDataError: string | null;
  reportData: DisplayData[];
  reportDataLoading: boolean;
  reportError: string | null;
  onFiltersChange: (filters: ReportFilters) => void;
}

export default function ReportsPageWrapper({
  facultyList,
  facultyDept,
  facultyDataLoading,
  facultyDataError,
  reportData,
  reportDataLoading,
  reportError,
  onFiltersChange
}: ReportsPageWrapperProps) {
  return (
    <Layout>
      <Container>
        <MainContent>
          <ModernReportsTable
            tableData={reportData}
            staffDetails={facultyList}
            loading={reportDataLoading}
            error={reportError}
          />
        </MainContent>
        <Sidebar>
          <ModernFilters
            staffDetails={facultyList}
            staffDepartment={facultyDept}
            onFiltersChange={onFiltersChange}
            loading={facultyDataLoading}
            error={facultyDataError}
          />
        </Sidebar>
      </Container>
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

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  padding: 3rem;
`;

const MainContent = styled.section`
  display: flex;
  flex-direction: column;
`;

const Sidebar = styled.aside`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;