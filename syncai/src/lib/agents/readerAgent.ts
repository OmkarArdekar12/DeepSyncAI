import { getModel } from "../llm";
import { scrapeUrl, extractFirstUrl } from "../tools/webTools";

export async function runReaderAgent(searchResults: string): Promise<string> {
  const url = extractFirstUrl(searchResults);
  if (!url) return "No URL could be extracted from search results.";

  let pageContent: string;
  try {
    pageContent = await scrapeUrl(url);
  } catch (err) {
    return `Could not scrape ${url}: ${String(err)}`;
  }

  const model = getModel();
  const result = await model.generateContent(
    `You are a content extraction expert. From the following webpage content, extract the most relevant and detailed information.

URL: ${url}

Content:
${pageContent}

Extract and organize the key information in a structured format:`,
  );

  return result.response.text();
}
