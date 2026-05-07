import { FeatureGrid } from "../types";
import { LuGlobe } from "react-icons/lu";
import { MdDataExploration } from "react-icons/md";
import { TbReportSearch } from "react-icons/tb";
import { GiArtificialIntelligence } from "react-icons/gi";

const features: FeatureGrid[] = [
  {
    title: "Deep Web Search",
    description:
      "Performs intelligent real-time web exploration to discover relevant sources, URLs, and insights on any research topic.",
    icon: LuGlobe,
  },
  {
    title: "Multi-Source Extraction",
    description:
      "Extracts and structures high-value information from multiple web sources to build a rich research context.",
    icon: MdDataExploration,
  },
  {
    title: "DeepSyncAI Research Report",
    description:
      "Transforms gathered data into a comprehensive, well-structured, and insight-driven research report using advanced AI reasoning.",
    icon: TbReportSearch,
  },
  {
    title: "Intelligent Critique",
    description:
      "Analyzes the generated report with an AI-powered critic that evaluates accuracy, clarity, strengths, and improvement areas.",
    icon: GiArtificialIntelligence,
  },
];

export default features;
