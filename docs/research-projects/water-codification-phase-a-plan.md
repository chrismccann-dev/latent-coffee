# Scoped execution plan — RP6 Water Codification, Phase A (the water knowledge substrate)

*Coordinator-authored scoped execution plan. Operator: open a FRESH Claude Code session (fresh branch off main) and paste this as the opening message. It is a normal implementation session — NOT a Research Assistant session; the research role-discipline caps do NOT apply here (this is the substrate-fold the Coordinator scoped).*

---

## What this is

Research Project #6 (water chemistry) completed Phase 1 (concentrate screen, Track 1) + Phase 2 (single-mineral isolation, Track 2, all 5 HTs resolved). The operator's call (2026-07-03): **codify the SHAPE now** — the taxonomy, the mineral→role chart, the build method, the recording schema — treating the single-coffee directional *values* as provisional and verifying them on a 2nd coffee later. **Do NOT gate the structure on the 2nd coffee** — the structure is coffee-independent; only the specific recipe values are provisional.

**Phase A (this plan):** author the water knowledge substrate as a brewing cluster doc + register it. **Phase B (NOT this plan — deferred):** wire water into the `/brew` flow. Keep Phase B out.

Source material to read for the content (all on main):
- [Track 2 archive](docs/research-projects/water-single-mineral-isolation.md) — the resolved mechanism (§ TRACK 2 FINAL CLOSE, § Final isolation map, § Final recipe-library pointer, the HT verdicts).
- [Track 1 archive](docs/research-projects/water-concentrate-postbrew-screen.md) — the concentrate screen + "less is more" + the dose-dependence finding.
- [2026 WBC water handoff](docs/research-projects/wbc-2026-water-handoff.md) — external corroboration (anion-sets-a-phase) + the role-label divergence.
- Style to match: [grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) header + metadata + "not a comprehensive registry" pattern.

---

## Deliverable 1 — `docs/skills/brewing-equipment-expert/cluster/water.md` (NEW)

Author a new cluster doc, sibling to `grinder-eg1.md` / `sworks.md` / `brewers.md` / `filters.md`. Match their header/metadata style. Content spec (author faithfully from the source archives; keep the coffee-independent structure separate from the single-coffee values):

**Header + metadata block** (grinder-eg1.md style): `# Water`, then — Enforcement bar (Reference/soft — this is a knowledge doc, not a strict registry yet); Provenance (derived from RP6 Track 1 + Track 2, 2026-06 → 2026-07, links to both archives + the WBC handoff); a "**Not a comprehensive registry / values are single-coffee-provisional**" note (the anion→phase *framework* is validated; the specific directional values are Pink-Bourbon-only pending a 2nd-coffee replication).

**§ 1 — Water taxonomy (the recording schema).** How to describe/record any water: base (distilled / RO / spring / tap), total ppm / TDS, GH (general hardness, as CaCO₃), KH (alkalinity / buffer), cation split (Ca vs Mg), anion split (sulfate vs chloride), buffer source (Na vs K bicarbonate). This is the vocabulary Phase B will use to structure `water_recipe`. State units + how each is measured (LaMotte BrewLab for GH/KH/Ca/Mg/sulfate/chloride; EC60 for TDS).

**§ 2 — The mineral→role mechanism (the resolved Track 2 finding).** The crown-jewel model: **the anion sets a phase; the cation gates it.**
- SULFATE → body / sweetness / creaminess / texture, roughly cation-agnostic (MgSO₄, CaSO₄).
- CHLORIDE → attack / acidity / florality / clarity, but cation-GATED: Mg+chloride = bright peak; Ca+chloride = muted/lactic/oily.
- It's an interaction, not two clean main effects — attribute to the pairing, never the lone ion.
- Buffer (KH): mutes acidity / flattens clarity; minimal/zero KH favored on clarity coffees.
- **Cross-reference the WBC field:** the anion-sets-a-phase mechanism is strongly corroborated by the 2026 WBC field; BUT the field's specific role-labels (MgSO₄=florality, CaCl₂=body) did NOT reproduce on the Pink Bourbon (we got sulfate=body, chloride=florality) — role-labels are coffee-dependent. State this as a held divergence.

**§ 3 — The water chart (the decision artifact — the "grind chart" analog).** A table turning the mechanism into action: rows = desired direction (more body/sweetness · more acidity/attack · more florality/clarity · smoother texture · longer finish · more buffer/less bright), columns = the lever (which salt / anion / cation, at what rough level), with the cation-gating caveats inline. Include the WBC-seeded rows we haven't isolated yet (potassium→finish, silica→texture) marked as **hypothesis, not yet Latent-tested**. This is the operator-facing "given what I want, what do I build" surface.

**§ 4 — Build method.** Single-salt 10,000 ppm stocks (gypsum/CaSO₄ is low-solubility → dilute ~1-2 g/L stock, shake before every dose). GH/KH targets + the GH-44 / KH-20 starter recipes (per-liter mg, from the Track 2 protocol). Precipitation discipline: calcium never shares a concentrate with sulfate/bicarbonate — build multi-salt waters from single-salt stocks added sequentially to the dilute water. **WATER-vs-CONCENTRATE labeling** (tag every built liquid; brew a finished water directly, never re-dose it). Measure-don't-guess (verify every built water on the LaMotte; the GH drop-count is cation-specific — don't port a drop-lock across cations, match within a pair). The gear chain (distiller / A&D balance / EC60 + 84 µS standard / LaMotte / micropipettes / stirrer).

