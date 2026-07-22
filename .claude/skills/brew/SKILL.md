---
name: brew
description: >-
  Run a coffee brew end-to-end in Claude Code. Use when Chris says "brew a coffee", "start a
  brew", "I want to brew", "let's dial in <coffee>", or pastes a coffee URL / OPTIMIZED BREW
  PACKET to brew. The only thing it writes to the app is the OPTIMIZED brew via push_brew;
  intermediate iterations stay in-thread by design (archive-driven).
---

# Brew (Claude-Code-native brewing entry)

This is the brewing workflow's **Claude-Code-native entry surface**, the migration of the
claude.ai brewing project onto a Claude Code (mobile) session ([roadmap.md Active queue #4](docs/product/roadmap.md);
[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md) carries the domain-boundary
reasoning). It is **not** a new architecture. A brew is one short single session: Coffee Brief,
starting recipe, in-thread iteration, push the optimized brew. You are **reusing** the existing
stack as-is, just from a new client:

- [`brewing-assistant`](docs/skills/brewing-assistant/SKILL.md), Steps 1-4 design framework (the substantive how-to lives in [`cluster/operational-guide.md`](docs/skills/brewing-assistant/cluster/operational-guide.md))
- [`brew-recorder`](docs/skills/brew-recorder/SKILL.md), the `push_brew` executor
- the three knowledge clusters: [brewing-equipment-expert](docs/skills/brewing-equipment-expert/SKILL.md) · [brewing-historian](docs/skills/brewing-historian/SKILL.md) · [wbc-brewing-archivist](docs/skills/wbc-brewing-archivist/SKILL.md)

This skill is the orchestration spine the claude.ai project instructions used to be. It does
**not** restate the operational guide; it composes it via `read_doc`, the same calls
[`docs/prompts/start-brew.md`](docs/prompts/start-brew.md) makes (mobile CC reads docs over MCP,
not the filesystem). The substantive design logic stays in the cluster; this file is just the
reliable way in.

> **Operator-direct, like the roasting coordinator** ([ADR-0017](docs/adr/0017-research-assistant-architecture.md) Exception 1).
> Not Master-Coordinator-dispatched, not MCP-registered. The operator triggers it directly
> ("brew a coffee"). If a fresh mobile session does NOT surface this skill, the identical entry
> is the operator one-liner in [`docs/prompts/start-brew.md`](docs/prompts/start-brew.md); that
> prompt is the fallback surface and reaches the same operational guide.

## Apex inheritance: do not re-author it

The brewing stack is already **apex-aware**. You inherit the
philosophy; you do not re-state it. Two load-bearing places it lives, reached for free when you
compose the operational guide:

- **Step 1d clarify-side default.** For **apex coffees** (self-roasted, or apex-selected
  purchased) the brew is the *clarify* stage of the express-then-clarify couple, so strategy
  defaults clarify-side (Suppression / Clarity-First / Hybrid). Apex default, not a global
  override. ([operational-guide.md § Step 1d](docs/skills/brewing-assistant/cluster/operational-guide.md))
- **Step 3 whole-arc station discipline.** Judge the *shape* of the cup's evolution across
  aroma, hot ~59-60, warm ~54-55, cool ≤50; never iterate off a single temperature. The apex is a
  **layered-evolving** cup; the keystone is **reveal the latent, don't inject the absent**.
  ([operational-guide.md § Step 3](docs/skills/brewing-assistant/cluster/operational-guide.md))

Canon, read-only: [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md) + [catalog § Brewing domain principles](docs/skills/coordinator/catalog.md).

## Session start: self-roasted gate FIRST (before any Step)

Before anything else, determine whether this brew is **purchased** or **self-roasted**, because
the two route differently at completion. This mirrors the gate in
[`bundled-brewing-completion.md`](docs/prompts/bundled-brewing-completion.md); read its
self-roasted detection block for the full signal list. The short version:

1. **Ask:** "is this brew from a coffee Chris roasted himself?" Signals: explicit "self-roasted"
   / "Latent" framing, batch # references, a roast date instead of a roaster purchase date, or a
   coffee URL pointing at a green-bean PRODUCT path (discriminate by URL *path* / product type,
   not bare domain; Untold Coffee Lab sells both green and roasted). If genuinely ambiguous, ASK
   (this one question survives the no-confirmation rule).

2. **Purchased** → run the full arc below; complete via
   [`bundled-brewing-completion.md`](docs/prompts/bundled-brewing-completion.md) (`push_brew`,
   then `propose_doc_changes`).

3. **Self-roasted, ordinary** → **STOP.** Do not `push_brew` here; that creates an orphan row the
   architecture routes elsewhere. Give Chris the handoff context (recipe + tasting arc +
   brewing-side learnings) and tell him to run `close-lot.md` (or `one-shot-closeout.md` if
   `green_beans.is_one_shot=true`) in the roasting thread.

4. **Self-roasted optimized-brew carve-out**, the ONE self-roasted brew that completes HERE.
   Signal: an `OPTIMIZED BREW PACKET` block, or the operator declares "this is the optimized /
   reference brew for <lot>". Handle per [`start-brew.md`](docs/prompts/start-brew.md)'s
   self-roasted entry: pull the lot via `get_green_bean` + `get_bean_pipeline` (the roasted-bean
   state IS the "coffee"), seed Step 1d from the packet's starting brewing direction, iterate
   normally, and at completion run `push_brew` (`source: "self-roasted"`, `roaster: "Latent"`,
   `green_bean_id` + the packet's `roast_id` both set); it does NOT stop at the gate. Then emit the
   closing handoff line so the roasting close-out prompt LINKS the `brew_id` via
   `green_beans.optimized_brew_id` (link, never re-push). Invariant: pushed exactly once (here),
   linked exactly once (close-out).

## The arc

Fetch each operational-guide section at the point you need it via `read_doc_section` (anchors are
the verbatim h2 headings, em-dashes preserved; on a miss, `list_doc_sections` to rediscover,
do not re-fetch the whole doc). This is the same fetch discipline `start-brew.md` documents.

**Step 1: Coffee Brief.** Fetch
`read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md", anchor="Step 1 — Coffee Brief (Claude runs this automatically)")`.
Run 1a-1d. **Purchased-coffee freezer lookup (do this first, in 1a):** before asking Chris for the
roasted-bean color, consult the freezer-stock table — `read_doc(uri="docs://brewing/freezer-stock.md")`
(mobile/MCP) or read `docs/brewing/freezer-stock.md` directly — and match by roaster + coffee name
(the `##` heading is the key). On a HIT, seed the brief from the record: **the whole-bean Agtron is
the load-bearing pull — use it, do NOT ask Chris to re-measure** — plus the spec URL, process,
variety, elevation, and rest window. On a MISS (or a `Resting` row with Agtron `pending`), proceed
normally. Self-roasted brews skip this — the carve-out pulls the roasted-bean state from the DB
(`get_green_bean` + `get_bean_pipeline`) instead. For equipment knowledge dispatch to the Brewing Equipment Expert cluster; for WBC
recipe anchors + cross-cutting control patterns dispatch to the WBC Brewing Archivist; for
per-cultivar / per-coffee-family / per-strategy priors dispatch to the Brewing Historian; for
canonical lookups call `read_canonical(axis: "<name>")`. **Pause at Step 1d for strategy + modifier
confirmation before producing the recipe**; this is where the apex clarify-side default applies.

**Step 2: Recipe.** After strategy is confirmed, fetch
`read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md", anchor="Step 2 — Recipe Output (after strategy is confirmed)")`.
Author Bloom + Pour Structure in the labeled CUMULATIVE-target shape; water formula goes in the
Water Recipe field (at home, source the suggestion from [water.md](docs/skills/brewing-equipment-expert/cluster/water.md)
per the operational guide's Step 2 home/office branch; office records the source as-is); kettle
thermal stance / active ramps go in a `thermal_staging` modifier; gear
beyond brewer+filter (Melodrip / booster / Paragon ball) goes in an `equipment` modifier with
free-text scope.

**Step 3: Iterate (Phase 2).** When the operator returns with tasting notes, fetch
`read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md", anchor="Step 3 — Iteration Loop (Phase 2 — in-thread iteration)")`,
not before. Honor the whole-arc station discipline + the scale-dependent adjustment-width rule
(Brew 1 wide-variance, Brew 2-3 single-variable, Brew 3+ probe). Maintain the **running
tasting-arc state block** below at every iteration turn.

**Completion.** When the operator declares the optimized brew, hand to
[`bundled-brewing-completion.md`](docs/prompts/bundled-brewing-completion.md): it fetches Step 4
(Resolved Brew Output Format), runs `push_brew` (the per-coffee terminal write; only the optimized
brew lands), then `propose_doc_changes` for the coffee learnings. Then run the **close retro**
below.

**If the Latent connector is unreachable at the completion write** (N=3 recovery recipe,
graduated 2026-07-22): (a) discover the tools by keyword (`ToolSearch "push brew canonical"`) or
the connector-UUID prefix — never by `mcp__latent-coffee__*` name, which does not exist on the
account-level connector; (b) if the connection dropped mid-session, one fresh-session retry
before concluding the server is down — the deferred-tool catalog does not repopulate in-session;
(c) if still unreachable, freeze the complete resolved payload in-thread and land it in the next
session (zero-loss, proven three times).

## Running tasting-arc state block (Claude Code compaction discipline)

Brewing Phase-2 iteration is audio-heavy and can span an idle gap (the operator brews, comes back
hours later). Across a >24h idle gap, compaction preserves load-bearing identifiers verbatim but
**compresses long tool-result bodies, including per-iteration tasting detail, to gist**. The
iteration arc is exactly that per-iteration detail, so it is the thing at risk.

**Mitigation: maintain a running tasting-arc state block in the conversation, restated and updated
every iteration turn** so the arc lives in recent context (which compaction preserves) rather than
only in old tool-result bodies (which it compresses). Keep it compact:

```
ARC STATE: <coffee>
Recipe now: <strategy> · <brewer>/<filter> · <dose>g · <ratio> · <grind> · <temp> · <key pour/valve moves>
Brew 1: aroma … / hot ~59 … / warm ~54 … / cool ≤50 … → signal: <directional read>
Brew 2: … → signal: …
Leading direction: <what's working> · Next change: <single variable + why>
Open: <unresolved / strategy-pivot watch>
```

This is the brewing analog of the roasting Brief's write-at-every-break discipline, except
brewing's arc is short enough to live in-thread, so the block is the persistence, not a file. When
the operator dictates a long multi-fact tasting turn (per [feedback_audio_dictation.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_audio_dictation.md)),
extract every implicit term into the appropriate station, fold it into the block, and keep the
response tight.

## Close retro: append workflow friction

After the brew completes (or if it stops early at the self-roasted gate), spend one beat on the
**workflow itself**, not the coffee: did the entry trigger cleanly, did the arc survive
compaction, did a knowledge-cluster fetch fail, did a gate fire wrong, did the CC surface make
anything harder than the claude.ai path did? Append any friction as a dated bullet to
[`docs/skills/brewing-assistant/cluster/process-friction-log.md`](docs/skills/brewing-assistant/cluster/process-friction-log.md)
(the brewing analog of the roasting [process-friction-log](docs/skills/roasting-coordinator/cluster/process-friction-log.md);
the coffee's learnings go to the DB + `propose_doc_changes`, the *process* friction goes here). If
this session can't write the repo file, surface the friction line for Chris to land. A friction
recurring across brews (N=3) graduates into a SKILL.md / operational-guide edit; make the skill
better, not bigger.

## Out of scope

One short session: the running-state block + friction log. **No** durable Brief file,
Coordinator/Assistant split, handoff packets, or `lot_status` - brewing has none of roasting's
single-session context-bloat problem. The whole-arc tasting-capture *schema* question on `brews`
is a separate gated brainstorm, not this skill's job.

## Never code-deploy mid-brew (build-hygiene guardrail)

A brew session **records** a brew; it does not ship app code. If a net-new
canonical blocks `push_brew`, use the matching `*_override: true` flag — every
axis now has one, **including `cultivar_override`**. Hard rules:

- **NEVER** edit `lib/cultivar-registry.ts` / `lib/terroir-registry.ts` (or any
  `lib/*` / migration) and deploy mid-brew to unblock a write. The override flag
  + the arbiter queue is the path; the registry promotion happens later, off the
  brew session's critical path.
- The one true strict axis left is the **terroir macro** — if a net-new macro
  blocks, queue it via `propose_canonical_addition` and finish the brew with the
  closest canonical macro (or park the push), rather than editing + deploying.
- If a code change is ever genuinely unavoidable, **never merge without a green
  `npx tsc --noEmit` / build** ([CLAUDE.md § build-hygiene](CLAUDE.md)). The
  FanHua detour shipped a failed prod build because this step was skipped.

The write path is always `push_brew` via the Latent MCP server
([feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md)),
regardless of client; no manual DB inserts, no in-app forms.

## Cross-references

- [docs/brewing/freezer-stock.md](docs/brewing/freezer-stock.md), the roasted-bean freezer inventory — brew-time lookup for purchased coffees (whole-bean Agtron + URL + specs), so Chris isn't asked to re-measure
- [docs/prompts/start-brew.md](docs/prompts/start-brew.md), the CC `/brew` fallback entry surface + self-roasted carve-out substrate (claude.ai brewing retired 2026-06-18; same operational guide)
- [docs/prompts/bundled-brewing-completion.md](docs/prompts/bundled-brewing-completion.md), the shared completion engine this skill hands off to (push_brew, then propose_doc_changes)
- [docs/skills/brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md), the substantive Steps 1-4 how-to (composed via read_doc)
- [docs/skills/brewing-assistant/cluster/process-friction-log.md](docs/skills/brewing-assistant/cluster/process-friction-log.md), the close-retro friction log
- [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md), apex canon
