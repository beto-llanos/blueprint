import Anthropic from "@anthropic-ai/sdk";
import { scanUser } from "./scan";
import type { ScanResult, TeamReport } from "./types";
import {
  TEAM_SCHEMA,
  TEAM_SYSTEM_PROMPT,
  buildTeamUserPrompt,
} from "./prompt-team";

const client = new Anthropic();

export class TeamError extends Error {}

export const TEAM_MAX_MEMBERS = 6;

const TEAM_TTL_MS = 60 * 60 * 1000;
const teamCache = new Map<
  string,
  { value: TeamReport; expires: number }
>();

function teamCacheKey(teamName: string, members: ScanResult[]): string {
  const sorted = members
    .map((m) => m.username.toLowerCase())
    .sort()
    .join(",");
  return `${teamName.toLowerCase()}::${sorted}`;
}

export async function scanTeam(
  rawUsernames: string[],
): Promise<{ members: ScanResult[]; errors: { username: string; error: string }[] }> {
  const usernames = Array.from(
    new Set(
      rawUsernames
        .map((u) => u.trim().replace(/^@/, "").toLowerCase())
        .filter((u) => u && /^[a-zA-Z0-9-]{1,39}$/.test(u)),
    ),
  ).slice(0, TEAM_MAX_MEMBERS);

  const settled = await Promise.allSettled(usernames.map((u) => scanUser(u)));
  const members: ScanResult[] = [];
  const errors: { username: string; error: string }[] = [];
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") {
      members.push(r.value);
    } else {
      errors.push({
        username: usernames[i],
        error: r.reason instanceof Error ? r.reason.message : String(r.reason),
      });
    }
  });
  return { members, errors };
}

export async function generateTeamReport(
  teamName: string,
  members: ScanResult[],
): Promise<TeamReport> {
  if (members.length < 2) {
    throw new TeamError("Need at least 2 valid builders for a team scan");
  }
  const cacheKey = teamCacheKey(teamName, members);
  const hit = teamCache.get(cacheKey);
  if (hit && Date.now() < hit.expires) return hit.value;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    system: [
      {
        type: "text",
        text: TEAM_SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    thinking: { type: "disabled" },
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: TEAM_SCHEMA,
      },
    },
    messages: [
      {
        role: "user",
        content: buildTeamUserPrompt(teamName, members),
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new TeamError("No text response from Claude");
  }
  try {
    const parsed = JSON.parse(text.text) as TeamReport;
    teamCache.set(cacheKey, {
      value: parsed,
      expires: Date.now() + TEAM_TTL_MS,
    });
    return parsed;
  } catch {
    throw new TeamError("Failed to parse team response");
  }
}
