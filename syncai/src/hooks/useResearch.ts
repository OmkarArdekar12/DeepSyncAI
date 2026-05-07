"use client";
import { useState, useCallback } from "react";
import { ResearchState, StreamEvent, AgentStepId } from "@/types";

const STEP_ORDER: AgentStepId[] = ["search", "read", "write", "critique"];

const INITIAL: ResearchState = {
  status: "idle",
  currentStep: null,
  completedSteps: [],
  result: {},
  topic: "",
};

export function useResearch() {
  const [state, setState] = useState<ResearchState>(INITIAL);

  const startResearch = useCallback(async (topic: string) => {
    setState({ ...INITIAL, status: "running", currentStep: "search", topic });

    let response: Response;
    try {
      response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
    } catch {
      setState((s) => ({
        ...s,
        status: "error",
        error: "Failed to connect to API.",
      }));
      return;
    }

    if (!response.ok || !response.body) {
      setState((s) => ({
        ...s,
        status: "error",
        error: "API returned an error.",
      }));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

      for (const line of lines) {
        try {
          const event: StreamEvent = JSON.parse(line.slice(6));

          if (event.type === "step") {
            setState((s) => ({
              ...s,
              currentStep: event.step,
              completedSteps: STEP_ORDER.slice(
                0,
                STEP_ORDER.indexOf(event.step),
              ),
            }));
          } else if (event.type === "data") {
            setState((s) => ({
              ...s,
              result: { ...s.result, [event.key]: event.value },
            }));
          } else if (event.type === "done") {
            setState((s) => ({
              ...s,
              status: "done",
              currentStep: null,
              completedSteps: [...STEP_ORDER],
            }));
          } else if (event.type === "error") {
            setState((s) => ({ ...s, status: "error", error: event.message }));
          }
        } catch {
          //skip malformed SSE lines
        }
      }
    }
  }, []);

  const reset = useCallback(() => setState(INITIAL), []);

  return { state, startResearch, reset };
}
