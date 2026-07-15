# POD-1 routing — simulated pourover gate + Path C rewrite scoping

**Status:** SCOPING DRAFT (carried forward from `docs/sprints/pod-1-scoping-draft-2026-05-26.md`). **Vocabulary rename shipped 2026-05-24 (Item 7 grill)** — Path C-2 → Simulated Pourover Gate, with reframed trigger shape per Chris's lived end-of-V-set workflow. **Schema shape resolved + free-text write convention shipped (Cluster A, 2026-06-01)**: SPG cups record as `cuppings` rows with `eval_method = 'Simulated Pourover'` today (the column is unconstrained free-text). **The Path C consolidation question is RESOLVED (2026-07-15, lifecycle-gate reconciliation grill / ADR-0025): option (c) below won** — the peer-cup gate ("Path C-1") was demoted to a non-gating advisory (transfer value requires same green AND compatible roast philosophy, per Chris; never halts, defers, or touches `lot_status`), making the SPG the only Path C and the only winner-deferring gate; the SPG handoff writes the ADR-0025 composite (`winner` sentinel + `lot_status: waiting_for_brewing`). What remains GATED on the lived-practice trigger conditions below is only the **canonicalization** of the `eval_method` value (lookup / validation / `cupping_method` taxonomy) — formalization, not enablement.

**Why this lives here:** Per Wave 3 PR 3 scope decision (2026-05-26), POD-1's scope is *absorbed* into Cupping Specialist at the SKILL.md level but the *implementation* (full Path C consolidation + schema decisions) waits for cross-thread observation. This cluster doc holds the scoping context + trigger conditions so a future sprint can lift it without re-grokking the original draft.

## Today's Path C-1 + Simulated Pourover Gate substrate

`log-cupping.md` STAGE 4 currently encodes:

- **Path A** — leading slot is reference-quality, route to close-out (Chain 1)
- **Path B** — design V_(n+1), iterate (Roasting Assistant for next V-set)
- **Path C-1** — pre-V_(n+1) calibration when peer-roasted reference cup is missing
- **Simulated Pourover Gate** — end-of-V-set decision-support cup on the real pourover setup, used to choose the reference roast OR to disambiguate a provisional V_n leading slot (renamed from Path C-2 at Item 7 grill, 2026-05-24; subsumes both the original "missing cup-side discriminator" trigger AND the lived end-of-V-set decision-support workflow Chris has been running in his head outside the app)

Cupping Specialist's SKILL.md § Path routing now documents THREE active routes (A / B / C = Simulated Pourover Gate) + the peer-cup advisory — the Path C-1 row above is historical (demoted 2026-07-15 per ADR-0025). The SPG write convention (`eval_method = 'Simulated Pourover'`, free-text) shipped Cluster A; what remains gated on the lived-practice trigger conditions below is the `eval_method` **canonicalization** only.

## The POD-1 framing (kept dormant)

Chris's lived workflow has **three cup-reads** on a V-set lot, not the two today's substrate models:

| # | Cup-read | Today's substrate representation |
|---|---|---|
| 1 | **xBloom cupping** (Brian Quan recipe, Day 7, normalized across all slots) | `push_cupping` with `recipe_variant: "xbloom_gate"` — the sole decision gate per substrate |
| 2 | **Simulated pourover** (non-optimized pourover-shape recipe in actual brewing setup; preview of what the roast might taste like as an optimized brew) | **Not modeled.** Chris does this as he nears reference (~V3+); not a `cuppings` row, not a `brews` row |
| 3 | **Optimized brew** (full brewing-project dial-in on the reference roast, several iterations) | `push_brew` with `source: "self-roasted"` + `roast_id` FK at lot close-out |

The middle read (simulated pourover) is the diagnostic Chris uses to validate that a candidate reference roast will work as an optimized brew BEFORE committing it as THE reference. Lives entirely in claude.ai thread prose today.

## Trigger conditions for the Path C rewrite

The scoping draft explicitly lists four observation gates. **All four should be met before the rewrite ships.**

1. **2-3 more V-set lots progressing through Path A** — verify Chris's "I do simulated pourovers as I near reference" pattern reliably across multiple lots, not just one
2. **At least one one-shot close-out** — clarify whether the simulated-pourover concept applies to one-shots (likely not — one-shot has 1 cup read, no V-set iteration → no simulated-pourover need; but confirm with lived evidence)
3. **The Stefano Um / Bukure / Higuito lots in flight** — capture how Chris actually decides to do or skip a simulated pourover; is it always when nearing reference, or only on coffees that are cup-side ambiguous?
4. **C-2 disambiguation cases** — did claude.ai ever propose Path C-2 in a real session? If never observed in lived practice, that's strong evidence to deprecate Path C-2

When the gates are met, surface a POD-1 follow-up sprint with the three rewrite-direction options below.

## Lived-practice trigger fires

Append-only log of trigger events as they're observed in dog-food sessions. Each entry captures date + lot + which trigger condition fired + how it shifts the rewrite-direction interpretation.

