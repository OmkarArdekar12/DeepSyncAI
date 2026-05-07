"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Telescope, ArrowRight } from "lucide-react";

interface Props {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  defaultTopic?: string;
  compact?: boolean;
}

const PLACEHOLDERS = [
  "The future of quantum computing…",
  "Climate change mitigation strategies…",
  "Advances in gene therapy…",
  "The economics of AI adoption…",
  "History of the Roman Empire…",
];

export default function ResearchForm({
  onSubmit,
  isLoading,
  defaultTopic = "",
  compact = false,
}: Props) {
  const [topic, setTopic] = useState(defaultTopic);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);

  useEffect(() => {
    if (compact) return;
    const id = setInterval(() => {
      setPlaceholder(
        PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
      );
    }, 3000);
    return () => clearInterval(id);
  }, [compact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) onSubmit(topic.trim());
  };

  return (
    <motion.div
      layout
      className={
        compact
          ? "mb-6"
          : "flex flex-col items-center justify-center min-h-[55vh] px-4"
      }
    >
      {!compact && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-[#1a1200] border border-[#e8a020]/20">
              <Telescope size={28} className="text-[#e8a020]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#f2e8d0] font-display mb-3 tracking-tight">
            Deep Research
          </h1>
          <p className="text-[#555] text-lg max-w-md">
            Multi-agent AI pipeline: search, read, write, and critique — all in
            one run.
          </p>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`w-full ${compact ? "" : "max-w-xl"}`}
      >
        <div className="relative group">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`
              w-full bg-[#111] border border-[#222] rounded-xl text-[#e8e8e8] placeholder-[#333]
              focus:outline-none focus:border-[#e8a020]/50 focus:shadow-[0_0_0_3px_rgba(232,160,32,0.08)]
              transition-all duration-300 font-mono disabled:opacity-50
              ${compact ? "px-4 py-3 pr-12 text-sm" : "px-6 py-4 pr-16 text-base"}
            `}
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className={`
              absolute right-2 top-1/2 -translate-y-1/2
              bg-[#e8a020] hover:bg-[#f0b840] disabled:bg-[#333] disabled:text-[#555]
              text-[#0a0a0f] rounded-lg transition-all duration-200 font-semibold
              flex items-center justify-center
              ${compact ? "p-2" : "p-2.5"}
            `}
          >
            <ArrowRight size={compact ? 16 : 18} />
          </button>
        </div>
      </form>

      {!compact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mt-6 flex-wrap justify-center"
        >
          {["AI trends 2025", "CRISPR technology", "Black holes"].map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              className="px-3 py-1.5 text-xs font-mono text-[#555] border border-[#1e1e1e] rounded-full hover:border-[#e8a020]/30 hover:text-[#e8a020] transition-all"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
