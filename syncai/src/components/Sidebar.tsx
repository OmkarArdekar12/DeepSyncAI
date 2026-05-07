"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Telescope,
} from "lucide-react";
import { ResearchResult } from "@/types";

interface Props {
  history: ResearchResult[];
  isOpen: boolean;
  selectedId?: string;
  onToggle: () => void;
  onSelect: (result: ResearchResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onNew: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHrs = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export default function Sidebar({
  history,
  isOpen,
  selectedId,
  onToggle,
  onSelect,
  onDelete,
  onClear,
  onNew,
}: Props) {
  return (
    <>
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-screen flex flex-col border-r border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden flex-shrink-0"
          >
            {/* Brand */}
            <div className="flex items-center gap-2.5 px-4 py-5 border-b border-[#1a1a1a]">
              <div className="p-1.5 rounded-lg bg-[#1a1200] border border-[#e8a020]/20">
                <Telescope size={16} className="text-[#e8a020]" />
              </div>
              <span className="text-sm font-bold text-[#e8e8e8] font-display tracking-wide">
                Deep Research
              </span>
            </div>

            {/* New button */}
            <div className="px-3 pt-4 pb-3">
              <button
                onClick={onNew}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#e8a020] hover:bg-[#f0b840] text-[#0a0a0f] text-xs font-semibold font-mono transition-all"
              >
                <Plus size={14} />
                New Research
              </button>
            </div>

            {/* History label + clear */}
            <div className="flex items-center justify-between px-4 pb-2">
              <div className="flex items-center gap-1.5 text-[#444] text-[10px] font-mono uppercase tracking-widest">
                <Clock size={10} />
                History
              </div>
              {history.length > 0 && (
                <button
                  onClick={onClear}
                  className="text-[10px] text-[#333] hover:text-red-500 font-mono transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-thin">
              {history.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-[#333] text-xs font-mono">
                    No research yet.
                  </p>
                  <p className="text-[#252525] text-xs font-mono mt-1">
                    Your sessions will appear here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => onSelect(item)}
                    onDelete={() => onDelete(item.id)}
                  />
                ))
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-4 left-4 z-50 p-2 rounded-lg border border-[#1e1e1e] bg-[#0a0a0a] text-[#444] hover:text-[#e8a020] hover:border-[#e8a020]/30 transition-all"
        style={{ left: isOpen ? 268 : 16 }}
      >
        {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </button>
    </>
  );
}

function HistoryItem({
  item,
  isSelected,
  onSelect,
  onDelete,
}: {
  item: ResearchResult;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className={`
        group relative flex items-start gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all
        ${isSelected ? "bg-[#1a1200] border border-[#e8a020]/20" : "hover:bg-[#111] border border-transparent"}
      `}
      onClick={onSelect}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${isSelected ? "bg-[#e8a020]" : "bg-[#333]"}`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-medium truncate leading-snug ${isSelected ? "text-[#e8c070]" : "text-[#888]"}`}
        >
          {item.topic}
        </p>
        <p className="text-[10px] text-[#333] font-mono mt-0.5">
          {formatDate(item.createdAt)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 text-[#333] hover:text-red-500 transition-all flex-shrink-0"
      >
        <Trash2 size={11} />
      </button>
    </motion.div>
  );
}
