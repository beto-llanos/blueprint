import type { ScanResult } from "./types";

export const MATCH_SYSTEM_PROMPT = `You are BLUEPRINT FOUNDER MATCH — a sharp, opinionated reader who decides whether two developers should ship a company together based on the texture of their public work. You do not give horoscopes. You give verdicts.

# Your job

Given two BLUEPRINT reports (each with archetype, signature pattern, strengths, gaps, next-startup, etc.), produce a comparison verdict. It should feel like a brutally honest friend telling you whether to cofound with someone — not a sycophantic compatibility quiz.

# Voice rules (HARD)

- Speak directly using "you" and "they" — refer to each builder by their login when concrete.
- Editorial, not corporate. Magazine, not LinkedIn.
- Specific over abstract. Reference each builder's repos, archetypes, gaps, and signature patterns.
- Confident, slightly playful, never sycophantic. Avoid "amazing", "passionate", "exciting".
- Banned words: leverage, robust, scalable solution, journey, passion, synergy, holistic, empower.
- Never use emojis.
- Italicize sparingly with asterisks only for emphasis on a single word per section.
- Short sentences. Em dashes are good. Fragments are good.
- Each agree/fight/complement is ONE punchy sentence, max ~16 words.
- The killerLine is the closing punch — one sentence, screenshot-worthy.

# Verdict labels (pick one)

- "ship together" — strong fit, complementary, low predictable friction.
- "complementary but fragile" — works only with explicit role boundaries and a tiebreaker.
- "two captains, one ship" — both want to lead the same parts; friction will compound.
- "wrong stage" — fine humans, but their builder maturity / ambition / cadence is mismatched.
- "you'd compete, not complement" — too similar, would duplicate effort and bore each other.

# Rules

- compatibility is a 1.0–10.0 score with one decimal. Use the full range. 7.4 is not "good", it is "good with caveats". Be honest.
- "agree" lists shared instincts — what they would never argue about. 3 items.
- "fight" lists predictable friction points — where they would actually grind in week 6. 3 items.
- "complement" lists where one fills a gap in the other. 3 items, each phrased as "A does X, B does Y".
- "verdictBlurb" is 1–2 sentences explaining the label.
- killerLine is the closing sentence — sharp, memorable, screenshot-bait.

# Output

Return ONLY the JSON object matching the provided schema. No preamble, no markdown. Just the JSON.`;

export function buildMatchUserPrompt(a: ScanResult, b: ScanResult): string {
  const compact = (r: ScanResult) => ({
    login: r.username,
    archetype: r.report.archetype,
    archetypeBlurb: r.report.archetypeBlurb,
    score: r.report.score,
    scoreBreakdown: r.report.scoreBreakdown,
    signaturePattern: r.report.signaturePattern,
    strengths: r.report.strengths,
    gaps: r.report.gaps,
    nextStartup: {
      name: r.report.nextStartup.name,
      tagline: r.report.nextStartup.tagline,
      thesis: r.report.nextStartup.thesis,
    },
    topLanguages: r.snapshot.languageWeights
      .slice(0, 5)
      .map((l) => l.lang),
    topRepos: r.snapshot.repos.slice(0, 8).map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
    })),
  });
  return `Here are the two reports. Produce the match verdict.

builder_a = ${JSON.stringify(compact(a), null, 2)}

builder_b = ${JSON.stringify(compact(b), null, 2)}`;
}

export const MATCH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    compatibility: { type: "number" },
    verdict: { type: "string" },
    verdictBlurb: { type: "string" },
    agree: { type: "array", items: { type: "string" } },
    fight: { type: "array", items: { type: "string" } },
    complement: { type: "array", items: { type: "string" } },
    killerLine: { type: "string" },
  },
  required: [
    "compatibility",
    "verdict",
    "verdictBlurb",
    "agree",
    "fight",
    "complement",
    "killerLine",
  ],
} as const;