- **2026-05-21 — CGLE Sudan Rume Natural V5 (batches 187/188/189)** — **Trigger #4 fired (Path C-2 proposed in real session).** First lived test of refreshed `log-cupping.md` (Sprint R Phase 4 Step 1, [PR #215](https://github.com/chrismccann-dev/latent-coffee/pull/215)) AND first lived exercise of POD-1 absorption into Cupping Specialist. V5A leading slot at xbloom_gate carried WB-to-ground delta of 15.7 vs prior reference roast 169's 3.1; combined with V4's documented xbloom-vs-real-pourover inversion on this lot, claude.ai correctly routed Path C-2 and prescribed side-by-side simulated pourover (187 vs 169) at confirmed April Glass recipe. **Inverts trigger #4's interpretation**: the framing said "if never observed, deprecate Path C-2" — now that Path C-2 has fired with sound reasoning, the framing is validated by lived practice. **Future rewrite direction**: the simulated-pourover-gate concept is the right rename target (preserves the structural intent), not a deprecation. Also advances trigger #1 (V5 is moving toward Path A pending the real-pourover discriminator) and surfaces two new substrate gaps logged separately:
  - **Delta-threshold heuristic missing from C-2 rule** — V5A's 15.7 delta was the *primary* evidence; prior-inversion was secondary corroboration. Worth adding "OR delta-on-leading-slot exceeds N points" as a 4th independent trigger (threshold pick deferred until 2-3 more data points).
  - **Inversion evidence requires session memory, not query** — Path C-2's "prior inversion" check relied on session context (V4 xbloom underrepresented 169) rather than a programmatic DB read. Future Tool sprint: scope `list_cuppings_by_lot` or extend `get_bean_pipeline` to group cuppings by `recipe_variant`.
- **2026-05-24 — Item 7 grill (Sprint R Phase 4 Step 4 Group 2)** — **Vocabulary rename shipped + trigger shape reframed via Chris audio note.** Two locks:
  - **Path C-2 → Simulated Pourover Gate.** Chris confirmed the name and said "I I even honestly forgot what this was" referring to the Path C-2 framing. Renamed in CONTEXT-roasting.md § Simulated pourover gate + cupping-specialist/SKILL.md § Path routing + log-cupping.md STAGE 4 + this doc's § Today's substrate. The historical "Path C-2" reference is preserved in sprint/archive docs (audit-trail integrity per the Item 11 slug-convention pattern).
  - **Trigger shape reframed from reactive-only → proactive + reactive.** The original Path C-2 framing was reactive-only ("V_n leading slot is provisional because cup-side variant inversion observed"); Chris's lived workflow is primarily *proactive* — he runs simulated pourovers at the end of V-set iteration (typically V3+) on the V_n winner + secondary contender + V_(n-1) winner as a control, brewed on the real pourover setup with a non-optimized recipe close to end-state. The purpose is to choose the reference roast, not to disambiguate inversions. The reactive shape (CGLE Sudan Rume V5's delta-anomaly trigger; Higuito V3's prior-inversion trigger) is now subsumed as a particular use case within the broader proactive workflow. Chris noted he's been running this routine in his head outside the app, which retroactively confirms trigger condition #1 (the multi-lot V-set Path A confirmation) — the simulated pourover has been firing reliably for many lots; V5 was just the first time it became visible in the dog-food loop.
  - **Schema preference locked at vocabulary level.** Chris explicitly: "this should fit cleanly in the cupping method... this simulated pour over cupping method that could / should insert nicely into whatever the existing cupping process is. This shouldn't be something that lives outside of it." Closes the deferred schema scoping question in favor of option 1 (the cuppings-row + `eval_method = 'Simulated Pourover'` shape) over option 2 (a `brews.is_simulated_pourover` flag) or option 3 (hybrid). The migration ships with the full POD-1 rewrite, not today.
  - **Cup-set convention captured.** Typical simulated-pourover cup-set: V_n winner + V_n secondary contender + V_(n-1) winner (as a control baseline). One simulated-pourover recipe across all three; each brewed for real with Chris's real water + brewer + filter setup, not on the xBloom.
  - **Trigger conditions #1 + #3 effectively advance** via lived-practice retroactive recognition; trigger #2 (one-shot close-out) confirmed N/A per Chris ("let's not overcomplicate this — focus on end part"); trigger #4 was the original V5 fire. The full Path C consolidation + schema migration sprint can fire now whenever scheduled.

## Rewrite direction options (PARTIALLY LOCKED — full consolidation pick during follow-up sprint)

Status post-Item-7 grill (2026-05-24): the "Simulated Pourover Gate" name has been adopted as the rename for Path C-2 (option (a) family at the path-identifier level). The remaining open question is whether C-1 (peer-cup calibration) folds into the same unified path or stays separate:

- **(a) Consolidate Path C-1 + Simulated Pourover Gate into a unified Path C** — single "calibration cup pending" concept; sub-shape resolved by which cup (peer-roasted vs simulated pourover) is needed
- **(b) Preserve C-1 as a distinct path; keep Simulated Pourover Gate as its own path** — the two trigger shapes are genuinely different (external calibration cup acquisition vs internal end-of-V-set decision-support); preserving the distinction in the routing surface keeps the calibration action explicit
- **(c) Deprecate Path C-1** — if peer-roasted calibration cups end up rare and lived practice converges on the simulated-pourover step as the primary reference-call discriminator, fold the C-1 lived case (Fazenda Um) into the simulated-pourover-gate framework

