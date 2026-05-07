export type AgentStepId = "search" | "read" | "write" | "critique";

export interface AgentStep {
  id: AgentStepId;
  label: string;
  description: string;
}

export interface ResearchResult {
  id: string;
  topic: string;
  search: string;
  content: string;
  report: string;
  feedback: string;
  createdAt: string;
}

export interface ResearchState {
  status: "idle" | "running" | "done" | "error";
  currentStep: AgentStepId | null;
  completedSteps: AgentStepId[];
  result: Partial<ResearchResult>;
  topic: string;
  error?: string;
}

export type StreamEvent =
  | { type: "step"; step: AgentStepId }
  | {
      type: "data";
      key: "search" | "content" | "report" | "feedback";
      value: string;
    }
  | { type: "done" }
  | { type: "error"; message: string };
