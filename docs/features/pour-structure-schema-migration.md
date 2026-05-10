# Pour Structure schema migration

**Status:** Scope doc. Not committed to ship — captured 2026-05-09 as a follow-up to the [/brews/[id] detail page rethink (PR #131)](https://github.com/chrismccann-dev/latent-coffee/pull/131) so the scope doesn't get lost.
**Triggers when:** parse drift starts hurting render / a downstream feature demands structured pour data / MCP write reliability becomes an issue. None of those are true today.

---

## Goal

Move `brews.pour_structure` from a single free-text column to a structured `brews.pours jsonb` array of `{n, label?, time?, amount_g?, method?, note?}` objects. Keep the human-readable note as the unstructured field per pour; promote everything else to structured.

The shipped detail-page sprint (PR #131) already extracts this shape via `lib/pour-structure.ts` `parsePourSteps()` — the parser returns `ParsedPourStep[]` with optional `{label, time, amount_g, method, raw}` fields, but the render layer today only consumes `step.raw`. The structured fields are forward investment from that sprint, not new design work for this migration.

## Why migrate

Free-text storage works fine for render today (the parser handles all 79 brews acceptably enough that the shipped detail page renders without complaints). What it doesn't enable:

1. **Aggregation queries.** "Show me brews where Pour 1 was > 100g" / "median bloom-to-Pour-1 gap by extraction strategy" / "how does total water vary across Hybrids" — currently impossible without text-parsing every row at query time.
2. **Recipe diff between brews of the same coffee.** `/brews/[id]` could surface "what changed vs your last brew of this coffee" with a structured diff. Hard to do reliably with prose.
3. **Better mobile rendering.** A structured table layout (time | amount | method | note columns) is more legible at-a-glance under pressure than flat bullet prose. The current parser already extracts these fields; structured storage + structured render unlocks the layout.
4. **MCP write reliability.** `push_brew` accepting structured `pours: PourStep[]` is more reliable than asking claude.ai to format prose for a downstream parser. Slot-fill is more robust than prose round-trip.
5. **Per-pour analytics.** Same as (1) but for `/processes/[name]` / `/roasters/[name]` aggregation pages: "what does a typical Picolot recipe look like across 12 brews?"

## Non-goals

- **Restructure the bloom column.** `brews.bloom` is a separate text column with its own shape (amount + duration + technique). Out of scope unless it becomes load-bearing.
- **Deprecate the free-text column immediately.** Keep `brews.pour_structure text` as denormalized display through one or two follow-up sprints. Mirror of how Process 1e.2 → 1e.4 retired the legacy text column.
- **Build a structured-table render in the same sprint.** That's a follow-up. Migration just lands the structured storage + parity render.
- **Drop intermediate-state correctness.** Both columns must stay in sync during the transition; both PATCH route + persistBrew populate both on every write.

## Sub-tracks (~3-4 days total)

### 1. Schema (~0.25d)

- Migration adds `brews.pours jsonb NOT NULL DEFAULT '[]'::jsonb`.
- `composePourStructure(pours[]): string` + `decomposePourStructure(text): PourStep[]` helpers in `lib/pour-structure.ts`. The latter is the existing `parsePourSteps` rebadged + with an extra "strip parsed prefix from raw to populate `note`" step.
- PATCH route + persistBrew: write both `brews.pour_structure` (composed) and `brews.pours` (structured) on every save. Same pattern Process 1e.2 used.

### 2. Backfill + manual review (~1d)

- One-shot script: load all 79 rows, run `parsePourSteps`, write `brews.pours`.
- Hit-rate on the 20-row sample I checked during the PR #131 sprint: ~95% on label, ~90% on time, ~70-80% on amount_g, ~60% on method, 100% on raw (always populated).
- Edge cases that need manual touch (~8-12 rows expected):
  - Continuous-prose entries (CGLE Mandela XO "Continuous gentle pour to 240g, total 3:30" — single step, time embedded inline).
  - Brews where Pour 1 was the bloom (Gesha Village Surma — pour_structure starts at "Pour 2: ...").
  - Entries with non-pour meta-text mixed in ("Office tap water. Kettle on base throughout." — currently parsed as a bullet but doesn't fit `{time, amount}` shape).
- Manual-review surface: a temporary `/admin/pours-backfill` page listing each brew's parsed output side-by-side with raw. Not strictly necessary; could also be a CLI script that prints rows where `parsedSteps.length === 0` or `parsedSteps.every(s => !s.amount_g)` for inspection.

### 3. Edit form rebuild (~1.5-2d)

The biggest interpretive chunk. Two design options:

- **Option A: structured row editor.** Per-pour `{add, remove, reorder}` rows with separate inputs for time / amount / method / note. Matches the canonical-registry discipline pattern (terroir picker, process picker, modifier composer). New component, ~150-200 lines. Right answer if structured pours become load-bearing for downstream features.
- **Option B: textarea + parsed preview panel.** Keep the textarea, render a live preview of what the parser will store so the user can fix the source if parsing is wrong. Cheaper, less rigorous. Right answer if structured pours are a forward investment without immediate downstream demand.

Default recommendation: **Option B at migration time, Option A as a follow-up** if a downstream feature genuinely demands structured editing reliability. Option B preserves the prose-friendly write path that claude.ai sessions use today; Option A would force every brew through structured slots which is friction without payoff.

### 4. Render swap (~0.25d)

`<PourStructureList>` source-swaps from `parsePourSteps(pour_structure)` to direct `brews.pours` consumption. Render layer doesn't change because we already invested in `ParsedPourStep` shape during PR #131. The call site goes from:

```tsx
const steps = parsePourSteps(brew.pour_structure)
```

to:

```tsx
const steps = brew.pours
```

Optional bonus: add a `<StructuredPourTable>` variant that renders time / amount / method as table columns with the note as a footnote per row. Defer unless mobile rendering is the trigger for the migration.

### 5. MCP write surface (~0.5d)

- `push_brew` Tool: accept either `pour_structure: string` (existing) OR `pours: PourStep[]` (new). If both are sent, structured wins; if only text is sent, server runs `decomposePourStructure` to populate structured.
- `patch_brew` Tool: same shape, partial update.
- Brewing prompt v9.x update: teach claude.ai the structured slot shape with an example.
- The asymmetric write trust principle still applies — claude.ai writes can paste prose; the server canonicalizes structurally.

### 6. Legacy column drop (~0.25d, follow-up sprint)

- Migration drops `brews.pour_structure text` once 2-3 sprints of dual-write have shipped without issues.
- Mirror of Process 1e.4. Don't bundle with the migration sprint; let dust settle.

## Decision points to resolve before implementation

| # | Question | Default |
|---|---|---|
| 1 | `time` field shape — string ("0:57") or numeric (seconds since brew start)? | String for now. Keeps parity with how Chris writes timing in claude.ai. Numeric is a follow-up if aggregation queries demand it. |
| 2 | `time` range vs single value — single ("0:57") vs range ("0:45-1:15")? | Range supported. The parser already extracts both. Most pours have a single start-time; a few have explicit ranges. Use a single `time` field that accepts either shape. |
| 3 | `method` field — free text or canonical enum? | Free text. Canonicalizing methods (Melodrip / center spiral / Vannelli / etc.) is its own taxonomy sprint. Keep open through migration. |
| 4 | `delta_g` vs `amount_g` — store cumulative or delta? | Cumulative (`amount_g`). Matches how Chris writes prose. Delta is computable at render time. |
| 5 | Bloom — promote to its own structured field too? | No, defer. Bloom has a different shape than pours (amount + duration + technique, no time-from-start). Keep `brews.bloom text` for this migration; bundle in a follow-up if needed. |
| 6 | Edit form approach — Option A or B? | Option B (textarea + parsed preview). Cheaper, less friction for prose-style writes. |
| 7 | Backfill manual-review surface — admin page or CLI? | CLI script that prints flagged rows. Cheaper than a temporary page. |
| 8 | Migration trigger — preemptive or demand-driven? | Demand-driven. Wait for a downstream feature to want it (recipe diff, structured mobile render, aggregation queries). |

## When this becomes worth doing

Three signals, any one of which is sufficient:

1. **Parse drift starts hurting render.** Today: zero pain across 79 brews. Re-check this every 3-6 months as the corpus grows.
2. **A downstream feature demands structured data.** Specifically: recipe diff between brews of the same coffee, a structured mobile table render for /brews/[id], or any aggregation query that wants per-pour metrics on /processes / /roasters detail pages.
3. **MCP write reliability problems.** If claude.ai sessions start producing prose pour_structure that the parser can't handle, structured slot-fill becomes the cheaper write path.

Until at least one of those fires, this is forward investment without a load-bearing customer. The current shape is lossless (`raw` always populated), the render is acceptable, and the parser is doing its job.

## Cost summary

| Sub-track | Effort | Risk |
|---|---|---|
| Schema | 0.25d | Low |
| Backfill + manual review | 1d | Medium (parser hit-rate variance) |
| Edit form rebuild (Option B) | 0.75d | Low |
| Edit form rebuild (Option A) | 1.5-2d | Medium |
| Render swap | 0.25d | Low |
| MCP write surface | 0.5d | Low |
| Legacy column drop | 0.25d (follow-up) | Low |
| **Total (Option B)** | **~3d** | — |
| **Total (Option A)** | **~4d** | — |

Plus ~0.25d follow-up sprint to drop `brews.pour_structure text` once dust settles.
