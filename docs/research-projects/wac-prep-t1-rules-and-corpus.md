# AeroPress Championship 2027 Prep - Track 1: Rules + Champion Corpus (desk track)

*Research Project #10 (RP10) - AeroPress Championship 2027 Prep / "WAC recipe R&D" · OFFICE LANE, third occupant*
**Status:** EXECUTED 2026-10-05 - all deliverables filled, handoff brief at the bottom; awaiting Coordinator fold (scoped 2026-10-04, step 1 of 7)
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

Filled at execution: see § Notes / friction / lessons / audit items (Sitting 1) inside the Session Record below.

---

## SESSION RECORD

### Sitting 1 - 2026-10-05

**Operator rulings at session open (2026-10-05):**
- Recipe-fact claims (A1-A3, B10, B11) may be CONFIRMED from the official recipes page or the competitor's own published account (T3, tagged); third-party press alone stays UNVERIFIED.
- Rules baseline = the 2026 season document (the season is still live). Wayback Machine copies of the official site are allowed for prior seasons, logged as T1-archived.
- D4 stop line = all World Finals + every US event (including the 2025 city qualifiers). Other nationals are out of scope.
- D3 US scope = national final only.
- 2026 events not yet held are recorded as "not yet held", not as gaps.
- Git: protocol rule holds (commit + push this doc to the session branch only; no PR, no merge).

### Source log

| # | URL | Tier | Accessed | What it covered |
|---|---|---|---|---|
| S1 | https://worldaeropresschampionship.com/pages/resources-for-competitors | T1 | 2026-10-05 | World Final competitor hub; states the linked rules are the official World Final rules regardless of national rules, and that extra requirements may be added closer to the event; site map of season pages; contact hello@aero.press |
| S2 | https://worldaeropresschampionship.com/pages/rules | T1 | 2026-10-05 | Landing page only ("Official Rules and Regulations of Competition"); links to S3 |
| S3 | https://docs.google.com/document/d/12b3bSs59beuKIVxdPZS_cqQA9iF1BFc9eIT209CCVLk | T1 | 2026-10-05 | THE rules document. "Rules and Regulations of Competition", last updated 2026-06-09, 15 sections, asterisk marks sections changed from last season. Read in full (mobilebasic view), not via a summariser |
| S4 | https://worldaeropresschampionship.com/pages/recipes | T1 | 2026-10-05 | World Final podium recipes, single page, 2008-2025 (no 2020). No national-level recipes. No 2026 content |
| S5 | https://worldaeropresschampionship.com/pages/2026-national-championships | T1 | 2026-10-05 | 70+ national events listed with host, date, fee. US row: Atomic Coffee Roasters, 2026-08-21, $100. No coffees or winners listed |
| S6 | https://worldaeropresschampionship.com/pages/aac | T1 | 2026-10-05 | 2025 American AeroPress Championship page: city qualifiers (LA, Austin, Seattle, NYC) into a San Francisco final 2025-10-26; partner list includes Comandante and Third Wave Water |
| S7 | https://worldaeropresschampionship.com/pages/aac-competitor-information-and-registration | T1 (host-specific content: the 2025 US series was run by the WAC organisers) | 2026-10-05 | 2025 US competitor info: $99, 18 spots per qualifier, one qualifier per person, hand grinders only, one kettle, Third Wave Water provided (own allowed), Caravela green, per-city roasting partner, a 2-year US living-and-working requirement |
| S8 | https://atomicroastery.com/pages/aeropress-championship | T2 | 2026-10-05 | 2026 US Championship (Boston, 2026-08-21): 36 competitors / 12 heats, schedule, compulsory coffee, water policy, provided gear, podium |
| S9 | web.archive.org snapshots of S2 | T1-archived | 2026-10-05 | NOT REACHED - HTTP 429 on two attempts (and the fetch tool refuses the domain). Prior-season rules diff still open |

### Step 0 findings

**0.1 Official rules document - LOCATED.** S3, a Google Doc linked from S2. Title "Rules and Regulations of Competition"; last updated 2026-06-09; no version number beyond the date. Sections flagged as changed from last season: 2 Brewer Specifications, 4 Brewing Accessories and Tools, 5 Brewing Regulations, 10 Competition Time, 11 Regional and National Eligibility, 14 Conflict of Interest. The asterisk is per section, not per line, so WHICH line changed inside each section is not knowable from this document alone. Only the current season's rules are reachable on the live site; the prior-season text needs an archive copy (S9, blocked so far).

