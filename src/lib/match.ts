import Anthropic from "@anthropic-ai/sdk";
import type { MatchReport, ScanResult } from "./types";
import {
  MATCH_SCHEMA,
  MATCH_SYSTEM_PROMPT,
  buildMatchUserPrompt,
} from "./prompt-match";

const client = new Anthropic();

export class MatchError extends Error {}

const ARCHETYPE_AXES: Record<string, [number, number]> = {
  "The Tinkerer": [-1, 1],
  "The Architect": [1, 1],
  "The Storyteller": [0, -1],
  "The Operator": [1, 0],
  "The Wanderer": [-1, 0],
  "The Optimizer": [1, 1],
  "The Translator": [0, 0],
  "The Maverick": [-1, -1],
  "The Specialist": [1, -1],
  "The Connector": [0, 1],
};

function archetypeDistance(a: string, b: string): number {
  const A = ARCHETYPE_AXES[a] ?? [0, 0];
  const B = ARCHETYPE_AXES[b] ?? [0, 0];
  const dx = A[0] - B[0];
  const dy = A[1] - B[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function languageJaccard(
  aLangs: { lang: string }[],
  bLangs: { lang: string }[],
): number {
  const A = new Set(aLangs.slice(0, 6).map((l) => l.lang));
  const B = new Set(bLangs.slice(0, 6).map((l) => l.lang));
  const intersection = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size;
  if (!union) return 0;
  return intersection / union;
}

export function quantSimilarity(a: ScanResult, b: ScanResult): number {
  const archDist = archetypeDistance(a.report.archetype, b.report.archetype);
  const langOverlap = languageJaccard(
    a.snapshot.languageWeights,
    b.snapshot.languageWeights,
  );
  const scoreDelta = Math.abs(a.report.score - b.report.score);

  const archScore = Math.max(0, 1 - archDist / 2.83);
  const scoreScore = Math.max(0, 1 - scoreDelta / 5);
  const complementScore = 1 - langOverlap;

  const composite =
    0.45 * archScore + 0.3 * scoreScore + 0.25 * complementScore;
  return Math.round(composite * 1000) / 10;
}

export async function generateMatchReport(
  a: ScanResult,
  b: ScanResult,
): Promise<MatchReport> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: [
      {
        type: "text",
        text: MATCH_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    thinking: { type: "disabled" },
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: MATCH_SCHEMA,
      },
    },
    messages: [
      {
        role: "user",
        content: buildMatchUserPrompt(a, b),
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new MatchError("No text response from Claude");
  }
  try {
    const parsed = JSON.parse(text.text) as MatchReport;
    return parsed;
  } catch {
    throw new MatchError("Failed to parse match response");
  }
}
