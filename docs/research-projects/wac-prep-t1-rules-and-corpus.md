# AeroPress Championship 2027 Prep - Track 1: Rules + Champion Corpus (desk track)

*Research Project #10 (RP10) - AeroPress Championship 2027 Prep / "WAC recipe R&D" · OFFICE LANE, third occupant*
**Status:** SCOPED - operator sign-off on the phase-1 runway 2026-10-04 (this track is step 1 of 7)
**Coordinator:** persistent RP10 Coordinator session (kickoff 2026-10-02)
**Protocol authored:** 2026-10-04
**Track shape:** DESK RESEARCH. No vials, no cups, no TDS, no bench. Runs while the operator's AeroPress Original ships.

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE - READ THIS FIRST

You (the session reading this at execution time) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files (including the wbc-brewing-archivist cluster - the corpus you build lives in THIS doc until a fold session moves it)
- Edit ADR files, `lib/mcp/docs.ts`, or any MCP config
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` (nothing is brewed on this track)
- Design recipes, pick levers, or scope later tracks - that is the Coordinator's job; you report what the sources say
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Run Step 0 (source inventory) to completion before filling any deliverable table
- Cite a source URL for every row and every rule line; tag anything without an official source as UNVERIFIED
- Capture friction + lessons + audit items inline in this doc (the doc IS the archive)
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- Terminate with the explicit termination declaration block

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project framing (why this track, why first)

RP10 prepares the operator to compete in the 2027 AeroPress Championship season - the lower-stakes entry rung before WBC (PRODUCT.md § Purpose; RP8 strategic close). It inherits RP8's immersion-press craft and RP9's probe-first workflow.

**Operator frame (2026-10-02 to 10-04, captured at scoping):**
- Readiness target is "any time in 2027" - the qualifier could land anywhere in the year; nothing is announced. The operator tracks dates himself, outside this project.
- "Seems like the coffee is pre-determined so no need for roasting, picking my own coffee" - the competition skill is a repeatable base recipe plus fast adaptation to an unknown coffee.
- "It's going to be more about concentration, water, technique, more than anything else."
- The operator attends the WAC 2026 World Final in Mexico City on 2026-12-06 in person (tickets, flight, hotel booked).
- AeroPress Original purchased 2026-10-04 (the office unit is a Premium, believed not competition-legal).

**Phase-1 runway (operator-signed 2026-10-04), now through the December final:**

| # | Track | Shape |
|---|---|---|
| 1 | **Rules + champion corpus (THIS TRACK)** | Desk |
| 2 | Base recipe on the Original: RP8 press winner scaled to 18 g vs champion concentrate-and-bypass | Bench, known coffee, no clock |
| 3 | Dilution types: staged hot/cool bypass, final-step temperature, own-tail splash vs plain water | Bench |
| 4 | Serving temperature / Paragon chilling ball | Bench |
| 5 | Water (only what the rules allow) | Bench |
| 6 | Fellow Shimmy sieve | Bench |
| 7 | The clock: first undialed-coffee drill, full 5 minutes | Bench |

Phase 2 (routine rehearsal) opens when the operator reports the 2027 format, with a floor of early 2027.

**Why this track is first:** the WAC corpus in Latent substrate is one paragraph (RP8 T5 protocol, "Championship prior art") plus one line on the 2025 champion water profile. The WBC archive holds 154 recipes; the WAC archive holds none. Every bench track inherits constraints (dose cap, yield floor, permitted gear, what may be added to the cup) that are currently known only second-hand. This track turns them into a verified rules sheet and a recipe corpus.

## Claims ledger (seeded at scoping - each is a claim to VERIFY, not a fact)

Two unverified inputs exist. Treat both as claims; record a verdict (CONFIRMED / CORRECTED / UNVERIFIABLE) with a source for each.

**Source A - RP8 T5 protocol paragraph (external input, operator-reviewed at the time):**
- A1. 2022-2025 World AeroPress Champions share one architecture: 18 g / ~100 g chamber water (about 1:5.5) / coarse / long immersion / gentle 20-40 s press / 60-80 g concentrate / bypass to ~150-170 g.
- A2. Press speed, not pressure, is the reproducible control (2025 champion: 1-2 g/s output).
- A3. Every recent champion bypasses.

**Source B - operator's own pre-research (assistant-generated summary, pasted 2026-10-02):**
- B1. Entry is open first-come sign-up; no residency, citizenship, or amateur/pro requirement. 2026 US event: 36 spots, $100, single national event in Boston. 2025 US: four city qualifiers feeding a San Francisco final.
- B2. 5 minutes to brew and present one cup. Max 18 g coffee, minimum 150 g brewed. Coffee + water only.
- B3. Compulsory coffee and water must be used when the host provides them. Own water allowed if neutral-tasting.
- B4. Genuine AeroPress Original or Clear only; Go, XL, Premium excluded. (Scoping-time web search also reported the Flow Control Filter Cap as now permitted.)
- B5. Judging is blind: three judges, point on a count of three, majority advances, head judge breaks ties, no scoresheet, single elimination.
- B6. Competitors bring brewer, grinder, kettle, scale, timer. At the World Final the national champion must brew on a Comandante grinder.
- B7. Grinding must happen inside the 5 minutes; no rinsing filters or preheating during setup.
- B8. A practice window with the compulsory coffee precedes round 1 (2026 US: check-in 5 pm, round 1 at 6 pm); competitors re-dial between rounds.
- B9. Season pattern: opens around May, nationals done by Oct 31, US event Aug-Oct, Worlds early December. 2027 US projected Aug-Oct 2027 (projection only).
- B10. Recent finalists dilute in stages, sometimes finishing with cooler water to serve near 54°C.
- B11. 2025 final: first and second place brewed the same coffee with very different water (about 125 ppm vs about 60 ppm).

## Step 0 - source inventory (run to completion before any deliverable)

The calibration-arc primitives are bench-shaped; this is their desk analog. Do not skip it.

1. **Locate the official rules document** on worldaeropresschampionship.com (start: `/pages/resources-for-competitors`). Record: URL, document title, season/version, date published or last updated. If more than one season's rules are reachable, note what changed between them.
2. **Locate the official recipes pages** and record which years and which events (World Final, national finals) have published podium recipes. A missing year is a finding, not a gap to paper over.
3. **Source tiers - assign one to every source you use:** T1 = official WAC site / official rules document; T2 = the host organisation's own event page for a specific national or regional event; T3 = coffee press or a competitor's own published recipe; T4 = anything else. A rule line needs T1 (or T2 for host-specific rules) to be CONFIRMED.
4. **Read the claims ledger back to the operator** with your Step 0 findings: which claims look checkable from T1 sources, which will need T2/T3, which are probably unverifiable. Ask the operator whether anything he has seen first-hand contradicts a seeded claim.
5. **Copyright discipline:** summarise rules and recipes in your own words in tables. Do not paste rulebook text or recipe write-ups verbatim.

## Deliverables (fill these sections inline below - the doc IS the archive)

### D1. Rules sheet

One line per rule, grouped: entry + eligibility · event format + bracket · time rules (what the 5 minutes covers; what must happen inside the clock) · dose and yield limits · permitted brewer, caps, filters (paper/metal, count) · grinder rules (own grinder; the Worlds grinder requirement) · water rules · what may be prepared before the clock · judging mechanics (what judges receive, how fast, in what vessel) · disqualifications · what the host provides vs what the competitor brings.
Columns: `rule · plain-language statement · source URL · tier · verdict (CONFIRMED / UNVERIFIED) · applies to (Worlds / national / host-specific)`.

### D2. Rulings needed (these gate tracks 3-6 - answer each with a source or mark OPEN)

1. **Mineral drops in the finished cup.** The operator's standing office practice is Apax cup-dosing (1 TONIK + 1 JAMM mineral concentrate per 200 mL finished cup). Is adding mineral concentrate to the brewed cup "water", or a prohibited additive? Is adding it to the brew water before brewing treated differently?
2. **Self-built brew water.** When a host supplies compulsory water, is own mineralised water ever permitted? When own water is permitted, is there a neutrality or TDS test, and who judges it?
3. **Bypass water.** Any rule on the source, temperature, or timing of dilution water (hot, room-temperature, chilled)? Does bypass count toward the 150 g minimum?
4. **Cooling tools.** Are a chilling ball (Nucleus Paragon), an ice bath for the serving vessel, or pre-chilled vessels permitted? Has any competitor used one?
5. **Sieving.** Is removing fines with a sieve (Fellow Shimmy) permitted, and must it happen inside the 5 minutes? Does the 18 g cap apply before or after sieving?
6. **Second pass through the spent bed.** RP9's signature shape adds a small "own-tail" splash: fresh water run through the already-pressed bed and added to the cup. Is a second press or rinse of the same bed permitted?
7. **Filters.** Paper count, metal filters, third-party papers, pre-wetting (rule B7 says no rinsing during setup - is rinsing inside the clock allowed?).
8. **Preheating.** May the brewer or serving vessel be preheated inside the clock? Before it?
9. **Multiple entries.** In a qualifier year, may one person enter more than one regional?

If the official documents are silent, say so, and list the official contact route for a ruling. Do NOT email anyone - sending a message is the operator's call.

### D3. Podium recipe corpus

Scope: World Final podium (1st-3rd) for every year from 2022 to the latest published; plus US national podium where published. Stretch (only if cheap): other national champions whose recipes appear on the official pages.
Columns: `year · event · place · competitor · country · coffee (if stated) · brewer orientation (inverted/upright) · dose g · grinder + setting · chamber water g + temp · agitation · steep · press duration · concentrate yield g · bypass stages (g + temp each) · final beverage g · filter (type, count) · water (ppm / recipe if stated) · served temp if stated · source URL · tier`.
Leave a cell blank-with-dash when the source does not state it. Never infer a number.

### D4. Compulsory-coffee census (operator request, 2026-10-04)

"Grab all of the coffee types from regionals to finals across 2023, 2024, 2025, 2026 - just to get a sense of what the end coffee will be like."
Columns: `year · event (World Final / national / regional + city) · coffee name · origin · variety · process · roaster · roast level or style if stated · same coffee across all rounds? · source URL · tier`.
Priority order: World Finals, then US events, then other nationals as sources allow. Report coverage honestly (rows found / events known).

### D5. Patterns (derived only from D3 + D4 - label each as an observation, with the row count behind it)

- Architecture distribution: how many podium recipes are concentrate-and-bypass vs full-volume press; the range of chamber ratios, concentrate yields, and final strengths.
- Temperature: brew-water range; whether and how often a cooler final dilution appears; any stated serving temperature.
- Water: the range of stated mineral contents; own vs compulsory.
- Coffee profile: which origins, varieties, and processes recur in D4, and how light the roasts are described.
- Anything a champion's own account names as the deciding move.
Do NOT translate patterns into recommendations for the operator's recipe. That is Coordinator scoping for track 2.

### D6. Mexico City capture sheet (the operator attends the 2026 World Final on 2026-12-06)

Draft a one-page observation checklist the operator can use in the room, built from the gaps this track could NOT close from published sources. Likely headings: station workflow and what competitors stage before the clock · how the practice window is actually used · grind-inside-the-clock handling · dilution and cooling choreography · time from press to judges' first sip · what judges do between sip and point · the compulsory coffee and water · gear seen on stations. The sheet is this track's output; the observations themselves arrive after the track closes and are folded by the Coordinator as an addendum.

## Recording discipline

- One source read per tool call where practical; log each source in a **Source log** table (`# · URL · tier · date accessed · what it covered`) as you go.
- Where two sources disagree, record both and say which tier wins. Do not average.
- Dates: record the date accessed for every source; rules change between seasons.
- Sitting recap: if the session spans more than one sitting, open each sitting by restating which deliverables are complete, which are partial, and what this sitting does.

