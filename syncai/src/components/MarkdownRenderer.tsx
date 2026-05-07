"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div className={`markdown-body ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-[#f2e8d0] mb-4 mt-6 font-display">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-[#e8d5b0] mb-3 mt-5 font-display border-b border-[#2a2a1a] pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-[#d4c090] mb-2 mt-4">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[#b8b8b8] leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-none mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-[#b8b8b8]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[#b8b8b8] flex gap-2 items-start">
              <span className="text-[#e8a020] mt-1 flex-shrink-0">›</span>
              <span>{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-[#e8c870] font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-[#c8b890] italic">{children}</em>
          ),
          code: ({
            inline,
            children,
          }: {
            inline?: boolean;
            children?: React.ReactNode;
          }) =>
            inline ? (
              <code className="bg-[#1a1a10] text-[#e8c060] px-1.5 py-0.5 rounded text-sm font-mono border border-[#2a2a15]">
                {children}
              </code>
            ) : (
              <code className="block bg-[#0f0f08] text-[#d4c080] p-4 rounded-lg text-sm font-mono border border-[#2a2a15] mb-4 overflow-x-auto">
                {children}
              </code>
            ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#e8a020] pl-4 my-4 text-[#a0a0a0] italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e8a020] hover:text-[#f0b840] underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-[#2a2a1a] my-6" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="text-left text-[#e8c060] font-semibold p-2 border border-[#2a2a15] bg-[#1a1a10]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="text-[#b8b8b8] p-2 border border-[#2a2a15]">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
