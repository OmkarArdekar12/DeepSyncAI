import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepSyncAI — Multi-Agent Research Engine",
  description:
    "Intelligent multi-agent research engine: search, extract, report and critique any topic with Gemini AI and Tavily.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
