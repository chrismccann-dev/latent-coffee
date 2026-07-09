# Whole-Arc Tasting-Capture Brainstorm — 2026-07-08

*Grilling/brainstorm session record + scoping doc. Every decision below is Chris-approved in-session (2026-07-08). This closes the roadmap Brainstorms entry "Whole-arc / layered-evolving tasting-capture on `brews`" and the [issues.md](docs/product/issues.md) data-model question of the same name. The build is now spec'd and promoted — this doc is the kickoff substrate for the build sprint.*

**Grounding inputs:** [wbc-mastery-brainstorm-2026-07-08.md](docs/features/wbc-mastery-brainstorm-2026-07-08.md) (§ 3 the instrument, § 5 rituals, § 10 open questions — the settled inputs this session did NOT relitigate) · [brewing-corpus-digest-2026-07.md](docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md) § 4 + § 7 (the evidence base: 100 prose `temperature_evolution` fields vs 17 structured `cooling_curve_target`s; layered-evolving unmeasurable; zero queryable quality scores on 102 brews) · [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md) (the four-station whole-arc protocol) · [docs/architecture/data-model.md](docs/architecture/data-model.md) §§ brews + cuppings · the 2026 WBrC rules summary + scoresheets.

**Settled inputs carried in (not reopened):** the WBrC sheet is the standing self-scoring instrument on everything brewed and roasted; a Latent-native layered-evolving axis rides alongside (the sheet lacks an arc axis); score data is informational, not steering (the apex is a hard commitment); descriptor-accuracy practice starts now with the "expected" written at brief time.

---

## Decision 1 — The archive-driven principle holds; scores land only on rows that already reach the app

Only the **optimized brew's** score sheet reaches the DB — iteration scores stay in-thread exactly like iteration recipes already do; if an iteration's score taught something, it flows into prose the way iteration learnings already do. **Mock-service and compulsory-drill scores live outside the DB entirely** (paper / in-thread) — "rehearsal is practice equipment, not substrate" (WBC brainstorm § 7). A doc-layer practice ledger was considered and rejected (scores are informational; no query needs practice scores). Rejected: a rehearsal-journal `tasting_scores` free-standing table.

**The forcing function (Chris addition, part of this decision):** the `/brew` close-out gains a **score-completeness gate** — when the OPTIMIZED brew packet is assembled, the skill verifies the full sheet is present and **refuses to call `push_brew` until it is**. Rides the existing choke point (`bundled-brewing-completion.md` assembles the packet) rather than adding a ritual.

## Decision 2 — Schema shape on `brews`: hybrid — discrete score columns + one `tasting_arc` jsonb

- **Nine `smallint` score columns, `CHECK` 0-9 (integers, no half points — matches the 2026 WBrC judging convention):** `score_aroma` · `score_flavor` · `score_aftertaste` · `score_acidity` · `score_sweetness` · `score_mouthfeel` · `score_overall` (the WBrC seven) + `score_layered_evolving` (Decision 4) + `score_descriptor_accuracy` (Decision 5). Discrete columns because the components are fixed-cardinality, stable across WBrC years, and are exactly the payload that must be SQL-queryable (score trends per roaster/terroir; synthesis adapters read them without jsonb gymnastics).
- **One `tasting_arc` jsonb** for the per-station payload — repeating/nested, following the `pours` jsonb precedent on the same table.
- Rejected: everything-in-jsonb (buries the queryable scores — the corpus digest's exact complaint); a `tasting_scores` sibling table (justified only by 1:N cardinality, which Decision 1 eliminated).

## Decision 3 — Cuppings mirror the schema, nullable; the roast-side gate fires at the reference cup only

"Everything roasted" gets its home on `cuppings`: the same nine `score_*` columns + a `tasting_arc` jsonb, **all nullable**. Roasting is iterative-in-app (every cupping already lands as a row), so there is no brewing-style "optimized only" filter — instead the *forced* moment mirrors the brew-side push gate: **the canonical pourover cupping on the lot's `best_roast_id` must carry a full sheet before close-lot writes `roast_learnings`.** Mid-lot V-set bowls score optionally (cheap cross-batch comparability, never forced — V-set cuppings are multi-batch and the bowls don't run the four-station pourover protocol).

The existing prose axes stay untouched and are **complementary, not redundant**: prose is the narrative *shape* ("opens muted, blooms at warm"), scores are the calibrated *level*. `cuppings.temperature_behavior` prose coexists with `tasting_arc` the same way `brews.temperature_evolution` prose does.

## Decision 4 — `score_layered_evolving`: a directly scored 0-9 eighth component, apex-anchored

The Latent-native axis the official sheet lacks is a **directly scored 0-9 integer in the same instrument grammar** as the seven — scored after the full arc, at the cool station. The `tasting_arc` stations are the *evidence trail* under the score (eyeball whether an 8 was backed by real station-to-station development), but the score is **authored, never computed**. Rejected: deriving it from per-station deltas (the derivation rule would be invented, the inputs are equally subjective, and descriptor *difference* is not evolution *quality* — a degrading cup shows big deltas too); prose-only (the status quo, i.e. the gap).

