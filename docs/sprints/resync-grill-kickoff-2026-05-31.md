# Resync grill — grill-queue drain + doc resync (pre-Cluster-A)

Produced by the capstone product-roadmap-review session (2026-05-31). This is the
**first item sequenced** out of that review. The agreed chain is:

> capstone roadmap session → **(A) this resync grill** → Cluster A scaffold
> grill-to-spec → Cluster A build.

## ⚠️ THIS IS A GRILLING SESSION. DO NOT EXECUTE. ⚠️
Ask-don't-ship. The autonomy rule does NOT apply (per
[feedback_grilling_vs_executing_distinction](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md)).
Interview Chris in long-form prose on every substrate-altering call. Output =
CONTEXT/ADR/doc updates via `/grill-with-docs` (which edits inline as decisions
crystallize), not code.

## Why now
Decided in the capstone roadmap session: resync the glossary + docs BEFORE the
Cluster A cross-domain scaffold grill introduces a pile of new cross-domain terms —
so they land on synced ground. Chris: "always good to keep resyncing on the
grilling side and documentation side so we don't get too far out of sync."
Bounded housekeeping; keep it clean and don't let it bleed into scaffold design.

## Working mode
Invoke `/grill-with-docs`. It updates CONTEXT-{brewing,roasting,shared}.md + ADRs
inline as calls firm up.

## Scope — IN
Drain the grilling-queue ([docs/grilling-queue.md](../grilling-queue.md)):
- **Item 42** — per-surface mobile pattern → ADR candidate (`order-*` single-tree
  vs container-query dual-subtree at the 520px crossover). READY → likely a new ADR.
- **Item 43** — detail-view hero-tile reconciliation (lifecycle `--tile-*`
  gradient vs per-surface emphasis hero tiles: cupping lavender `#7A6E9E` /
  waiting-roast amber `#A88037`). Decide: reconcile or bless the divergence.
- **Item 39 residual** — add "Pour step" glossary term to CONTEXT-brewing.md
  (pour-structure shipped migration 074; the term waits for a grill per
  CONTEXT-grows-grilling-first).
- **Items 36 / 37 / 38** — strategy-zone-terminology anchor-or-drop /
  claude.ai project-memory currency lag / operator-guide cross-reference density.
- **Items 40 / 41** — process-registry arbiter-queue reminder + honey-subprocess
  missing description field / Anoxic-qualifier aggregation promotion at N≥3.
- **Item 35** — drop-rules UI persistence / roast-time HUD. NOTE: this is a Latent
  *feature*, not a doc/terminology item — **TRIAGE + RANK** it here (where does it
  sit vs Cluster A / predicted-vs-actual?), don't full-scope it in this grill.

Resync-adjacent (fold in):
- **Doc-size tripwire review** — check all root living docs vs the 120KB tripwire
  (PRODUCT.md ~140KB is the flagged compaction candidate; CLAUDE.md ~114KB).
- **Substrate fix: make "XO" a signature method** (Chris found it in brew cards;
  should be its own signature). Mirror the Sprint T1/BR-1 signature-registry
  pattern — `lib/process-registry.ts` `SignatureEntry` + `SIGNATURE_LOOKUP` +
  `docs/taxonomies/processes.md` + the six-actor hops (MCP Zod is already generic
  over the signature lookup). Triage whether it's grill-decided-here +
  executed-later or a tiny ride-along.

## Scope — OUT
- The **Cluster A scaffold** itself (cross-domain sim-pour-over workflow + MB-7
  reference brew + roasted-variant modeling) — its own grill-to-spec session, next.
- Predicted-vs-actual delta / coffee-brief scoping / surface trio / cultivar arc
  (later tiers — see PRODUCT.md § Roadmap capstone reprioritization).
- Data nits (#185 `best_batch_id` drift, `end_condition` backfill, green-helper
  dedup) — side quests.
- Any feature code or migration.

## Six-actor note
XO-as-signature touches the registry + MCP Zod + processes.md + CONTEXT — run the
cross-system trace if it's executed. The ADRs (item 42) + glossary terms (item 39)
are Actor-5 doc writes; item 43 is an Actor-6 token/render decision.

## End-of-session
- Confirm the grilling-queue is drained (or items explicitly re-deferred with a
  reason recorded in the queue).
- Update `docs/grilling-queue.md` to reflect drained vs deferred.
- Hand off to the **Cluster A scaffold grill-to-spec** session (write that kickoff
  brief at the end of this one).
