import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DeepSyncAI",
    short_name: "DeepSyncAI",

    description:
      "Intelligent multi-agent research engine for deep web search, extraction, report generation, and AI-powered critique.",

    start_url: "/",

    display: "standalone",

    background_color: "#000000",

    theme_color: "#7c3aed",

    orientation: "portrait",

    icons: [
      {
        src: "/deepsyncai.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/deepsyncai.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
