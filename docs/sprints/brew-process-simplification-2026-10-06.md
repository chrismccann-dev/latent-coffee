# `/brew` process simplification - 2026-10-06 (planned execution, follow-on to the house-style grill)

Brief: [grilling-2026-10-06-house-style.md § Kickoff brief](docs/sprints/grilling-2026-10-06-house-style.md). Canon: [CONTEXT-brewing.md](CONTEXT-brewing.md) § Latent house style + § Brewer rotation discipline, [ADR-0026](docs/adr/0026-latent-house-style-chassis.md). Read-only audit first: [docs/audits/skills/10-brew-house-style.md](docs/audits/skills/10-brew-house-style.md).

## What changed

| Surface | Before | After | Change |
|---|---|---|---|
| operational-guide.md | 56.3 KB / 312 lines | 38.4 KB / 254 lines | Steps 1-3 + Output Format rewritten onto the house-style flow; Step 4 write contract untouched except the `concentration` modifier enum; h2 anchors byte-identical |
| .claude/skills/brew/SKILL.md | 16.2 KB / 224 lines | 13.9 KB / 199 lines | Audit cuts 1-5 applied; arc section = open → name row → emit chassis → iterate by row |
| docs/prompts/start-brew.md | 8.3 KB | 7.3 KB | House-style opener; freezer procedure single-sourced in the guide |
| brewing-assistant cluster | 72.8 KB / 100 | 60.9 KB / 100 | |

- **Step 1** = 1a identity + roast level (freezer lookup for purchased, DB pull for self-roasted, roast level as the overriding signal with the three confirmation routes and the ground-over-WB rule) · 1b archive lookup (query_brews first, pattern docs, signal table, roaster card) · 1c brief summary + apex gate · 1d name the delta or row + modifier check + the two named considerations, then pause on a one-sentence brief. The 1b / 1c / 1d sub-step names the glossary references (process signal at 1b, arbitration at 1c, strategy gate + named considerations at 1d) still hold.
- **Axis 1 table** became a pure delta table (`Strategy | Delta on the chassis | Signal that names it`); the grind / temperature / agitation / ratio columns went - the chassis carries the numbers and the per-strategy docs carry the rest. Presentation call 1 of the brief.
- **Step 2** emits the chassis once, then the six-row adjustment table, then Brewer (SWORKS unless a rotation trigger) and Water Recipe (compressed). The Output Format gains a `Row / delta` line; **Hybrid Phase Note + Valve Strategy note collapsed into one House-style note** (presentation call 2).
- **Step 3** leads with "iterate by row" (valve before grind, temperature first on a roast-level row), keeps the adjustment-width ladder, the deviation-reconciliation rule and the pivot heuristics (now explicitly "rows exhausted, picking the new zone"). The old "closed bloom exceeded ~25 s" check went: the chassis bloom is 45 s.
- **Rotation question deleted** at its two homes: cross-coffee-insights.md § 6 (Historian; a one-paragraph conformance edit, not the ledger-cite-`pours` hygiene item the brief scoped out) and operational-reference.md's rotation-framework lead-in (now "applies only once off the default"). The guide's End-of-coffee review gained two house-style questions instead (did the brew leave the house style and why; did an off-table row recur → grilling queue).
- `lib/mcp/docs.ts` description for the guide Resource updated; `bundled-brewing-completion.md` touched only at its target-doc description line.

## Paper walks

**Purchased, Sey light washed.** Gate: purchased. 1a: freezer hit, WB Agtron from the record, Sey brew guide = high extraction / low agitation signal; roast level ultra-light, no override. 1b: `query_brews(roaster: "Sey")` for priors; roaster card = Extraction Push-leaning; signal table no flags. 1c: purchased, not apex-selected, no clarify default. 1d: strong roaster signal names the **Extraction Push delta** (grind 5.6, 96°C held, long restricted contact), labelled Extraction Push, modifiers none, both named considerations default. Pause on "house style + Extraction Push delta, labelled Extraction Push, modifiers none". Step 2: chassis with 5.6 / 96°C / longer Dial 5 hold. Step 3 first sip thin → stay restricted longer (not finer); very-light row available if still off. Labels recorded as today.

**Self-roasted carve-out, developed roast.** Gate branch 4 (packet). 1a: `get_green_bean` + `get_bean_pipeline(roast_id)`; cupping `ground_agtron` is the prior; reads developed → dark-roast row. 1b: `query_brews(roaster: "Latent", coffee_name)` for sibling lots + by-cultivar doc. 1c: apex coffee, clarify-side; the house style is already clarify-side. 1d: **house style + dark-roast row**, labelled Hybrid (Sequential), no `strategy_notes` line needed (house style not left), modifiers none. Step 2: chassis at 88-90°C kettle off base, otherwise verbatim. Step 3 still roasty → shorter bloom / Dial 6 mains / late cut. Completion: `push_brew` self-roasted + handoff line. Push-once / link-once invariant unchanged.

## Verification

`npm run check:doc-sizes -- --write` all Tier-1 within cap (guide left the ≥80% band); `check:doc-links` 0 live misses; `npx tsc --noEmit` clean; the five pinned anchors (`/brew`, start-brew, bundled-brewing-completion, simulated-pourover, docs.ts) resolve unchanged.

## Retro

- The audit-first step paid for itself: the skill's apex-inheritance section and its arc section contradicted each other on the same page (one said "do not design from zero", the other "run 1a-1d, pause for strategy"). A rewrite without the audit would likely have kept both.
- The glossary pins sub-step letters (Step 1b / 1c / 1d appear ~15 times in CONTEXT-brewing). Keeping the letter-to-meaning mapping stable cost nothing and avoided a glossary sweep; worth checking before renumbering any stepped doc.
- The rotation question did not live where the brief said (the guide's End-of-coffee review); a grep found it in the Historian + Equipment docs. Grep-first again.

## Next

Live the rewritten flow on the next two brews (one purchased, one carve-out) and log friction to `process-friction-log.md`; the first recurring off-table row is a grilling-queue item. The ledger-cite-`pours` hygiene item from the grill retro remains open.
