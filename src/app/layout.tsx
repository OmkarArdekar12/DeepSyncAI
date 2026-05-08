import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://deepsyncai.vercel.app"),

  title: {
    default: "DeepSyncAI - Multi-Agent Research Engine",
    template: "%s | DeepSyncAI",
  },

  description:
    "DeepSyncAI is an intelligent multi-agent research engine that autonomously searches the web, extracts information from live sources, generates structured research reports, and performs AI-powered critique.",

  verification: {
    google: "cIpfNdHkzMpM_Wpuo6JXHOkMH_wEpHyrgBe_f46e5Ig",
  },

  keywords: [
    "DeepSyncAI",
    "AI Research Engine",
    "Multi-Agent AI",
    "AI Research Assistant",
    "Research Automation",
    "Gemini AI",
    "Tavily AI",
    "AI Report Generator",
    "AI Search Engine",
    "AI Critic System",
    "Agentic AI",
    "Web Research AI",
    "AI Extraction",
    "AI Analysis",
    "Next.js AI Project",
  ],

  authors: [
    {
      name: "Omkar Ardekar",
      url: "https://github.com/OmkarArdekar12",
    },
  ],

  creator: "Omkar Ardekar",

  publisher: "DeepSyncAI",

  applicationName: "DeepSyncAI",

  category: "Artificial Intelligence",

  alternates: {
    canonical: "https://deepsyncai.vercel.app",
  },

  openGraph: {
    title: "DeepSyncAI - Multi-Agent Research Engine",

    description:
      "An intelligent multi-agent AI system that performs deep web research, extraction, report generation, and AI-powered critique.",

    url: "https://deepsyncai.vercel.app",

    siteName: "DeepSyncAI",

    images: [
      {
        url: "/deepsyncai.png",
        width: 1200,
        height: 630,
        alt: "DeepSyncAI",
      },
    ],

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "DeepSyncAI - Multi-Agent Research Engine",

    description:
      "AI-powered multi-agent research platform for deep web search, extraction, reporting, and intelligent critique.",

    images: ["/deepsyncai.png"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/deepsyncai.png",
    shortcut: "/deepsyncai.png",
    apple: "/deepsyncai.png",
  },
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
