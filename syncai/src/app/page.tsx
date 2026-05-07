"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResearch } from "@/hooks/useResearch";
import { useHistory } from "@/hooks/useHistory";
import Sidebar from "@/components/Sidebar";
import ResearchForm from "@/components/ResearchForm";
import AgentPipeline from "@/components/AgentPipeline";
import ResultTabs from "@/components/ResultTabs";
import { ResearchResult } from "@/types";
import { AlertCircle } from "lucide-react";

export default function Page() {
  const { state, startResearch, reset } = useResearch();
  const { history, addToHistory, deleteFromHistory, clearHistory } =
    useHistory();
  const [selectedHistory, setSelectedHistory] = useState<ResearchResult | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Save completed research to history
  useEffect(() => {
    if (state.status === "done" && state.result.report && !selectedHistory) {
      const result: ResearchResult = {
        id: crypto.randomUUID(),
        topic: state.topic,
        search: state.result.search ?? "",
        content: state.result.content ?? "",
        report: state.result.report ?? "",
        feedback: state.result.feedback ?? "",
        createdAt: new Date().toISOString(),
      };
      addToHistory(result);
    }
  }, [state.status]);

  const handleSubmit = (topic: string) => {
    setSelectedHistory(null);
    startResearch(topic);
  };

  const handleNew = () => {
    reset();
    setSelectedHistory(null);
  };

  const handleSelectHistory = (result: ResearchResult) => {
    reset();
    setSelectedHistory(result);
  };

  // What to display in the results area
  const displayResult =
    selectedHistory ??
    (state.status === "done" ? (state.result as ResearchResult) : null);
  const displayTopic = selectedHistory?.topic ?? state.topic;

  const isRunning = state.status === "running";
  const isIdle = state.status === "idle" && !selectedHistory;
  const hasError = state.status === "error";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar */}
      <div className="relative">
        <Sidebar
          history={history}
          isOpen={sidebarOpen}
          selectedId={selectedHistory?.id}
          onToggle={() => setSidebarOpen((s) => !s)}
          onSelect={handleSelectHistory}
          onDelete={deleteFromHistory}
          onClear={clearHistory}
          onNew={handleNew}
        />
      </div>

      {/* Main */}
      <main
        className="flex-1 flex flex-col overflow-hidden bg-grid relative transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 0 : 0 }}
      >
        {/* Top bar */}
        <div
          className="flex items-center border-b border-[#1a1a1a] px-6 py-3 bg-[#0a0a0f]/80 backdrop-blur-sm flex-shrink-0"
          style={{ paddingLeft: sidebarOpen ? "1.5rem" : "3.5rem" }}
        >
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] font-mono text-[#333] uppercase tracking-widest">
              Gemini 2.0 · Tavily
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${isRunning ? "bg-[#e8a020] animate-pulse" : "bg-[#222]"}`}
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-8">
          <div
            className="max-w-3xl mx-auto"
            style={{ paddingLeft: !sidebarOpen ? "2rem" : "0" }}
          >
            {/* Idle landing */}
            <AnimatePresence mode="wait">
              {isIdle && !isRunning && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResearchForm onSubmit={handleSubmit} isLoading={false} />
                </motion.div>
              )}

              {/* Running state */}
              {isRunning && (
                <motion.div
                  key="running"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResearchForm
                    onSubmit={() => {}}
                    isLoading={true}
                    defaultTopic={state.topic}
                    compact
                  />
                  <AgentPipeline
                    currentStep={state.currentStep}
                    completedSteps={state.completedSteps}
                    status="running"
                  />

                  {/* Live preview of results as they stream in */}
                  {state.result.report && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-10"
                    >
                      <ResultTabs result={state.result} topic={state.topic} />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Error state */}
              {hasError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center min-h-[50vh] gap-4"
                >
                  <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
                    <AlertCircle size={16} />
                    {state.error ?? "Something went wrong"}
                  </div>
                  <button
                    onClick={handleNew}
                    className="text-xs text-[#555] hover:text-[#e8a020] font-mono underline underline-offset-2 transition-colors"
                  >
                    Try again
                  </button>
                </motion.div>
              )}

              {/* Results (done or from history) */}
              {displayResult && !isRunning && !hasError && (
                <motion.div
                  key={displayResult.id ?? "current"}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultTabs
                    result={displayResult}
                    topic={displayTopic}
                    onNewResearch={handleNew}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
