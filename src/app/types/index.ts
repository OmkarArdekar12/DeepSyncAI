import { IconType } from "react-icons";

export interface MemoryState {
  search: string;
  extract: string;
  report: string;
  critic: string;
}

export interface HistoryItem {
  id: number;
  topic: string;
  timestamp: string;
  memory: MemoryState;
}

export interface FeatureGrid {
  title: string;
  description: string;
  icon: IconType;
}
