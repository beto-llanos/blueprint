# BLUEPRINT

*your repos, decoded into your next startup.*

Drop a GitHub username. BLUEPRINT reads every repo, language signal, and commit
cadence — then tells you the company you are already, slowly, accidentally
building.

Live: [blueprint-production-50d0.up.railway.app](https://blueprint-production-50d0.up.railway.app)

Built solo for [HACKHAZARDS '26](https://hack.namespace.world). Developer Tools
track + Human Experience theme + Neo4j track candidate.

---

## What it does

Four modes. One pipeline. All share the editorial render.

### `/` — Decode

Given any public GitHub handle, BLUEPRINT generates an editorial report with:

- An **archetype** — one of ten (The Tinkerer, The Architect, The Storyteller…)
- A **builder score** — range × depth × consistency × ambition
- A **signature pattern** — the through-line you didn't notice
- Your **next startup** — a real, named idea with thesis, MVP scope, and a
  4-step roadmap tied to repos you actually wrote
- Two **alternative paths** + a closing line worth screenshotting

Every report gets a unique Open Graph card so shared links render as a
designed object, not a placeholder.

### `/match` — Founder Match

Drop two GitHubs. We compute a structural similarity score, compare archetypes
and gaps, then return a verdict:

- **compatibility 1–10**
- **verdict** — "ship together", "complementary but fragile", "two captains
  one ship", "wrong stage", or "you'd compete, not complement"
- **where you agree** · **where you'll fight** · **complementary edges**
- a closing line worth screenshotting

### `/team` — Team Scan

Drop 2–6 GitHub usernames. We read every member and produce a composite
verdict on the team itself:

- archetype mix + collective score
- single biggest capability
- shared blind spot
- the cofounder you're missing (archetype + blurb)
- the product hiding in the overlap

### `/archive` — Public archive

Every decoded builder, browsable. Filter by archetype or primary language.

---

## How it works

```text
GitHub username
      │
      ▼
GitHub REST  ──►  snapshot (profile + top 25 repos + language weights)
      │
      ▼
Claude Sonnet 4.6  ──►  structured JSON (json_schema output_config)
      │                 system prompt is cached across requests
      ▼
ReportStore  ──►  in-memory (default) | Neo4j (env-switched)
      │
      ▼
Editorial render (Next.js 16 App Router · Tailwind v4 · framer-motion)
      │
      ▼
Public report page + dynamic OG image (next/og)
```

The same pipeline powers Match (two reports → one Claude call comparing them)
and Team Scan (N reports → one Claude call composing them).

---

## Stack

- **Next.js 16.2.6** (App Router, Turbopack, async `params` / `searchParams`)
- **React 19.2 / Tailwind CSS v4** — design system with one ink/paper/accent
  palette and Fraunces display serif
- **TypeScript 5**
- **@anthropic-ai/sdk 0.95** — Claude Sonnet 4.6, structured outputs via
  `output_config.format` (`json_schema`), system-prompt caching across all
  three prompts (decode, match, team)
- **neo4j-driver** — optional graph backend, swapped in when `NEO4J_URI` is set
- **framer-motion** — stagger animations on every report
- **next/og** — dynamic 1200×630 share cards
- **Railway** — production hosting

---

## Run locally

```bash
git clone https://github.com/beto-llanos/blueprint
cd blueprint
npm install
cp .env.local.example .env.local
# fill in ANTHROPIC_API_KEY (required) and GITHUB_TOKEN (optional, lifts rate
# limit from 60/h to 5000/h). NEO4J_* vars are optional — see "Neo4j" below.
npm run dev
```

Then open <http://localhost:3000>.

A scan takes 10–20 seconds depending on how many public repos the target has.
First scan on a username costs roughly $0.03–0.05 in Anthropic credits; repeat
scans within an hour are free (cache).

---

## Storage backends

BLUEPRINT writes every successful scan to a `ReportStore`. Two implementations
ship in this repo:

- **InMemoryStore** (default) — 1-hour TTL per entry, no persistence across
  restarts. Zero setup.
- **Neo4jStore** — persists every builder as a `(:Builder)` node with
  `archetype`, `score`, `languages`, and the full payload. Powers the
  HACKHAZARDS Neo4j track — set `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
  and the store auto-switches on boot.

The Neo4j adapter creates `CONSTRAINT builder_login` on first run. List queries
are indexed on `archetype` and `languages` (array). Match and Team features
work transparently across both stores.

---

## Roadmap

See [`.devpost/v2-roadmap.md`](.devpost/v2-roadmap.md) for the full plan.

Status:

- ✅ **v1** · public report generator, OG share cards, editorial UI.
- ✅ **v2 — Founder Match** · `/match/[a]/[b]` with structural similarity +
  Claude verdict.
- ✅ **v2 — Team Scan** · `/team?n=...&u=...` with composite Claude analysis.
- ✅ **v2 — Public archive** · `/archive` with archetype + language filters.
- ✅ **v2 — Neo4j adapter** · drop-in graph backend (off by default; flip on by
  setting `NEO4J_*` env vars).

---

## Submission docs

- [`.devpost/deck.md`](.devpost/deck.md) — 6-slide pitch
- [`.devpost/demo-script.md`](.devpost/demo-script.md) — 90-second video script
- [`.devpost/v2-roadmap.md`](.devpost/v2-roadmap.md) — what shipped + what's
  next
