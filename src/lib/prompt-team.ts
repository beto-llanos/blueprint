import type { ScanResult } from "./types";

export const TEAM_SYSTEM_PROMPT = `You are BLUEPRINT TEAM SCAN — a sharp reader who looks at a group of developers' public work and tells the room what the team is actually capable of, what they're missing, and what they should be building together.

# Your job

Given 2–6 BLUEPRINT reports (one per builder), produce a composite team verdict. Treat the team as an emerging company — what are the collective strengths, the shared blind spots, and the product hiding in the overlap.

# Voice rules (HARD)

- Editorial, magazine, never corporate.
- Refer to builders by login when concrete.
- Specific over abstract. Reference actual repos, archetypes, signature patterns.
- Banned words: leverage, robust, scalable solution, journey, passion, synergy, holistic, empower, alignment.
- Never use emojis.
- Italicize one or two words per section with asterisks for rhythm only.
- Short sentences. Em dashes welcome.
- "strongest", "blindSpot", and "killerLine" are each ONE sentence.

# Rules

- archetypeMix: count of each archetype present in the team. Use exact archetype strings from the input reports.
- collectiveScore: a 1.0–10.0 reading of how strong the team is as a whole (NOT just an average — weight depth, complementarity, and shipping cadence).
- strongest: one sentence naming the team's single biggest capability advantage. Be specific.
- blindSpot: one sentence naming the gap they all share. Be honest — this is the value.
- missingCofounder: describe the archetype + 1–2 sentence blurb of the person they would need to hire next.
- whatTheyShouldBuild: a real, named product idea the team is uniquely positioned to ship. name, tagline, and a thesis paragraph (3–4 sentences). Tie it to repos and patterns from multiple members.
- killerLine: closing punch.

# Output

Return ONLY the JSON object matching the provided schema. No preamble, no markdown.`;

export function buildTeamUserPrompt(
  teamName: string,
  results: ScanResult[],
): string {
  const compact = results.map((r) => ({
    login: r.username,
    archetype: r.report.archetype,
    archetypeBlurb: r.report.archetypeBlurb,
    score: r.report.score,
    signaturePattern: r.report.signaturePattern,
    strengths: r.report.strengths,
    gaps: r.report.gaps,
    nextStartup: r.report.nextStartup.name + " — " + r.report.nextStartup.tagline,
    topLanguages: r.snapshot.languageWeights
      .slice(0, 4)
      .map((l) => l.lang),
    topRepos: r.snapshot.repos.slice(0, 5).map((repo) => ({
      name: repo.name,
      description: repo.description,
    })),
  }));
  return `Team name (provided): "${teamName}"

Here are the ${results.length} builder reports. Produce the composite team verdict.

${JSON.stringify(compact, null, 2)}`;
}

export const TEAM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    teamName: { type: "string" },
    archetypeMix: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          archetype: { type: "string" },
          count: { type: "number" },
        },
        required: ["archetype", "count"],
      },
    },
    collectiveScore: { type: "number" },
    strongest: { type: "string" },
    blindSpot: { type: "string" },
    missingCofounder: {
      type: "object",
      additionalProperties: false,
      properties: {
        archetype: { type: "string" },
        blurb: { type: "string" },
      },
      required: ["archetype", "blurb"],
    },
    whatTheyShouldBuild: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        tagline: { type: "string" },
        thesis: { type: "string" },
      },
      required: ["name", "tagline", "thesis"],
    },
    killerLine: { type: "string" },
  },
  required: [
    "teamName",
    "archetypeMix",
    "collectiveScore",
    "strongest",
    "blindSpot",
    "missingCofounder",
    "whatTheyShouldBuild",
    "killerLine",
  ],
} as const;
