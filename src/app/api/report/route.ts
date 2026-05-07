import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { topic, searchResult, extractResult } = await req.json();
    if (!topic?.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: "gemini-3-flash-preview",
      generationConfig: { temperature: 0.3 },
    });

    const combinedData = [
      searchResult ? `## Web Search Summary\n${searchResult}` : "",
      extractResult ? `## Extracted Source Content\n${extractResult}` : "",
    ]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 5000);

    const prompt = `You are an expert research writer. Write a comprehensive, well-structured research report in Markdown format.

**Topic:** ${topic}

**Research Data:**
${combinedData}

Write the report with these sections:

# ${topic}

## Executive Summary
(2-3 sentence overview)

## Introduction
(Background and context)

## Key Findings
(Numbered list of the most important discoveries)

## Detailed Analysis
(In-depth analysis of the topic with subsections as needed)

## Implications & Applications
(Real-world relevance and use cases)

## Conclusion
(Summary of insights and future outlook)

## Sources
(List the URLs referenced)

Use proper Markdown: headers, bold, bullet points, tables where appropriate. Be comprehensive and insightful.`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
