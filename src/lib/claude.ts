import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisReport, GitHubSnapshot } from "./types";
import { REPORT_SCHEMA, SYSTEM_PROMPT, buildUserPrompt } from "./prompt";

const client = new Anthropic();

export class ClaudeError extends Error {}

export async function generateReport(
  snapshot: GitHubSnapshot,
): Promise<AnalysisReport> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 16000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    thinking: { type: "disabled" },
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: REPORT_SCHEMA,
      },
    },
    messages: [
      {
        role: "user",
        content: buildUserPrompt(snapshot),
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new ClaudeError("No text response from Claude");
  }
  try {
    return JSON.parse(text.text) as AnalysisReport;
  } catch {
    throw new ClaudeError("Failed to parse Claude response as JSON");
  }
}
