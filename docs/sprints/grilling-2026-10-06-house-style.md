# Grilling session record - 2026-10-06 - Latent house style (item 59)

**Session shape:** `/grill-with-docs`, three rounds of batched questions (Q1-Q24), Chris answering by audio batch. Evidence base: the 40-brew `query_brews` read from the queue item, CONTEXT-brewing (Roaster signal / Brewer rotation discipline / Two-Axis / Hybrid sub-form / Concentrated Pour-Over), hybrid.md + sworks.md + freezer-stock.md, operational-guide Step 1d / Step 2, `/brew` SKILL.md, a 32-row Balanced Intensity `query_brews` pass for the relabel set.

## Confabulation ledger (R3) - corrections to the queue item made before Round 1

| Claim in item 59 | Finding |
|---|---|
| "Graduated Taper ... never landed anywhere in the cluster" | False. It had a sworks.md Canonical recipe patterns row and a hybrid.md § Sequential subsection with three rules since 2026-07-27. What was missing was a glossary headword. |
| Tabaco Pata (10c46241) "ports Graduated Taper verbatim" | False. hybrid.md / sworks.md recorded 0→5→6→7; freezer-stock.md and Chris (99% certain) say 0→5→5→6-at-end, the house sequence. Pattern docs corrected; Taper drops to Aroste + Zarza Bella Vista (N=2). |
| Tabaco Pata / La Dinastia is "label drift" | It is a labelling-rule inconsistency the substrate already answered: the v8.4 Hybrid promotion reclassified every SWORKS Restricted→Half-Open brew to Hybrid (Sequential). La Dinastia and six older brews violated that rule; El Placer's v8.4 reclass note in balanced-intensity.md had never reached the DB. |
| Chassis 92°C base, 30-45 s bloom | Chris's recount: 94°C kettle on base throughout, 45 s bloom. Taken as canon. |

## Decisions (all Chris-ratified)

| # | Decision | Outcome |
|---|---|---|
| Q1 | Name / collision with Roaster signal (a.k.a. house style) | **Latent house style**, proper-noun headword. Generic lowercase "house style" stays the Roaster signal alias. Asymmetry is the point: a third-party house style is a bias we infer; Latent's is a recipe we own, and it spans roasting + brewing (Chris: "my roast would fold into my brewing strategy ... backwards test"). |
| Q2 / Q9 / Q17 | Valve pattern vs Graduated Taper | House valve = 0→5→5→6-at-end. Graduated Taper (Dial 6 at ~155 g mid, Dial 7 flush) = adjustment row "body climbing over the attack", sub-entry not headword. Tabaco Pata was house style. |
| Q3 | Strategy-label drift | Five intensity strategies = **named deltas on the chassis**; Two-Axis Framework stays the taxonomy of intent; no `chassis` field. |
| Q4 | Label of a plain house-style brew | **Hybrid (Sequential)**, per v8.4. Balanced Intensity survives only constant-valve / valveless. |
| Q5 / Q15 | Brewer rotation discipline | Narrowed: SWORKS default; leave on four triggers (research question on geometry/filter · chassis fails after rows exhausted · competition build with own playbook · no SWORKS at location). End-of-coffee rotation question deleted. Default-brewer trap kept as analytical headword, applies only once the default is left. |
| Q6 / Q10 | Adjustment table | Six rows ratified, trigger column = roast-level or cup signal, never a coffee. Roast-level rows: temperature is the primary lever (dark 88-90 off base; very light 96-100), valve structure compensates second (dark: shorter bloom, Dial 6 mains; light: Dial 5 throughout, longer hold). |
| Q7 | Switch closed-steep-then-cut form | Not a fourth archetype: the chassis on a two-state valve + dark-roast row + late-cut row. "Clunkier"; SWORKS maps it with more control. |
| Q8 / Q16 | Chassis contents | Ratio 1:16 invariant, dose variable (15 g default, 18 g WAC-lane exception). Water stated per location in the entry (home distilled + MgCl2 concentrate; office PA tap + 1 TONIK + 1 JAMM); no water exploration until a competition build. Grind 6.5 default, 6.3 common, coarser acceptable. |
| Q11 / Q21 | Roasting-side meaning | SPG standing recipe starts from the house style (CONTEXT-roasting amended); optimized brew of a self-roasted lot = house style by default (close-lot + one-shot-closeout + `/brew` carve-out); exceptions (e.g. CGLE Mandela XO pungency) state why in one `strategy_notes` line. |
| Q12 / Q19 | Split pour | Recorded as one paragraph under Concentrated Pour-Over: concentrate (bloom + Pour 1 = 150 g = 1:10) + reserve (Pour 2, palate cleanser / bypass source ≤10 g) + reconstructed cup. Concentrate-forward is Chris's default; reserve-forward is a sanctioned serving form when serving others. Technique, not a headword or modifier value. |
| Q13 / Q18 | ADR + relabel | [ADR-0026](docs/adr/0026-latent-house-style-chassis.md). Relabel all seven Balanced Intensity SWORKS brews with a valve transition (list below) via `patch_brew` after merge. |
| Q14 / Q20 | `/brew` Step 1 | Step 1 collapses toward identity + roast level + archive lookup + apex gate; 1d = "house style unless a signal names a delta or row". Full Steps 1-4 simplification is a **separate follow-on sprint** (brief below). |
| Q22 | Full Expression on the chassis | No observed delta; flagged, not invented from Picolot doctrine. |
| Q23 | Headword prose | Ratified as drafted. |
| Q24 | Packaging | One PR; patches after merge. |

