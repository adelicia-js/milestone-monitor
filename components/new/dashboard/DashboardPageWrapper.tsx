"use client";

import React from "react";
import styled, { keyframes } from "styled-components";
import { Inconsolata } from "next/font/google";

const bodyText = Inconsolata({
  weight: "400",
  subsets: ["latin"],
});

export default function DashboardPageWrapper() {
  return (
    <Layout>
      <h1 style={{ fontFamily: bodyText.style.fontFamily }}>Dashboard</h1>
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
  background-color: rgba(225, 225, 225, 0.35);
`;
