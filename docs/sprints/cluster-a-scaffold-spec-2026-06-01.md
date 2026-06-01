# Cluster A scaffold - SPEC (grill-to-spec output)

Grilled 2026-05-31 / 2026-06-01. Source: [cluster-a-scaffold-grill-to-spec-kickoff-2026-05-31.md](cluster-a-scaffold-grill-to-spec-kickoff-2026-05-31.md). Grilling session (ask-don't-ship); this is the spec, not the build.

## Headline reframe

Cluster A is **workflow-shaped, not data-model-shaped.** The kickoff framed the lot-brew data model as the big open call; the grill found two of three items already settled at the schema level (peer FK shipped migration 069; SPG cupping-row shape decided, deferred to POD-1). What is actually missing is **cross-project workflow** plus **one small mirror FK**. Every one of Chris's three points is a "how do I do this inside a claude.ai thread, and how does the knowledge cross the brewing-project ↔ roasting-project boundary" question.

The unifying primitive that fell out of the grill: a **brewing-to-roasting handoff brief** - a brewing-project thread produces a structured doc, a roasting-project thread consumes it, and the boundary is never crossed by loading brewing context into the roasting thread (same discipline as the research coordinator ↔ assistant pattern, same reason: protect the roasting thread's context window). All three workflows are one instance each of this primitive.

| # | Workflow | Brewing-side executor | Handoff carries | Roasting-side consumer | Brew persisted? | Link |
|---|---|---|---|---|---|---|
| 1 | Simulated pourover gate | new `simulated-pourover.md` | the first-guess recipe + derivation | cupping-specialist (thin trigger) | No (ephemeral) | none (cupping row only) |
| 2 | Peer-roasted variant | new `peer-variant-completion.md` | 5-field assessment | Peer-Learning skill + `start-lot.md` pickup | Yes (full `push_brew`) | `green_beans.peer_reference_brew_id` (exists) |
| 3 | Optimized brew (MB-7) | existing `bundled-brewing-completion.md` (+ brew_id in handoff) | the pushed `brew_id` | `close-lot.md` completion-fill | Yes (full `push_brew`) | `green_beans.optimized_brew_id` (NEW) |

## Workflow 1 - Simulated pourover gate (cross-project handoff)

**Lived shape (El Patricio Red Plum Castillo, RED-PLUM-CAS-2026, roasts 196/197/198):** mid pourover-cupping, two finalists, the xBloom gate cup is consistent-but-non-optimized so it doesn't predict the end-state optimized cup (delta can be large). SPG = run the bean's identity through the *brewing* process for one first-guess (non-iterated) recipe, apply it identically to the finalists, get a sharper read without spending the full optimization budget.

**Spec:**
- **Brewing side** owns the full contract: new `docs/prompts/simulated-pourover.md`, sibling to `start-brew.md`. Input: a green bean, **read via `get_green_bean`** (not hand-pasted). Output: a simulated coffee brief + one initial recipe + a handoff-back doc. Hard rules: **no iteration loop; no `push_brew`** (ephemeral).
- **Roasting side**: a thin pointer in the **cupping-specialist skill** - on SPG kickoff, emit a minimal packet (`green_bean_id` + finalist batch numbers + intent) conforming to the brewing prompt's input contract. No format duplication, no context bloat. (Chris's stated top worry: roasting-side bloat. This keeps it to a few lines.)
- **Persistence:** the SPG *cupping result* persists as a cupping row (`cuppings.eval_method = 'Simulated Pourover'`, already decided, ships with POD-1). The SPG *recipe is ephemeral* - lives in the brewing-thread stub, never recorded, no brew row. Same recipe across finalists within a session; not persisted across sessions.
- **Flagged ambiguity (recorded, not contested):** not recording the SPG recipe means no attribution trace and no strict cross-V-set SPG comparability. Deprioritized by Chris, revisitable. Matches the existing precedent (intermediate iteration brews lost when a thread rolls off).

## Workflow 2 - Peer-roasted variant (cross-project handoff, the other direction)

**Lived cases (the two-axis taxonomy Chris articulated):**

*Axis 1 - lifecycle stage where the peer variant appears:* (1) green in inventory, no roast started (Panama Janson); (2) about to taste/design V2 (Wush Wush, V1 cupping went off); (3) deep in V-sets (Sudan Rume, V2/V3); (4) roast cycle already done, peer variant found after (pure philosophy comparison, no roast action).

*Axis 2 - information value, gated by roast-level distance from Chris's philosophy:* **High** (same lot, similar philosophy - learn a lot); **Low** (Panama Janson, 47.9 Agtron, oily, past second crack - roast level overtakes everything, variety/origin/process stop mattering, almost no transfer); **Medium** (Wush Wush, 65.4 Agtron, medium-light, slightly dark - real but partial; notably *confirmed a hypothesis*: this green roasts fast/dark, bias lighter).

**The handoff beats a raw read.** A raw `get_brew` hands the roasting thread roast-contaminated cup notes with no guidance on how to discount them. The single most valuable thing about a peer variant is **how much of the cup is the bean vs their roast** - which only the brewing side, at completion, with the Agtron in hand, can judge. So a curated handoff doc, not a live read.

**Peer-Variant Handoff (brewing → roasting) - 5 fields:**
1. **Pairing + provenance** - `green_bean_id` it pairs to, peer roaster, same-lot confirmation, **their roast level (Agtron WB + visual: oily/color)**, process/variety/origin.
2. **Information-value rating: High / Medium / Low** + reason, anchored on roast-level distance from Chris's philosophy. The dial that weights everything below.
3. **Cup read, split bean-attributable vs roast-attributable** - the mechanism that produces field 2.
4. **Roast-design takeaway for MY roast** - the actionable line(s); hypothesis-flagged at Medium/Low.
5. **Discount list** - the roast-contaminated notes that must NOT drive roast design.

**Spec:**
- **Brewing side**: new `docs/prompts/peer-variant-completion.md` (shares `start-brew.md`; only the ending differs because the operator knows up front it's a peer variant). **Strongly encourages an Agtron + color read** (it feeds field 2) but does not gate on it. Emits the 5-field handoff. Sets `peer_reference_brew_id` if the green row exists; else records the pairing for start-lot.
- **Roasting side**: the **Peer-Learning Roasting Archivist skill** owns the consumption reasoning (weight by info-value, consult per lifecycle stage) and is the durable home for the handoff. `start-lot.md` gains a pickup step: "have you already brewed a peer variant of this green? bring its handoff" - which is the discovery path that already worked once (Wush Wush surfaced via an inventory-sheet note).
- **Link timing rule:** set `peer_reference_brew_id` **at the earliest moment both rows exist.** Green row exists (mid-V-set, post-cycle) → completion prompt links immediately. Green row doesn't exist (pre-V1 inventory, Panama Janson) → defer; `start-lot.md` sets it when it creates the green row. **No skeleton green-bean row** (buys nothing real, costs a dedup hazard + a phantom `in_inventory` lot).
- **Requirement locked:** peer learnings must reach V1 **before/as `start-lot.md` generates the first roast recipes.** Mechanism kept deliberately simple: operator pastes the handoff (or Claude pulls it from the Peer-Learning skill) at start-lot. No auto-discovery machinery now; add a brews-search step later only if hand-pasting gets annoying across many lots.

## Workflow 3 - Optimized brew (MB-7, attach reference brew)

**Lived shape:** near a reference-roast call → SPG bake-off → declare `is_reference = true` → fresh brewing thread from scratch with just the reference roast in mind → full brewing cycle → completion `push_brew` (brew lands in Latent) → handoff doc back to roasting → `close-lot.md` completion fill (cupping data etc.).

**Spec:**
- **New FK** `green_beans.optimized_brew_id` → `brews(id)` ON DELETE SET NULL. A carbon copy of migration 069. **Named `optimized_brew_id`, not `reference_brew_id`** - "reference brew" collides three ways (reference *roast* = winning batch, reference *cup* = xBloom gate, reference *brew* = the purchased-bean term); for a self-roasted lot the attached artifact is precisely the **optimized brew** per CONTEXT. (Supersedes the roadmap's looser "attach reference brew" label.)
- **Happy-path linkage is explicit, not heuristic:** the `bundled-brewing-completion.md` handoff carries the pushed `brew_id`; `close-lot.md`'s completion fill reads it and sets `optimized_brew_id`, asking for the ID if it's missing. The `pickOptimizedBrew` heuristic is demoted to legacy-only fallback for lots closed before the column exists (same back-compat shape as `best_roast_id` over `best_batch_id`).
- **No new prompt file** - just add "include the pushed `brew_id` in the handoff" to `bundled-brewing-completion.md`. Only #2 earns its own completion file.
- **Backfill:** Chris supplies the per-lot optimized-brew mapping (no clean programmatic disambiguation from `green_bean_id` alone); set via `patch_green_bean(optimized_brew_id)`.

## The lot's brew-web (relationships)

A green-bean lot links to up to three brew artifacts, two of them canonical single pointers:
- **my brews** - `brews.green_bean_id` (many).
- **my optimized brew** - `green_beans.optimized_brew_id` (1, NEW) - the lot's canonical end-state cup.
- **peer-roasted variant** - `green_beans.peer_reference_brew_id` (1, exists) - external calibration anchor.

Two sibling nullable FKs, explicit, fed by the cross-project handoff brief. Not a join table (1:1 in lived practice; revisit if many-to-many emerges). Not a heuristic (kept only as legacy fallback).

## No new MCP Tools or Resources

The cross-boundary reads all use existing tools: `get_green_bean` (#1), `get_brew` (optional), `patch_green_bean` (set both FKs). The only MCP-surface change is adding `optimized_brew_id` to the `push_green_bean` / `patch_green_bean` Zod schema + Tool descriptions - a schema change to an existing Tool, so it is not callable in claude.ai until a fresh session re-handshakes the catalog (per the catalog-cache rule).

## Proposed CONTEXT additions (for ratification)

**CONTEXT-shared.md - new term:**

> **Brewing-to-roasting handoff brief**:
> A structured doc a brewing-project thread produces and a roasting-project thread pulls back in, carrying a brewing-side result across the claude.ai project boundary without loading brewing context into the roasting thread. Three instances in the lot pipeline: the simulated-pourover recipe handoff (ephemeral), the peer-variant handoff (5-field assessment), the optimized-brew handoff (carries the pushed `brew_id`). Same shape and rationale as the research coordinator ↔ assistant handoff - the boundary exists to protect the roasting thread's context window.
> _Avoid_: "handoff doc" (too generic); conflating with the research-coordinator handoff (same shape, different domain).

**CONTEXT-roasting.md - extend the existing § Peer-roasted reference brew:** add the **information-value rating** (High/Medium/Low, gated by roast-level distance; bean-vs-roast-attributable split as the mechanism), the **5-field handoff doc shape**, the **start-lot pickup + earliest-both-exist link rule**, and a **currency fix**: strike the stale "UI surface deferred to a future sprint" line (the 05-26 audio moved this to the Peer-Learning Roasting Archivist skill, not the app) and name that skill as the lessons home.

**CONTEXT-roasting.md - near § Optimized brew:** note the explicit `green_beans.optimized_brew_id` FK replaces the `pickOptimizedBrew` heuristic.

## Proposed ADR-0019 (offered - see open question)

> # The lot's brew-web: explicit sibling FKs over heuristic and join table
> A green-bean lot points at up to three brew artifacts: the operator's own brews (`brews.green_bean_id`), the operator's canonical optimized brew, and an external peer-roasted variant. We model the two canonical pointers as two nullable sibling FKs on `green_beans` (`optimized_brew_id` + `peer_reference_brew_id`), set explicitly at the earliest moment both rows exist via a brewing-to-roasting handoff brief that carries the `brew_id`. Rejected: (a) the `pickOptimizedBrew` heuristic as the permanent mechanism (kept only as a legacy fallback for pre-FK closed lots); (b) a `peer_reference_brews` join table (1:1 in lived practice - migrate later if many-to-many emerges). The handoff-brief delivery (vs a live `get_brew` read) is deliberate: the bean-vs-roast attribution that makes a peer variant high- or low-information can only be judged brewing-side at completion, not reconstructed from the raw brew row.

## Build plan (PR decomposition)

- **PR-A1 (schema + link):** migration NNN `green_beans.optimized_brew_id` (mirror 069); `lib/types.ts`; `push_green_bean` / `patch_green_bean` Zod + Tool descriptions; resolved-view prefers FK, heuristic fallback; backfill via Chris's mapping. Six-actor: 6 (schema/types/UI) + 4 (MCP) + 1 (resolved render).
- **PR-A2 (brewing prompts):** new `simulated-pourover.md`; new `peer-variant-completion.md`; edit `bundled-brewing-completion.md` (brew_id in handoff). Actor 2.
- **PR-A3 (roasting prompts + skills):** cupping-specialist SPG trigger + thin pointer; `start-lot.md` peer-variant pickup + deferred-link set; `close-lot.md` read brew_id + set `optimized_brew_id` + ask-if-missing; Peer-Learning Roasting Archivist consumption reasoning + durable handoff home. Actor 2 + 5.
- **PR-A4 (substrate):** CONTEXT-shared handoff-brief term; CONTEXT-roasting peer-entry extension + currency fix + optimized_brew_id note; ADR-0019; roadmap currency (move Cluster A items out of § Roadmap, add shipped.md rows on build close). Actor 5.

(A1 + A4 could land together as the spec-landing PR; A2/A3 are the workflow build.)

## claude.ai grilling review (3-part, fired at grill close)

1. **Memory/instruction currency:** one real drift found and folded into PR-A4 - CONTEXT-roasting § Peer-roasted reference brew (line 386) still points at a deferred app UI surface that the 05-26 audio killed; also predates the Peer-Learning skill as the lessons home.
2. **Cross-party claude.ai grill (roasting-emphasized):** highest silent-drift risk. Cluster A introduces three handoff docs crossing the boundary the claude.ai layer mediates. The **claude.ai/brewing and claude.ai/roasting project instructions** (the one surface Claude Code can't see/edit) must be updated at build time to route to the new prompts: brewing project needs `simulated-pourover.md` + `peer-variant-completion.md` + "brew_id in handoff"; roasting project needs the start-lot / close-lot / cupping-specialist handoff-consumption steps. The prompt *content* reaches claude.ai via `docs://` Resources at session start, but the project-instruction *pointers* are manual. Build-kickoff must list this as an explicit Chris action.
3. **Context-window usage check:** the entire design is context-protective by construction - the handoff-brief primitive and the thin-pointer-on-roasting-side discipline exist precisely to keep brewing context out of roasting threads. No concern; the design serves the rule.
