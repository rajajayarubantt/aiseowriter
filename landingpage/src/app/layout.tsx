import React, { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import LoaderUi from "../components/ui/LoaderUi";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ai SEO Writer  - AI SEO Writer that Auto-Publishes to your Blog",
  description:
    "Ai SEO Writer  is an AI-powered SEO writer that automatically generates, publishes, syndicates, and updates blog articles for your website.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Suspense fallback={<LoaderUi props={{}} />}>
            <Navbar />
            {children}
            <Footer />
          </Suspense>
        </div>
      </body>
      <GoogleAnalytics gaId="G-7X6XSDE8CY" />
    </html>
  );
}
