# Cluster A scaffold — grill-to-spec (kickoff)

Next item in the chain sequenced by the capstone roadmap session (2026-05-31):

> capstone roadmap session → resync grill (done, 2026-05-31) → **(this) Cluster A scaffold grill-to-spec** → Cluster A build.

The resync grill landed first specifically so the glossary + docs are synced *before* this scaffold grill introduces a pile of new cross-domain terms — they now land on synced ground.

## ⚠️ THIS IS A GRILLING SESSION (grill-to-spec). DO NOT EXECUTE. ⚠️
Ask-don't-ship. The autonomy rule does **NOT** apply (per [feedback_grilling_vs_executing_distinction](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md)). Interview Chris in long-form prose on every substrate-altering call; recommend an answer per question; one question at a time. Chris's audio is the load-bearing signal — do NOT pre-pick the data model or frame as plan-mode-approved execution. Output = a spec (CONTEXT terms + ADR(s) + a build plan), not code or migrations.

## What Cluster A is (PRODUCT.md § Roadmap — "top of the board")

**Cluster A = the cross-domain lot↔brew scaffold.** Three roadmap items are ONE scaffold and grill together (may split into multiple build PRs):

1. **Cross-domain simulated-pour-over workflow + roast↔brew handoff** (Roadmap Item 4) — keeping the roast↔brew loop intact across the claude.ai *project boundary* (brewing project ↔ roasting project).
2. **MB-7: attach reference brew** — the lot's canonical reference brew, linked.
3. **Roasted-variant-of-same-green modeling** (grilling-queue Item 17 / roadmap "roasted-variant" item) — for ~25-30% of lots Chris also buys the roasted variant from the same source as an external-roaster calibration anchor; today the pair is unlinked in the data model. Options on the table: (a) keep separate forever; (b) FK on `green_beans` → external roasted brew's `brew_id`; (c) a `peer_reference_brews` join table.

The unifying concept: **the lot's web of linked brews** — canonical reference brew / my other brews / peer-roasted variants — and keeping the roast↔brew loop coherent across the project boundary.

## Likely grill territory (open — for the grill to resolve, not pre-decide)

- The **data-model call** for the lot↔brew web (FK vs join table vs operator-coordinated) — this is the big one; Chris's standing instinct has been "keep separate," but the scaffold may change that. Grill it.
- New cross-domain vocabulary (likely CONTEXT-shared, since it spans both zones): "reference brew" vs "optimized brew" already exist (CONTEXT-brewing) — does the cross-domain web need new terms (linked-brew web / peer-roasted variant / project-boundary handoff)?
- The **Simulated Pourover Gate** already exists in CONTEXT-roasting — confirm how the cross-domain workflow relates to it (don't re-invent).
- Whether this needs new MCP Tools / Resources (the roast↔brew handoff across the project boundary may), which pulls in the six-actor trace at spec time.

## Resync-grill carry-ins relevant here

- **Doc-size:** CLAUDE.md is OVER tripwire (149KB) — a root-doc compaction sprint is queued (Cluster B, interleaved). Don't add large IA prose to CLAUDE.md during Cluster A; prefer cluster docs / `docs/architecture/`.
- **claude.ai grilling review** fires at this grill's close too (standing rule) — especially relevant since Cluster A spans the project boundary the claude.ai layer mediates.
- The **predicted-vs-actual tier** (now carrying the folded Item 35 roast-time-HUD + deviation-attribution need) is a *later* tier — keep it OUT of Cluster A scope (Cluster A is cross-domain modeling, not roasting-side execution UX).

## Scope — OUT
- Predicted-vs-actual delta / coffee-brief scoping / surface trio / cultivar arc (later tiers).
- The root-doc compaction + claude.ai grilling review (Cluster B, separate).
- Any build/migration (this is grill-to-spec; the build is the session after).

## End-of-session
- Produce the Cluster A **spec**: CONTEXT terms (likely shared-zone) + ADR(s) for the data-model decision + a build plan (PR decomposition).
- Run the claude.ai grilling review at close.
- Write the Cluster A **build** kickoff brief.