## Relabel set (Balanced Intensity → Hybrid / sequential)

| Brew | Date | Valve |
|---|---|---|
| La Dinastia 23b48be7 | 2026-09-24 | 0→5→5→6 (house style verbatim) |
| Zarza Bella Vista e560bc72 | 2026-06-03 | 0→5→6 at 155 g→6/7 (Graduated Taper, second instance) |
| Mokkita Cold Room 7ad09c9b | 2026-05-26 | 0→5→5→7 |
| Blue Iris f404e3b0 | 2026-05-04 | 5→5→6 at 190 g |
| Janson 1010 64606db8 | 2026-04-30 | 5/5/7 slow/slow/open (v8.4 missed it) |
| El Placer White Honey 99ce6fa9 | 2026-04-30 | Restricted→Half-Open (doc said reclassified; DB was not) |
| Alo Gemechu 265fdff8 | 2026-04-29 | 5→5/6 |

Unchanged: every other Balanced Intensity row (April / UFO / Orea / Kalita / V60, no valve) and the AeroPress Peach concentrate.

## Landed this session

- CONTEXT-brewing.md: **Latent house style** headword; Roaster signal cross-ref; **Brewer rotation discipline** rewritten; split pour paragraph under Concentrated Pour-Over; header term list.
- CONTEXT-roasting.md § SPG standing recipe: starts from the house style; Avoid line reworded.
- docs/adr/0026-latent-house-style-chassis.md.
- hybrid.md § Sequential: house style block + relabel list + Taper N=2 + Tabaco Pata row corrected. sworks.md: house style row, Blue Iris row relabelled, Tabaco Pata paragraph corrected. freezer-stock.md Tabaco Pata entry corrected. balanced-intensity.md relabel note.
- operational-guide.md: Step 1d default sentence; Step 2 chassis block + adjustment table.
- .claude/skills/brew/SKILL.md: house style default bullet; self-roasted carve-out default.
- docs/prompts/close-lot.md + one-shot-closeout.md: default-recipe line at the optimized-brew link stage.
- grilling-queue.md: item 59 → § Resolved.

## Retro

- The queue item carried two false "never landed" / "ports verbatim" claims that a grep and one DB read overturned before Round 1. The grep-first rule (R1) earned its keep again; both would have become glossary text otherwise.
- The archive disagreed with itself about the same brew in two files written days apart. Pattern-doc rows written from a session summary rather than the `pours` array are the drift source; the follow-on sprint should have ledger rows cite `pours`.
- A v8.4-era reclass note in a pattern doc never reached the DB. Doc-vs-DB relabel claims need a `query_brews` check, which `query_brews` now makes cheap.
- Chris widened the brief twice in Round 2 (roasting-side meaning; whole-process simplification). Both routed cleanly: one became a one-line SPG amendment, the other a follow-on brief. Neither was executed as a side effect.

## Kickoff brief - `/brew` process simplification (follow-on, planned execution)

**Problem:** the brewing operational guide and the `/brew` skill still walk a six-strategy design-from-scratch Coffee Brief (Steps 1a-1d, signal arbitration, modifier check, Step 2 recipe design, Step 3 loop, Step 4 output) that was built for a practice that no longer exists. The 2026-10-06 grill landed the Latent house style as the default and bolted a "start here" block onto Step 1d and Step 2, but the surrounding flow still reads as design-from-zero.

**Goal:** rewrite Steps 1-4 of the operational guide and the `/brew` skill so a session opens with identity + roast level + archive lookup + apex gate, names the delta or adjustment row, emits the chassis with the row applied, iterates by row, and records strategy + modifier labels as today. Target: the guide and skill each shrink, not grow.

**Scope in:** operational-guide.md Steps 1-4 + Output Format + End-of-coffee review (delete the rotation question); `/brew` SKILL.md arc section; `start-brew.md` mobile entry; `bundled-brewing-completion.md` only where it echoes Step 1 structure; the Axis 1 strategy table reframed as "delta on the chassis". **Scope out:** schema, MCP Tools, Historian pattern docs (ledger-cite-`pours` convention is a separate hygiene item), AeroPress / WAC playbooks, water doctrine.

**Entry surface:** fresh Claude Code session, planned execution (autonomy rule applies; every substantive call was ratified 2026-10-06 - see Decisions table above). Run `/improve-skill brew` first as the read-only audit, then execute.

**Files likely to touch:** docs/skills/brewing-assistant/cluster/operational-guide.md · .claude/skills/brew/SKILL.md · docs/prompts/start-brew.md · docs/prompts/bundled-brewing-completion.md · docs/skills/brewing-assistant/SKILL.md (if it summarizes the Steps) · docs/architecture/doc-tripwires.md registry block via `check:doc-sizes -- --write`.

**Verification plan:** paper-walk one purchased brew (a Sey light washed → Extraction Push delta) and one self-roasted carve-out (house style + roast-level row) through the rewritten flow; `read_doc_section` anchors still resolve (h2 headings unchanged or `list_doc_sections` updated); `npm run check:doc-sizes` + `check:doc-links` green; brewing-assistant cluster stays under its 100 KB cap.

**Open questions:** none substantive. Two presentation calls for the implementer: whether the Axis 1 table keeps its grind/temp columns or becomes a pure delta table, and whether the Hybrid Phase Note / Valve Strategy Note sections in Step 2 collapse into one house-style note.
