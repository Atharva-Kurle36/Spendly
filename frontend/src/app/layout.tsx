import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { AppNavBar } from "@/components/NavBarDemo";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export const metadata: Metadata = {
  title: "SmartWallet AI",
  description: "Your money should explain itself. An AI financial awareness assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} antialiased`}>
      <body className="font-body bg-paper text-ink min-h-screen flex flex-col relative">
        <AppNavBar />
        {children}
      </body>
    </html>
  );
}
