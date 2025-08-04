import React from "react";
import StyledComponentsRegistry from "@/lib/registry";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export const metadata = {
  title: "Milestone Monitor",
  description: "Academic Achievement Tracking System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
            }}
          />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}