import React from "react";
import { Metadata } from "next";
import ReportsNewClient from "./ReportsNewClient";

export const metadata: Metadata = {
  title: "Reports | Milestone Monitor",
};

export const dynamic = "force-dynamic";

export default function ReportsNewPage() {
  return <ReportsNewClient />;
}