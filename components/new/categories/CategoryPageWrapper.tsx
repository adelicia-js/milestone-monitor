"use client";

import React from "react";
import styled from "styled-components";
import {
  GenericHeader,
  GenericHeaderContainer,
} from "@/components/ui/GenericStyles";

export default function CategoryPageWrapper({
  categoryTitle,
}: {
  categoryTitle?: string;
}) {
  return (
    <Layout>
      <CardContainer1>
        <GenericHeaderContainer>
          <GenericHeader>{categoryTitle ?? "Category"}</GenericHeader>
        </GenericHeaderContainer>
        <CardContainer2></CardContainer2>
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
