import type { MatchReport, ScanResult } from "./types";
import { getStore } from "./store";
import {
  MATCH_SCHEMA,
  MATCH_SYSTEM_PROMPT,
  buildMatchUserPrompt,
} from "./prompt-match";
import { completeJSON } from "./openrouter";

export type Suggestion = {
  username: string;
  archetype: string;
  score: number;
  similarity: number;
  avatar_url: string;
  killerLine: string;
};

export async function findTopMatches(
  source: ScanResult,
  limit = 5,
): Promise<Suggestion[]> {
  const store = await getStore();
  const all = await store.list({ limit: 60 });
  const others = all.filter(
    (r) => r.username.toLowerCase() !== source.username.toLowerCase(),
  );
  return others
    .map((r) => ({
      username: r.username,
      archetype: r.report.archetype,
      score: r.report.score,
      similarity: quantSimilarity(source, r),
      avatar_url: r.snapshot.profile.avatar_url,
      killerLine: r.report.killerLine,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

export class MatchError extends Error {}

const MATCH_TTL_MS = 60 * 60 * 1000;
const matchCache = new Map<
  string,
  { value: MatchReport; expires: number }
>();

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
  const cacheKey = `${a.username.toLowerCase()}::${b.username.toLowerCase()}`;
  const hit = matchCache.get(cacheKey);
  if (hit && Date.now() < hit.expires) return hit.value;

  const json = await completeJSON({
    system: MATCH_SYSTEM_PROMPT,
    user: buildMatchUserPrompt(a, b),
    schema: MATCH_SCHEMA,
    maxTokens: 8000,
    title: "blueprint",
  });
  try {
    const parsed = JSON.parse(json) as MatchReport;
    matchCache.set(cacheKey, {
      value: parsed,
      expires: Date.now() + MATCH_TTL_MS,
    });
    return parsed;
  } catch {
    throw new MatchError("Failed to parse match response");
  }
}
