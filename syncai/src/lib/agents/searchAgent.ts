import { getModel } from "../llm";
import { tavilySearch } from "../tools/webTools";

export async function runSearchAgent(topic: string): Promise<string> {
  const rawResults = await tavilySearch(topic);

  const model = getModel();
  const result = await model.generateContent(
    `You are a research assistant. Synthesize these web search results about "${topic}" into a concise, organized summary. Preserve key facts and any important URLs.

Search Results:
${rawResults}

Provide a clear synthesis:`,
  );

  return result.response.text();
}
