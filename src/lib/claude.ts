import type { AnalysisReport, GitHubSnapshot } from "./types";
import { REPORT_SCHEMA, SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { completeJSON } from "./openrouter";

export class ClaudeError extends Error {}

export async function generateReport(
  snapshot: GitHubSnapshot,
): Promise<AnalysisReport> {
  const json = await completeJSON({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt(snapshot),
    schema: REPORT_SCHEMA,
    maxTokens: 16000,
    title: "blueprint",
  });
  try {
    return JSON.parse(json) as AnalysisReport;
  } catch {
    throw new ClaudeError("Failed to parse Claude response as JSON");
  }
}
