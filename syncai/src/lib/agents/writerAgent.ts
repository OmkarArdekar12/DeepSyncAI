import { getModel } from "../llm";

export async function runWriterAgent(
  topic: string,
  research: string,
): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(
    `You are an expert research writer. Write a detailed, well-structured research report in Markdown format.

Topic: ${topic}

Research Material:
${research.slice(0, 3000)}

Write a comprehensive report with these sections:
# ${topic}

## Introduction
## Key Findings
## Analysis
## Conclusion
## Sources

Use Markdown formatting including headers, bullet points, and bold text where appropriate:`,
  );

  return result.response.text();
}
