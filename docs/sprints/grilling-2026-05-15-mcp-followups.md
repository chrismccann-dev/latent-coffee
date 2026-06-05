# Grilling 2026-05-15 — MCP / Sync Architecture cluster follow-ups

## Session summary

Third `/grill-with-docs` session, audit-grilling the MCP / Sync Architecture cluster — the largest single cluster in the series at 10 grilling rounds. Outputs:

- [CONTEXT.md](CONTEXT.md) — **27 new glossary entries** under a "MCP / Sync Architecture" sub-section (peer to "Roasting", "Brewing"). Plus **~15 new relationships** capturing role separation + auth split + trust tiers + arbiter pipeline + drift/bloat prevention + cross-system consistency. **7 new flagged ambiguities** for future review. CONTEXT.md is now ~81 entries total (31 roasting + 23 brewing + 27 MCP).

The new entries split across two thematic groups:

**WHY layer (6 entries)** — championship-mode → system self-improvement loop → role separation → Latent MCP server → MCP-only input principle → cross-system consistency principle.

**HOW layer (21 entries)** — Tool / Resource / dual-surface pattern / asymmetric write trust / drift / category bloat / state bloat / arbiter / arbiter procedure / process pending arbitration / propose_doc_changes / doc_proposals queue / taxonomy_overrides_queue / propose_canonical_addition / Override flag (+ canonical-strictness spectrum) / find-or-create / canonical validation / NET-NEW / bearer token auth / OAuth 2.1 + PKCE auth / Roest API integration.

## Standing decision: MCP cluster does not block dogfood

None of the follow-ups below are correctness blockers for the existing claude.ai → Latent MCP workflows. All are forward-looking architectural extensions or naming/documentation hygiene. **Routine roasting + brewing workflows proceed as planned**; schedule follow-ups as sprint capacity allows.

## 8 follow-up actions

### Sprint candidates (bundle 1+2 together; 3-5 independent)

**1. Signature method as override-eligible axis on `taxonomy_overrides_queue`** [SCHEMA + TOOL SURFACE]
- Why: Chris-locked decision during round 8 grilling. Today the queue covers 7 axes (producer / roaster / brewer / filter / grinder / terroir / cultivar). Signature method is structurally analogous to producer/roaster (text-only, override-eligible) and has high net-new probability — Chris's working canonical list has 14 signatures vs the registry's 3, and new proprietary processes emerge from producers regularly. Pairs naturally with the brewing-side follow-up #1 (signature method registry sync).
- Surface: migration to widen the queue's axis enum + `lib/mcp/push-brew.ts` + `lib/mcp/push-green-bean.ts` override-flag wiring for `signature_method_override` + ARBITER.md § Taxonomy queue arbitration table (add row) + `docs/features/taxonomy-overrides-queue.md` design doc
- Effort: small-medium. Schema + Tool wiring is mechanical; arbiter doc edit is small.

**2. Signature method registry sync — fold into Sprint A above** [REGISTRY SYNC]
- Why: Already logged in [grilling-2026-05-15-brewing-followups.md](docs/sprints/grilling-2026-05-15-brewing-followups.md) item #1 (highest brewing priority). MCP follow-up #1 is the architectural complement — register the queue path; brewing follow-up is the canonical-list fill. Both touch `lib/process-registry.ts` + `docs/taxonomies/processes.md` and should bundle.

**3. Per-axis canonical-strictness audit against the 4-tier framing** [AUDIT + DOC]
- Why: Chris's 4-tier framing (strict-static / self-owned / closed-objective / open-loose) from round 8 grilling gives a clean per-axis policy taxonomy, but today's queue implementation maps unevenly: strict-static cultivar/terroir + override-eligible self-owned brewer/filter/grinder + override-eligible loose-producer-roaster are all in the queue; flavor + roast-level + process-modifier axes aren't. Either the 4-tier framing should drive uniform queue coverage, or per-tier behaviors should be deliberately distinct and documented.
- Surface: audit doc (not code) flagging per-axis (a) current strictness, (b) tier classification, (c) gap if any. Possibly feeds into a future ADR if non-obvious per-tier behavior is locked.
- Effort: small. Output is a written audit / proposal, not a migration.

**4. xBloom API existence check** [INVESTIGATION]
- Why: Chris flagged in round 10 grilling that he doesn't know whether the xBloom machine exposes an API. Low priority because xBloom runs one fixed reference-cup recipe — even if an API exists, integration value is low. But worth a 30-minute investigation for completeness.
- Surface: web search + product docs check. If an API exists, scope a quick read-surface integration; if not, log the negative result + close.
- Effort: 30 min investigation; surface decision afterward.

