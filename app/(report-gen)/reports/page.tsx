import React from "react";
import ReportPageWrapper from "./ReportPageWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports | Milestone Monitor",
};

const page = () => {
  return <ReportPageWrapper />;
};

export default page;
