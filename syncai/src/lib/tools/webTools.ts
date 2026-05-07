import * as cheerio from "cheerio";

export async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) throw new Error("TAVILY_API_KEY is not set in .env.local");

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey, query, max_results: 5 }),
  });

  if (!res.ok) throw new Error(`Tavily API error: ${res.statusText}`);

  const data = await res.json();
  const results: { title: string; url: string; content: string }[] =
    data.results ?? [];

  return results
    .map(
      (r) =>
        `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.content?.slice(0, 300) ?? ""}`,
    )
    .join("\n----\n");
}

export async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10_000),
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside").remove();
  return $("body").text().replace(/\s+/g, " ").trim().slice(0, 3000);
}

export function extractFirstUrl(searchResults: string): string | null {
  const match = searchResults.match(/URL:\s*(https?:\/\/[^\n]+)/);
  return match ? match[1].trim() : null;
}
