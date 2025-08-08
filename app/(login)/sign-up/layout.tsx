import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up | Milestone Monitor',
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}