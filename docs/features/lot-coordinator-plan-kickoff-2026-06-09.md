# KICKOFF — Lot Coordinator + V-Set Assistant plan/build (prepped 2026-06-09)

**Read first:** [ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md) (the locked architecture) + the [brainstorm doc § 2026-06-09 resolution](docs/features/lot-coordinator-brainstorm-2026-06-02.md) (the narrative trail). The 2026-06-09 grilling session resolved every seam and Chris audio-ratified each fork. **The architecture is locked; this brief is the build sequence.**

**Session type is mixed — read the demarcation.** Phase 0 is a **grilling session** (vocab — ask, don't ship; the autonomy rule does NOT apply). Phases 1-2 are a **live dogfood against a real fresh lot**: the technical scaffolding (skills, schema, check script) is execution work the autonomy rule covers once Phase 0 + this plan are ratified, but the *roasting-design and workflow-shape calls surface against Chris's real roast* — his lived experience is load-bearing there, so **ask at the interpretive forks, execute the technical scaffolding.** The first lot may revise details before we call the architecture final.

## Trigger

The next **fresh** green-bean lot, started clean on the new process (Chris green-lights when home with a new green). Current lots finish on the old claude.ai surface (grace-handoff). Chris out of town as of 2026-06-09.

## Goal

Restructure roasting from one-claude.ai-session-per-lot into a **Claude-Code-native Roasting Coordinator (Brief-persistent, session-transient) + ephemeral V-Set Assistant**, dogfooded live against the first fresh lot. Fixes the proven context-bloat-as-correctness problem ([severity handoff](docs/features/roasting-context-window-severity-handoff-2026-06-06.md)) and is **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)).

## The sequence

### Phase 0 — CONTEXT-roasting vocab grill (GRILLING; do first, before any build)

Run `/grill-with-docs` on [grilling-queue item 46](docs/grilling-queue.md). Lock these terms into [CONTEXT-roasting.md](CONTEXT-roasting.md): **Roasting Coordinator** (role, Brief-persistent/session-transient), **V-Set Assistant** (ephemeral per-V-set), **Roasting Brief** (`docs/lots/<lot>.md`, durable source of truth), **V-set Handoff Packet** (near-empty, down), **V-set Results Packet** (thin, up), the **predicted/actual boundary**, and the **three-point delta chain** (design → roast-actual re-prediction → cup-actual). Grilling-first — do not bulk-author ahead. Pull Chris's parked **drop-rules mechanism edits** ([item 51](docs/grilling-queue.md)) here too — they feed the Coordinator's V-set-design step.

### Phase 1 — build the two skills + the substrate (execution)

- **`docs/skills/roasting-coordinator/` + `docs/skills/v-set-assistant/`** — net-new SKILL.md + clusters, mirroring `research-coordinator` / `research-assistant`. Operator-direct (ADR-0017 Exception 1): no MCP registration, no `docs/prompts` entry. Coordinator owns Brief + design + route + close; Assistant owns the cycle. Hybrid reconciliation: subsume the design/close prose from `roasting-assistant` + `close-lot-specialist`; **keep** the thin write-executors (`roast-recorder`, `cupping-specialist`, `roest-api-worker`) as called primitives; **compose** the knowledge clusters (`roest-knowledge`, `roasting-historian`, archivists) unchanged.
- **The Roasting Brief mechanism** — `docs/lots/<lot>.md` template + the reconstruct-from-Brief discipline (write at every break; never trust a session to survive one).
- **Stored `lot_status`** — migration (`>= 076`, self-registering line per the migration convention) adding the column to `green_beans`; coarse enum (`in_inventory → waiting_for_roast ⇄ waiting_for_cupping → waiting_for_brewing → resolved / unresolved` + one-shot variants); single-write-path through the MCP Tools + Coordinator handoff; `lib/types.ts` typed in the same PR (standing rule).
- **`check:lifecycle-consistency`** — a `check:*` gate + daily CI cron flagging stored-`lot_status`-vs-rows disagreement (the derived logic survives as validator).
- **`/green` render** — surface `waiting_for_brewing` (ball-in-brewing-court signal); update `computeLifecycleState` consumers.

### Phase 2 — live dogfood

Run the real lot through the operator dry-run (ADR-0024 § 8 / brainstorm § dry-run): T0 start (Coordinator) → V1 Handoff → V1 roast+cup (Assistant) → Results → route → … → close. Capture friction; the architecture is revisable on first-lot evidence.

## Prerequisites (build these or confirm them first — they keep packets/pulls thin)

Both in [issues.md](docs/product/issues.md), tagged Lot-Coordinator prerequisites:
- **`read_canonical(axis, name)`** name-filter (bare form returns whole axis ~20K tokens; also a memory-vs-reality gap — documented but not implemented).
- **`get_bean_pipeline(since:<ts>)`** incremental fetch (the full pipeline is ~25-35KB by mid-V-set; `since:` removes the skip-incentive that caused the lived staleness failure).

## Scope

**In:** the two skills + Brief mechanism + `lot_status` + `check:lifecycle-consistency` + `/green` brew-wait render + the two MCP prerequisites + the vocab grill. **Out:** brewing-side changes (stays claude.ai; SPG-execution + optimized-brew are claude.ai handoffs); deleting any existing prompt/skill (grace-handoff — net-new only, retire on Chris's signal when the last claude.ai lot resolves); the resolution-pointer FK polish + Predicted-vs-Actual *render* surface (separate roadmap item, shares this spine).

## Files likely to touch

`docs/skills/roasting-coordinator/**`, `docs/skills/v-set-assistant/**`, `docs/lots/` (new), `CONTEXT-roasting.md`, `supabase/migrations/NNN_lot_status.sql`, `lib/types.ts`, `lib/green/computeLifecycleState*`, `app/(app)/green/**`, `scripts/check-lifecycle-consistency.ts` + `package.json`, `lib/mcp/*` (the two prerequisite Tools), `docs/architecture/sub-skills-status.md` (skill count), the catalog/dispatch/handoff rule docs.

## Verification plan

`npm run build` (touched API routes / `lib/`); the migration applied to PROD + receipt row before building on it (build-kickoff migration gate); `check:lifecycle-consistency` + `check:migrations` + `check:types-vs-schema` green; the live dogfood lot reaching `resolved` with a correct `/green` resolved view.

## Standing rules

- **Six-actor audit** on every substrate change. This sprint changes CONTEXT-roasting (Actor 5) + MCP Tools (Actor 4) + schema/UI (Actor 6) + the skill surface — trace each.
- **claude.ai grilling review** fires at close **because** claude.ai-facing substrate changes (CONTEXT-roasting vocab + the two MCP Tools + their descriptions). The new skills are operator-direct (no claude.ai catalog entry), but the MCP prerequisites need a fresh-session catalog refresh.
- **Roadmap currency:** move section 2 out of [roadmap.md](docs/product/roadmap.md) Active queue + add a [shipped.md](docs/sprints/shipped.md) row, same PR, when the dogfood closes.
- **Formalization tax:** the prototype docs are input-not-canon; states are named, schema lands only as the build needs it; don't build the universal self-improvement loop — let this be a clean instance-2 worked example.