## Exit conditions

Track closes when: Step 0 is logged · every claim in the ledger carries a verdict · D1 is filled with every line tagged · every D2 ruling is answered-with-source or marked OPEN with the contact route · D3 covers at least the World Final podiums 2022 to latest published (or documents why not) · D4 reports its coverage · D5 and D6 are drafted · the handoff brief lands.
The track does NOT wait for 2026-12-06.

## Handoff brief - what the Coordinator needs from it

Beyond the template's standard sections:
- A **constraints block** track 2 can inherit verbatim (dose cap, yield floor, permitted brewer and caps, filter rules, what happens inside the clock).
- The D2 rulings as a table: `question · answer · confidence · which later track it gates`.
- **Candidate substrate specs (SPECIFIED, not applied):** whether D1 + D3 + D4 should become a WAC reference doc in the wbc-brewing-archivist cluster, and what an MCP-registration decision would involve. The Coordinator and operator decide; you describe the option.
- Corrections to the seeded claims (especially anything that changes the 18 g / 150 g arithmetic or the brewer rule).

## What this track does NOT do

No brewing · no recipe design · no lever ranking · no contact with organisers · no substrate edits · no changes to the Concentrated Pour-Over canon or to grilling-queue item 58 (evidence may be noted for the Coordinator; nothing is resolved here) · no tracking of 2027 dates (the operator tracks those himself; record what the published pattern has been and stop).

## Known limitations

- Published recipes are self-reported and often incomplete (grind settings without grinder context, no yields).
- National and regional rules are host-dependent; a T1 Worlds rule may not bind a 2027 US host.
- The 2026 World Final has not happened at authoring time; 2026 rows will be national-level only until the Coordinator's December addendum.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant fills from Step 0 onward)*
