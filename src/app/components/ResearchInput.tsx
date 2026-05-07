"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  LuGlobe,
  LuDatabase,
  LuFileText,
  LuStar,
  LuSearch,
  LuCircle,
  LuLoader,
} from "react-icons/lu";
import { RingLoader } from "react-spinners";
import { AnimatePresence, motion } from "framer-motion";
import { MemoryState } from "../types";
import DeepSyncOutput from "./DeepSyncOutput";
import CompleteDeepSyncOutput from "./CompleteDeepSyncOutput";

interface ResearchInputProps {
  onComplete: (topic: string, memory: MemoryState) => void;
}

type StepKey = keyof MemoryState;

const STEPS: {
  key: StepKey;
  label: string;
  badge: string;
  Icon: React.ElementType;
}[] = [
  {
    key: "search",
    label: "Search Results",
    badge: "Tavily Web Search",
    Icon: LuGlobe,
  },
  {
    key: "extract",
    label: "Extracted Content",
    badge: "URL Scraper",
    Icon: LuDatabase,
  },
  {
    key: "report",
    label: "Research Report",
    badge: "Gemini AI",
    Icon: LuFileText,
  },
  { key: "critic", label: "Critic Analysis", badge: "Gemini AI", Icon: LuStar },
];

const ResearchInput = ({ onComplete }: ResearchInputProps) => {
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<StepKey | null>(null);
  const [activeTab, setActiveTab] = useState<StepKey>("search");
  const [memory, setMemory] = useState<MemoryState>({
    search: "",
    extract: "",
    report: "",
    critic: "",
  });
  const [hasResult, setHasResult] = useState(false);
  const [typedSteps, setTypedSteps] = useState<Set<StepKey>>(new Set());

  const updateMemory = (key: StepKey, value: string) => {
    setMemory((prev) => ({ ...prev, [key]: value }));
    setActiveTab(key);
  };

  const handleResearch = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic to research.", { id: "topic-error" });
      return;
    }

    setLoading(true);
    setHasResult(false);
    setActiveTab("search");
    setMemory({ search: "", extract: "", report: "", critic: "" });
    setTypedSteps(new Set());

    const m: MemoryState = { search: "", extract: "", report: "", critic: "" };

    try {
      //Search
      setCurrentStep("search");
      toast.success("Searching the web with Tavily...", { id: "step-search" });
      const searchRes = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const searchData = await searchRes.json();
      if (!searchRes.ok) throw new Error(searchData.error ?? "Search failed");
      m.search = searchData.result;
      updateMemory("search", m.search);

      //Extract
      setCurrentStep("extract");
      toast.success("Extracting content from sources...", {
        id: "step-extract",
      });
      const extractRes = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchResult: m.search }),
      });
      const extractData = await extractRes.json();
      if (!extractRes.ok)
        throw new Error(extractData.error ?? "Extract failed");
      m.extract = extractData.result;
      updateMemory("extract", m.extract);

      //Report
      setCurrentStep("report");
      toast.success("Generating research report...", { id: "step-report" });
      const reportRes = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          searchResult: m.search,
          extractResult: m.extract,
        }),
      });
      const reportData = await reportRes.json();
      if (!reportRes.ok) throw new Error(reportData.error ?? "Report failed");
      m.report = reportData.result;
      updateMemory("report", m.report);

      //Critic
      setCurrentStep("critic");
      toast.success("Running critic analysis...", { id: "step-critic" });
      const criticRes = await fetch("/api/critic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          searchResult: m.search,
          extractResult: m.extract,
          reportResult: m.report,
        }),
      });
      const criticData = await criticRes.json();
      if (!criticRes.ok) throw new Error(criticData.error ?? "Critic failed");
      m.critic = criticData.result;
      updateMemory("critic", m.critic);

      setHasResult(true);
      setCurrentStep(null);
      toast.success("Research complete!", { id: "step-done" });
      onComplete(topic, m);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Research failed";
      toast.error(msg, { id: "research-error" });
    } finally {
      setLoading(false);
      setCurrentStep(null);
    }
  };

  const showResults = hasResult || STEPS.some((s) => memory[s.key]);

  return (
    <div className="w-full flex flex-col justify-center space-y-6 transition-all duration-200">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Deep Research</h2>
      </div>

      <div className="w-full flex flex-col items-center justify-center space-y-4 p-1">
        <div className="w-full flex flex-col justify-center p-2 gap-2">
          <div className="w-full flex items-center justify-between px-2">
            <label className="block text-sm font-medium text-gray-300 ml-1">
              Research Topic
            </label>
            <span className="text-sm text-gray-400 mr-1">
              {topic.length} chars
            </span>
          </div>
          <textarea
            rows={3}
            spellCheck={false}
            value={topic}
            readOnly={loading}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={
              "Enter any topic you want to deeply research…\ne.g. The future of quantum computing, Climate change strategies, History of Rome"
            }
            className={`w-full bg-black/60 text-blue-100 placeholder:text-blue-400/40 rounded-xl border border-blue-500/40 px-4 py-3 font-normal text-md leading-relaxed backdrop-blur-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 ease-out resize-none overflow-y-auto deepsync-scrollbar ${loading ? "cursor-not-allowed opacity-70" : ""}`}
          />
        </div>

        <div className="w-full flex items-center justify-center p-1">
          <button
            onClick={handleResearch}
            disabled={loading || !topic.trim()}
            className="w-full inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white bg-blue-600/95 shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:text-black transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-500/60 disabled:hover:text-white"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RingLoader size={25} color="white" />
                {currentStep
                  ? `Running ${STEPS.find((s) => s.key === currentStep)?.label}...`
                  : "Processing..."}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <LuSearch className="size-5" />
                <span>Start Deep Research</span>
              </span>
            )}
          </button>
        </div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full mt-2"
          >
            <div className="w-full flex flex-wrap items-end gap-1 border-b border-blue-600/60 bg-black/30 backdrop-blur-md rounded-t-xl px-2 pt-2">
              {STEPS.map(({ key, label, Icon }) => {
                const isDone = !!memory[key];
                const isRunning = currentStep === key;
                const isActive = activeTab === key;
                const isLocked = !isDone && !isRunning;

                return (
                  <button
                    key={key}
                    onClick={() => isDone && setActiveTab(key)}
                    disabled={isLocked}
                    className={`
                      relative flex items-center gap-2 px-5 py-2.5 rounded-t-lg font-semibold text-sm
                      transition-all duration-200 select-none
                      ${
                        isActive && isDone
                          ? "bg-gradient-to-r from-blue-600/95 via-cyan-600/80 to-blue-500/95 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
                          : isDone
                            ? "text-blue-300 hover:text-white hover:bg-blue-700/30 cursor-pointer"
                            : isRunning
                              ? "text-blue-400/80 animate-pulse cursor-default"
                              : "text-gray-600 cursor-not-allowed"
                      }
                    `}
                  >
                    {isRunning ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="inline-flex"
                      >
                        <LuLoader size={15} className="text-blue-400" />
                      </motion.span>
                    ) : isDone ? (
                      <LuCircle
                        size={15}
                        className={isActive ? "text-white" : "text-blue-400"}
                      />
                    ) : (
                      <Icon size={15} />
                    )}
                    <span>{label}</span>

                    {isActive && isDone && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/50 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="w-full bg-black/40 backdrop-blur-md rounded-b-xl border border-t-0 border-blue-600/40 min-h-40">
              <AnimatePresence mode="wait">
                {STEPS.map(({ key, label, badge }) => {
                  const shouldType = !typedSteps.has(key);

                  return activeTab === key && memory[key] ? (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      {shouldType ? (
                        <DeepSyncOutput
                          output={memory[key]}
                          outputType={label}
                          badge={badge}
                          onComplete={() => {
                            setTypedSteps((prev) => new Set(prev).add(key));
                          }}
                        />
                      ) : (
                        <CompleteDeepSyncOutput
                          output={memory[key]}
                          outputType={label}
                          badge={badge}
                        />
                      )}
                    </motion.div>
                  ) : null;
                })}

                {currentStep &&
                  activeTab === currentStep &&
                  !memory[currentStep] && (
                    <motion.div
                      key="loading-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center gap-3 py-16 text-blue-400/60"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <LuLoader size={28} />
                      </motion.div>
                      <span className="text-sm font-medium">
                        {STEPS.find((s) => s.key === currentStep)?.label} in
                        progress...
                      </span>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResearchInput;

// "use client";

// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import {
//   LuGlobe,
//   LuDatabase,
//   LuFileText,
//   LuStar,
//   LuSearch,
// } from "react-icons/lu";
// import { RingLoader } from "react-spinners";
// import { MemoryState } from "../types";
// import DeepSyncOutput from "./DeepSyncOutput";

// interface ResearchInputProps {
//   onComplete: (topic: string, memory: MemoryState) => void;
// }

// type StepKey = keyof MemoryState;

// const STEPS: {
//   key: StepKey;
//   label: string;
//   badge: string;
//   Icon: React.ElementType;
// }[] = [
//   {
//     key: "search",
//     label: "Search Results",
//     badge: "Tavily Web Search",
//     Icon: LuGlobe,
//   },
//   {
//     key: "extract",
//     label: "Extracted Content",
//     badge: "URL Scraper",
//     Icon: LuDatabase,
//   },
//   {
//     key: "report",
//     label: "Research Report",
//     badge: "Gemini AI",
//     Icon: LuFileText,
//   },
//   { key: "critic", label: "Critic Analysis", badge: "Gemini AI", Icon: LuStar },
// ];

// const ResearchInput = ({ onComplete }: ResearchInputProps) => {
//   const [topic, setTopic] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [currentStep, setCurrentStep] = useState<StepKey | null>(null);
//   const [memory, setMemory] = useState<MemoryState>({
//     search: "",
//     extract: "",
//     report: "",
//     critic: "",
//   });
//   const [hasResult, setHasResult] = useState(false);

//   const updateMemory = (key: StepKey, value: string) => {
//     setMemory((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleResearch = async () => {
//     if (!topic.trim()) {
//       toast.error("Please enter a topic to research.", { id: "topic-error" });
//       return;
//     }

//     setLoading(true);
//     setHasResult(false);
//     setMemory({ search: "", extract: "", report: "", critic: "" });

//     const newMemory: MemoryState = {
//       search: "",
//       extract: "",
//       report: "",
//       critic: "",
//     };

//     try {
//       setCurrentStep("search");
//       toast.success("Searching the web with Tavily...", { id: "step-search" });
//       const searchRes = await fetch("/api/search", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ topic }),
//       });
//       const searchData = await searchRes.json();
//       if (!searchRes.ok) throw new Error(searchData.error ?? "Search failed");
//       newMemory.search = searchData.result;
//       updateMemory("search", searchData.result);

//       setCurrentStep("extract");
//       toast.success("Extracting content from sources...", {
//         id: "step-extract",
//       });
//       const extractRes = await fetch("/api/extract", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ searchResult: newMemory.search }),
//       });
//       const extractData = await extractRes.json();
//       if (!extractRes.ok)
//         throw new Error(extractData.error ?? "Extract failed");
//       newMemory.extract = extractData.result;
//       updateMemory("extract", extractData.result);

//       setCurrentStep("report");
//       toast.success("Generating research report...", { id: "step-report" });
//       const reportRes = await fetch("/api/report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           topic,
//           searchResult: newMemory.search,
//           extractResult: newMemory.extract,
//         }),
//       });
//       const reportData = await reportRes.json();
//       if (!reportRes.ok) throw new Error(reportData.error ?? "Report failed");
//       newMemory.report = reportData.result;
//       updateMemory("report", reportData.result);

//       setCurrentStep("critic");
//       toast.success("Running critic analysis...", { id: "step-critic" });
//       const criticRes = await fetch("/api/critic", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           topic,
//           searchResult: newMemory.search,
//           extractResult: newMemory.extract,
//           reportResult: newMemory.report,
//         }),
//       });
//       const criticData = await criticRes.json();
//       if (!criticRes.ok) throw new Error(criticData.error ?? "Critic failed");
//       newMemory.critic = criticData.result;
//       updateMemory("critic", criticData.result);

//       setHasResult(true);
//       setCurrentStep(null);
//       toast.success("Research complete!", { id: "step-done" });
//       onComplete(topic, newMemory);
//     } catch (err: unknown) {
//       const msg = err instanceof Error ? err.message : "Research failed";
//       toast.error(msg, { id: "research-error" });
//     } finally {
//       setLoading(false);
//       setCurrentStep(null);
//     }
//   };

//   const stepsDone = STEPS.filter((s) => memory[s.key]);
//   const showResults = hasResult || stepsDone.length > 0;

//   return (
//     <div className="w-full flex flex-col justify-center space-y-6 transition-all duration-200">
//       <div className="w-full flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-white">Deep Research</h2>
//       </div>

//       <div className="w-full flex flex-col items-center justify-center space-y-4 p-1">
//         <div className="w-full flex flex-col justify-center p-2 gap-2">
//           <div className="w-full flex items-center justify-between px-2">
//             <label className="block text-sm font-medium text-gray-300 ml-1">
//               Research Topic
//             </label>
//             <span className="text-sm text-gray-400 mr-1">
//               {topic.length} chars
//             </span>
//           </div>
//           <textarea
//             rows={3}
//             spellCheck={false}
//             value={topic}
//             readOnly={loading}
//             onChange={(e) => setTopic(e.target.value)}
//             placeholder="Enter any topic you want to deeply research…&#10;e.g. The future of quantum computing, Climate change strategies, History of Rome"
//             className={`w-full bg-black/60 text-blue-100 placeholder:text-blue-400/40 rounded-xl border border-blue-500/40 px-4 py-3 font-normal text-md leading-relaxed backdrop-blur-md focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 ease-out resize-none overflow-y-auto deepsync-scrollbar ${
//               loading ? "cursor-not-allowed opacity-70" : ""
//             }`}
//           />
//         </div>
//         <div className="w-full flex items-center justify-center p-1">
//           <button
//             onClick={handleResearch}
//             disabled={loading || !topic.trim()}
//             className="w-full inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white bg-blue-600/95 shadow-lg shadow-blue-500/25 hover:bg-blue-500 hover:text-black transition-all duration-200 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-500/60 disabled:hover:text-white"
//           >
//             {loading ? (
//               <span className="flex items-center gap-2">
//                 <RingLoader size={25} color="white" />
//                 {currentStep
//                   ? `Running ${STEPS.find((s) => s.key === currentStep)?.label}...`
//                   : "Processing..."}
//               </span>
//             ) : (
//               <span className="flex items-center gap-3">
//                 <LuSearch className="size-5" />
//                 <span>Start Deep Research</span>
//               </span>
//             )}
//           </button>
//         </div>
//         {loading && (
//           <div className="w-full flex items-center justify-between gap-2 px-2 py-3">
//             {STEPS.map(({ key, label, Icon }) => {
//               const isDone = !!memory[key];
//               const isActive = currentStep === key;
//               return (
//                 <div
//                   key={key}
//                   className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-300 ${
//                     isDone
//                       ? "border-blue-500/60 bg-blue-500/10"
//                       : isActive
//                         ? "border-blue-400/80 bg-blue-400/10 animate-pulse"
//                         : "border-gray-700/50 bg-black/20"
//                   }`}
//                 >
//                   <Icon
//                     size={18}
//                     className={
//                       isDone
//                         ? "text-blue-400"
//                         : isActive
//                           ? "text-blue-300"
//                           : "text-gray-600"
//                     }
//                   />
//                   <span
//                     className={`text-xs text-center font-medium ${
//                       isDone
//                         ? "text-blue-400"
//                         : isActive
//                           ? "text-blue-300"
//                           : "text-gray-600"
//                     }`}
//                   >
//                     {label}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//         {showResults && (
//           <div className="w-full flex flex-col gap-0">
//             {STEPS.map(({ key, label, badge, Icon }) => {
//               const content = memory[key];
//               if (!content) return null;
//               return (
//                 <div key={key} className="w-full">
//                   <DeepSyncOutput
//                     output={content}
//                     outputType={label}
//                     badge={badge}
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResearchInput;
