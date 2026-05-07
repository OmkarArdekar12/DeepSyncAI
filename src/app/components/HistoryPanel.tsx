import React from "react";
import { MdHistory } from "react-icons/md";
import { LuGlobe } from "react-icons/lu";
import { HistoryItem } from "../types";

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryPanel = ({ history, onSelect }: HistoryPanelProps) => {
  const formatContent = (content: string, maxLength: number = 80): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-full bg-black/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-600/95">
      <div className="w-full flex flex-col items-start bg-black/50 p-6 border-b border-blue-600/95">
        <h2 className="text-xl font-semibold text-gray-200">Recent Research</h2>
        <p className="text-gray-400 text-sm mt-1">
          Your previous research sessions
        </p>
      </div>
      <div className="p-4 max-h-120 overflow-y-auto deepsync-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-full bg-black/50 rounded-full flex items-center justify-center">
              <MdHistory className="size-7 text-gray-400 m-4" />
            </div>
            <p className="text-gray-500 text-sm">No research yet</p>
            <p className="text-gray-600 text-xs mt-1">
              Your sessions will appear here
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-3">
            {history.map((item) => (
              <div
                onClick={() => onSelect(item)}
                key={item.id}
                className="w-full flex flex-col items-center p-4 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-all duration-200 group backdrop-blur-sm bg-black/50 cursor-pointer"
              >
                <div className="w-full flex flex-col items-start justify-center gap-1 mb-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-tl from-blue-600/95 via-cyan-600/95 to-blue-500/95 py-1 px-4 rounded-xl">
                    <LuGlobe className="size-4" />
                    <span className="text-sm font-medium text-gray-200">
                      Research
                    </span>
                  </div>
                  <span className="pl-1 pt-1 text-xs text-gray-400 group-hover:text-gray-300">
                    {item.timestamp}
                  </span>
                </div>
                <div className="w-full flex flex-col space-y-2 pl-1">
                  <div className="w-full">
                    <p className="text-xs font-medium text-gray-300 mb-1">
                      Topic
                    </p>
                    <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-semibold">
                      {formatContent(item.topic, 60)}
                    </p>
                  </div>
                  {item.memory.report && (
                    <div className="w-full">
                      <p className="text-xs font-medium text-gray-300 mb-1">
                        Report Preview
                      </p>
                      <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
                        {formatContent(item.memory.report, 90)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
