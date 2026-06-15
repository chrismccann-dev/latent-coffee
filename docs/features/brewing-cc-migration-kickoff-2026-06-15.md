# KICKOFF — Brewing → Claude Code migration (roadmap Active queue #4)

**Prepped 2026-06-15** (North Star roadmap review). Paste this path into a fresh Claude Code session: *"Read docs/features/brewing-cc-migration-kickoff-2026-06-15.md and run the Brewing → Claude Code migration sprint."*

## Read first

- [roadmap.md Active queue #4](docs/product/roadmap.md) — the scoped item this brief expands.
- [ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md) — the roasting precedent. **Read § Context + § 1 specifically**: the reason roasting needed a Coordinator/Assistant split (single-session context-bloat-as-correctness) and **why brewing does not**.
- The existing brewing stack you are migrating, not rebuilding: [`docs/prompts/start-brew.md`](docs/prompts/start-brew.md) (the claude.ai entry prompt) + [`docs/prompts/bundled-brewing-completion.md`](docs/prompts/bundled-brewing-completion.md) (the completion path) + [`docs/skills/brewing-assistant/`](docs/skills/brewing-assistant/SKILL.md) (Steps 1-4 design framework + `cluster/operational-guide.md`) + [`docs/skills/brew-recorder/`](docs/skills/brew-recorder/SKILL.md) (the `push_brew` executor) + the knowledge clusters (`brewing-equipment-expert`, `brewing-historian`, `wbc-brewing-archivist`).
- The precedent kickoff shape: [docs/features/lot-coordinator-plan-kickoff-2026-06-09.md](docs/features/lot-coordinator-plan-kickoff-2026-06-09.md).

## Goal

Move the brewing workflow off claude.ai onto a **Claude-Code-native (mobile) session**, so a brew runs end-to-end (Coffee Brief → recipe → in-thread iteration → optimized-brew push + doc-proposals) in Claude Code the way it does in the claude.ai project today. The Claude Code mobile release is what makes this viable; the mobile probe (2026-06-09/10) already de-risked the infra.

## Load-bearing framing — this is NOT a Coordinator/Assistant restructure

Do **not** build a "brewing-coordinator + brew-assistant" pair. Brewing has **none** of roasting's single-session context-bloat problem (ADR-0024 § Context): a brew is one short thread, only the *optimized* brew lands in the app (archive-driven; intermediate iterations stay in-thread by design, ADR-0011 § iteration-depth asymmetry). So this is a **surface migration of one short single session** — the same workflow, new client. You are *reusing* `brewing-assistant` + `brew-recorder` + the knowledge clusters as-is, plus borrowing roasting's **operator-direct entry pattern** and the **self-improving-loop spine** (a friction log + a close retro). Over-building this into roasting's shape is the failure mode to avoid.

## What's already done — do NOT redo

The North Star apex bake-in (PR #450, 2026-06-15) already made the brewing stack apex-aware:
- `brewing-assistant/cluster/operational-guide.md` carries the **apex clarify-side default at Step 1d** + **whole-arc station-discipline enforcement in the iteration loop** (aroma → hot ~59-60 → warm ~54-55 → cool ≤50; never iterate off a single temperature).
- `coordinator/catalog.md § Brewing domain principles` carries the same doctrine.
- The modifier-currency drift (`inverted_temperature_staging` → `thermal_staging`; the 5-set incl. `equipment`) was fixed in `brew-recorder` + `CONTEXT-brewing.md` + `catalog`.

So the migration **inherits** the philosophy; the entry skill just has to *compose* the already-apex-aware operational-guide, not re-author it. (One residual: the `docs/reference/wbc-materials.md` 4→5 modifier-mapping is parked for a brewing grill per [issues.md](docs/product/issues.md) — out of scope here.)

## Session type + demarcation

**Mixed.** 4a (entry surface) + 4b (audio parity) are **execution / verification** — the architecture is settled in roadmap #4, so the autonomy rule applies once you've confirmed this plan: build + verify + ship without a second sign-off round. 4c (live dogfood) is a **real brew where Chris's lived brewing experience is load-bearing** — at the brew-design interpretive forks (strategy choice, what to iterate on, when the brew is "optimized"), **ask Chris; do not auto-decide the coffee**. Execute the scaffolding; ask at the brew calls.

## The sequence

### 4a — Entry surface (the one real design call; verify the mobile constraint FIRST)

The gap: Claude Code has no claude.ai project instructions; `CLAUDE.md` (dev-oriented) auto-loads instead, so a brewing session needs an explicit, reliable entry. This gap is **shared with roasting** (neither `roasting-coordinator` nor `research-coordinator` has a `.claude/skills/` wrapper today — they rely on an operator one-liner + a CLAUDE.md pointer). Brewing is the cleaner first test, so whatever you land here is the pattern roasting can inherit (a `.claude/skills/lot/` wrapper).

**VERIFY FIRST (open question that determines the design):** does a fresh **mobile** Claude Code session load repo `.claude/skills/`? The 2026-06-09 probe verified MCP `read_doc` over `docs://` Resources works on mobile, but did **not** confirm skill discovery/triggering on mobile. The answer forks the entry:
- **If mobile loads repo skills:** add a real invocable **`.claude/skills/brew/SKILL.md`** (trigger: "brew a coffee" / "start a brew"). Its body replicates `start-brew.md`'s framing for the Claude-Code client — pull the operational-guide Step 1-4 sections (via `read_doc`/`read_doc_section` on `docs://skills/brewing-assistant/cluster/operational-guide.md`, the same calls `start-brew.md` makes, since mobile reads docs over MCP not the filesystem), compose the three knowledge clusters, run Coffee Brief → pause at Step 1d for strategy + modifier confirmation → recipe (Step 2) → iterate (Step 3) → complete via `bundled-brewing-completion`. Include the self-roasted **hard-gate** + the optimized-brew **carve-out** logic that `start-brew.md` / `bundled-brewing-completion.md` already encode.
- **If mobile does NOT load repo skills:** the entry is an **operator one-liner** that points the session at `read_doc` of the brewing operational-guide — which is essentially what `start-brew.md` already is. In that case `start-brew.md` *is* the entry surface for mobile; the work is to confirm it reads cleanly in Claude Code and add a Claude-Code-client note (the `read_doc_section` calls are client-agnostic, so this should mostly already work).

Land whichever the verification supports. Either way the entry must reach the **already-apex-aware** operational-guide so the Step 1d clarify-side default + whole-arc discipline carry over for free.

### 4b — Audio-dictation parity (verify-first; the one item that could block)

Brewing Phase-2 iteration is audio-heavy (operator dictates long multi-fact tasting notes; `feedback_audio_dictation.md` — extract every implicit term, keep responses tight). Verify a mobile Claude Code session handles that turn shape. Then **codify the running-state-block habit** (the mobile-probe finding: across a >24h idle gap, compaction preserved load-bearing identifiers verbatim but compressed long tool-result bodies — incl. per-iteration tasting detail — to gist). Add a short "maintain a running tasting-arc state block" instruction to the entry surface (the new skill, or `start-brew.md` if that's the mobile entry) so the iteration arc survives compaction. If a hard audio gap exists, surface it to Chris before proceeding — it's the only thing that can block the migration.

### 4c — Live dogfood

Run one real brew end-to-end on mobile Claude Code with Chris. Capture friction (mirror roasting's `process-friction-log.md` pattern — a thin append-only log for the brewing workflow itself). The migration is revisable on first-brew evidence. Ask at the brew-design forks (§ demarcation above).

## Files likely to touch

`.claude/skills/brew/` (new, *if* 4a verification supports it) · `docs/prompts/start-brew.md` (running-state-block note + any Claude-Code-client framing) · possibly a thin brewing friction-log doc under `docs/skills/brewing-assistant/cluster/` · `docs/product/roadmap.md` (move #4 to done at close) · `docs/sprints/shipped.md` (shipped row at close). Likely **no schema / app code** — this is a surface migration; the whole-arc `brews` *schema* question is the coupled brainstorm, explicitly **out of scope**.

## Verification plan

- 4a/4b are verification-first: the mobile-skill-loading check + the audio check are the gates, run them before building the entry.
- If any TS/lib/API-route file is touched: `npm run build` (proxy via the main repo per CLAUDE.md). Expected: none.
- `npm run check:doc-links` + `npm run check:doc-sizes` green on any doc edits.
- **The real verification is 4c** — a real brew completing end-to-end on mobile CC with the optimized brew pushed via `push_brew` and doc-proposals emitted via `propose_doc_changes`, indistinguishable from the claude.ai path.

## Standing rules

- **Six-actor cross-system audit** on any substrate change (the entry skill is a new surface; trace it). This sprint is mostly Actor 2 (prompts) + the new skill surface; it deliberately does **not** touch Actor 6 (schema) or Actor 4 (MCP Tools).
- **Roadmap currency:** at close, move #4 out of [roadmap.md](docs/product/roadmap.md) Active queue + add a [shipped.md](docs/sprints/shipped.md) row, same PR.
- **`feedback_hyphens_not_emdashes`:** plain hyphens in new prose.
- **MCP-only input holds** regardless of client (`feedback_mcp_only_input`) — the migration changes the *orchestration surface*, never the write path.

## Out of scope

Whole-arc tasting-capture *schema* on `brews` (the coupled brainstorm — scope-first, build-gated). Any Coordinator/Assistant split. Retiring `start-brew.md` / the claude.ai brewing path (grace-handoff; net-new only, retire on Chris's signal once mobile CC brewing is proven). The `wbc-materials.md` modifier-mapping grill.

## Open questions to resolve in-session

1. **Does mobile CC load repo `.claude/skills/`?** (forks 4a — verify before building).
2. **Audio dictation parity on mobile CC** — does the long-multi-fact turn work? (4b gate).
3. Where does the running-state-block instruction live — the new skill, `start-brew.md`, or both? (minor; resolve once 4a's shape is known).
