import { NextRequest } from "next/server";
import { runSearchAgent } from "@/lib/agents/searchAgent";
import { runReaderAgent } from "@/lib/agents/readerAgent";
import { runWriterAgent } from "@/lib/agents/writerAgent";
import { runCriticAgent } from "@/lib/agents/criticAgent";
import { StreamEvent } from "@/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  if (!topic?.trim()) {
    return new Response(JSON.stringify({ error: "Topic is required" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      try {
        // Step 1: Search
        send({ type: "step", step: "search" });
        const search = await runSearchAgent(topic);
        send({ type: "data", key: "search", value: search });

        // Step 2: Read
        send({ type: "step", step: "read" });
        const content = await runReaderAgent(search);
        send({ type: "data", key: "content", value: content });

        // Step 3: Write
        send({ type: "step", step: "write" });
        const combined = `Search Summary:\n${search}\n\nDetailed Content:\n${content}`;
        const report = await runWriterAgent(topic, combined);
        send({ type: "data", key: "report", value: report });

        // Step 4: Critique
        send({ type: "step", step: "critique" });
        const feedback = await runCriticAgent(report);
        send({ type: "data", key: "feedback", value: feedback });

        send({ type: "done" });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
