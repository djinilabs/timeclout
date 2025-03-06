import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Time Table (tt3) - Manage Team Work Hours and Shifts",
  description:
    "The all-in-one solution for managing work hours, shifts, and team availability with ease.",
  icons: {
    icon: "/homepage/tt3-logo-3.svg",
    apple: "/homepage/tt3-logo-3.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import "./globals.css";
