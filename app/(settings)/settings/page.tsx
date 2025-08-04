import React from "react";
import { Metadata } from "next";
import SettingsWrapper from "@/components/new/settings/SettingsWrapper";

export const metadata: Metadata = {
  title: "Settings | Milestone Monitor",
};

export const dynamic = "force-dynamic";

export default function SettingsNewPage() {
  return <SettingsWrapper />;
}