**§ 5 — Guardrails.** Less-is-more (distilled beat every built + natural water on the clarity Pink Bourbon; a built water must clear "beat distilled"). Post-brew is a **bounded proxy** — it gets the coarse ranking but inverts the mechanism (the HT3 extraction-effect finding), so a mineral must be judged pre-brew for its true role. Water seasons, it doesn't fix a coffee that lacks the note. Precipitation **unbalances** a cloudy commercial concentrate (selectively strips Ca + carbonate — measured HT5 finding), so a clean stock build > a cloudy bottle. Over-Mg over-sharpens, over-Ca over-weights, KH flattens.

**§ 6 — Recipe library (SEED).** A table, first row = **Hydrangea Pink Bourbon Washed → MgCl₂-forward, GH ~44, minimal/zero sulfate, avoid calcium, zero/minimal KH; peak = straight MgCl₂ @ GH 44.** Stamp it **PROVISIONAL — single-coffee (RP6, one coffee); coffee-dependence gate holds (a body-wanting coffee may flip toward sulfate/blends).** Leave the table structured so future coffees append as rows. This is the "per-coffee water recipe library" end-state, seeded with one row.

Keep the doc under the cluster-doc size cap (check via `npm run check:doc-sizes`). Root-relative internal links only ([ADR-0021](docs/adr/0021-root-relative-doc-links.md)).

## Deliverable 2 — Register `water.md` in MCP (`lib/mcp/docs.ts`)

The sibling cluster docs are MCP Resources (brewers/filters/grinder-eg1/sworks). Add a `DOC_FILES` entry for `docs://skills/brewing-equipment-expert/cluster/water.md` with a description in the same style (what it is + when to use it + the single-coffee-provisional caveat). The `outputFileTracingIncludes` glob `./docs/skills/**/*.md` in `next.config.js` already covers it — confirm with `npm run check:mcp-bundle` (should pass, but run it). This is the [register-reference-docs-in-MCP](docs/architecture/doc-tripwires.md) rule + the six-actor Actor-4 hop.

## Deliverable 3 — Roadmap update (`docs/skills/research-coordinator/cluster/roadmap.md`)

Update the RP6 § Now entry: Track 2 (Phase 2) CLOSED (all 5 HTs resolved; the anion→phase mechanism); **codification Phase A SHIPPED** (pointer to `water.md`); **Phase B (brewing-flow wiring) queued**; the 2nd-coffee replication now **de-gated for structure but still the verification step for the values**; the L-c #1-11 method primitives still pending the PROJECT retro; P6T1-AI-3 (TONIK confound) still re-queued. Keep it tight.

## Deliverable 4 — CONTEXT-taste pointer (light)

Add a one-line pointer in [CONTEXT-taste.md](CONTEXT-taste.md) (or confirm one exists) noting that the water mineral→role mechanism (anion-sets-a-phase / cation-gating) lives in `water.md`. Do NOT relocate the mechanism into CONTEXT-taste — water.md is its home; this is just a discoverability pointer. Skip if it doesn't fit the CONTEXT-taste structure cleanly (flag it if so).

---

## Six-actor audit (trace before PR)

- **Actor 6 (schema/UI):** NONE. `water_recipe` already exists (migration 071, free-text). No new column, no migration. (Structured columns are a Phase-B-or-later decision.)
- **Actor 4 (MCP):** Deliverable 2 — the new Resource entry. Run `npm run check:mcp-bundle`.
- **Actor 5 (Claude Code docs):** Deliverables 1 + 3 + 4. Run `npm run check:doc-links` + `npm run check:doc-sizes`.
- **Actor 2 (prompts):** NONE this phase (the `/brew` wiring is Phase B).
- **Actor 3 (claude.ai):** N/A (Claude-Code-native; no claude.ai catalog).
- **Actor 1 (Chris):** water.md renders as a brewing-input reference + the recipe-library seed — confirm it reads coherently.

## Verification

1. `npm run check:doc-links` — green (0 live misses).
2. `npm run check:mcp-bundle` — green (water.md covered).
3. `npm run check:doc-sizes` — water.md under the cluster-doc cap.
4. `npm run check:mcp` — the Resource count moved by +1.

## Explicitly OUT of scope (do NOT do — these are Phase B or later)

- Wiring water into the `/brew` skill / brewing-assistant (Phase B).
- Restructuring `water_recipe` guidance or adding structured water columns (Phase B / later).
- The 2nd-coffee replication (later — verifies the values, not the structure).
- Graduating the L-c #1-11 research-method primitives (the PROJECT retro, when RP6 closes).
- Resolving the TONIK confound (P6T1-AI-3, still re-queued).

## Commit / PR

Approved planned work — commit + push + open PR + squash-merge to main as one flow. Title: "RP6 Phase A: codify the water knowledge substrate (water.md taxonomy + chart + recipe seed)." Report the merged-PR URL + main SHA. End by telling the Coordinator (paste back) that Phase A landed, so the roadmap + Phase B scoping continue.
