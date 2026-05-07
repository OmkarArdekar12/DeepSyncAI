import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelVersion, models } from "@/app/data/aiModel";

export async function POST(req: NextRequest) {
  try {
    const { topic, searchResult, extractResult, reportResult } =
      await req.json();

    if (!reportResult?.trim()) {
      return NextResponse.json(
        { error: "Report result is required" },
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

    const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genai.getGenerativeModel({
      model: models[modelVersion],
      generationConfig: { temperature: 0.2 },
    });

    const safeSearch = searchResult?.slice(0, 15000) ?? "";
    const safeExtract = extractResult?.slice(0, 30000) ?? "";
    const safeReport = reportResult?.slice(0, 15000) ?? "";

    const prompt = `
You are an accurate, expert research critic.
Give higher scores as the report effectively incorporates accurate and up-to-date extracted data.
Critically evaluate the following research report based on the supporting search data and extracted content.

Topic: ${topic}

Research Report: ${safeReport}

Search Data: ${safeSearch}

Extracted Content: ${safeExtract}

Provide your critique in this exact Markdown format:

# Critic Analysis

## Overall Score
**Score: X / 5** — (one sentence justification)

## Strengths
- (specific strength 1)
- (specific strength 2)
- (specific strength 3)
- (more as needed)

## Weaknesses
- (specific weakness 1)
- (specific weakness 2)
- (specific weakness 3)
- (more as needed)

## Accuracy Assessment
(How well does the report reflect the actual source data? Is anything missing or misleading?)

## Improvement Suggestions
- (actionable suggestion 1)
- (actionable suggestion 2)
- (actionable suggestion 3)

## Final Verdict
(2-3 sentence final verdict on the quality, reliability, and usefulness of this research report)
Be honest, specific, and constructive. Support your critique with evidence from the report, search data, and extracted content.`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Critic analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
