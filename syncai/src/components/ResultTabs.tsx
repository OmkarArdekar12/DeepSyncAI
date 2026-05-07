"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, MessageSquare, Search, BookOpen, Plus } from "lucide-react";
import { ResearchResult } from "@/types";
import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
  result: Partial<ResearchResult>;
  topic?: string;
  onNewResearch?: () => void;
}

const TABS = [
  { id: "report", label: "Report", Icon: FileText },
  { id: "feedback", label: "Critic", Icon: MessageSquare },
  { id: "search", label: "Search", Icon: Search },
  { id: "content", label: "Extracted", Icon: BookOpen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ResultTabs({ result, topic, onNewResearch }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("report");

  const contentMap: Record<TabId, string | undefined> = {
    report: result.report,
    feedback: result.feedback,
    search: result.search,
    content: result.content,
  };

  const activeContent = contentMap[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Topic header */}
      {topic && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] text-[#444] font-mono uppercase tracking-widest mb-1">
              Research Topic
            </p>
            <h2 className="text-xl font-bold text-[#f2e8d0] font-display">
              {topic}
            </h2>
          </div>
          {onNewResearch && (
            <button
              onClick={onNewResearch}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#222] rounded-lg text-[#555] hover:text-[#e8a020] hover:border-[#e8a020]/30 transition-all"
            >
              <Plus size={12} />
              New
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-[#1e1e1e] pb-0">
        {TABS.map(({ id, label, Icon }) => {
          const hasContent = !!contentMap[id];
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => hasContent && setActiveTab(id)}
              disabled={!hasContent}
              className={`
                relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono font-medium transition-all
                ${isActive ? "text-[#e8a020]" : hasContent ? "text-[#555] hover:text-[#888]" : "text-[#2a2a2a] cursor-not-allowed"}
              `}
            >
              <Icon size={12} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-[#e8a020]"
                />
              )}
              {!hasContent && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a] ml-1" />
              )}
              {hasContent && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/60 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="min-h-[300px]"
        >
          {activeContent ? (
            activeTab === "report" || activeTab === "feedback" ? (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-6">
                <MarkdownRenderer content={activeContent} />
              </div>
            ) : (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-6">
                <pre className="text-[#888] text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
                  {activeContent}
                </pre>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-48 text-[#333] text-sm font-mono">
              Waiting for agent…
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