**5. Aggregation scope per axis — defer to taxonomy grilling session** [GRILLING]
- Why: The right canonical granularity per axis (terroir-at-macro / cultivar-at-lineage / process-at-base+modifier / roaster-at-family) is a real architectural concept that surfaces across multiple cluster boundaries. Chris articulated the trade-off for terroir during round 5 grilling but the same trade-off applies per-axis. Bundling these decisions in a single taxonomy-grilling session keeps them coherent rather than scattered.
- Trigger: next grilling session (canonical registries, per Chris's session 2 plan)

### Open questions for future grilling sessions

**6. The 5 SYNC_V2 locked decisions as a single umbrella entry**
- Chris: "I don't have strong opinion." Today each decision is absorbed into a separate glossary entry (Latent MCP server / bearer + OAuth auth / asymmetric write trust / propose_doc_changes / etc.). If a future grilling session wants a consolidated five-decision view they can either read SYNC_V2.md directly or add an umbrella entry.

**7. Real-time push from app → claude.ai — explicitly out-of-scope confirmed**
- Reaffirmed Chris (2026-05-15): no real-time push planned, ever. Drop rules on Roest profiles (`drop_rule_if_fast` + `drop_rule_if_slow`) carry mid-roast decision logic at the machine layer, so claude.ai doesn't need real-time data pulling. Captured as a CONTEXT.md relationship + flagged ambiguity; no further work needed unless the project scope changes.

**8. Next grilling session — canonical registries cluster** [/grill-with-docs]
- Trigger: after MCP cluster PR lands
- Likely scope: all 10 taxonomy axes (brewers / filters / flavors / grinders / processes / producers / regions / roast-levels / roasters / varieties) — the canonical / alias / override / NET-NEW / drift / find-or-create / auto_created provenance + the per-axis aggregation scope question. Expected scale: ~15-25 more terms.
- Follow-up cluster: WBC docs (`docs/brewing/wbc-recipes.md` + `docs/brewing/wbc-reference.md` + `docs/roasting/wbc-roasting.md` + `docs/roasting/wbc-sourcing.md`) — Chris flagged these as a separate grilling target after taxonomies. Probably its own session; keep taxonomy session focused.

## Suggested sequencing

```
[ Sprint A ] Signature method registry sync + queue addition (#1 + #2)
              [coupled — both touch processes canonical content; bundle in one PR]

[ Sprint B ] Per-axis canonical-strictness audit (#3)
              [reflective; output is a doc / proposal, not code]

[ Sprint C ] xBloom API investigation (#4)
              [30-min lookup; close-out]

[ Future grilling session 4 ] Canonical registries cluster (#8) — covers #5

[ Future grilling session 5 ] WBC reference docs cluster

[ Mega cleanup grilling session ] Bundle 7 open roasting + 9 open brewing + MCP follow-ups
              [Chris-flagged 2026-05-15; trigger after sessions 4 + 5 land]
```

Sprint A is the most time-sensitive (the brewing-side workflow is bumping into the signature-method gap on every proprietary-process coffee). Sprints B+C are low-urgency. Future grilling sessions land per cadence.

## Combined with prior-session followups

Prior session follow-up totals after this session lands:
- Roasting (2026-05-14): **7 open items** (#8 was "do brewing grilling" — completed)
- Brewing (2026-05-15): **9 open items** (#1 is highest priority; pairs with MCP #1)
- MCP (this session): **8 new items** above

**Combined backlog: 24 items** across three clusters. Per Chris's standing rule: bundle by sprint affinity, not by cluster origin. Sprint A (signature method) already cross-cuts MCP + brewing.

## Audio dictation note

Audio dictation mode held as default cadence — 10 rounds produced ~27 entries (2.7:1 ratio), in line with brewing (~1.9:1) and richer than roasting (~2.6:1). The discipline of extracting every implicit term per turn (rather than just the literal answer) continues to pay off — round 5's drift/bloat/state-bloat triplet and round 8's canonical-strictness spectrum both came from audio context that wasn't in the direct answer.

## Open questions for the next grilling session

Carried forward to the canonical registries cluster (session 4):
- Per-axis aggregation scope — terroir-at-macro / cultivar-at-lineage / process-at-base+modifier / roaster-at-family / brewer-at-canonical-model / etc.
- How the rich-registry markdown ↔ TS-registry mirror pattern works architecturally + what discipline governs adding a net-new canonical via the 2-step deliberate edit
- The flavor taxonomy's 3-axis composable shape (`BASE_FLAVORS` + `FLAVOR_MODIFIERS` + `STRUCTURE_TAGS`) as a possible model for other axes
- Process taxonomy's multi-axis decomposition (`base_process` + `subprocess` + 4 modifier-array axes + `decaf_modifier` + `signature_method`) as the most complex example
- Override-eligible vs strict-axis per-tier policy (carried from MCP follow-up #3)

Carried to WBC docs grilling (session 5):
- Where wbc-reference.md sits vs BREWING.md vs CONTEXT.md (reference layer vs master reference vs glossary)
- The 102-recipe WBC corpus as a structured artifact — is the per-recipe schema worth canonicalizing?
- WBC sourcing tier framework (Tier 1 / 2 / 3 priority targets) — is this implicit canonical taxonomy that should surface?
