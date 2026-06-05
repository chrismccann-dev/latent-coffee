# `data-model` session (session 4 of 5) — kickoff brief

Redesign-polish punch-list, bucket 4. Hand-off from the `cleanup` session
([punch-list § Cleanup session outcomes](docs/features/redesign-polish-punchlist.md)).
Buckets run **one per session, sequentially**: `data-audit` ✅ → `naming` ✅ →
`cleanup` ✅ → **`data-model` (this one)** → `side-quest` MB-6.

## ⚠️ THIS SESSION OPENS WITH CHRIS'S AUDIO. DO NOT START THE PARSER FIRST. ⚠️

**This is a spec/grilling session first, build second.** Chris will kick it off
with a **full audio readout of several real recipes** — deliberately spanning
**complex and simplistic** pour structures — so the storage-shape decision is
made against the real range, not a guess off the written notes. **Do NOT touch
[lib/pour-structure.ts](lib/pour-structure.ts) or design a storage shape
before that audio lands.**

Posture on the storage-shape call: **capture-first, ask-don't-ship.** This is
the same pattern that made WC-2 land right — the written note looked like a
small fix; Chris's audio recount revealed it was a full reshape. Treat the
storage-shape / parser-vs-schema decision as an **interpretive call Chris signs
off** before any implementation. The autonomy rule applies only **after** the
shape is locked and we're in the build phase (a normal migration + render
execution at that point).

## Goal

