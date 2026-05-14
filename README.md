# BLUEPRINT

*your repos, decoded into your next startup.*

Drop a GitHub username. BLUEPRINT reads every repo, language signal, and commit
cadence — then tells you the company you are already, slowly, accidentally
building.

Live: [blueprint-production-50d0.up.railway.app](https://blueprint-production-50d0.up.railway.app)

Built solo for [HACKHAZARDS '26](https://hack.namespace.world). Developer Tools
track. Two-month buildathon.

---

## What it does

Given any public GitHub handle, BLUEPRINT generates an editorial report with:

- An **archetype** — one of ten (The Tinkerer, The Architect, The Storyteller…)
- A **builder score** — range × depth × consistency × ambition
- A **signature pattern** — the through-line you didn't notice
- Your **next startup** — a real, named idea with thesis, MVP scope, and a
  4-step roadmap tied to repos you actually wrote
- Two **alternative paths** + a closing line worth screenshotting

Every report gets a unique Open Graph card so links shared on X / LinkedIn /
Slack render as a designed object, not a placeholder.

---

## How it works

```
GitHub username
      │
      ▼
GitHub REST  ──►  snapshot (profile + top 25 repos + language weights)
      │
      ▼
Claude Sonnet 4.6  ──►  structured JSON (json_schema output_config)
      │                 system prompt is cached across requests
      ▼
Editorial render (Next.js 16 App Router · Tailwind v4 · framer-motion)
      │
      ▼
Public report page + dynamic OG image (next/og)
```

Reports are cached in-memory for an hour. Cache replaced by Neo4j in v2 so
reports become a persistent, queryable graph of builders.

---

## Stack

- **Next.js 16.2.6** (App Router, Turbopack, async `params` / `searchParams`)
- **React 19.2 / Tailwind CSS v4** — design system with one ink/paper/accent palette and Fraunces display serif
- **TypeScript 5**
- **@anthropic-ai/sdk 0.95** — Claude Sonnet 4.6, structured outputs via
  `output_config.format` (`json_schema`), system-prompt caching
- **framer-motion** — stagger animations on report sections
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
# limit from 60/h to 5000/h)
npm run dev
```

Then open http://localhost:3000.

A scan takes 10–20 seconds depending on how many public repos the target has.
First scan on a username costs roughly $0.03–0.05 in Anthropic credits; repeated
scans within an hour are free (in-memory cache).

---

## Roadmap

See [`.devpost/v2-roadmap.md`](.devpost/v2-roadmap.md) for the full plan.

Headline:

- **v1 — shipped** · public report generator, OG share cards, editorial UI.
- **v2 — Founder Match** · Neo4j-backed graph of builders, structural
  compatibility pairing.
- **v2 — Archive** · opt-in public report library so each scan becomes a
  portfolio piece + viral loop.
- **v2 — Team Scan** · feed an organization or list of usernames and get a
  composite "what is this team actually building" report.

---

## Submission docs

- [`.devpost/deck.md`](.devpost/deck.md) — 6-slide pitch
- [`.devpost/demo-script.md`](.devpost/demo-script.md) — 90-second video script
- [`.devpost/v2-roadmap.md`](.devpost/v2-roadmap.md) — what ships during the
  HACKHAZARDS window
