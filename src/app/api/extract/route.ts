import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s\)\"\']+/g) ?? [];
  // deduplicate and limit to top 3
  return [...new Set(matches)].slice(0, 3);
}

async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10_000),
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, aside, iframe").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text.slice(0, 2500);
}

export async function POST(req: NextRequest) {
  try {
    const { searchResult } = await req.json();
    if (!searchResult?.trim()) {
      return NextResponse.json(
        { error: "Search result is required" },
        { status: 400 },
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const urls = extractUrls(searchResult);
    if (urls.length === 0) {
      return NextResponse.json({
        result: "No URLs found in search results to extract.",
      });
    }

    // Scrape each URL
    const scraped: { url: string; content: string }[] = [];
    for (const url of urls) {
      try {
        const content = await scrapeUrl(url);
        scraped.push({ url, content });
      } catch {
        scraped.push({ url, content: `[Could not scrape: ${url}]` });
      }
    }

    const combined = scraped
      .map((s) => `### From: ${s.url}\n${s.content}`)
      .join("\n\n---\n\n");

    // Gemini extraction
    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { temperature: 0 },
    });

    const prompt = `You are a content extraction expert. From the following scraped web pages, extract the most relevant, detailed, and structured information.

For each source:
1. State the URL
2. Extract the most important facts, data, and insights
3. Organize information in structured bullet points or sections

Scraped Content:
${combined}

Format your extraction clearly in Markdown with sections per source:`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Extract failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