**Apex-anchored rubric (build deliverable, lands in canon):** a **9** means the cup did the full layered-evolving thing — *new layers revealed AND character held through ≤50°C*; mid-range = shifted without layering, or layered without holding; low = static or degrading. One paragraph, written once (CONTEXT-taste-adjacent, operational home in the brewing-assistant cluster), so the score means the same thing in March as in November and a longitudinal "apex rate" query stays honest.

## Decision 5 — Partial bundle with the Coffee Brief expected-half: take only the overlap

This build lands **`descriptors_expected text[]` on `brews`** (authored at brief time, carried through the session, pushed with the optimized brew) + **`score_descriptor_accuracy`** (0-9, in the discrete set on both tables — it is a scored element on the real WBrC sheet, so it belongs to this instrument). The broader Coffee Brief expected-half (full `roaster_tasting_notes` capture, brief storage, provenance) **stays its own roadmap entry with scope reduced accordingly**. Rejected: full bundle (brief capture has its own design questions — e.g. where a brief lives when the coffee is never archived); full split (leaves a scored column with no referent and the committed ritual homeless).

**Dual semantics (Chris nuance, same field, no discriminator column — `roaster = 'Latent'` already splits the cases):**

- **External roaster coffee:** expected = **the bag notes**. Chris is the *judge* — scoring whether the cup delivers what the roaster claimed (judge-calibration practice; exactly what a WBrC sensory judge does with the competitor's spoken descriptors). `/brew` pre-fills `descriptors_expected` from the bag notes.
- **Self-roasted:** expected = **Chris's own prediction**, seeded from the `roast_recipes` prediction fields. Chris is the *competitor* — scoring his own descriptor authorship (the actual competition skill). `/brew` prompts him to author them at brief time.

The dual semantics must be written down at: the `push_brew` Tool description, CONTEXT-brewing glossary, and the `/brew` skill. Roast-side asymmetry: `cuppings` gets **no** `descriptors_expected` — the roast side's "expected" home already exists (`roast_recipes` predictions); the reference-cup `score_descriptor_accuracy` scores against the recipe's prediction.

This decision also strengthens the sibling brainstorm's remaining case: for external coffees the bag notes now have a *consumer* on the brew row.

## Decision 6 — Capture ergonomics: dictation-extraction, fixed station keys, one-line numbers ask, and a glanceable tasting card

- **Dictation-extraction, not a questionnaire.** Chris already narrates the whole-arc stations conversationally in every brew (100/102 discipline). The skill's job is *extraction*: build `tasting_arc` (station, temp, descriptors, one-line note) from the narration already given. The only *new* explicit ask at close-out is the **nine integers in one dictated line** ("aroma 7, flavor 6, ... layered-evolving 7, descriptors 6"). If a station went un-narrated, the gate asks for that station before push rather than silently pushing a hole. Rejected: per-station per-component structured walkthrough (the version that gets resented by October).
- **Fixed station keys** in `tasting_arc`: `aroma` / `hot` (~59-60°C) / `warm` (~54-55°C) / `cool` (≤50°C), matching the canon protocol, optional extras allowed. Fixed keys are what make per-station queries possible ("every cup that peaked warm"); free-form labels would recreate the prose-classification problem the digest had to hand-wave through.
- **Build deliverable: a one-page WBrC self-scoring tasting card** — same shape as the water-research tasting card Chris found "super helpful": each of the 9 axes with the question to hold in mind while drinking + example vocabulary, the apex-anchored layered-evolving rubric, and the sip protocol (station order aroma → hot → warm → cool). Lives in the brewing-assistant cluster, **registered in `lib/mcp/docs.ts` same-PR** (standing rule), surfaced by `/brew` at evaluation time; the reference-cup cupping flow gets the same card pointer. Chris: glanceable-while-drinking is the requirement; he'll also use it as practice on structured cuppings beyond the forced reference cup.

## Decision 7 — Build now on the 2026 sheet; the Dec 2026 rules drop is a re-verify checkpoint, not a gate

The rules-coupled surface is shallow (seven component names + the 0-9 scale, both stable across recent WBrC years; a rename is a cheap single-tenant column migration). Everything Latent-native (layered-evolving, `tasting_arc`, `descriptors_expected`, station keys) is rules-independent by construction. Waiting ~5 months would leave every optimized brew and reference cup scoring onto paper with nowhere to land — the exact zero-queryable-scores gap this closes. **Scheduled checkpoint (carried on the build's roadmap entry): Dec 2026 — diff the 2027 WBrC sheet against the capture schema; migrate names if drifted.** (The 2026 set dropped 2025-12-17.)

**Promotion:** the brainstorm concludes as a **spec'd build sprint promoted to the roadmap's On deck** (this doc is its kickoff substrate), not a lingering Brainstorms entry.

---

## Column inventory (the build's migration, one place)

**`brews`:** `score_aroma` · `score_flavor` · `score_aftertaste` · `score_acidity` · `score_sweetness` · `score_mouthfeel` · `score_overall` · `score_layered_evolving` · `score_descriptor_accuracy` (all `smallint`, `CHECK` between 0 and 9, nullable) + `tasting_arc jsonb` + `descriptors_expected text[]`.

**`cuppings`:** the same nine `score_*` columns + `tasting_arc jsonb`. No `descriptors_expected` (lives on `roast_recipes` predictions).

`tasting_arc` shape (both tables): array of station objects `{ station: "aroma"|"hot"|"warm"|"cool" (fixed keys, extras allowed), temp_c, descriptors: [], note }`.

No backfill: the 102 existing brews / 100 existing cuppings stay prose-only — the instrument starts now, retro-scoring from memory would be fake data.

## Six-actor trace (for the build sprint)

1. **Actor 6 (schema/UI):** migration `NNN_tasting_capture.sql` (+ self-register line, standing rule) → same-PR `lib/types.ts` typing (`check:types-vs-schema` Class A) → UI render: `/brews/[id]` (scores + arc on the detail surface — priority-stack placement per design-system grammar) + `/green/[id]` REFERENCE CUP card (scores render beside the existing prose axes).
2. **Actor 4 (MCP):** `push_brew` / `patch_brew` + `push_cupping` / `patch_cupping` Zod schemas + Tool descriptions (including the dual expected-semantics); tasting-card doc registered in `lib/mcp/docs.ts` → `npm run check:mcp-bundle`.
3. **Actor 5 (Claude Code docs):** CONTEXT-brewing glossary entries (score sheet / layered-evolving score / descriptors expected) + the apex-anchored rubric's canon home + `data-model.md` column entries + this doc linked from the roadmap.
4. **Actor 2 (prompts/skills):** `/brew` SKILL + `bundled-brewing-completion.md` (the score-completeness push gate + dictation-extraction + card surfacing + expected pre-fill/authoring); roast-side: the close-lot flow gains the reference-cup gate; `log-cupping.md` mentions optional mid-lot scoring.
5. **Actor 3 (claude.ai):** roasting-side prompts still run in claude.ai mid-migration — fresh-session catalog refresh after the `push_cupping` schema change (`check:mcp` count + fresh session per the standing cache rule).
6. **Actor 1 (Chris):** the tasting card is the glanceable in-session surface; rendered scores on `/brews/[id]` + `/green/[id]` read coherently next to prose.

Post-ship: `check:doc-sizes` (bundled-brewing-completion + CONTEXT-brewing are tracked surfaces); grilling refresh at feature ship per standing rule.

## Kickoff brief — tasting-capture build sprint

- **Problem:** the committed WBrC self-scoring instrument (WBC brainstorm Decision 2) has nowhere to land — zero structured quality scores on 102 brews; layered-evolving unmeasurable; 100 prose arcs vs 17 structured targets.
- **Goal:** land the Decision 1-7 capture schema + write path + gates, so the next optimized brew and the next reference cup push full score sheets.
- **Scope in:** the column inventory above; both push/patch Tool pairs; the `/brew` score-completeness gate + dictation-extraction; the close-lot reference-cup gate; the one-page tasting card + rubric; UI render on `/brews/[id]` + `/green/[id]`; docs per the six-actor trace.
- **Scope out:** any backfill; practice/mock/drill storage; cooling-behavior tracking visualizations (Future Directions entry stays gated until scored data accumulates); the broader Coffee Brief expected-half (reduced-scope sibling); synthesis-adapter score reads (future, once N is meaningful).
- **Entry surface:** fresh Claude Code session, planned-execution (this doc = the approved plan substrate; autonomy rule applies).
- **Files likely to touch:** `supabase/migrations/`, `lib/types.ts`, `lib/brew-import.ts`, `lib/mcp/` (brew + cupping tools, docs.ts), `.claude/skills/brew/SKILL.md`, `docs/prompts/bundled-brewing-completion.md`, close-lot flow, new `docs/skills/brewing-assistant/cluster/tasting-card.md`, `app/(app)/brews/[id]/`, `app/(app)/green/[id]/`, CONTEXT-brewing.md, `docs/architecture/data-model.md`.
- **Verification:** migration applied-to-PROD check at kickoff; `check:types-vs-schema` / `check:mcp` / `check:mcp-bundle` / `check:doc-sizes` green; an end-to-end exercised push (real-shaped payload through `push_brew` with scores + arc, row inspected) per the exercise-flows-end-to-end rule; preview at 390 + 1024 for the two UI surfaces.
- **Open questions:** none blocking — Dec 2026 re-verify is scheduled, not open.

## Open questions (genuinely unresolved)

- **Where exactly the rubric paragraph lives** (CONTEXT-taste editorial pointer vs brewing-assistant cluster as operational home) — build-time call, low stakes.
- **Whether mid-lot V-set bowls ever get a lighter-weight partial-score convention** (e.g. overall + layered-evolving only) — let lived practice decide; nullable columns already permit it.
