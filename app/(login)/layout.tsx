import React from "react";
import { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login | Milestone Monitor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="">
          {children}
        </main>
      </body>
    </html>
  )
}