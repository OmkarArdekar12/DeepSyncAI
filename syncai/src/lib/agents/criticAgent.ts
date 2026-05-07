import { getModel } from "../llm";

export async function runCriticAgent(report: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(
    `You are a strict research reviewer. Review the following research report and provide detailed feedback in Markdown format.

Report:
${report}

Provide your review with:

## Score
**X / 10**

## Strengths
- (bullet points)

## Weaknesses
- (bullet points)

## Verdict
(1–2 sentences summary)`,
  );

  return result.response.text();
}
