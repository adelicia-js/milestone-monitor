import React from "react";
import { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login | Milestone Monitor',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main>
      {children}
    </main>
  )
}