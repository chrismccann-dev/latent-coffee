# Doc-cap pruning prep - 2026-07-08 (two watchers + two 60KB single docs)

> Read-only pruning-prep report (Handoff 4). Purpose: turn the eventual operator-led Pattern-J prune sessions into short ratification sessions. **Nothing was edited** - every claim below is a candidate awaiting Chris's ratification. Method: re-measured via `npm run check:doc-sizes` (2026-07-08 run), per-file sizes + 90d/30d git churn per doc, then a section-level cut-test pass ([writing-great-skills](.claude/skills/writing-great-skills/SKILL.md) lens: no-op / sediment / sprawl / duplication / relevance + the Negation / Negative Space failure modes) against the Pattern-J six shapes ([protocol](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md)). Every duplication claim cites both locations; every sediment claim cites git evidence.

## Executive summary

| Surface | Today / cap | Est. recoverable | Lead move | When |
|---|---|---|---|---|
| [brewing-equipment-expert/](docs/skills/brewing-equipment-expert/) cluster | **147.0 / 150 KB** | ~22 KB lead move (~38 KB total identified) | consolidate `operational-reference.md`'s four duplicated blocks to pointers | **Now - this is the urgent one (98% of cap)** |
| [roasting-historian/](docs/skills/roasting-historian/) cluster | 208.1 / 250 KB | ~25 KB Phase 1 + ~22 KB Phase 2 | **PARTIAL defer**: active-lots stub-down hygiene now; CCIL re-scope after AN10 closes | Phase 1 now, Phase 2 post-AN10 |
| [brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) | 54.2 / 60 KB | ~5-6 KB actual (8.3-8.8 gross, case-008 2x discount) | consolidate + provenance-delete pass, no split | With the next brewing-side pass |
| [wbc-roasting-archivist/cluster/sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) | 48.6 / 60 KB | ~13.4 KB (firm - mostly mechanical block moves) | re-home the inventory snapshot to the DB (`list_green_inventory`) + small sibling | Low urgency, high-confidence cuts |

