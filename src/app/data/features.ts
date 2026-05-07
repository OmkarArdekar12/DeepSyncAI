import { FeatureGrid } from "../types";
import { LuGlobe } from "react-icons/lu";
import { MdDataExploration } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { GiArtificialIntelligence } from "react-icons/gi";

const features: FeatureGrid[] = [
  {
    title: "Deep Web Search",
    description:
      "Scans the web via Tavily to gather real-time URLs and content snippets on any topic.",
    icon: LuGlobe,
  },
  {
    title: "Multi-Source Extraction",
    description:
      "Scrapes and extracts rich, structured data from the top sources found during search.",
    icon: MdDataExploration,
  },
  {
    title: "AI Research Report",
    description:
      "Gemini synthesizes all gathered data into a comprehensive, well-structured research report.",
    icon: TbReportSearch,
  },
  {
    title: "Intelligent Critique",
    description:
      "AI-powered critic scores the report, highlights strengths and weaknesses with precision.",
    icon: GiArtificialIntelligence,
  },
];

export default features;