Pick at follow-up sprint based on additional N on C-1 fires (currently 1 lived case: Fazenda Um).

## Schema scoping (PREFERENCE LOCKED — migration deferred to full POD-1 rewrite sprint)

Per Item 7 grill (2026-05-24), Chris's preference is locked: simulated pourover lives in the `cuppings` table via a new `eval_method` canonical, not as a `brews` flag or hybrid. Verbatim: "this should fit cleanly in the cupping method... this should slot creamly into what I'm doing already."

Locked shape (migration ships with the full POD-1 rewrite, NOT today):

- **`cuppings.eval_method = 'Simulated Pourover'`** — new canonical added to the enum-via-substring; all standard cupping prose fields populate. Recipe metadata for the simulated pourover (which brewer / filter / dose / grinder / grind_setting / temperature was used) lives in `cuppings.additional_notes` as free-text or via an extension column TBD at migration time. The simulated-pourover IS a cupping in Chris's mental model — it shouldn't fragment across `cuppings` + `brews`.

Discarded at lock time:

- ~~`brews.is_simulated_pourover: boolean`~~ — fragments the cupping flow; the simulated pourover isn't the optimized brew.
- ~~Hybrid (cuppings row + brews row + FK)~~ — overhead with no operational benefit.

Current convention (Cluster A, 2026-06-01): push simulated-pourover cups as `cuppings` rows with **`eval_method: 'Simulated Pourover'`** directly + recipe metadata in `additional_notes`. The Cluster A dogfood empirically established that `cuppings.eval_method` is an unconstrained free-text column (no enum, no CHECK), so the target value stores TODAY — the prior interim convention (`eval_method: 'Pourover'` + `recipe_variant: 'real_pourover'` + free-text flag) was abandoned because it collided with the optimized-brew cup's `recipe_variant: 'real_pourover'` and obscured the SPG cup behind a generic label. The remaining POD-1 work is **formalization, not enablement**: canonicalizing `'Simulated Pourover'` (lookup / validation / the `cupping_method` taxonomy rethink) so it's a recognized canonical rather than a free-text string. No row migration is owed — SPG cups going forward carry the target value; there were no pre-Cluster-A SPG rows under the old convention to backfill.

## Cross-project handoff lifecycle states (DEFERRED scoping)

Chris's lived workflow steps 11-12: pick reference roast in roasting project → switch to brewing project for optimized brew dial-in via standard brewing flow → bring results back to roasting project for close-lot.

Today's substrate handles the data routing manually (`close-lot.md` STAGE 3 accepts paste-by-recipe or reference-by-brew_id). What's invisible is the **workflow phase itself**.

Candidate optimized-brew lifecycle states between `resolved_pending` and `resolved`:

- `optimized_brew_pending` — reference roast picked, but optimized brew not yet dialed
- `optimized_brew_in_progress` — brewing-project iteration active
- `optimized_brew_resolved` — push_brew complete, ready for close-lot

Whether these warrant first-class substrate (DB-stored vs derived) is open. Lifecycle helper at `lib/lifecycle-state.ts` would need extension.

## Punted items

- Whether the simulated-pourover recipe has a canonical default (analogous to xBloom Brian Quan as the cupping gate's canonical recipe) or whether it's a free-design discriminator. Chris's lived shape today is "free-design but close to end-state" — operator picks a recipe much closer in scope to the eventual optimized recipe, not a single canonical default.
- Whether the cross-project handoff should be modeled as an automatic state transition or stay manual
- Whether POD-1 folds into a broader rethink of `eval_method` taxonomy on `cuppings`
- Whether the "3 cup-reads" framing extends to one-shots — **confirmed N/A per Chris (2026-05-24 grill)**: one-shot has 1 cup read, the Day 7 xBloom; no V-set iteration → no simulated-pourover need ("let's not overcomplicate this — focus on end part" of V-set iteration).

## Cross-references

- [`docs/sprints/pod-1-scoping-draft-2026-05-26.md`](docs/sprints/pod-1-scoping-draft-2026-05-26.md) — the source DRAFT that this cluster doc carries forward
- [`docs/prompts/log-cupping.md`](docs/prompts/log-cupping.md) STAGE 4 — current Path C-1/C-2 substrate
- [`docs/prompts/close-lot.md`](docs/prompts/close-lot.md) STAGE 3 — current optimized-brew push
- [`docs/skills/cupping-specialist/SKILL.md`](docs/skills/cupping-specialist/SKILL.md) — Cupping Specialist canonical spec; § Path routing for the four ACTIVE paths
- [Architecture Wave 3 PR 3 retro](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/) — will land at PR 3 close-out
- 2026-05-26 audit cluster retro (`memory/project_audit_cluster_2026-05-26.md`) — source of the original draft
