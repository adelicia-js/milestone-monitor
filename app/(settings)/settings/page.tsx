import React from "react";
import { Metadata } from "next";
import ImprovedModernSettings from "@/components/new/settings/ImprovedModernSettings";

export const metadata: Metadata = {
  title: "Settings | Milestone Monitor",
};

export const dynamic = "force-dynamic";

export default function SettingsNewPage() {
  return <ImprovedModernSettings />;
}