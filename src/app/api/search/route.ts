import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelVersion, models } from "@/app/data/aiModel";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!TAVILY_API_KEY || !GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API keys not configured in .env.local" },
        { status: 500 },
      );
    }

    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: topic,
        max_results: 6,
        include_answer: true,
      }),
    });

    if (!tavilyRes.ok) {
      throw new Error(`Tavily API error: ${tavilyRes.statusText}`);
    }

    const tavilyData = await tavilyRes.json();
    const results: { title: string; url: string; content: string }[] =
      tavilyData.results ?? [];

    const rawResults = results
      .map(
        (r, i) =>
          `### Source ${i + 1}: ${r.title}\n**URL:** ${r.url}\n**Content:** ${r.content?.slice(0, 400) ?? ""}`,
      )
      .join("\n\n---\n\n");

    console.log(rawResults);

    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: models[modelVersion],
      generationConfig: { temperature: 0 },
    });

    const prompt = `
You are a research assistant. 
Synthesize the following web search results about "${topic}" into a clear, organized summary.

For each source, include:
- The title and URL (as a clickable markdown link)
- A concise summary of its key information

Then add a brief "Overall Summary" section at the end.

Search Results:
${rawResults}

Format your response in clean Markdown:`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
