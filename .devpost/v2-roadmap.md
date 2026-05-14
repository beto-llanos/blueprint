# BLUEPRINT v2 — HACKHAZARDS roadmap

HACKHAZARDS window: **2026-05-01 → 2026-06-30**. Submission cutoff
**2026-06-15 12:29**. ~5 weeks of build time after v1 ships, plus 2 weeks
of buffer for polish + video + submission.

This is the plan for what ships *during* the hackathon. v1 is already live.

---

## Submission targets

| Track / theme | Fit | Status |
|---|---|---|
| **Theme — 🛠 Developer Tools & Software Infrastructure** | Primary — BLUEPRINT is a tool for devs. | Submitted. |
| **Theme — 🧠 Human Experience & Productivity** | Secondary — "software that helps users better understand themselves through data." | Submitted. |
| **Track — Neo4j** | Build the Founder Match graph on AuraDB. Strong bounty fit. | Targeted (v2 feature 1). |
| **Track — Base44** | Skip. Base44 is for prototyping; we have shipped code. | — |
| **Track — Expo** | Skip unless we add a native mobile companion. Out of scope for now. | — |

---

## v2 features

Priority ordered by win-condition impact (track bounty + viral loop + judge
demo wow) over engineering effort.

### 1. Founder Match (Neo4j track)

**Pitch:** "Two GitHubs go in. We tell you whether you'd cofound well." Or in
the explorer view, "show me builders structurally compatible with mine."

**Why it wins:**
- Single feature, unlocks the **Neo4j track bounty** + the **Developer Tools
  theme** simultaneously.
- Inherently social — every match is a shareable artifact.
- Demo: type two usernames side by side, see one verdict.

**Tech:**
- Neo4j AuraDB Free tier (1 GB, hosted).
- Each scan writes a `(:Builder {login, archetype, score, stack, ...})` node
  plus `(:Repo)` and `(:Lang)` nodes connected by relationships.
- Match query: given two builders, compute a structural similarity score
  (Cypher with weights on archetype distance, stack overlap, complementary
  gaps, range vs. depth balance).
- Add a `/match/[a]/[b]` route that runs the query + renders a comparison
  report (same editorial style — "you fight about X, you agree about Y").
- Add a `/u/[login]/matches` route that shows top 5 compatible builders from
  the archive.

**Scope:** ~2 weeks. Hardest part is calibrating the similarity score (lots of
LLM-as-judge eval iterations).

### 2. Public Archive

**Pitch:** Every report becomes a permanent, shareable URL with proper OG.
Browse the archive at `/archive` — a wall of builder cards filterable by
archetype, language, location.

**Why it wins:**
- Compounds Founder Match (need an archive for the graph to be interesting).
- Becomes a portfolio piece for every builder who scans themselves → viral
  loop.
- Increases SEO / inbound traffic — Google indexes the report pages.

**Tech:**
- Move from in-memory cache to Neo4j storage (already there if doing #1).
- Add an `opt-in` flag per report (private by default, public if user toggles).
- `/archive` route with simple filtering + pagination.

**Scope:** ~1 week.

### 3. Team Scan

**Pitch:** Drop an org name or a list of usernames. Get a composite report on
the team's collective archetype, capability map, and *missing co-founder*
profile.

**Why it wins:**
- Targets a different buyer (founders, VCs, eng managers) → broadens the
  product story.
- High-quality LLM output is much easier here than founder match because the
  task is summarization across known builders.
- Visually striking — a team's archetype distribution as a chart.

**Tech:**
- `/team` route, input is a list of handles (or a GitHub org).
- Fetch each builder's snapshot in parallel (already cached if scanned before).
- Single Claude call with all snapshots as context → composite report.
- Re-uses the v1 system prompt + a new "team-context" preamble.

**Scope:** ~1 week.

---

## Build order

| Week | Focus | Status |
|---|---|---|
| Day 1 (May 12) | v1 ship — landing, fetch, Claude pipeline, report, OG, deploy | ✅ |
| Day 2 (May 13) | v2 ship — storage abstraction + Neo4j adapter + Founder Match + Team Scan + Public Archive | ✅ |
| Week 1–2 (May 14–26) | Provision AuraDB. Flip prod onto Neo4j. Backfill pre-warmed accounts. Calibrate Match similarity with LLM-as-judge eval set. | pending |
| Week 3–4 (May 27 – Jun 9) | Polish, mobile pass, optional features (`/u/[login]/matches` top-N from archive). | pending |
| Week 5 (Jun 10–14) | Demo video re-record. Deck refresh. Submit. | pending |
| Buffer (Jun 15 – Jun 30) | Public launch, paid org plan, anything that didn't fit. | pending |

---

## Open questions

- **Privacy** — should Founder Match require the *other* person's consent to
  appear in someone's results, or is public-GitHub-data fair game? Default to
  fair-game with an opt-out, decide before launch.
- **Pricing** — keep entirely free for hackathon. Add Stripe + paid org plan
  *after* the submission so judges see a clean, free product.
- **LLM cost** — at $0.03–0.05 per scan, an archive of 10K builders is
  $300–500. Need a per-IP rate limit before going public. Add Cloudflare
  Turnstile on `/r/[username]`.