Fix **BS-1** — pour-structure rendering is wrong on multiple brews. The recipe
*layout* is liked; the *data* doesn't map cleanly. Chris flagged this as
**broader than design polish** — likely the `pour_structure` free-text parser
AND/OR the storage shape (today it's a single free-text column the parser eats
at render time). The open question the audio resolves: **do we keep parsing
free-text, or move pour structure to a structured shape** (the long-deferred
`brews.pours` jsonb — see grilling-queue Item 39, "structured pour_structure
deferred")?

## The 6 flagged brews (the symptom set — re-walk each against the audio)

From BS-1 in the punch-list:

1. **[2026 Ruarai AA Separation](https://www.latentcoffee.com/brews/da937ce6-2877-4436-84f4-8191d93e5528)**
   — timeline shows `0:00 Bloom` → `· Pour 1` (no start time) → `~3:00 Bloom`
   (should be the second POUR, not "Bloom" again). *(The missing-producer half
   of this brew was a `data-audit` item, already handled — this is the
   pour-structure half only.)*
2. **[Garrido Mokkita Cold Room](https://www.latentcoffee.com/brews/7ad09c9b-35c3-4635-88eb-248bb38b42bc)**
   — cleaner (`0:00`/`0:50`/`1:40`) but Pour 3 starts at "·" because it's a
   2-pour recipe with a dial change at the end of pour 2.
3. **[Release 056 - El Placer](https://www.latentcoffee.com/brews/71c1d610-5a13-4dbc-ad73-cb211a455f0f)**
   — 2-pour brew showing only 1 pour (Pours 3/4 are "Office tap water" / "Kettle
   on base throughout" with "·" times). *(The filter-label half was handled in
   `naming`.)*
4. **[Ethiopia Heirloom Cold Room Natural](https://www.latentcoffee.com/brews/0d93118c-555e-4778-905f-17d166e33a8f)**
   — pour structure not represented correctly.
5. **[Altieri Gesha CHOMBI Natural Dry Fermentation](https://www.latentcoffee.com/brews/4fc7e914-095d-4d1e-9af6-3a6c7c556c9b)**
   — pour structure all off.
6. **[Apricoast](https://www.latentcoffee.com/brews/53c552ec-3046-4090-a6ec-4e9dba14c523)**
   — showing two blooms (pour-structure data). *(Filter-label half handled in
   `naming`.)*

Recurring failure shapes visible in the symptom set (confirm/extend against the
audio, don't pre-fix): **two blooms** (bloom prepended as `0:00` AND a second
"Bloom" segment parsed from the body), **missing pour start times** (`·` where a
time should be), **non-pour segments leaking into the bullets** ("Office tap
water" / "Kettle on base throughout" rendering as pours), **dial-change tails**
on the last pour rendering as a phantom extra pour.

## Where the code lives (pointers — do NOT edit before the audio)

- **[lib/pour-structure.ts](lib/pour-structure.ts)** — `parsePourSteps(text): ParsedPourStep[]`
  with the composable strategy cascade (newline > semicolon > middle-dot >
  period+marker > arrow-chain). `ParsedPourStep` carries `raw` always +
  best-effort `label / time / amount_g / method`. `extractDrawdown(total_time,
  pour_structure)` filters drawdown out of the bullets. CLAUDE.md's standing
  note: *"Don't change the storage shape; the parser eats the existing free-text
  column"* — **that note is exactly what's under review this session.**
- **Render: `/brews/[id]` Reference Brew Recipe section** — `<SspTimeline>` in
  [components/Ssp.tsx](components/Ssp.tsx). The brew detail page
  ([app/(app)/brews/[id]/page.tsx](<../../app/(app)/brews/[id]/page.tsx>))
  prepends bloom as a `0:00 · Bloom` step, then feeds `parsePourSteps`, then
  `cleanPourDesc(raw, time)` strips the leading `Pour N:`/time echo. The
  "two blooms" bug likely lives in this prepend-plus-parse seam.
- **Storage today:** `brews.pour_structure` (free-text) + `brews.total_time`.
  The parser was authored as forward-investment for a future **`brews.pours`
  jsonb** migration (per CLAUDE.md). If the audio says "go structured," that
  migration + a `push_brew`/`patch_brew` schema field + a claude.ai prompt
  update for how pours are written is the shape.

## Scope decision the audio drives (present options, let Chris pick)

This is the load-bearing interpretive call — **do not pre-pick.** Likely framing:
- **Option A — parser-only fix.** Keep `pour_structure` free-text; fix the
  cascade so blooms/non-pour-segments/dial-tails/missing-times render right.
  Render-layer + lib only, no migration, no MCP/prompt change. Lower blast
  radius; bets that free-text can be parsed reliably across Chris's real range.
- **Option B — structured `brews.pours` jsonb.** Move pour structure to a typed
  shape; parser becomes a one-time backfill + claude.ai writes structured going
  forward. Higher blast radius (migration + `push_brew`/`patch_brew` schema +
  prompt + render), but kills the parse-ambiguity class permanently.
- **Hybrid** — structured shape forward, parser retained as a read-fallback for
  legacy free-text rows.

The audio's purpose is to reveal whether the real range of pour structures is
parseable (→ A) or genuinely needs typing (→ B). **Build only after the call.**

## Six-actor reminder (if this becomes a storage change)

`cleanup` was render-layer only. **`data-model` is NOT** if Option B/Hybrid
wins — it propagates: Actor 6 (migration + `brews.pours` + render) → Actor 4
(`push_brew`/`patch_brew` schema + Tool description + matching Resource) → Actor
2 (`docs/prompts/*.md` — how a brew session writes pours) → Actor 3 (claude.ai
catalog refresh) → Actor 5 (CLAUDE.md § Brews + the pour-structure note +
CONTEXT-brewing.md) → Actor 1 (rendered recipe reads right). Run the full audit
at substrate-change time. Also drain **grilling-queue Item 39** if this closes it.

## Files likely to touch (Option-dependent)

`lib/pour-structure.ts`, `components/Ssp.tsx` (`SspTimeline`),
`app/(app)/brews/[id]/page.tsx` (the bloom-prepend seam). **If Option B:** a
`supabase/migrations/NNN_*.sql` (apply via Supabase SQL Editor per the 072/073
precedent), `push_brew`/`patch_brew` Zod schema + Tool descriptions, a
`docs/prompts/*.md` brewing-flow update, `lib/types.ts`.

## Verification

Preview `/brews/[id]` for all 6 flagged brews @1024 + 390 — each pour structure
renders correctly (no double bloom, no `·` times, no leaked non-pour segments,
dial-tail handled). tsc via the worktree node_modules symlink trick
(`ln -sf ../../../node_modules node_modules`, `npx tsc --noEmit`, `rm
node_modules`). `npm run build` if the symlink is in place and the change
touched a route or lib consumed by one. `/simplify`. Squash-merge per autonomy
**once the storage-shape call is signed off** and the build is done.

## End-of-session

Write the **`side-quest` MB-6 kickoff brief** (green index → brew-card-style
grid treatment; Chris will mock it). MB-6 is the last bucket; after it ships the
explicit capstone is the **product roadmap review / brainstorm** (the deferred
/producers · /experiments · homepage trio + the systemic cultivar-skeleton
backfill + the attach-resolved-brew affordance all stay parked behind it).
