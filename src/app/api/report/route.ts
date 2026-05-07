import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelVersion, models } from "@/app/data/aiModel";

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
      model: models[modelVersion],
      generationConfig: { temperature: 0.3 },
    });

    // const combinedData = [
    //   searchResult ? `## Web Search Summary\n${searchResult}` : "",
    //   extractResult ? `## Extracted Source Content\n${extractResult}` : "",
    // ]
    //   .filter(Boolean)
    //   .join("\n\n")
    //   .slice(0, 5000);

    const safeSearch = searchResult?.slice(0, 8000) ?? "";
    const safeExtract = extractResult?.slice(0, 20000) ?? "";
    const combinedData = [
      safeSearch ? `## Web Search Summary\n${safeSearch}` : "",
      safeExtract ? `## Extracted Source Content\n${safeExtract}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    console.log(combinedData);

    const prompt = `
You are an expert research writer. 
Write a comprehensive, well-structured research report in Markdown format.

Important Rules:
- Use only the provided research data
- Do not hallucinate, invent facts, statistics, claims, or sources
- If information is incomplete or missing, explicitly mention the limitation
- Keep the report factual, analytical, and well-structured
- Use a professional and objective tone
- Support conclusions using the available evidence
- Avoid repetition and unnecessary filler content
- Use proper Markdown formatting throughout the report

Topic:
${topic}

Research Data:
${combinedData}

Write a comprehensive research report in the following Markdown structure:

# ${topic}

## Executive Summary
- Provide a concise 2-3 paragraph overview of the topic, major findings, and overall significance.

## Introduction
- Explain the background, context, and importance of the topic.
- Introduce key concepts and objectives of the research.

## Key Findings
- Provide 5-10 important evidence-backed findings.
- Use numbered points.
- Include relevant statistics, trends, or factual observations where available.

## Detailed Analysis
- Provide an in-depth analysis of the topic.
- Organize the analysis into logical subsections with clear headings.
- Compare perspectives, trends, opportunities, risks, limitations, and challenges where relevant.
- Use tables or bullet points if useful for clarity.

## Implications & Applications
- Explain the practical impact, real-world applications, and broader implications of the findings.
- Discuss how the research may affect industries, technology, society, business, education, or future developments where relevant.

## Limitations
- Mention any gaps, missing information, uncertainty, or limitations in the available research data.

## Conclusion
- Summarize the major insights and overall conclusions.
- Provide a balanced future outlook based on the evidence.

## Sources
- List only the sources and URLs explicitly provided in the research data.
- Do not invent or generate additional sources.

Return the final report in clean, professional Markdown format.`;

    const geminiResult = await model.generateContent(prompt);
    const result = geminiResult.response.text();

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Report generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
