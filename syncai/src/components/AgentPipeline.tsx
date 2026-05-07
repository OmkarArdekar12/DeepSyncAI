"use client";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  PenLine,
  MessageSquare,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AgentStepId } from "@/types";

const STEPS: {
  id: AgentStepId;
  label: string;
  subtitle: string;
  Icon: React.ElementType;
}[] = [
  { id: "search", label: "Search", subtitle: "Scanning the web", Icon: Search },
  { id: "read", label: "Read", subtitle: "Extracting content", Icon: BookOpen },
  { id: "write", label: "Write", subtitle: "Composing report", Icon: PenLine },
  {
    id: "critique",
    label: "Critique",
    subtitle: "Reviewing quality",
    Icon: MessageSquare,
  },
];

interface Props {
  currentStep: AgentStepId | null;
  completedSteps: AgentStepId[];
  status: "running" | "done" | "error";
}

export default function AgentPipeline({
  currentStep,
  completedSteps,
  status,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <p className="text-center text-xs text-[#555] uppercase tracking-widest mb-6 font-mono">
        Multi-Agent Pipeline
      </p>

      <div className="relative flex items-start justify-between">
        {/* Connecting line */}
        <div className="absolute top-6 left-0 right-0 h-px bg-[#1e1e1e] z-0" />
        <motion.div
          className="absolute top-6 left-0 h-px bg-gradient-to-r from-[#e8a020] to-[#e8a020]/30 z-0"
          initial={{ width: "0%" }}
          animate={{
            width:
              status === "done"
                ? "100%"
                : currentStep === "search"
                  ? "0%"
                  : currentStep === "read"
                    ? "33%"
                    : currentStep === "write"
                      ? "66%"
                      : currentStep === "critique"
                        ? "90%"
                        : "0%",
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(step.id);
          const isRunning = currentStep === step.id;
          const isPending = !isCompleted && !isRunning;

          return (
            <motion.div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2 flex-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Circle icon */}
              <div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500
                  ${isRunning ? "border-[#e8a020] bg-[#1a1400] shadow-[0_0_20px_rgba(232,160,32,0.4)]" : ""}
                  ${isCompleted ? "border-[#10b981] bg-[#0a1a14]" : ""}
                  ${isPending ? "border-[#222] bg-[#111]" : ""}
                `}
              >
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#e8a020]/30"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {isCompleted ? (
                  <CheckCircle2 size={18} className="text-[#10b981]" />
                ) : isRunning ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={18} className="text-[#e8a020]" />
                  </motion.div>
                ) : (
                  <step.Icon size={18} className="text-[#333]" />
                )}
              </div>

              {/* Label */}
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`text-xs font-semibold tracking-wide font-mono transition-colors ${
                    isRunning
                      ? "text-[#e8a020]"
                      : isCompleted
                        ? "text-[#10b981]"
                        : "text-[#444]"
                  }`}
                >
                  {step.label}
                </span>
                {isRunning && (
                  <motion.span
                    className="text-[10px] text-[#e8a020]/60"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {step.subtitle}
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
