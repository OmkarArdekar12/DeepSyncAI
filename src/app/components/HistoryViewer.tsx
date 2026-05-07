"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LuX } from "react-icons/lu";
import { HistoryItem } from "../types";
import { LuGlobe, LuDatabase, LuFileText, LuStar } from "react-icons/lu";
import HistoryOutput from "./HistoryOutput";

interface HistoryViewerProps {
  item: HistoryItem;
  onClose: () => void;
}

const SECTIONS = [
  { key: "search" as const, label: "Search Results", Icon: LuGlobe },
  { key: "extract" as const, label: "Extracted Content", Icon: LuDatabase },
  { key: "report" as const, label: "Research Report", Icon: LuFileText },
  { key: "critic" as const, label: "Critic Analysis", Icon: LuStar },
];

const HistoryViewer = ({ item, onClose }: HistoryViewerProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ ease: "easeOut", duration: 0.2 }}
          className="relative w-full max-w-[90%] md:max-w-[75%] mx-4 bg-black/80 border border-blue-600/80 rounded-2xl shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer z-10"
          >
            <LuX size={22} />
          </button>

          <div className="p-6 border-b border-blue-600/50">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-300">
              <LuGlobe className="inline size-5" />
              Research: {item.topic}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
          </div>

          <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto deepsync-scrollbar">
            {SECTIONS.map(({ key, label, Icon }) => {
              const content = item.memory[key];
              if (!content) return null;
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <Icon size={16} className="text-blue-400" />
                    <h4 className="text-md font-semibold text-blue-300">
                      {label}
                    </h4>
                  </div>
                  <HistoryOutput outputType={label} output={content} />
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HistoryViewer;
