import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aashray — AI-Based Disaster Risk Mapping & Relocation Recommendation System",
  description:
    "Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment And Immediate Relocation Needs for Vulnerable Habitations. From Disaster Response to Disaster Prevention.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
