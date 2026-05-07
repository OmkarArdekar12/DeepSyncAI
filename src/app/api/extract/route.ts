import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelVersion, models } from "@/app/data/aiModel";
import * as cheerio from "cheerio";

function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s\)\"\']+/g) ?? [];
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
  return text.slice(0, 8000);
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

    // const scraped: { url: string; content: string }[] = [];
    // for (const url of urls) {
    //   try {
    //     const content = await scrapeUrl(url);
    //     scraped.push({ url, content });
    //   } catch {
    //     scraped.push({ url, content: `[Could not scrape: ${url}]` });
    //   }
    // }
    const scraped = await Promise.all(
      urls.map(async (url) => {
        try {
          const content = await scrapeUrl(url);
          return { url, content };
        } catch {
          return { url, content: `[Could not scrape: ${url}]` };
        }
      }),
    );

    const combined = scraped
      .map((s) => `### From: ${s.url}\n${s.content}`)
      .join("\n\n---\n\n");

    // EXTRACT ROUTE
    console.log(
      `\n\n========== EXTRACT RESULT ==========\n\nLength: ${combined.length}\n\nPreview:\n${combined.slice(0, 100)}\n\n`,
    );

    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: models[modelVersion],
      generationConfig: { temperature: 0 },
    });

    const prompt = `
You are an expert content extraction and analysis system.
From the following scraped web pages, extract only the most relevant factual information.

Instructions:
- Ignore advertisements, navigation menus, cookie notices, footers, and unrelated content
- Preserve important facts, statistics, dates, names, and technical details
- Keep the information concise but detailed
- Do not hallucinate or invent information
- Organize the output clearly in Markdown

For each source:
1. State the URL
2. Provide a short overview
3. Extract the key facts and insights in bullet points
4. Include important numbers, statistics, and claims if available

Scraped Content:
${combined}

Return the final extraction in well-structured Markdown.`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Extract failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
