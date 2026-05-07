"use client";

import features from "../data/features";
import { motion } from "framer-motion";

const FeatureGrid = () => {
  return (
    <motion.section
      initial={{ display: "none", opacity: 0, y: 0, scale: 0.8 }}
      animate={{ display: "flex", opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 3 }}
      className="w-full flex items-center justify-center py-10 px-6 md:px-20 transition-all duration-100"
    >
      <div className="flex flex-col md:flex-row gap-5 items-center justify-center w-full px-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center group relative rounded-2xl border border-blue-500/20 bg-black/40 backdrop-blur-md p-6 hover:border-blue-400/40 transition-all"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition group-hover:animate-bounce">
                  <Icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-100 group-hover:animate-pulse">
                  {feature.title}
                </h3>
              </div>
              <p className="text-blue-300/70 text-sm leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default FeatureGrid;
