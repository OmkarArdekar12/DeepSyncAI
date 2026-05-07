"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import HistoryPanel from "./HistoryPanel";
import HistoryViewer from "./HistoryViewer";
import ResearchInput from "./ResearchInput";
import { HistoryItem, MemoryState } from "../types";

const MainContent = () => {
  // Global memory state - holds current research results across all 4 sections
  const [memory, setMemory] = useState<MemoryState>({
    search: "",
    extract: "",
    report: "",
    critic: "",
  });

  // History state - list of all previous research sessions
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(
    null,
  );

  const addToHistory = (topic: string, completedMemory: MemoryState) => {
    const newItem: HistoryItem = {
      id: Date.now(),
      topic,
      timestamp: new Date().toLocaleString(),
      memory: completedMemory,
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 9)]);
    setMemory(completedMemory);
  };

  return (
    <motion.div
      initial={{ display: "none", opacity: 0, y: 0, scale: 0.1 }}
      animate={{ display: "flex", opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 4.5 }}
      className="w-full flex flex-col items-start justify-center lg:flex-row gap-8 py-2 px-1 sm:px-4 md:px-10 transition-all duration-300"
    >
      {/* Left: main research panel (2/3 width) */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="w-full bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-600/95">
          <div className="w-full flex items-center gap-3 border-b border-blue-600/95 bg-black/50 p-4 px-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-semibold text-blue-300">
                Multi-Agent Research Pipeline
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
              <span>Search</span>
              <span>→</span>
              <span>Extract</span>
              <span>→</span>
              <span>Report</span>
              <span>→</span>
              <span>Critic</span>
            </div>
          </div>
          <div className="w-full flex items-center p-6">
            <ResearchInput onComplete={addToHistory} />
          </div>
        </div>
      </div>

      {/* Right: history panel (1/3 width) */}
      <div className="w-full lg:w-1/3 flex items-center justify-center">
        <HistoryPanel history={history} onSelect={setSelectedHistory} />
      </div>

      {/* History popup viewer */}
      {selectedHistory && (
        <HistoryViewer
          item={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
    </motion.div>
  );
};

export default MainContent;