**0.2 Official recipes pages - LOCATED.** S4 carries World Final podiums only: full 1st-3rd for 2009-2019 and 2021-2025, 1st only for 2008, nothing for 2020. In-scope years 2022-2025 = 12 recipes, all present. FINDING: there is no official published source for national-level recipes, and none for 2026. US national podium recipes therefore have no T1 source; they will need T2 (host page) or T3 (competitor's own account).

**0.3 Tiers** - assigned in the source log above.

**0.4 Headline finding ahead of the ledger read-back:** the 2026 rules set the maximum dose at **20 g**, not 18 g (S3 section 5, read directly). Section 5 is asterisked as changed, and all 11 of the 12 podium recipes from 2022-2025 that state a full dose use exactly 18.0 g (the twelfth uses 16 g), which is consistent with an 18 g cap in earlier seasons. RESOLVED later the same sitting: the 2025 rules PDF (S10) and the Swiss 2024 rules (S11) both state 18 g, read directly. The cap rose from 18 g to 20 g for the 2026 season.

**0.4 Ledger read-back** - delivered to the operator in-session with preliminary verdicts and the question "anything first-hand that contradicts a seeded claim?". Operator reply: no contradiction offered; instead supplied a second agent's research memo (S12) answering the seven parallel questions. The memo was treated as a set of claims: its load-bearing sources (S10, S11, S13, S14, S15, S16 and all recipe pages) were re-read here; items taken from the memo without a re-read are tagged "memo-only" wherever they appear.

**0.5 Copyright** - all tables below are paraphrase; no rulebook or recipe text is pasted.

### Source log (continued)

| # | URL | Tier | Accessed | What it covered |
|---|---|---|---|---|
| S10 | https://elrespectivo.com/wp-content/uploads/2025/10/Rules-and-Regulations-of-Competition-2025.pdf | T2-hosted copy of the WAC 2025 rules (not T1-archived: it is a host mirror) | 2026-10-05 | 2025 rules, 14 sections, header notes the 2025 Flow Control additions. Read in full |
| S11 | https://swissaeropress.coffee/wp-content/uploads/2024/04/Rules-and-Regulations-of-Competition-2024.pdf | T2 (Swiss national version, dated 2024-04-01) | 2026-10-05 | 2024 rules with Swiss additions (max 4 per set; Swiss address). Read in full |
| S12 | Operator-supplied research memo "AeroPress competition research", 2026-10-05 (second agent) | T4 as a document; each claim inherits the tier of its underlying source once re-read | 2026-10-05 | Answers to the seven parallel questions; pointer to S10, S11, S13-S16 and memo-only sources |
| S13 | https://aeropress.com/blogs/blog/aeropress-championships-2025 | T2 (manufacturer / event partner), published 2025-10-31 | 2026-10-05 | 2025 US circuit: per-city coffees, winners, national-winning recipe |
| S14 | https://apaxlab.com/blogs/hall-of-fames/hall-of-fame-phillippe-akira-kato-2026-us-aeropress-champion | T3 (competitor's own account, hosted by a mineral supplier) | 2026-10-05 | 2026 US champion: water recipe, cooling routine |
| S15 | https://apaxlab.com/blogs/hall-of-fames/champions-choice-nemo-pop-2025-world-aeropress-champion | T3 (same caveat) | 2026-10-05 | 2025 world champion: water, time with the coffee, what he credits |
| S16 | https://brew.supply/wac-2025-recipe-analysis-report | T3 (run by the 2025 runner-up's project), updated 2026-09-21 | 2026-10-05 | 30-of-66 finalist recipe analysis for the 2025 World Final |
| S17 | Per-recipe pages on worldaeropresschampionship.com (`/pages/1st-nemo-pop-australia-2025`, `/pages/2nd-jan-ahrend-switzerland-2025`, `/pages/3rd-dharun-vyas-india-2025`, `/pages/1st-george-stanica-romania-2024`, `/pages/2nd-sophan-nugraha-indonesia-2024`) plus the S4 page body for the other seven | T1 | 2026-10-05 | All 12 podium recipes 2022-2025 read as page text, not through a summariser |
| S18 | https://worldaeropresschampionship.com/pages/2024-world-aeropress-championship-recap · `/pages/2025-world-aeropress-championship` · `/pages/wac23` | T1 | 2026-10-05 | World Final dates, cities, field sizes; 2025 practice-coffee timing |

Memo-only sources (cited by S12, NOT re-read here): AeroPress ambassador page for the 2023 US champion; AeroPress LinkedIn post and a podcast transcript for the 2024 US champion; brew.supply AeroBox pages; a Reddit post on the 2024 US coffee (T4 lead); the six-judges detail and the "same coffee for every competitor" wording on the Atomic page; the practice-bag detail on the 2025 US competitor page.

---

## D1. Rules sheet (baseline: 2026 rules, S3, updated 2026-06-09)

"New 2026" = absent from the 2025 text (S10). Verdict is CONFIRMED only on T1, or T2 for host-specific lines.

| Group | Rule | Plain-language statement | Source | Tier | Verdict | Applies to |
|---|---|---|---|---|---|---|
| Entry | Age | Any age may compete | S3 §11 | T1 | CONFIRMED | Regional / national |
| Entry | Citizenship | No passport, citizenship or permanent residence needed | S3 §11 | T1 | CONFIRMED | Regional / national |
| Entry | Residency (new 2026) | Must have lived in the country for the three months before the event, provable on request | S3 §11 | T1 | CONFIRMED | Regional / national |
| Entry | One title per season (new 2026) | A national champion cannot enter any further regional or national that season, in any country | S3 §11 | T1 | CONFIRMED | Regional / national |
| Entry | Host staff | Owners, leadership and operations staff of a hosting organisation cannot compete in its events; from 2026 also roaster-partner staff who physically handled the competition coffee | S3 §11, §14 | T1 | CONFIRMED | Regional / national |
| Entry | Amateur / pro | No amateur or professional restriction appears anywhere in the rules | S3 (silent) | T1 | CONFIRMED (by absence) | All |
| Entry | US 2026 | Single national event, Boston, 2026-08-21, 36 competitors in 12 heats, $100 | S8, S5 | T2, T1 | CONFIRMED | Host-specific |
| Entry | US 2025 | Four city qualifiers (18 spots each, $99) into a San Francisco final; one qualifier per person; host asked for two years living and working in the US plus a valid passport | S7, S6 | T1 (host-specific content) | CONFIRMED | Host-specific |
| Entry | World Final | National champion only; passes to 2nd then 3rd if the champion cannot travel; no further, no rollover. 2026 registration $99, 1 Sept to 1 Nov | S3 §12, S1 | T1 | CONFIRMED | Worlds |
| Format | Bracket | Multi-round elimination; two or more competitors brew at once; round winner advances | S3 §1 | T1 | CONFIRMED | All |
| Format | Heat size | Not fixed by the global rules. 2026 US used 36 competitors over 12 heats; Swiss 2024 capped a set at 4 | S3, S8, S11 | T1 / T2 | CONFIRMED (host-set) | Host-specific |
| Format | World Final field | 60 champions in 2024 (60 to 16 to 4), 66 in 2025, "sixty-odd" expected in 2026 | S18, S1 | T1 | CONFIRMED | Worlds |
| Time | Five minutes | Covers preparing, brewing and presenting. Coffee not presented in time is not evaluated | S3 §1, §5 | T1 | CONFIRMED | All |
| Time | Inside the clock | Any preheating or pre-chilling of brewer and vessels, grinding, the recipe, and pouring all brewed coffee into the judging vessel | S3 §10 | T1 | CONFIRMED | All |
| Time | Tasting (new 2026) | Competitors may taste their own coffee at any point in competition time | S3 §10 | T1 | CONFIRMED | All |
| Time | Interference (new 2026) | Anything that disrupts another competitor is prohibited: blowing chaff into their area, knocking a shared bench, encroaching on their space | S3 §10 | T1 | CONFIRMED | All |
| Dose / yield | Dose cap | Maximum 20 g of ground coffee per recipe (18 g in 2024 and 2025) | S3 §5; S10, S11 | T1; T2 | CONFIRMED | All |
| Dose / yield | Yield floor | Minimum 150 g of brewed coffee | S3 §5 | T1 | CONFIRMED | All |
| Dose / yield | Ingredients | Ground coffee and water only | S3 §5 | T1 | CONFIRMED | All |
| Dose / yield | Compulsory coffee | If the host specifies and provides a coffee, only that coffee may be used | S3 §5 | T1 | CONFIRMED | All |
| Brewer | Model | Genuine AeroPress Original or Clear only. Go, XL and Premium excluded | S3 §2 | T1 | CONFIRMED | All |
| Brewer | Count (new 2026) | One brewer only | S3 §2 | T1 | CONFIRMED | All |
| Brewer | Parts | Chamber, plunger and a cap must all be used | S3 §2 | T1 | CONFIRMED | All |
| Brewer | Flow Control cap | Genuine Flow Control Filter Cap allowed in place of the original cap; no aftermarket versions. Added in 2025; prohibited in the 2024 Swiss text | S3 §2; S10; S11 | T1; T2 | CONFIRMED | All |
| Brewer | Other devices | No other brewer in any part of the routine (press pots, pour-over, zero-bypass brewers, syphons) | S3 §2 | T1 | CONFIRMED | All |
| Filters | Type | Any brand or material (paper, metal, cloth) if taste-neutral; must sit inside the cap and be the main filter. No count limit is stated | S3 §3 | T1 | CONFIRMED | All |
| Accessories | Named list | Grinders, kettles, decanters, scales, stirrers, spoons, timers, thermometers, brewer stands, sifters, air blowers, RDT and WDT tools, chilling rocks, water dispersion aids | S3 §4 | T1 | CONFIRMED | All |
| Grinder | Own grinder | Allowed by default. Grinding must happen inside the five minutes | S3 §4, §9, §10 | T1 | CONFIRMED | All |
| Grinder | Compulsory equipment (new 2026) | A host may mandate a kettle, scale and/or grinder (those three items only) for sponsorship or operational reasons, with at least three hours of practice access beforehand; otherwise competitors may use their own | S3 §4 | T1 | CONFIRMED | All |
| Grinder | Worlds grinder | No grinder is named in the rules or on the 2026 competitor page. Not established for 2026 | S3, S1 | T1 | UNVERIFIED | Worlds |
| Grinder | US 2025 | Hand grinders only; one kettle | S7 | T1 (host-specific) | CONFIRMED | Host-specific |
| Water | Compulsory water | If the host specifies and provides water, only that water may be used | S3 §5 | T1 | CONFIRMED | All |
| Water | Own water | Otherwise own water is allowed; it must taste neutral; the Head Judge may taste and disallow it. No TDS number is set | S3 §6 | T1 | CONFIRMED | All |
| Water | Minerals in the cup (new 2026) | Adding minerals or concentrates as a separate substance during brewing or into brewed coffee is prohibited. Minerals are allowed only pre-dissolved in water that meets the water rules; applies to brew water, ice and bypass | S3 §5 | T1 | CONFIRMED | All |
| Water | Ice and bypass | Ice and bypass water of any temperature allowed, to the same standard as brew water | S3 §5, §6 | T1 | CONFIRMED | All |
| Water | US 2026 | Own water allowed, random on-site checks, sweeteners or tampering disqualify. Method and threshold not published | S8 | T2 | CONFIRMED (policy); UNVERIFIED (method) | Host-specific |
| Before the clock | Off stage | Preheat brew water, sort beans, weigh doses, assemble the brewer, place a dry filter in the cap | S3 §8 | T1 | CONFIRMED | All |
| Before the clock | Set-up on stage | A few minutes: plug in, place gear, heat kettle water. NOT allowed: rinsing the filter, preheating or pre-chilling brewer or vessels, loading the grinder or grinding | S3 §9 | T1 | CONFIRMED | All |
| Judging | Method | Blind cupping (spoon, slurp, spit) from identical vessels; names hidden under the cups | S3 §1, §7 | T1 | CONFIRMED | All |
| Judging | Decision | No scoresheet, no discussion; judges point at once on a count of three; the MC lifts the winning cup | S3 §7 | T1 | CONFIRMED | All |
| Judging | Tie | If every judge points at a different cup, the pre-named Head Judge tastes all and decides; final | S3 §7 | T1 | CONFIRMED | All |
| Judging | Panel size | Not stated in the rules | S3 (silent) | T1 | UNVERIFIED | All |
| Judging | Serving temperature | No rule | S3 (silent) | T1 | CONFIRMED (by absence) | All |
| Disqualification | Listed grounds | Late presentation is simply not evaluated. No general disqualification list exists; ineligibility is decided by the organisers and is final | S3 §5, §14 | T1 | CONFIRMED | All |
| Host vs competitor | US 2026 | Host provided kettle, scale, bulk grinder and cupping bowls; competitors brought brewer and filters; hand grinder optional | S8 | T2 | CONFIRMED | Host-specific |
| Host vs competitor | US 2025 | Host water provided (own allowed); grinder demo units sold on the day | S7 | T1 (host-specific) | CONFIRMED | Host-specific |
| Worlds 2026 | Schedule | Coffee revealed at the welcome event Fri 4 Dec; Sat 5 Dec free with the coffee in hand; competition Sun 6 Dec 10:00-17:00, Frontón Bucareli | S1 | T1 | CONFIRMED | Worlds |
| Worlds 2026 | Late additions | The organisers say extra requirements or workflows may be added closer to the event | S1 | T1 | CONFIRMED | Worlds |
| Disputes | Route | Regional and national issues go to the host; unresolved or Worlds issues go to hello@aero.press by email | S3 §15 | T1 | CONFIRMED | All |

**2025 to 2026 rule changes (S10 against S3, both read directly):** one brewer only · dose cap 18 g to 20 g · compulsory-equipment clause (kettle, scale, grinder; three hours' access) · separate mineral additions banned · interference ban and tasting permission · three-month residency · national winners barred from further entry that season · new conflict-of-interest section. Unchanged: five minutes, 150 g floor, filter rules, the accessory list (sifters and chilling rocks were already named), water neutrality, judging, set-up prohibitions.

## D2. Rulings needed

Official contact route for every OPEN item: email hello@aero.press for World Final questions; the national host for a national event. No message has been sent.

| # | Question | Answer | Source | Status |
|---|---|---|---|---|
| 1 | Mineral drops in the finished cup | Prohibited. Minerals added as a separate substance during brewing or into the brewed coffee count as an ingredient. Minerals pre-dissolved in the brew or bypass water are allowed where own water is allowed. The office practice of dosing concentrate into the finished cup is not competition-legal | S3 §5 | ANSWERED |
| 2 | Self-built brew water | Never permitted when the host specifies and provides water. Otherwise permitted; the test is "tastes neutral", judged by the Head Judge by taste; no TDS figure. Podium recipes from 2023-2025 show different competitors using different waters in the same final, so own water was in use at those World Finals. Whether 2026 Worlds or a 2027 US host supplies compulsory water is not published | S3 §5, §6; S17 | ANSWERED (rule); OPEN (2026 Worlds and 2027 host choice) |
| 3 | Bypass water | Any temperature; ice allowed; same neutrality standard. It must be in the judging vessel inside the five minutes. The rule says 150 g of "brewed coffee" and does not say whether bypass counts. Published official podium recipes reach about 150 g only after dilution (66 g to 152 g in 2025; 58-64 g to 150 g in 2022), so in practice it counts. Whether brew and bypass water may carry different mineral content is not addressed; the 2024 champion used about 85-90 ppm brew water and 0 ppm dilution water | S3 §5, §6; S17 | ANSWERED (temperature, timing); practice-supported, not written (150 g counting); OPEN (different profiles) |
| 4 | Cooling tools | Chilling rocks are a named permitted accessory. Pre-chilling the brewer or vessels is banned before the clock and allowed inside it. The rules do not say whether a chilling ball frozen beforehand counts as a pre-chilled vessel or as an accessory. Documented use: the 2022 champion's recipe lists chilled balls as optional; 2025 3rd place and the 2026 US champion cooled by swirling the carafe for about 30 seconds; 2025 2nd place cooled to about 54°C by an unstated method. No named chilling-ball product found in any podium recipe | S3 §4, §9, §10; S17; S14 | ANSWERED (tool is legal); OPEN (pre-frozen ball before the clock) |
| 5 | Sieving | Sifters are a named permitted accessory. Grinding must be inside the clock, so sieving is too. The cap is on "ground coffee in each recipe"; before or after sieving is not addressed. Two podium recipes sift (2025 1st at 200 µm; 2022 1st removing 100-200 µm fines), both listing an 18 g dose without saying when it was weighed | S3 §4, §5, §10; S17 | ANSWERED (legal, inside the clock); OPEN (cap before or after sieving) |
| 6 | Second pass through the spent bed | The rules are silent. Evidence only: the 2023 3rd-place recipe on the official page presses a first infusion, then refills the same bed with cooler water and presses again. That was under 2023 rules, which were not recovered | S3 (silent); S17 | OPEN (with a published precedent) |
| 7 | Filters | Any material or brand, taste-neutral, inside the cap; no count limit stated; third-party papers and cloth appear in podium recipes. Rinsing is banned in set-up and allowed inside the clock; a dry filter may be placed in the cap beforehand | S3 §3, §8, §9; S17 | ANSWERED |
| 8 | Preheating | Brewer and vessels: inside the clock only. Brew water: may be heated before | S3 §8, §9, §10 | ANSWERED |
| 9 | Multiple entries | The global rules do not address entering more than one regional. They bar a national champion from further entry that season. The 2025 US series limited each person to one qualifier | S3 §11; S7 | ANSWERED for 2025 US; OPEN for a 2027 host |

## D3. Podium recipe corpus (World Final 2022-2025; US national final where published)

All World Final rows: source S17 / S4, tier T1, read as page text. A dash means the source does not state it. "ml" is kept where the source uses ml.

| Year | Event | Pl. | Competitor | Country | Coffee | Orient. | Dose g | Grinder + setting | Chamber water + temp | Agitation | Steep | Press | Concentrate | Bypass stages | Final beverage | Filter | Water | Served temp |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2025 | World Final | 1 | Némo Pop | Australia | Ecuador, Finca La Carolina, washed Sidra | Upright | 18 | Comandante Trailmaster x25, 31 clicks, sifted at 200 µm, chaff blown | 100 g at 84°C | Patterned stir at 0:25 | Press starts 0:50 | About 20 s, gentle | - | 70 g at 50°C, poured into the carafe first | - | Flow Control cap, 2 paper | 125 ppm, Apax prototype | - |
| 2025 | World Final | 2 | Jan Ahrend | Switzerland | same | Inverted | 18 | Comandante C40 Mk4, 24 clicks, chaff removed | 100 g at 88°C | 5 stirs | Flip at 1:30 | 1.0-2.0 g/s until 66 g out | 66 g | Dilute to 152 g (temperature not stated) | 152 g | 2 standard paper, rinsed | About 60 ppm, Apax drops in distilled | About 54°C |
| 2025 | World Final | 3 | Dharun Vyas | India | same | Inverted | 16 (16.5 into grinder) | Comandante C40 Red Clix, 52 clicks | Pour to 65 ml, then to 208 ml, at 88°C | Spiral pours; 4-5 hard swirls after flip | 20 s, then 10 s before capping, 10 s settle | Over 1:00, steady | - | 12 ml room temp (87 ppm) | - | Flow Control cap, 1 classic paper | Distilled + mineral concentrate to 87 ppm | - (swirls and blows about 0:30) |
| 2024 | World Final | 1 | George Stanica | Romania | Ethiopia Guji, Arsosala, washed heirloom | Inverted | 18 | Comandante C40 Mk4 Red Clix, 58 clicks (870 µm) | 50 g + 50 g at 96°C through a dispersion tool | Light patterned stir 10 s | 30 s bloom; cap at 1:20; press at 1:35 | 30-40 s, gentle | 76-79 g | Warm kettle water to 130-135 g, then 20-30 g room-temp 0 ppm | - | 1 Aesir, rinsed | Aquacode diluted to about 85-90 ppm | - |
| 2024 | World Final | 2 | Sophan Nugraha | Indonesia | same | Inverted | 18 | Comandante C40 (nitro blade), 22 clicks | 60 ml room temp, then 95°C to 190 ml | 8 stirs | Second pour at 0:40; flip 1:30 | 1:30-2:00 | - | 10 ml room temp | - | 2 Cafec light-roast papers cut to fit, rinsed | Bottled spring water (Caldas de Penacova) | - |
| 2024 | World Final | 3 | Jamika Mahmoud | Egypt | same | Inverted | 18 | Comandante Mk4, 900 µm | 50 ml at 80°C, then 100 ml at 75°C | 5 circular stirs; 20 more after capping | 1:00 bloom; flip 1:30 | 30 s, slow | - | 30 ml room temp | - | 2 paper, rinsed | Third Wave Water light-roast profile | - |
| 2023 | World Final | 1 | Tay Wipvasutt | Thailand | Kenya AB, Karindundu, Nyeri, washed | Inverted | 18 (16, plus 2 at 0:45) | 1Zpresso ZP6, 65 clicks | 100 g at 89°C | 5 s stir at 0:30 and at 0:55 | Flip and press at 1:35 | About 30 s | About 75 g | Room temp to 115 g, then hot to about 155 g | About 155 g | 1 paper, rinsed | Perfect Coffee Water at 81.5% strength | - |
| 2023 | World Final | 2 | Carlo Graf Bülow | Germany | same | Inverted | 18 | Comandante C40, 32 clicks | 50 g bloom, then to 160 g, at 100°C | 32 fast stirs at 0:15 | Cap 1:00; flip 1:25 | 1:35-1:50 | 135 g | Room temp to 150 g | 150 g | 2 classic paper, rinsed | Lotus drops recipe | "Pleasant temperature" (poured between two servers 10 times) |
| 2023 | World Final | 3 | Leon Zhang | China | same | Upright | 18 | Comandante C40, 27 clicks | 100 g at 93°C, pressed out; then 135 g at 75°C on the same bed | 15 rounds; then 5 turns | 45 s; second soak to 1:40 | 5 s; then steady | - | None stated | - | 1 cotton + 1 linen | - | - |
| 2022 | World Final | 1 | Jibbi Little | Australia | Colombia, Finca Juan Martin, natural Striped Red Bourbon | Inverted | 18.0 | Two grinders (Timemore coarse, then Kinu setting 4); fines of 100-200 µm sifted out | 94 ml at 90°C (150 ml total listed) | 35 gentle stirs | Cap 1:20; flip 1:30 | 1:40-2:10 | 58-64 g | 90°C water to 150 g | 150 g | 1 AeroPress paper, rinsed | Perfect Coffee Water | - (chilled balls listed as optional) |
| 2022 | World Final | 2 | Simon Derutter | Belgium | same | Upright | 18.0 | Comandante, 23 clicks | 140 ml at 85°C | 3 stirs | To 1:15 | 30 s | About 110 ml | Water to 156 ml total | 156 ml | 1 Aesir, dry | Perfect Coffee Water | - |
| 2022 | World Final | 3 | Jennifer Rui Ping Ho | Singapore | same | Inverted | 18.0 | Comandante, 30 clicks | 100 ml + 100 ml at 84°C | Gentle stirs | 30 s bloom; flip 1:30 | 30 s | - | None stated | - | 1 AeroPress paper, dry | Perfect Coffee Water | - ("aerate and serve") |
| 2025 | US final (San Francisco) | 1 | Jeff Rambo | USA | Ecuador, Alambi, Pichincha, washed Sidra | Inverted | 15 | Comandante C40 Mk4, 24 clicks | 50 g, then to 180 g, at 90.5°C | Agitate after first pour | 30 s; flip listed at 1:20-1:30 | Source says press begins just under 1:00, which conflicts with the flip time | - | 30 g, poured into the carafe first | - | 2 Sibarist FAST, rinsed | Lotus, about 114 ppm | - |
| 2026 | US final (Boston) | 1 | Phillippe Akira Kato | USA | Ethiopia Ayla Bombe, washed | - | - | - | - | - | - | - | - | - | - | - | Apax drops per 250 ml (3 / 2 / 1 / 2 of four concentrates), set two hours before the event | - (30 s carafe swirl to cool) |

US rows: 2025 source S13 (T2); 2026 source S14 (T3, partial). US 2nd and 3rd place recipes for 2025 and 2026, and all 2023 and 2024 US recipes: not recovered. 2026 US podium names (S8, T2): 1 Phillippe Akira Kato, 2 Pack Katisomsakul, 3 Justin Enis.

Coverage: World Final 12 / 12 recipes for 2022-2025. US national final 1 full + 1 partial recipe out of 12 podium places across 2023-2026.

## D4. Compulsory-coffee census (World Finals + US events, 2023-2026; 2022 World Final included because D3 covers it)

| Year | Event | Coffee | Origin | Variety | Process | Roaster | Roast level | Same coffee all rounds? | Source | Tier |
|---|---|---|---|---|---|---|---|---|---|---|
| 2022 | World Final | Finca Juan Martin | Colombia | Striped Red Bourbon | Natural | Quietly Coffee | - | All three podium recipes name it | S4 | T1 |
| 2023 | World Final (Melbourne, 1-2 Dec) | Karindundu AB | Nyeri, Kenya | - | Washed | Fieldwork Coffee | - | All three podium recipes name it | S4, S18 | T1 |
| 2024 | World Final (Lisbon, 19-21 Sep) | Arsosala washing station | Guji, Ethiopia | Ethiopian heirloom | Washed | Olisipo Coffee | - | All three podium recipes name it | S17, S18 | T1 |
| 2025 | World Final (Seoul, 5-6 Dec) | Finca La Carolina, Fausto Romo | Ecuador | Sidra | Washed | Stereoscope Coffee | - | All three podium recipes name it | S17, S18 | T1 |
| 2026 | World Final (Mexico City, 6 Dec) | Not yet revealed (reveal 4 Dec) | | | | | | | S1 | T1 |
| 2023 | US national | Not recovered | | | | | | | - | - |
| 2024 | US national | Not recovered (one unverified forum lead, memo-only: an anaerobic natural from Brazil) | | | | | | | S12 | T4 |
| 2025 | US qualifier, Los Angeles (21 Sep) | Las Nubes | Jinotega, Nicaragua | Caturra, Catuai, Bourbon | Natural | Stereoscope | - | - | S13 | T2 |
| 2025 | US qualifier, Austin (28 Sep) | Melao | Huila, Colombia | Pink Bourbon | Washed | Black Fox | - | - | S13 | T2 |
| 2025 | US qualifier, Seattle | Altos de Saraguallas | Loja, Ecuador | Sidra | Washed | Caffe Vita | - | - | S13 | T2 |
| 2025 | US qualifier, New York | Marco Morocho | Ecuador | Bourbon | Washed | Sey | - | - | S13 | T2 |
| 2025 | US final, San Francisco (26 Oct) | Alambi | Pichincha, Ecuador | Sidra | Washed | Equator per the S7 partner list (S13's recipe block names a different entity; roaster for this row rests on S7) | - | - | S13, S7 | T2 |
| 2026 | US national, Boston (21 Aug) | Ayla Bombe | Sidamo, Ethiopia (1,950-2,000 m) | Heirloom | Washed | Atomic Coffee Roasters | - | Host lists a single compulsory coffee | S8 | T2 |

Coverage: World Finals 4 / 4 held events in 2022-2025 (2026 not yet held). US events 6 / 8 known for 2023-2026 (all five 2025 events and 2026 found; the 2023 and 2024 nationals not recovered, and their format and any regionals were not established). Roast level is stated for 0 of 10 named coffees.

## D5. Patterns (observations only; counts are from the 12 World Final recipes unless stated)

**Architecture**
- Observation: 10 of 12 recipes add bypass water; 2 state none (2023 3rd, 2022 3rd).
- Observation: 5 of 12 are large-dilution recipes (concentrate stated at 79 g or less, or 70 g of bypass): all four champions 2022-2025 plus the 2025 runner-up. Five more press most of the volume and trim with 10 to about 46 g. 
- Observation: champion chamber water is 94-100 g for 18 g in all four years (about 1:5.2 to 1:5.6). Stated champion concentrates: 58-64 g, about 75 g, 76-79 g (3 of 4; the 2025 champion states none).
- Observation: stated final beverage is 150-156 in 5 of 12 recipes; the other 7 do not state one. Stated strength appears twice: TDS 1.3-1.35 (2022 1st) and about 1.45% (2023 3rd).
- Observation: dose is 18 g in 11 of 12 and 16 g in 1. All were brewed under an 18 g cap; none tells us what a 20 g cap changes.
- Observation: 9 inverted, 3 upright. Both 2025 Flow Control users include the champion (upright) and 3rd place (inverted).
- Observation: grinder is a Comandante in 10 of 12. The 2023 and 2022 champions are the two exceptions. In the 30-recipe 2025 finalist analysis (S16, T3) it is 30 of 30.
- Observation: sifting appears in 2 of 12, both champions (2022, 2025). Chaff removal is stated in 2 (both 2025).

**Temperature**
- Observation: brew water spans 75-100°C across the 12; the four champions used 90, 89, 96 and 84°C.
- Observation: 7 of 12 add room-temperature or cooler-than-brew dilution water (the 2025 champion at 50°C; six others at room temperature). One champion (2022) dilutes with 90°C water; one (2023) uses room temperature first, then hot.
- Observation: one recipe of 12 states a serving temperature (about 54°C, 2025 2nd). Three more describe an active cooling step without a number (carafe swirl and blowing; pouring between servers; "aerate"). S16 reports cooling documented in 12 of 22 of the 2025 finalist recipes it could assess (T3).

**Water**
- Observation: 4 of 12 state a mineral figure: about 60, 87, about 85-90 and 125 ppm. S16 reports 48-125 ppm, median 87, across 13 finalist recipes (T3).
- Observation: 2025 1st and 2nd brewed the same coffee at 125 and about 60 ppm. The champion's own interview says about 120 ppm (S15); both figures are kept. This does not show water decided the result.
- Observation: within each of 2023, 2024 and 2025 the three podium recipes use different waters, so competitors were choosing their own. In 2022 all three name the same product; whether that was compulsory is not established.

**Coffee profile (10 named coffees in D4)**
- Observation: 8 of 10 washed, 2 natural. No anaerobic or co-fermented coffee appears.
- Observation: origins are Ecuador 4, Ethiopia 2, Colombia 2, Kenya 1, Nicaragua 1. Sidra appears 3 times (all 2025).
- Observation: roast level is never stated.

**What champions name as the deciding move**
- 2025 champion (S15, T3, supplier-hosted): a simple recipe, nothing changed at the last minute, everything organised in advance, and his water work. He reports 12 hours with the coffee.
- 2026 US champion (S14, T3, supplier-hosted): an enjoyable recipe, systematic variable testing, and fixing the water recipe two hours before the event.
- 2024 champion (S17, T1): says the method was tailored to that coffee and roast.
- No source isolates a single deciding move by experiment.

## D6. Mexico City capture sheet (World Final, Sun 6 Dec 2026, Frontón Bucareli, 10:00-17:00)

Built from what the published sources could not close. Tick, time, or note.

**Coffee and water**
- [ ] Compulsory coffee: name, origin, variety, process, roaster. Roast look (colour, any roast date on the bag).
- [ ] When it was handed over and how much each competitor got. Same lot in every round?
- [ ] Is there a compulsory water? If not, what waters are on stations (bottles, mineral kits, labelled jugs)?
- [ ] Any water check by a judge (taste, meter)? When?
- [ ] Separate brew and bypass waters on a station?

**Station and set-up**
- [ ] Compulsory kettle, scale, grinder: which models? Anyone using their own?
- [ ] What is staged before the clock: pre-weighed doses, dry filter in cap, water in kettle, bypass water pre-measured?
- [ ] Length of the set-up window before "go".
- [ ] Brewer: Original or Clear; original cap or Flow Control cap (count each).

**Inside the five minutes**
- [ ] Time to finish grinding. Hand-grind speed; anyone visibly struggling with the dose.
- [ ] Sieving: who sifts, with what, how long it takes, what happens to the fines. Any weighing after sifting?
- [ ] Dose seen on scales (18 g or up toward 20 g?).
- [ ] Filter rinse: done inside the clock? With what water?
- [ ] Preheating or pre-chilling of brewer or carafe inside the clock.
- [ ] Press: stand or press aid in use; press duration; stop before the hiss?
- [ ] Any second fill or second press of the same bed. Any judge or steward reaction.
- [ ] Total elapsed time at hand-over (how much of the five minutes is used).

**Dilution and cooling**
- [ ] Bypass poured before the brew or after? Hot, room temperature, chilled, ice?
- [ ] Number of dilution steps.
- [ ] Cooling moves: carafe swirl, pouring between servers, blowing, chilling balls or rocks (were they out before the clock?), chilled vessels.
- [ ] Anyone checking beverage temperature (thermometer, by hand) before pouring.
- [ ] Anyone tasting and adjusting before pouring.

**Judging**
- [ ] Competitors per heat. Judges per heat. Is the Head Judge one of them?
- [ ] Serving vessel type and fill level.
- [ ] Time from the last cup landing to the first slurp. Order of tasting.
- [ ] How many passes each judge makes; whether they return as the cups cool.
- [ ] Time from first slurp to the point. Split decisions and how they were settled.

**Between rounds**
- [ ] Fresh practice brews allowed between rounds? Where?
- [ ] Do advancing competitors change grind, water or recipe?
- [ ] Gap between a competitor's rounds.

**Ask if the chance arises (official answers only count in writing)**
- [ ] Is the dose cap measured before or after sieving?
- [ ] Is a second pass of water through the pressed bed allowed?
- [ ] May a chilling ball come out of a freezer before the clock?
- [ ] May brew water and bypass water have different mineral content?
- [ ] Will the 2027 rules keep 20 g?

---

## Claims ledger verdicts

| Claim | Verdict | Basis |
|---|---|---|
| A1 champions 2022-2025 share one architecture | CORRECTED | All four dose 18 g, use 94-100 g chamber water, press about 20-40 s and bypass. They differ in orientation (one upright with a Flow Control cap), steep (0:50 to 1:40), grind approach, and final weight (two state about 150-155 g; none states 160-170 g). Concentrate is 58-79 g where stated (3 of 4). "Coarse" is not checkable across four different grinders. S17, T1 |
| A2 press speed 1-2 g/s is the 2025 champion's control | CORRECTED | The 1-2 g/s figure is the 2025 runner-up's. The champion states a gentle press of about 20 s. S17, T1 |
| A3 every recent champion bypasses | CONFIRMED | True for the four first places 2022-2025. Not true of every podium recipe (10 of 12). S17, T1 |
| B1 entry terms | CORRECTED | No citizenship or amateur/pro bar: confirmed. But a three-month residency rule applies from 2026 (S3), and the 2025 US series required two years living and working in the US (S7). 2026 US: 36 competitors, $100, one event in Boston: confirmed (S8, S5). 2025 US: four qualifiers into a San Francisco final: confirmed (S6, S7). "First-come sign-up" not verified for 2026 |
| B2 five minutes, 18 g, 150 g, coffee and water only | CORRECTED | Dose cap is 20 g for 2026 (18 g in 2024-2025). The rest is confirmed. S3, S10, S11 |
| B3 compulsory coffee and water; own water if neutral | CONFIRMED | S3 §5, §6 |
| B4 Original or Clear only; Flow Control cap permitted | CONFIRMED | S3 §2. The cap has been permitted since 2025, not newly in 2026 (S10) |
| B5 judging | CORRECTED | Blind, count of three, no scoresheet, elimination: confirmed. "Three judges" and "majority advances" are not in the rules. The Head Judge decides only when every judge points at a different cup. S3 §7 |
| B6 bring own gear; Comandante compulsory at Worlds | CORRECTED (first half); UNVERIFIABLE from published sources (second half) | Hosts may mandate kettle, scale and grinder from 2026, and the 2026 US host supplied kettle, scale and a bulk grinder. No rule names a grinder for Worlds. It was not required in 2022 or 2023 (champions used other brands). 2026 not published |
| B7 grind inside the clock; no rinsing or preheating in set-up | CONFIRMED | S3 §9, §10 |
| B8 practice window before round 1; re-dial between rounds | CONFIRMED (2026 US schedule, T2); UNVERIFIABLE (re-dialling between rounds) | S8. For Worlds 2026 the coffee is in hand a full day before (S1) |
| B9 season pattern and 2027 projection | CONFIRMED as a 2026 pattern in part; UNVERIFIABLE as a projection | 2026 nationals listed May to October (sampled, not all 70+ read); US events ran Aug-Oct in 2025 and 2026; World Finals were early December in 2023 and 2025 but September in 2024. S5, S18 |
| B10 staged dilution, cooler finish, about 54°C | CONFIRMED as separate facts | Staged dilution: 2023 and 2024 champions. A room-temperature final addition: 2024 champion and five others. About 54°C: 2025 runner-up only. No single recipe combines all three. S17 |
| B11 2025 first and second, same coffee, about 125 vs about 60 ppm | CONFIRMED | S17, T1. The champion's interview gives about 120 ppm (S15) |

Also confirmed along the way: the AeroPress Premium is not competition-legal (S3 §2), so the Original purchase was needed.

## Notes / friction / lessons / audit items (Sitting 1)

**Friction**
- F1. The fetch tool's summariser misread recipe numbers on two podium recipes (it turned cumulative pour targets into separate pours and misplaced a press time). Every D3 row was redone from page text through the browser.
- F2. The Wayback Machine was unreachable (fetch tool refuses the domain; browser got HTTP 429 twice). Prior-season rules were recovered instead from national hosts' own sites.
- F3. The fetch tool cannot parse PDFs but saves them; reading the saved file worked.
- F4. The rules mark changes per section, not per line, so the diff needed a prior-season copy.
- F5. The protocol's verdict vocabulary differs between D1 (two values) and the ledger (three values); mixed claims needed split verdicts.
- F6. A second agent's memo arrived mid-Step-0. Its tiering differed slightly from this protocol's; its sources were re-read rather than its tiers adopted.

**Lessons (provisional numbering)**
- RP10-T1-N1. Desk analog of "a transcription is a claim": a summariser's reading of a recipe is itself a transcription. Corpus rows need the page text.
- RP10-T1-N2. Competition rules are season-versioned and national hosts mirror them; a host's copy is the practical archive when the organiser overwrites a single live document.
- RP10-T1-N3. Podium recipes are evidence of what was done and tolerated, not of what the rules permit; each use (sieving, double infusion, 0 ppm bypass) sits under that year's rules.

**Audit items**
- RP10-T1-AI-1. Re-read the rules document when the 2027 season opens (the 2026 revision is dated 9 June). The 20 g cap is one season old.
- RP10-T1-AI-2. Office cup-dosing of mineral concentrate is not competition-legal; any water track must dose the brew and bypass water instead.
- RP10-T1-AI-3. Track 2 was scoped as "scaled to 18 g". The cap is now 20 g. Coordinator decision.
- RP10-T1-AI-4. No authenticated 2023 or 2022 global rulebook was recovered; the 2024 text is a Swiss national version.
- RP10-T1-AI-5. Memo-only sources (listed under the source log) were not re-read.
- RP10-T1-AI-6. Possible evidence for grilling-queue item 58 and the concentrate canon: all four champions use a large-dilution shape. Noted only; nothing resolved here.


---

## HANDOFF BRIEF FOR COMPILE SESSION (RP10 Track 1 - WAC Rules + Champion Corpus Close-Out)

**Date:** 2026-10-05
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/wac-prep-t1-rules-corpus-13be95`, pushed to origin; commit SHA is reported in the session's closing message and is the branch head (the archive doc is committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** MIXED - the seeded claims were about half right. 6 of 14 confirmed (one only as separate facts), 5 corrected, 3 split or unverifiable. The largest correction changes the project's arithmetic: the dose cap is 20 g, not 18 g.

This brief closes the desk track. Everything it cites lives above in this doc (D1-D6, the ledger verdicts, the source log). The Coordinator can lift the constraints block and the rulings table directly into the Track 2 protocol.

### TL;DR

- The 2026 rules (updated 2026-06-09) cap the dose at **20 g**. It was 18 g in 2024 and 2025. The 150 g floor and five-minute clock are unchanged.
- **Mineral concentrate added to the cup or during brewing is banned** from 2026. Minerals must be pre-dissolved in the water. Office cup-dosing is not legal in competition.
- Sifters and chilling rocks are named, permitted accessories. Bypass and ice at any temperature are permitted.
- The brewer rule is confirmed: one genuine Original or Clear, original or genuine Flow Control cap. The Premium is out.
- All 12 World Final podium recipes for 2022-2025 are captured. The four champions all use 18 g, 94-100 g chamber water and a large dilution; the wider podium does not.
- Four rulings stay OPEN: dose cap before or after sieving, a second pass through the spent bed, a pre-frozen chilling ball before the clock, and different mineral content in brew and bypass water.
- The 2026 World Final gives competitors the coffee about a day and a half ahead (reveal Fri 4 Dec, compete Sun 6 Dec).

### Execution summary

One sitting, 2026-10-05. 18 logged sources plus a second agent's memo supplied by the operator mid-Step-0. The rules document, the 2025 and 2024 prior-season rule PDFs and all 12 podium recipes were read as source text. The protocol held with two divergences: Wayback was unreachable, so prior seasons came from national hosts' mirrors (tiered T2, not T1-archived); and the operator's Step 0.4 reply took the form of the memo, whose load-bearing sources were re-read and whose remaining claims are tagged memo-only.

### Equipment / conditions

| Item | Condition |
|---|---|
| Track shape | Desk only; nothing brewed |
| Rules baseline | 2026 "Rules and Regulations of Competition", updated 2026-06-09 (S3) |
| Prior seasons | 2025 host-mirrored PDF (S10); 2024 Swiss national version (S11); 2023 and 2022 not recovered |
| Recipe source | Official recipes page and per-recipe pages, read as page text (S4, S17) |
| Operator rulings | Recorded at the top of the Session Record |

### Per-pull / per-measurement raw data

The raw data is the body of this doc: source log (S1-S18), D1 (rules, 48 lines), D3 (14 recipe rows), D4 (13 census rows). Nothing is summarised away here.

### Analysis

See D5 (patterns with row counts) and the claims ledger verdicts table.

### Final output

**Constraints block for Track 2 (inherit verbatim; valid for the 2026 rules only):**

| Constraint | Value | Source |
|---|---|---|
| Clock | 5:00 for everything: any preheat or pre-chill, grind, brew, dilute, pour into the judging vessel | S3 §1, §10 |
| Dose cap | 20 g ground coffee per recipe (18 g in 2024-2025) | S3 §5 |
| Yield floor | 150 g brewed coffee; bypass counts in practice (unwritten) | S3 §5; D2 #3 |
| Ingredients | Ground coffee and water only; no separate mineral additions during or after brewing | S3 §5 |
| Brewer | One genuine AeroPress Original or Clear; chamber, plunger and cap all used | S3 §2 |
| Cap | Original cap or genuine Flow Control Filter Cap | S3 §2 |
| Filters | Any material or brand, taste-neutral, inside the cap; no count limit | S3 §3 |
| Before the clock | Allowed: heat kettle water, weigh doses, assemble brewer, dry filter in cap. Not allowed: rinse filter, preheat or pre-chill brewer or vessels, load grinder, grind | S3 §8, §9 |
| Accessories | Sifter, chilling rocks, stirrers, stands, thermometers, dispersion aids, RDT/WDT, air blower all permitted | S3 §4 |
| Water | Host water if provided, otherwise own neutral-tasting water; same standard for bypass and ice | S3 §5, §6 |
| Host equipment | Host may mandate kettle, scale and grinder with three hours' prior access | S3 §4 |
| Coffee | Host's compulsory coffee when provided | S3 §5 |

**Rulings table:**

| Question | Answer | Confidence | Gates |
|---|---|---|---|
| 1 Mineral drops in the cup | Prohibited; pre-dissolved in water only | High (written rule) | T5, T3 |
| 2 Self-built water | Allowed unless the host supplies water; taste-neutral test by the Head Judge; no TDS figure | High on the rule; unknown for a 2027 host | T5 |
| 3 Bypass water | Any temperature, ice allowed; counts toward 150 g in practice; mixed mineral profiles unaddressed | High / medium / open | T3, T5 |
| 4 Cooling tools | Chilling rocks legal; vessels pre-chilled inside the clock only; pre-frozen ball before the clock unaddressed | High / open | T4 |
| 5 Sieving | Legal, inside the clock; cap before or after sieving unaddressed | High / open | T6 |
| 6 Second pass through the bed | Rules silent; one 2023 podium precedent | Open | T3 |
| 7 Filters | Any material, no count limit, rinse inside the clock only | High | T2 |
| 8 Preheating | Brewer and vessels inside the clock only | High | T2, T4 |
| 9 Multiple entries | Not in the global rules; 2025 US allowed one qualifier | Host-dependent | Phase 2 |

### Key findings

1. **Dose cap is 20 g.** S3 against S10 and S11, all read directly. Every corpus recipe was brewed under 18 g, so the corpus says nothing about 20 g. Implication: Track 2's "scaled to 18 g" premise needs a Coordinator decision.
2. **Cup-dosing minerals is banned (new 2026).** Implication: any water work must dose the water, and brew and bypass water need a deliberate choice.
3. **The tools tracks 4 and 6 depend on are legal.** Chilling rocks and sifters are named accessories; both must be used inside the clock where they touch vessels or grounds.
4. **Champions converge more than podiums do.** 4 of 4 champions use 94-100 g chamber water on 18 g with a large dilution; only 5 of 12 podium recipes do. Observation, not advice.
5. **Cooling is common and mostly unmeasured.** 7 of 12 use cooler dilution water; 1 of 12 states a serving temperature.
6. **Water varies widely on the same coffee.** Stated 60-125 ppm; 2025 first and second sit at the two ends.
7. **Compulsory coffees are clean.** 8 of 10 washed, 2 natural, none anaerobic; roast level never published.
8. **Hosts differ.** The 2025 US series added hand-grinders-only and a two-year US requirement; the 2026 US host supplied a kettle, scale and bulk grinder. A 2027 host can differ again.
9. **Time with the coffee is longer at Worlds than at a US national.** Worlds 2026: about a day and a half. US 2026: a one-hour check-in and practice window.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session - the compile session integrates substrate.

1. **Candidate: WAC reference doc in the WBC Brewing Archivist cluster (SPECIFIED, not applied; Coordinator and operator decide).** Option A: a new file `docs/skills/wbc-brewing-archivist/cluster/wac-reference.md` holding D1 (rules sheet with its season stamp), D3 and D4, with D5 kept out (observations belong to the project). Option B: leave everything in this protocol doc until the December addendum, then fold once. Option B avoids folding a corpus that will gain the 2026 podium within two months.
2. **If Option A is chosen, MCP registration involves:** an entry in `lib/mcp/docs.ts` `DOC_FILES`; confirming the path is covered by `next.config.js` `outputFileTracingIncludes` via `npm run check:mcp-bundle`; a catalog line in `docs/skills/coordinator/catalog.md`; and `npm run check:doc-sizes` for the cluster. No new Tool is needed.
3. **Memory note (operator-side substrate):** `project_office_water_apax_dosing.md` describes cup-dosing as the locked office practice. A one-line caveat that it is not competition-legal under the 2026 rules would stop it being assumed in RP10 tracks. Specified only.
4. **RP8 T5 "Championship prior art" paragraph:** claims A1 and A2 are corrected above. If that paragraph is cited again, cite this doc's ledger instead. No edit to the RP8 doc is proposed.
5. **No registry, ADR, canon or grilling-queue edits are proposed.** Item 58 evidence is noted at RP10-T1-AI-6 only.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP10-T1-N1 | A summariser's reading of a recipe is a transcription; corpus rows need the page text | Desk-track protocols should require source-text reads for any numeric row |
| RP10-T1-N2 | When an organiser overwrites one live rules document, national hosts' mirrors are the archive | Add "host mirrors" to the Step 0 source inventory for desk tracks |
| RP10-T1-N3 | Published recipes show what was done under that year's rules, not what today's rules permit | Keep rule lines and recipe precedents in separate tables |

### Audit items queued

| # | Item | Status |
|---|---|---|
| RP10-T1-AI-1 | Re-read the rules when the 2027 season document appears | Open |
| RP10-T1-AI-2 | Cup-dosing minerals is not competition-legal | Open, for Track 5 scoping |
| RP10-T1-AI-3 | Track 2 scoped at 18 g; cap is 20 g | Open, Coordinator decision |
| RP10-T1-AI-4 | 2023 and 2022 global rulebooks not recovered; 2024 is a national version | Open, low priority |
| RP10-T1-AI-5 | Memo-only sources not re-read | Open |
| RP10-T1-AI-6 | Evidence note for grilling-queue item 58 | Noted, not resolved |

### Open data items

- Four OPEN rulings (D2 #3 mixed water profiles, #4 pre-frozen ball, #5 cap and sieving, #6 second pass). Route: hello@aero.press. Sending is the operator's call.
- 2026 World Final specifics: compulsory water, any compulsory kettle, scale or grinder, judges and competitors per heat. Expected from D6 in the room.
- US 2023 and 2024 national coffees; US podium recipes other than the 2025 winner.
- The 2025 US winner's published recipe has an internal timing conflict (flip time later than press start).
- Whether the 2026 US event told entrants 18 g or 20 g before 21 Aug is not on the host page.
- 2026 national calendar was sampled, not read row by row.

### Recap map for compile session

First: carry the constraints block and rulings table into the Track 2 protocol, and decide the 18 g versus 20 g question (AI-3). Second: decide whether the four OPEN rulings are worth an email before tracks 3-6, or are left to Mexico City. Defer: the reference-doc fold until the December addendum adds the 2026 podium (Option B), unless the operator wants the corpus readable from other sessions sooner. Escalate to the operator: the cup-dosing finding, since it changes a standing practice inside this project.

### Protocol-execution friction captured

1. Summariser misreads on recipe numbers (F1).
2. Wayback unreachable through both tools (F2).
3. PDF parsing needed a save-then-read detour (F3).
4. Section-level change markers hid line-level changes (F4).
5. D1 and ledger verdict vocabularies differ (F5).
6. A parallel agent's memo used a slightly different tier scheme; the protocol has no rule for ingesting a second agent's output (F6).

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/wac-prep-t1-rules-corpus-13be95` (the authorized archive-persist exception - see [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md)); SHA = branch head, reported in the closing message
- ✅ Handoff brief produced above; branch in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP10 Track 1 close-out.
