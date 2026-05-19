# Sprint R — Audit prep: brewing workflow baseline (as of 2026-05-25)

**Purpose:** Hand-off artifact for the upcoming audit-execution sprint. Chris reads this and immediately sees either "yes that's my brewing flow" or "actually I've been doing X that the docs don't capture." Surfaces drift between lived brewing practice and the substrate before the architecture brainstorm cluster (#5+#6+#7) starts.

**Source:** Pulled literally from BREWING.md + the 4 brewing-side prompts (start-brew.md / log-brew.md / bundled-brewing-completion.md / propose-doc-changes-from-brew.md) + CLAUDE.md § Brews + CONTEXT.md vocabulary. No editorializing.

---

## Phase 1: Intake (new coffee enters)

**Trigger:** Chris has a new coffee to brew. Two paths:
- **Purchased bean:** new bag arrives, claude.ai brewing session opens
- **Self-roasted reference cup:** lot Resolved (per roasting Phase 5), now dialing in the optimized pourover brew

**Inputs Chris provides (start-brew.md):**
- Coffee URL (roaster's product page if available)
- Dose (fixed at 15g — currently invariant)
- Brewing location (Home or Office — determines equipment + water availability)
- Optional: reference experience ("brewed something similar last week")
- Optional: roaster brew guide URL

**claude.ai work:**
- `read_doc(uri="docs://brewing.md")` — pull master reference (5-strategy framework + modifiers + equipment + Cross-Coffee Insight Layer)
- For purchased: `list_recent_brews({roaster, cultivar, terroir, process})` — pull similar prior brews for pattern matching
- For self-roasted: `get_bean_pipeline({green_bean_id})` — pull lot's `roast_learnings` for tolerance + window
- Verify all canonical entities: roaster / producer / cultivar / terroir / process / brewer / filter / grinder
- **Step 1d:** Pause for explicit strategy + modifier confirmation before producing the recipe. This happens AFTER running the Coffee Brief but BEFORE deciding equipment or parameters.

**App state after:** No app write yet at intake. Brewing session iterates locally in claude.ai.

**Key vocabulary:** Coffee Brief (per-coffee intake summary in claude.ai) · Strategy + Modifier confirmation (Step 1d) · Location constraint (Home/Office equipment + water availability) · Canonical lookup pause (verify before recipe)

---

## Phase 2: Brewing-session iteration (V1 → Vn brew variants)

**Trigger:** Chris executes the recipe physically, tastes, decides whether to iterate.

**Inputs Chris provides:** Sensory response per brew variant, parameter changes per iteration, location-driven equipment swaps, reference comparison ("Wölfl WBrC 2024 used Extraction Push with aroma_capture flare")

**claude.ai work (`log-brew.md`):**
- Track brew variants locally (V1 / V2 / Vn) in claude.ai conversation
- Pull from `read_canonical()` and BREWING.md as needed mid-iteration
- For cross-pollination prompts: pull from BREWING.md § WBC Reference (102-recipe corpus, 2023-2025 finalists)

**No MCP writes during iteration.** The brewing workflow is **archive-driven** (CLAUDE.md L1): Chris iterates in claude.ai, the app gets ONLY the final brew. No intermediate versions flow to the database. This is the deliberate asymmetry vs roasting (which streams every roast + cupping into the app).

**App state after:** Still no write. Iteration completes when Chris is satisfied with the optimized brew.

**Key vocabulary:** Brew variant (V1 / V2 / Vn — claude.ai-local, not persisted) · Iteration loop (claude.ai-only) · Archive-driven (vs iterative) · Optimized brew (the final variant that gets pushed)

---

## Phase 3: Optimized brew capture (`push_brew`)

**Trigger:** Brewing session converges on optimized brew. Ready to archive.

**Inputs Chris provides (the full `push_brew` payload):**
- Coffee identity: coffee_name, roaster, producer, terroir, cultivar, process (composable: base_process + subprocess + 4 modifier arrays + fermentation_qualifiers + decaf_modifier + signature_method), roast_level
- Equipment: brewer, filter, grinder, grind_setting (canonical-strict for grinder + setting)
- Recipe: dose_g, water_g, temp_c, total_time, ratio, pour_structure (free-text), bloom_time / bloom_g (optional)
- Strategy: extraction_strategy (1 of 5 canonical), modifiers jsonb array (4 canonical types: output_selection / inverted_temperature_staging / aroma_capture / immersion), extraction_confirmed (optional, only if planned ≠ tasted)
- Sensory: flavors (jsonb, 3-axis composable), structure_tags (text[]), aroma / attack / mid_palate / body / finish / peak_expression / temperature_evolution prose, what_i_learned
- Provenance: source ("purchased" | "self-roasted"), green_bean_id (if self-roasted), roast_id (if self-roasted)
- Override flags as needed: roaster_override / producer_override / brewer_override / filter_override / grinder_override / signature_method_override (Sprint T1 / BR-1 added the last one)

**claude.ai work (`bundled-brewing-completion.md` STAGE 1):**
- All fields treated as final; no per-field confirmation
- Canonical validation on 11 axes (12 if counting fermentation_qualifiers separately per Sprint T3 / CR-5)
- Net-new entries via `*_override:true` flag — simultaneously queues for canonical promotion via `taxonomy_overrides_queue`
- Cultivars / terroirs / roast_level are STRICT canonical — no override path; net-new requires registry edit or `propose_canonical_addition` + arbiter session
- Validation errors aggregate in single response

**MCP writes:**
- `push_brew(...)` → returns `brew_id` + `queued_for_taxonomy_review[]` (which entries landed in the promotion queue)

**App state after:** Brew row exists. Appears on `/brews` index card. Detail page at `/brews/[id]` renders all 7 sections.

**Key vocabulary:** `brew_id` (PK) · `source` ("purchased" | "self-roasted") · `extraction_strategy` (5 canonical: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push) · `modifiers` (jsonb array, 4 canonical types) · `flavors` (jsonb, 3-axis composable: base + modifiers) · `structure_tags` (text[]) · `*_override:true` (canonical bypass with simultaneous queue) · `queued_for_taxonomy_review[]` (response array)

---

## Phase 4: Doc-proposal flow (`propose_doc_changes`)

**Trigger:** Brew session surfaced a lesson worth propagating to a living doc (BREWING.md / a roaster card / a taxonomy file).

**Critical discipline:** BEFORE drafting any citation, fetch the live document so `current_text` is byte-for-byte verbatim from deployed state (project-uploaded copies may have drifted).

**claude.ai work (`propose-doc-changes-from-brew.md`):**
- `read_doc_section(uri="docs://brewing.md", anchor="<Section Name>")` — anchor is header text WITHOUT leading `#`, case-sensitive exact match against `## ` / `### ` headers
- For roaster card edits: `read_doc_section(uri="docs://brewing/roasters.md", anchor="<Canonical Roaster Name>")`
- For taxonomy edits: `read_doc_section(uri="docs://taxonomies/<axis>.md", anchor="<Section>")`
- For `replace` operations: copy existing text VERBATIM into `current_text` — enables arbiter drift detection (byte-for-byte match; NO ASCII→Unicode normalization)
- For `append` / `prepend`: omit `current_text` unless positional hint helpful

**Source metadata required:** `source = {kind: "brew", id: "<brew_id from phase 3>"}`

**Auto-supersede behavior (existing, pre-Sprint 3.3):** new proposal that overlaps an existing pending proposal's (target_doc, section_anchor) on `replace × replace` auto-marks the older as superseded. Append-append does NOT auto-supersede (appends accumulate by design).

**MCP writes:**
- `propose_doc_changes(target_doc, source, citations[])` → returns `{proposal_id, status: "pending", superseded_ids[], summary, target_doc, citation_count, preflight[]}`

**App state after:** Proposal queued. Arbitrated separately by Chris-in-Claude-Code via `process pending arbitration` workflow per ARBITER.md.

**Most likely target sections:** BREWING.md § By Process / § By Variety / § Cross-Coffee Insight Layer (per-strategy archive) / § Cooling Behavior / § Open Questions · roaster cards · taxonomy files

**Key vocabulary:** `propose_doc_changes` Tool · `current_text` (byte-for-byte verbatim) · `replace × replace` auto-supersede · `append × append` accumulate · `source.kind = "brew"` · arbiter (separate Chris-in-Claude-Code session) · `superseded_ids[]`

---

## Phase 5: Cross-coffee compounding (Cross-Coffee Insight Layer + per-roaster + per-terroir pages)

**Trigger:** Pattern emerges across multiple brews of similar coffees. Either Chris notices and proposes, or the synthesis pipeline surfaces it automatically.

**Substrate that drives compounding:**
- **BREWING.md § Cross-Coffee Insight Layer** — per-strategy archive entries (e.g. "Coffees That Confirmed Clarity-First") + Open Questions. Patched via `propose_doc_changes` during brew sessions.
- **`/roasters/[id]` synthesis** — directed prompt pulls all brews where `roaster = X`. Reads both `brews` AND `roast_learnings` per Sprint 13 / SYN-6 cross-source corpus.
- **`/terroirs/[id]` synthesis** — same shape, joined through `terroir_id` FK.
- **`/cultivars/[id]` synthesis** — same shape, joined through `cultivar_id` FK.
- **`/processes/<aggregation>/synthesize`** — 5-adapter dispatch per Sub Pages 4 (base / honey_subprocess / modifier_combo / modifier_index / signature)
- **Synthesis pipeline (3 calls)** per Sprint 13 / ADR-0010: raw → humanizer → short-form digest (mobile capsule)
- **4-tier corpus classifier** per Sprint T4: early / emerging / established / mature
- **Resynthesize trigger** (SYN-7): every cache surface carries `synthesis_input_max_updated_at`; SynthesisCard regenerates on delta

**No explicit MCP write at this phase.** Compounding happens implicitly via:
1. Chris pushes a new brew → `push_brew` triggers synthesis-cache invalidation
2. Chris visits an aggregation page → SynthesisCard checks `synthesis_brew_count` + `synthesis_input_max_updated_at` deltas; regenerates if stale
3. Chris notices a pattern → uses `propose_doc_changes` to author BREWING.md § Cross-Coffee Insight Layer entry

**Key vocabulary:** Cross-Coffee Insight Layer (BREWING.md section, brewing-side counterpart to ROASTING.md's) · Confirmed Patterns / Working Hypotheses (post Sprint 9 / SYN-8 cross-side rename) · synthesis cache · 4-tier corpus classifier · short-form capsule · resynthesize trigger · cross-source corpus (brews + roast_learnings) · arbiter (for substrate-to-substrate, propose_doc_changes pipeline)

---

## Substrate dependencies (full read/write surface)

**BREWING.md sections referenced:** 5-strategy framework (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push) + Hybrid (6th strategy v8.4) · Two-Axis Framework · Equipment Reference · § Cross-Coffee Insight Layer · § Cooling Behavior · § Open Questions · § WBC Reference (5-axis foundational + 8 strategy families + 102-recipe corpus 2023-2025)

**CONTEXT.md vocabulary referenced:** Extraction strategy · Extraction modifier · Signature method · Fermentation qualifier (Anoxic) · Strategy + modifier confirmation · Coffee Brief · Brew variant · Optimized brew · Archive-driven · Cross-source · Short-form capsule · Resynthesize trigger · Confirmed Patterns / Working Hypotheses

**MCP Tools used in brewing flow:** `read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`, `list_canonicals`, `list_recent_brews`, `get_brew`, `get_bean_pipeline` (for self-roasted) · `push_brew` · `patch_brew` (for post-archive corrections) · `propose_doc_changes` · `propose_canonical_addition` (for net-new canonical entries)

---

## Hand-off points (where the workflow yields back to a human)

- **Intake → Iteration:** Chris's tasting call (does this match the expected profile?)
- **Iteration → Optimized brew:** Chris's convergence call (this variant is the one to archive)
- **Optimized brew → push_brew:** mechanical (claude.ai → MCP)
- **push_brew → propose_doc_changes:** Chris's lesson-extraction call (was there a pattern worth propagating?)
- **propose_doc_changes → arbiter:** asynchronous (Chris-in-Claude-Code separate session)
- **Synthesis regeneration:** automatic on cache-delta detection (no human in loop)

---

## Asymmetry with the roasting workflow (Chris-stated principle)

| Dimension | Brewing | Roasting |
|---|---|---|
| Iteration locus | claude.ai-local (no DB writes mid-iteration) | DB-streamed (Roest API + push_roast + push_cupping at each step) |
| App write timing | Single push_brew at the END | push_roast per batch + push_cupping per evaluation + push_roast_learnings at close-out |
| Lesson capture | propose_doc_changes per brew session | roast_learnings row per lot (cultivar_takeaway / terroir_takeaway / general_takeaway / starting_hypothesis) |
| State machine | Linear (brew → archive) | 4-state lifecycle (in_inventory → waiting_for_next_roast ⇄ waiting_for_next_cupping → resolved) |
| Cross-source synthesis | Reads `brews` only | Reads `brews` AND `roast_learnings` (cultivar / terroir / roaster adapters per Sprint 13 SYN-6) |
| Input surface | claude.ai via MCP (purchased: still has `/add` fallback; self-roasted: post-Sub Pages 6.6 brew is MCP-only via close-lot.md / one-shot-closeout.md STAGE 4) | claude.ai via MCP ONLY (Sub Pages 6.6 deprecated all roasting-side `/add` flows) |

**The asymmetry is load-bearing today** because the workflows DO differ in shape (one-shot brew session vs. multi-cycle roast iteration). But it's also where the architecture brainstorm cluster (#5 cross-brewing-roasting joined learning) may push: should the workflows converge, or does the asymmetry stay?

**Open question for the brainstorm cluster:** does brewing want to become iterative too (with intermediate brew variants persisted), or is archive-driven actually correct for brewing because the iteration is fast (15 min per variant) vs roasting (7 days rest per cupping)?

---

## Notable substrate gaps Chris may notice

These are points where the substrate ASSUMES Chris does something but the workflow may have drifted:

1. **propose_doc_changes per brew:** is Chris actually generating substrate-to-substrate proposals on every brew session? Or only occasionally? If sparse, BREWING.md § Cross-Coffee Insight Layer falls behind.
2. **Fermentation qualifiers (Sprint T3 / CR-5):** `Anoxic` canonical added forward. Is Chris setting it on new Anaerobic brews?
3. **Signature method override (Sprint T1 / BR-1):** 15 canonicals + override flag. Is Chris encountering net-new signatures in the wild that need promotion?
4. **Step 1d strategy + modifier confirmation pause:** does this pause actually fire in lived sessions, or does claude.ai sometimes skip ahead?
5. **Location constraint (Home/Office):** is this captured reliably? Equipment swaps mid-iteration?
6. **Cross-pollination pushing** (PRODUCT.md Future Directions): Chris recently used claude.ai to design a Wölfl-pattern brew using WBC corpus. Is this happening regularly enough that it earns a first-class workflow surface?

---

## Output format for the audit-execution sprint

Same shape as roasting baseline. For each phase, flag:
- ✅ matches lived practice
- ⚠️ partially matches (specify what diverges)
- ❌ doesn't match (specify what lived practice is)

Bundle into `memory/project_audit_cluster_2026-05-XX.md` alongside roasting findings.
