# Scoped execution plan — RP6 Water Codification, Phase B (wire water into the /brew flow)

*Coordinator-authored scoped execution plan. Operator: open a FRESH Claude Code session (fresh branch off main) and paste this as the opening message. It is a normal implementation session — the research role-discipline caps do NOT apply.*

---

## What this is

Phase A shipped the water knowledge substrate ([water.md](docs/skills/brewing-equipment-expert/cluster/water.md) — recording schema + anion→phase chart + build method + guardrails + the MgCl₂-forward Pink-Bourbon recipe seed). **Phase B makes it a lever in the normal brewing loop:** at home, the `/brew` flow should *suggest a water recipe per brew* (drawn from `water.md`), so Chris starts using the water work as part of routine brewing.

**Key context that makes this small (verify each before editing):**
- The `/brew` Step 2 (Recipe Output) **already selects brewer/filter by brewing location** and **already has a "Water Recipe" field** that maps to `push_brew.water_recipe` (free-text, migration 071). Phase B enriches *how that field is filled at home*.
- **Location gating is already inherent:** [operational-reference.md § Location Constraints](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) has **Office = tap, "no water adjustments available"** and **Home = built water**. So "home-only" needs no new mechanism — the office branch simply records tap as-is (no suggestion).
- No schema change (`water_recipe` exists), no new MCP Tool/Resource (`push_brew` already accepts it, the edited docs are already registered Resources).

**Operator requirement (2026-07-04):** the suggestion is **home context only** (built water needs the home gear); office brews just record `water_recipe` as-is. And it is an **offer, not a mandate** — the low-effort daily default (a standing "crushable" comp) stays available; the suggestion fires when Chris wants to build deliberately.

---

## Deliverable 1 — brewing-assistant Step 2 (Recipe Output): add the water suggestion

Edit [docs/skills/brewing-assistant/cluster/operational-guide.md](docs/skills/brewing-assistant/cluster/operational-guide.md), the **`## Step 2 — Recipe Output (after strategy is confirmed)`** section (the section that already selects brewer/filter by location + defines the recipe output table with the **Water Recipe** row).

⚠️ **Do NOT rename any `##` heading** — they are `read_doc_section` anchors (verbatim, em-dashes preserved) that `.claude/skills/brew/SKILL.md` fetches by exact string. Add content inside the section; don't touch the heading text.

Add a water-suggestion step to how the **Water Recipe** field is authored:
- **At home:** consult `water.md` (the anion→phase chart + the recipe library) and **suggest a water recipe for this coffee + confirmed extraction strategy.** If a recipe-library row in `water.md` matches the coffee, use it; otherwise **derive** a direction from the chart + the coffee's character (e.g. clarity/floral → MgCl₂-forward, minimal-KH; body-wanting → provisionally sulfate-forward per the coffee-dependence caveat) and propose it, **stamped provisional** (the values are single-coffee-verified so far; the *structure* is solid). Populate **Water Recipe** with the structured suggestion (taxonomy vocabulary: base + GH + KH + cation/anion). Frame it as an **offer** — the standing daily comp remains the low-effort default; the built suggestion is for when Chris wants to focus.
- **At office:** no suggestion (no adjustments available) — record the tap/source in **Water Recipe** as-is, exactly as today.

Keep it tight and consistent with the section's existing voice. Cross-link `water.md` as the source.

## Deliverable 2 — Location Constraints: reframe the Home water line

Edit [operational-reference.md § Location Constraints](docs/skills/brewing-equipment-expert/cluster/operational-reference.md), the **Home** table's **Water** row. Currently it hard-codes "Distilled + remineralized with Third Wave Water packs (~1:3)." Reframe it: **home water is a deliberate lever built per [water.md](docs/skills/brewing-equipment-expert/cluster/water.md)'s chart when focusing; the Third Wave ~1:3 comp (or a standing crushable comp) remains the low-effort daily default.** Leave the **Office** Water row unchanged (tap, no adjustments — this is what makes the suggestion home-only).

## Deliverable 3 — brew SKILL.md: point Step 2 at water.md

Edit [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) Step 2 (the "water formula goes in the Water Recipe field" line, ~L108): add that **at home, the Water Recipe suggestion is sourced from `water.md`** (office records source as-is). One clause; don't restructure the arc.

## Deliverable 4 — water.md back-pointer (light)

Add one line to [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) noting it is consumed by the `/brew` flow at home to suggest per-brew water (so the doc's role is discoverable from both directions). Skip if it doesn't fit cleanly — flag it.

---

## Six-actor audit (trace before PR)

- **Actor 6 (schema/UI):** NONE — `water_recipe` already exists; no column/migration.
- **Actor 4 (MCP):** NONE — `push_brew` already accepts `water_recipe`; the edited docs are already registered Resources (no new entry). Confirm no Tool/Resource description needs the water-lever mention (optional, low-value — skip unless obvious).
- **Actor 2 (prompts) + Actor 5 (Claude Code docs):** Deliverables 1-4 — the brew skill + the two cluster docs. This is the core of the change.
- **Actor 3 (claude.ai):** N/A (Claude-Code-native brewing).
- **Actor 1 (Chris):** at a home brew, Step 2 now offers a `water.md`-derived water recipe; at office, unchanged. Confirm the flow reads coherently and the offer-not-mandate framing lands.

## Verification

1. `npm run check:doc-links` — green (0 live misses).
2. `npm run check:doc-sizes` — the edited docs stay under their caps.
3. **Anchor integrity:** confirm no `##` heading in operational-guide.md was renamed (grep the headings before/after) — `read_doc_section` fetches them verbatim; a renamed anchor silently breaks the brew flow.
4. Sanity: re-read the edited Step 2 top-to-bottom — the home/office branch is unambiguous and the suggestion is clearly an offer.

## Explicitly OUT of scope

- **Recipe-library fold-back** — brews enriching `water.md`'s recipe library over time (each optimized home brew's water feeding back as a library row). A good future enhancement; not Phase B. (Note it in the close-back to the Coordinator if it feels worth queuing.)
- Structured `water_recipe` columns / any schema change.
- The 2nd-coffee values-verification (separate track).
- The WBC-seeded future tracks (stage-split / K-finish / silica).

## Commit / PR

Approved planned work — commit + push + open PR + squash-merge to main as one flow. Title: "RP6 Phase B: wire water into the /brew flow (home-only water suggestion)." Report the merged-PR URL + main SHA, and tell the Coordinator (paste back) that Phase B landed so the roadmap flips + the recipe-library-fold-back idea can be queued.
