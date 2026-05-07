"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { LuCopy } from "react-icons/lu";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface HistoryOutputProps {
  outputType: string;
  output: string;
}

const HistoryOutput = ({ outputType, output }: HistoryOutputProps) => {
  const copyToClipboard = async (text: string, label?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label ? `${label} copied` : "Copied to clipboard", {
        id: "copy-success",
      });
    } catch {
      toast.error("Failed to copy to clipboard", { id: "copy-error" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 px-2 mt-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-semibold text-blue-300">{outputType}</h3>
        <span className="text-xs text-blue-400/60">DeepSyncAI</span>
      </div>
      <div className="relative w-full max-h-72 overflow-y-auto deepsync-scrollbar bg-black/60 backdrop-blur-md rounded-xl border border-blue-500/90 px-5 py-8 text-blue-50 text-md leading-relaxed whitespace-normal">
        <button
          onClick={() => copyToClipboard(output, outputType)}
          className="absolute flex items-center justify-center gap-1 right-3 top-3 text-xs text-blue-300 hover:text-blue-200 transition cursor-pointer border border-gray-800 p-1 rounded-md"
          type="button"
        >
          <LuCopy />
          <span>Copy</span>
        </button>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1({ children }) {
              return (
                <h1 className="text-blue-200 text-xl font-bold mb-2">
                  {children}
                </h1>
              );
            },
            h2({ children }) {
              return (
                <h2 className="text-blue-200 text-lg font-semibold mb-2 border-b border-blue-500/20 pb-1">
                  {children}
                </h2>
              );
            },
            h3({ children }) {
              return (
                <h3 className="text-blue-200 font-semibold mb-1">{children}</h3>
              );
            },
            p({ children }) {
              return (
                <p className="text-blue-50 leading-relaxed mb-2">{children}</p>
              );
            },
            strong({ children }) {
              return (
                <strong className="text-blue-200 font-semibold">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="text-blue-200 italic">{children}</em>;
            },
            ul({ children }) {
              return (
                <ul className="list-disc pl-5 text-blue-50">{children}</ul>
              );
            },
            ol({ children }) {
              return (
                <ol className="list-decimal pl-5 text-blue-50">{children}</ol>
              );
            },
            li({ children }) {
              return <li className="list-item leading-relaxed">{children}</li>;
            },
            blockquote({ children }) {
              return (
                <blockquote className="border-l-2 border-blue-500/60 pl-4 text-blue-200/90 italic">
                  {children}
                </blockquote>
              );
            },
            a({ href, children }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline underline-offset-2 hover:text-blue-200 transition break-all"
                >
                  {children}
                </a>
              );
            },
            hr() {
              return <hr className="border-blue-500/30 my-3" />;
            },
            code({ className, children }) {
              if (!className) {
                return (
                  <code className="bg-blue-500/10 text-blue-300 px-1 rounded">
                    {children}
                  </code>
                );
              }
              return <code className={className}>{children}</code>;
            },
            pre({ children }) {
              if (!React.isValidElement(children)) return null;
              const codeElement = children as React.ReactElement<{
                className?: string;
                children?: React.ReactNode;
              }>;
              const codeText = String(codeElement.props.children ?? "");
              const className = codeElement.props.className || "";
              const match = /language-(\w+)/.exec(className);
              return (
                <div className="relative my-3 rounded-lg border border-blue-500/40 bg-black/80 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-blue-500/30 bg-black/90">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500/80" />
                    </div>
                    <button
                      onClick={() => copyToClipboard(codeText, "Code")}
                      className="flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200"
                      type="button"
                    >
                      <LuCopy size={14} />
                      <span>Copy</span>
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match ? match[1] : "text"}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      background: "transparent",
                      padding: "1rem",
                    }}
                  >
                    {codeText.replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            },
          }}
        >
          {output}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default HistoryOutput;