Cross-cutting findings:
- **Growth vectors identified.** brewing-equipment-expert grew +25.5 KB in ~3 weeks, all from the RP6 water arc (water.md / water-inventory.md / operational-reference.md) - the water docs are healthy and KEEP; the cap pressure is old migration sediment in operational-reference.md. roasting-historian's growth vector is the CCIL (+3-4 KB per lot close-out; ~4-5 close-outs of runway before its own 80 KB single-doc cap fires).
- **Premise correction (load-bearing).** The handoff brief implied the roasting-historian CCIL re-bloated after case 007. Wrong: case 007 pruned the **brewing**-historian CCIL. The roasting CCIL (`patterns/cross-coffee-insights.md`) was **never pruned** - it has grown monotonically 40.9 KB (birth, 2026-05-20) -> 57.2 (2026-06-05, #410) -> 60.2 (2026-06-15, #445) -> 64.0 KB (2026-06-25, #508), exhibiting exactly the pre-007 disease: single-lot detail accreting in the cross-anchor index because the roasting side never got the re-scope, the capsule graduation lifecycle, or the end-of-lot routing table.
- **The tripwire registry's live-size block is stale** (shows brewing-equipment-expert at 121.5 KB vs 147.0 actual). Run `npm run check:doc-sizes -- --write` at the prune session.

---

## 1. brewing-equipment-expert/ cluster - 147.0 / 150 KB

**Lead recommendation:** consolidate `operational-reference.md`'s four duplicated blocks (Filter System table -> filters.md pointer; Example Outputs -> archive; Valve Position Reference -> sworks.md pointer; Grinder + SWORKS/Switch cells -> pointers), ~22 KB at 3 inbound-anchor updates - drops the cluster to ~125 KB (17% headroom) at least risk, because every cut byte already has a newer, measured canonical owner inside the same cluster. The brewers.md ownership split (~11 KB, exact case-004 template) is the natural second move if more runway is wanted.

**Diagnosis:** the cluster's problem is one doc. `operational-reference.md` (42.1 KB) is the Wave-4-PR-4b bulk migration of BREWING.md prose (2026-05-21, commit 1c06922) that predates the cluster's own canonical per-item docs, so it re-states - in stale label-based form - content that sworks.md / filters.md / grinder-eg1.md / brewing-historian now own in measured, newer form. It is also accreting per-brew sediment (9 commits/90d). Roughly half the file is duplication.

### Cut candidates

| File § section | Class | Shape | Est. KB | Evidence |
|---|---|---|---|---|
| operational-reference.md § Filter System table (L64-90) | duplication + sediment | consolidate -> pointer | **~11.5** (12,464 B; keep ~1 KB: office-paper note + T-92/boiling pairing) | Duplicates per-paper flow/behavior/cup-impact that [filters.md](docs/skills/brewing-equipment-expert/cluster/filters.md) owns, in stale label form: table says CAFEC T-92 "Slow" / T-83 "Very Slow"; filters.md measured 80s / 68s ("CAFEC label = extraction intent, not flow", filters.md L102/128). "Espro Bloom" history line duplicates filters.md § Aliases L395-400. Untouched since migration except #374. No inbound anchors target the table (only whole-doc dispatch lines: start-brew.md L43, operational-guide.md L295). |
| operational-reference.md § Example Outputs (L139-174) | sediment + duplication | archive (or flag-delete) | **~5.1** (5,616 B) | BREWING.md-era format demos; canonical recipe format lives in [operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md) L103-130 incl. the SWORKS Valve clause. § Valve Note row duplicates sworks.md § Adjustment logic. Inbound: start-brew.md L43 names "Example Outputs" in its dispatch sentence - one-line update needed. |
| operational-reference.md § Valve Position Reference (L115-127) | duplication | consolidate -> pointer | **~2.5** (3,067 B; keep 3-line pointer + dead-zone warning) | Near-verbatim twin of [sworks.md](docs/skills/brewing-equipment-expert/cluster/sworks.md): 60/45/30 sec-per-100g (sworks L52/59/66), dials-1-4 dead zone (L33/43-47), bloom <=25s (L41), whole "Adjustment logic (valve-first)" paragraph (op-ref L126 = sworks L76-83). sworks.md self-declares "Authoritative authored content" (L5) and already back-points here (L135). Update operational-guide.md L295 + sworks.md L135 same-pass. |
| operational-reference.md § Brewer System SWORKS cell (L42) + Switch tail-cut blockquote (L62) | duplication | consolidate -> row pointer | **~2.5** | SWORKS cell (~1.9 KB) restates sworks.md L27-29; Khun Lao tail-cut blockquote (~1.1 KB) is held richer in brewing-historian `patterns/by-strategy/hybrid.md` L40-46, which already cross-references this row - back-pointer rewiring needed per case-007 inputs (11)/(12). |
| operational-reference.md § Grinder: Weber EG-1 (L107-114) | duplication | consolidate -> pointer | **~0.9** (1,156 B) | "Key structural finding" + "Critical implication" paragraphs match [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) § Structural findings L61-64 verbatim-in-substance. Inbound anchor: operational-guide.md L78 points here for the D50 plateau - re-point to grinder-eg1.md same-pass. |
| operational-reference.md - April 2:30 / Kalita 3:00-3:30 drain notes stated twice (§ Office table L16-17 AND § Brewer System L40-41) | no-op (2nd copy) | consolidate | **~0.6** | Same numbers twice in one doc; keep the Location Constraints copy (the operational read path). |
| brewers.md - 33 not-owned entries | relevance (live-selection surface carrying a promotion pool) | **split** (ownership axis) | **~11.0** (10,973 B measured) | Exact case-004 shape ("a live equipment doc only needs what the operator owns", heuristics 4-5). `lib/brewer-registry.ts` stays the whole 46-entry validator; archive at `docs/taxonomies/brewers-not-owned-archive.md` mirroring `filters-not-owned-archive.md`. All aliases target owned brewers (checked § Aliases L663-693) - zero brew-orphan risk. |
| SKILL.md § Implementation notes for Wave 1 sprint (L75-83) | sediment | delete (flag-only) | **~1.7** (1,711 B) | Wave 1 shipped 2026-05-26 (SKILL.md's own Status line); every instruction is a completed one-time migration step. Git-recoverable; no inbound references (grep clean). Also stale: "filter-flow-rates.md (planned)" - that ran as RP1-5 and folded into filters.md. |
| filters.md § Changelog pre-2026-06-20 entries | sediment (provenance class) | archive | **~2.0** (of 3,100 B) | Case-002 low-risk provenance class; the narrative already lives in [pruning case 004](docs/sprints/pruning-cases/004-filters-md.md) + doc-tripwires.md L132. Optional. |

### Considered and kept

- **filters.md § Aliases (4,147 B)** - looks like duplication of `lib/filter-registry.ts`, but the doc is the *authored source* and the .ts the mirror under the 2-step deliberate-edit discipline; cutting it inverts authorship direction. Same reasoning keeps brewers.md § Aliases.
- **filters.md § Research measurement appendix + RP5 texture subsection (3,437 B)** - this *is* the disclosure product of case 004; the texture-is-flow-mediated finding changes live paper selection.
- **op-ref § Decision rule when two brewers fit the cup goal** - accreted from a brew (Wush Wush R10) but it's the unique canonical home; operational-guide.md L105 pins its anchor by name.
- **op-ref § Location Constraints** - office envelope + water rows are the single source for the `/brew` home/office branch (operational-guide L103/107 anchor it); the roast-forward office-tap note was deliberately re-homed here in case 007b.
- **op-ref § Rotation Framework + § Filter Flow Gap + § Additional Tools** - unique, referenced (catalog.md L22; operational-guide L295); the half-notch compensation rule + B2 purchase trigger exist nowhere else.
- **op-ref § Brewer System cup-tendency column** - brewers.md holds tech specs only; this column is the recipe-construction view, genuinely complementary. Trim only the SWORKS/Switch mega-cells.
- **water.md (15.2 KB) + water-inventory.md (9.9 KB) - KEEP entirely, both HOT** (RP6, consumed by `/brew` Step 2). The knowledge-vs-stock split is deliberate and cross-pointed both ways (water.md L13 <-> water-inventory L86); only ~340 B of overlap, below cut threshold.
- **water.md § 6 recipe seed provisional flags** - reads as hedging prose but the coffee-dependence gate is the load-bearing guardrail against porting the Pink-Bourbon row; deliberate Negative-Space fill.
- **SKILL.md autonomy-ladder / patterns sections (1,438 B)** - boilerplate-shaped but structural per ADR-0013, shared across all 17 sub-skills; not this doc's call to cut.
- **sworks.md § Canonical recipe patterns table** - the only place dial *sequences* map to strategies; 007b re-homed the timing principles here on purpose.

### Count-drift fixes (free, same PR)

filters.md L14 "67 papers" -> 58 · resources/filter-registry.md "64 canonical (22 owned) + 34 aliases" -> 58/23/56 · brewers.md L6 "12 owned" -> 13 (stale since April Hybrid #343) · refresh the tripwire registry live-size block.

---

## 2. roasting-historian/ cluster - 208.1 / 250 KB

**Lead recommendation:** split the scope - execute the convention-locked active-lots graduation hygiene now (~-25 KB, zero AN10 interaction), and **defer the CCIL re-scope until AN10 closes** (the CCIL is AN10's named append target, and AN10's close gives the re-home its destination).

### AN10 defer question - answer: PARTIAL

**Proceed now (settled half):** 4 active-lots stub-downs + the missing `learnings/redplum-cas-2026.md` + stale-router/SKILL.md fixes. AN10-safe because AN10 (`RWA-NOVA-AN10-RB-2026`) has **no doc in this cluster at all** (grep: only two forward-references inside Bukure's learnings doc); its live state runs through the DB + the roasting-coordinator cluster. The close-out stub convention is already Chris-locked (Item 4 grill 2026-05-23; [mcp-architecture.md](docs/reference/mcp-architecture.md) § close-out convention + `active-lots/README.md`; lived exemplar `cgle-srume-natural-2026.md` at 750 B) - this is executing an existing decision, not an interpretive prune. Per case-007b, run a repo-wide anchor grep on each stubbed file before cutting.

**Defer until AN10 closes (accreting half):** the CCIL re-scope. Three reasons: (1) it is AN10's append target - Bukure's learnings doc names AN10 as the pending test for at least three CCIL promotions (widest-delta-wins, dev-time terroir-vs-cultivar, xbloom dark-tea third lot); re-homing those sections mid-lot moves the anchors AN10's close-out proposals will cite. (2) AN10's close gives the re-home its destination: a second closed Rwandan Red Bourbon makes the by-cultivar red-bourbon capsule real instead of speculative. (3) No cap forces it: the CCIL sits at 64/80 KB growing ~4 KB/close-out (>=3 close-outs of runway), and Phase 1 alone drops the cluster to ~183/250. **Phase 2 must also install the missing root-cause fix**: the roasting-side equivalent of case 007's End-of-Lot routing table (narrowest-correct-home), so close-outs stop defaulting every finding into the index.

### Append-target evidence (where post-June CCIL content landed)

`git diff 4297f51..HEAD` on the CCIL (+16.5 KB since 2026-06-05):
- **§ Working Hypotheses (Single-Lot, Low Confidence)** absorbed the bulk: two REDPLUM-CAS-2026 entries totaling **10.4 KB**, including one marked "resolved 2026-06-22". The section is now **22.8 KB = 36% of the doc** and is single-lot by definition - exactly what case 007's scoping rule pushes to capsules.
- **§ FC Floor** +1.6 KB and **§ Varietal Aromatic Fingerprints** +2.6 KB of single-cultivar single-lot Red Bourbon (Bukure) blocks.
- **§ Precedence table** +4 rows - genuinely cross-anchor, correctly homed.
- The capsule homes got **nothing**: `by-process/washed.md` has zero REDPLUM mentions despite REDPLUM being a washed lot whose headline finding is a washed-lot body-balance lever; **no `learnings/redplum-cas-2026.md` exists at all** (the only closed lot without one - commit a473523 shows its close-out proposals landed only in the CCIL); `by-cultivar/` has no red-bourbon capsule.

### Cut candidates

| File § section | Class | Shape | Est. KB | Evidence |
|---|---|---|---|---|
| `active-lots/rwa-nova-nat21-rb-2026.md` whole body -> 6-line stub | duplication (triple-homed: this + `learnings/rwa-nova-nat21-rb-2026.md` 10.9 KB + CCIL Red Bourbon blocks) | archive (locked stub convention) | **-12.9** | Header: "Status: Closed (2026-06-06)... See closed-lot learnings"; full V1/V2/SPG narrative still present below it. |
| `active-lots/cgle-gesha-clouds-2026.md` -> stub | duplication (learnings doc 7.3 KB exists, seeded PR #445) + sediment | archive | **-7.7** | Dual-status headers: "Status: Active - V4 designed" above a second "## Status: Closed (2026-06-14)". |
| `active-lots/cos-hig-bor-2026.md` -> stub | duplication + sediment | archive | **-4.3** | Closed 2026-05-23; ironically cited in mcp-architecture.md as a stub-convention "lived precedent" while carrying 5 KB of V1-V3 narrative. |
| `active-lots/redplum-cas-2026.md` -> stub, **after creating `learnings/redplum-cas-2026.md`** | sediment (status stale by two V-sets: "Active - V2 designed 2026-05-17"; lot resolved 2026-06-22, ref roast 212, 14 cuppings per CCIL + PR #508) | archive + re-home (fills the graduation gap) | **-4.8, +~5 new** | Close-out content currently homed only in CCIL working-hypotheses. |
| SKILL.md §§ Wave 2 PR 3 ship notes + Subsequent waves (L48-61) | sediment (ship history already in shipped.md + sub-skills-status.md) + stale counts ("7 per-lot files" - there are 12; "Gesha Clouds active" - closed) | archive/delete (case-002 low-risk provenance class) | **-3.0** | Git-recoverable, zero downstream consumers of the ship narrative. |
| CCIL § Working Hypotheses 2 resolved REDPLUM entries + Red Bourbon FC-floor + fingerprint blocks (**Phase 2, post-AN10**) | duplication/sprawl (single-lot in the cross-anchor index; Bukure blocks duplicate `learnings/rwa-nova-nat21-rb-2026.md` §§ 46-64) | re-home / re-scope (case-007 shape) + delete-resolved | **-20 to -25** | 22.8 KB single-lot section; 10.4 KB REDPLUM tail incl. "resolved 2026-06-22"; measured on line ranges. |
| `by-process/natural.md` corpus line + `by-cultivar/gesha.md` roster + `active-lots/README.md` status lines | sediment (stale: "Bukure (active)", "Sudan Rume Natural V5 (active)", "cluster file lands when lot closes") | delete (one-line fixes) | ~-0.2 | All three lots closed; gesha.md's promised file exists. |
| `patterns/open-questions.md` COS-HIG v1c-reproducibility + Gesha cupping-table-reversal entries | possible sediment | delete-on-resolve (the doc's own maintenance rule) | ~-0.8 | Both lots closed with resolutions (v2b/v3b superseded v1c; Gesha resolved to bean-temp end-condition). **Interpretive - flag-only, needs operator confirmation.** |

**Phase 1 (now) net: ~-25 KB -> cluster ~183 KB. Phase 2 (post-AN10) net: ~-22 KB -> cluster ~160 KB, CCIL ~40-44 KB.**

### Considered and kept

- **`patterns/roast-to-brew-translation.md` (13.3 KB)** - settled since 2026-06-05, unique cross-domain content, under every cap. Its § Total-Time-Outweighs-Peak hypothesis is REDPLUM-adjacent to the CCIL's new inlet-slope entry but not verbatim duplication (V1-era vs V4-resolution); reconcile at the Phase-2 re-scope.
- **9 settled `learnings/` docs (2.4-10.9 KB each)** - already the lean substrate-pointer style locked at Wave 2 PR 3; they are the *destinations* the re-home needs, not cuts.
- **`patterns/general.md` (1.1 KB)** - near-empty but deliberate architecture (the non-axis catch-all); deleting it recreates a Negative-Space gap the next general pattern would fill ad hoc.
- **`by-process/honey.md` (4.0 KB) + `one-shot-calibrations/README.md` (2.1 KB)** - forward investment for the queued Cruz Loma TM Honey one-shot; roster current ("(empty)").
- **CCIL §§ Confirmed Patterns / Precedence + Additive tables / FC Floor table / Delta Norms / Session Position / Rest Behavior** - genuinely cross-anchor, the doc's actual job; the new Gesha-Clouds Confirmed-Patterns entry correctly routers to its learnings capsule.
- **`active-lots/bra-fazendaum-wushwush-nat-2026.md` (15.3 KB)** - live lot mid-V3 (V3 pushed to Roest 2026-06-16); doing exactly its job.
- **The 3 recent `active-lots/README.md` convention paragraphs** - they *are* the enforcement text the stub-downs rely on.

---

## 3. brewing-assistant/cluster/operational-guide.md - 54.2 / 60 KB

**Lead recommendation:** a case-006-shaped consolidate + provenance-delete pass (no split needed) - collapse the internally-triplicated dark-roast override, pointer-ize Step 4's stale canonical-value enumerations (the 15-vs-16 signature-method drift is the live proof), and reduce the apex/whole-arc paragraphs to their existing CONTEXT-taste canon pointers - landing ~48-50 KB with the write-contract skeleton untouched.

Loading note: the `/brew` skill (`.claude/skills/brew/SKILL.md` L87-116) and `bundled-brewing-completion.md` (L84-91) load this doc **per-h2-section via `read_doc_section`**, never whole - per-section weight, not total, is the lived cost. Step 1 (21.9 KB) and Step 4 (13.7 KB) are the heavy sections.

**Growth-vector finding:** a case-009 growth-isolation split does NOT apply. Born at 237 lines (Wave 4 PR 4b, 2026-05-21), growth is diffuse rule-hardening (~1 KB/month baseline; the recent +5.5 KB/5 weeks was the RP6+apex ship cluster, not steady state): grill outputs (#235/#243 dark-roast block), feature ships (#286, #443/#450 apex, #541 RP6 water +5 lines), arbiter batches editing status clauses inside the Axis-1 table (#533, #522/#523). Per-brew corpus rows route out to brewing-historian by design. If a structural move is ever wanted, the natural seam is extracting Step 4 to a sibling (`resolved-brew-format.md`; sole consumer is bundled-brewing-completion.md's hardcoded anchor L85-86) - but consolidation alone clears the cap, so it's not the lead.

### Cut candidates

| § / lines | Class | Shape | Est. KB | Evidence |
|---|---|---|---|---|
| Dark-roast override + Item-29 carve-out (L41-49 + L59) | duplication (internal) + provenance sediment | consolidate | **2.5** | L59 (1,167 B) restates L43-47's forceful-confirmation discipline nearly whole (CM200 home-only / 15g-dose / visual alternative / "not blocking" each appear twice). "Item 20 / Group 5 grill, 2026-05-24, audio-ratified" stamped 3x, "Item 29" 2x - case-002 low-risk provenance class. |
| Step 4 canonical-value enumerations (L219, L227, L206, L213-220, L247) | duplication + **live staleness** | consolidate-to-pointer | **2.5-3** | L219 hard-codes "15 canonicals post Sprint T1/BR-1" + full inline list; canonical owner [processes.md](docs/taxonomies/processes.md) § "Signature methods (**16**)" has already drifted past it. L227 (793 B) carries filter alias/rename history owned by the filters registry. The section's own rule (L183) mandates `read_canonical(axis)` before populating - the runtime source of truth. Keep field skeleton + format rules inline (case-006: write-contracts stay). |
| Apex clarify-side default (L80, 917 B) | duplication x3 | consolidate-to-pointer | 0.6 | Near-verbatim triplicate of CONTEXT-taste.md L79 (canon, self-declared) and catalog.md L15 (§ brewing-domain-principles). |
| Whole-arc opening + restatement (L143, 919 B + L161, 335 B) | duplication x3 + internal restatement | consolidate | 0.7 | CONTEXT-taste.md L81 owns the protocol verbatim; catalog.md L15 restates it; L161's first sentence restates L143. Keep station list inline (Step 3's evaluation gate). |
| v8.4 Immersion-removal note (L91, 306 B) + Modifiers changelog tail (in L236, ~450 B) | sediment (version history 2026-05-06/05-28, stated twice) | delete | 0.6 | Same fact at L91 and L236; Thermal-Staging rename history also owned by bundled-brewing-completion.md L126-134 (the write path). Legacy-name acceptance is enforced code-side. Git-recoverable. |
| Strategy-table archive-status clauses (rows in L73-74) | duplication with brewing-historian + drift vector | consolidate-to-pointer | 0.4 | "Confirmed in by-strategy/extraction-push.md: Pepé Jijón + Helm El Burro" and "3 Sequential confirmed; 4 sub-forms empty" - corpus-status counts owned by brewing-historian `patterns/by-strategy/*.md`; they go stale here between arbiter passes. Keep the pointer, drop names/counts. |
| Preamble migration history (L5-7, 935 B) | sediment | delete | 0.5 | Wave-4-PR-4b provenance + log-brew.md deprecation genealogy; role statement needs 2 sentences. |
| Ground-Agtron lived case (in L53, ~500 B) | worked example, pointer-able | consolidate-to-pointer | 0.3 | CGLE Sudan Rume Round-13 narrative; mechanism already points at counterflow-observations.md § WB-to-Ground Delta. |
| CCIL-promotion trigger tail (in L39, ~350 B) | deferred-future TODO | re-home (flag-only) | 0.2 | "promote to a CCIL entry once N>=2" graduation gate belongs in the CCIL observing ledger, not the per-brew intake path. Live gate, so re-home not delete. |

**Gross ~8.3-8.8 KB; plan on 5-6 KB actual (case-008 input 15: estimates run ~2x when kept material is respected) -> lands ~48-50 KB.**

### Considered and kept

- **Axis-1 strategy table (L65-78, 6.4 KB)** - the Step 1d decision instrument; grind/temp/agitation/ratio ranges exist nowhere else (CONTEXT-brewing owns only the meta-concepts). Case-006: step skeletons stay inline.
- **Pivot-destination heuristics (L166-175, 3.0 KB)** - unique problem-shape -> strategy routing; CONTEXT-brewing's Strategy-pivot entry covers *when*, only this doc covers *where to*.
- **Iteration-width ladder Brew 1/2/3+ (L145-157, 4.5 KB)** - canonical operational home; CONTEXT-brewing explicitly defers operationalization here.
- **Step 4 field skeleton + Output Format table + pours/valve conventions** - write-contract; bundled-brewing-completion.md loads it by anchor as its STEP 1 shape source. Non-negotiable inline per case-006.
- **Water Recipe authoring block (L107-110, 1.5 KB)** - 4 days old (#541), pure routing/wiring; the one chart-derivation parenthetical (~0.3 KB) aids fallback when water.md § 6 has no row.
- **Measurement-availability asymmetry (L55-57)** - Chris-locked decision (Item 29) with no other operational home; only its provenance stamps are cut.
- **Archive lookup paths + net-new framing (L25-35)** - explicit-not-author-discretion lookups; the Negative-Space fill that makes Brew 1 regime selection deterministic.

---

## 4. wbc-roasting-archivist/cluster/sourcing/strategy.md - 48.6 / 60 KB

**Lead recommendation:** re-home + split the inventory snapshot (case-009 growth-vector isolation): live per-lot state -> `list_green_inventory`/DB (already authoritative by the doc's own admission), lane-lens gap analysis -> a small fast-refresh sibling, ~0.7 KB pointer + posture line stays; then take the four cheap cuts - 48.6 -> ~35 KB, with the refresh mandate leaving the slow framework doc entirely.

Loading note: this doc is a registered `docs://` MCP Resource (SYNC_V2.md L93) and `start-lot.md` L87 **full-reads it via `read_doc` at every V-set lot start** - every KB cut is per-session load saved, not just cap headroom.

### Cut candidates

| § | Class | Shape | Est. KB | Evidence |
|---|---|---|---|---|
| Inventory snapshot + Best next moves (L393-457, 8.8 KB) | duplication (vs DB) + refresh-burden growth vector | **re-home + split** (case-009) | **~8.0** | The section itself declares `list_green_inventory` "the live-data sources... read it for the current order" (L395-397, 401). DB check 2026-07-08: 38 in_inventory rows, per-lot rank + intake hypotheses all live in `green_beans` - the doc restates them. Refresh burden proven: full rewrite in its 6-week life (#475 "full turnover"); the "refresh on inventory change" mandate fires on every purchase/roast/close. §§ 0-11 framework is slow (§§ 1-6 essentially frozen since 2026-05-09); the snapshot is the only fast half. Keep ~0.7 KB pointer + one-line posture ("overfull - roast down, buy only apex standouts"); lane mapping + gap-analysis table (the only content the DB can't hold - no lane column) -> sibling `inventory-snapshot.md` carrying the refresh mandate alone. Recently-closed table (L426-436) is duplication both ways (each row links its archive/learnings home). No inbound `#anchor` links (repo grep clean); `portfolio-lanes.md` L19 names the section textually - repoint same-pass. |
| § 7 pursue/watch/learning/calibration roster (L293-300) | duplication (both locations) | delete-to-pointer | **~1.2** | § 7 itself says "the canonical roster lives in [producers.md § Sourcing priority]" (L283); producers.md L27-60 holds the identical 13-producer roster + all four buckets, fuller. The two rosters have already drifted slightly. Keep the bucket-meanings table (§ 7 is the declared substantive home per `priority-targets.md` L3); cut the roster to one pointer line. |
| History section (L21-26) | sediment | delete (case-002 provenance class) | **~1.8** | Pure changelog; all three entries restate what git log + shipped.md already hold. Zero inbound references. |
| "Palate vs WBC sweet spot" + stacked supersession notes (L69-97) | sediment + duplication | consolidate | **~1.5** | Sediment-plus-correction geology: the 2026-05-09 "VERY expressive / loud" framing survives verbatim with a 2026-06-14 blockquote (L94) declaring it "superseded in target by the apex" and a 2026-06-19 vocabulary note (L82). Rewrite the body in apex voice so the supersession note is unnecessary; keep the tier-reading table (L84-92, unique) + the three-uses-of-"Tier" de-collision note. |
| Stale inline inventory mentions in §§ 1-5 (6 sentences) | relevance (factually false) | delete | **~0.9** | L114 (Red Plum "currently has"), L151 + L188 (TM sample "in inventory"), L182 (Sudan Rume x2 - closed 2026-05-23 per the doc's own L434), L190 (Wush Wush DRD), L235 (Higuito "currently in inventory" - resolved 2026-05-23), L256. All rotated out per the snapshot's own 2026-06-18 note and absent from the DB read. Strongest argument *for* the re-home: after the cut, inventory state lives in exactly one place. Keep the timeless halves (e.g. L256's density -> FC-temp hypothesis) where separable. |

**Total ~13.4 KB -> lands ~35 KB (58% of cap); residual is all slow framework, so this doc should never re-trip - the fast half re-trips (if ever) on its own sibling.** (The case-008 2x discount applies mainly to glossaries; the snapshot removal is mechanical block-move, so this estimate is firm.)

### Considered and kept

- **§ 0 Sourcing philosophy (6.1 KB) - KEEP verbatim.** Canonical operational home of the sourcing lever-philosophy per CONTEXT-taste.md L51. The § 0 / CONTEXT-taste overlap is a *sanctioned* canon-vs-operational dual-home (CLAUDE.md names both), not failure-mode duplication - and § 0 carries operational material CONTEXT-taste doesn't (the four sourcing tells, the Project One Light variety-floor counter-case, the structural anti-target contrast).
- **§§ 1-6 WBC signal sections (~11.6 KB after stale-sentence cuts)** - the doc's core job; frozen-but-not-stale (a reference-corpus reading, not a live surface); what start-lot.md composes over.
- **§ 7 bucket-meanings table** - declared substantive home (priority-targets.md points here); three deliberate tiers with producers.md + wbc-materials.md, only the roster is a true dup.
- **§§ 8-9 (anti-target + filter cascade, 3.5 KB)** - fresh 2026-06-19 canon, single-source.
- **§ 10 lanes + Value-lane rationale** - canonical lane definitions (portfolio-lanes.md is a pointer *to* it).
- **§ 11 channels (5.0 KB)** - Chris-locked 2026-05-16 (WBC-7/8), unique, with the awareness-floor rationale.
- **"How sourcing thinking shifted" (1.1 KB)** - the doc's thesis statement; cheap and load-bearing.

---

## Out-of-scope observations (grilling-queue / follow-up candidates, not part of these prunes)

1. **`docs/roasting/archive.md` drift**: billed in CLAUDE.md as the closed-lot archive but missing all 5 lots closed since 2026-05-23 - `learnings/` has de facto superseded it. Worth a grilling-queue entry on which is canonical.
2. **Sibling placeholder re-growth** in wbc-roasting-archivist: `priority-targets.md` + `portfolio-lanes.md` were "PLACEHOLDER pointer" docs that have each re-grown substantive tables duplicating § 7 / § 10 + wbc-materials.md (a fourth home for the bucket table); `portfolio-lanes.md` L19 still says "(2026-05-09 snapshot)". Worth a same-pass trim to true pointers.
3. **Missing `learnings/redplum-cas-2026.md`** is a workflow gap, not just a prune input: the REDPLUM close-out (PR #508) routed its findings only to the CCIL - evidence the roasting side needs the case-007 End-of-Lot routing table (scheduled as Phase 2 above).
4. **Live count drift**: operational-guide.md's "15 signature methods" vs processes.md's 16; the brewing-equipment-expert count drifts listed in § 1. Cheap same-PR fixes at each prune.

## Suggested ratification order

1. **brewing-equipment-expert lead move** (op-ref consolidation, ~22 KB) - the only surface at 98% of cap; one more water-arc ship could trip it.
2. **roasting-historian Phase 1** (active-lots stub-downs + redplum learnings creation, ~25 KB) - convention already locked, zero interpretive weight, AN10-safe.
3. **sourcing/strategy.md re-home** (~13.4 KB, firm) - low urgency but high confidence; kills a recurring refresh burden.
4. **operational-guide.md consolidate pass** (~5-6 KB) - fold into the next brewing-side substrate PR.
5. **roasting-historian Phase 2** (CCIL re-scope + routing table) - **after AN10 closes**.
