"use client";
import { useState, useEffect, useCallback } from "react";
import { ResearchResult } from "@/types";

const STORAGE_KEY = "research-history-v1";
const MAX_HISTORY = 50;

export function useHistory() {
  const [history, setHistory] = useState<ResearchResult[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  const persist = (items: ResearchResult[]) => {
    setHistory(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToHistory = useCallback((result: ResearchResult) => {
    setHistory((prev) => {
      const deduplicated = prev.filter((r) => r.id !== result.id);
      const next = [result, ...deduplicated].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => persist([]), []);

  return { history, addToHistory, deleteFromHistory, clearHistory };
}
