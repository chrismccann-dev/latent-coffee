# Sub-sprint 4b — Roasters polish complementary pass — 2026-05-28

**Phase 2 of the 3-phase audit** per [kickoff brief](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md). Phase 1 (Chris's page-by-page audit) closed 2026-05-28 with 5 PDF items + a load-bearing job reframe. This doc is the complementary pass.

**No implementation specifics in this doc.** Phase 3 will bundle into plan-mode PRs.

## Phase 1 locks (recapped for Phase 3 context)

- **Job reframe**: roaster detail page's primary job is **index into brews** (frozen tube → roaster page → scroll to find this coffee → open brew card). The Roasters Reference Brew Recipe is reference data feeding claude.ai brewing-strategy work, **not** "follow this in-app to brew right now." The edge case ("I'm in a rush, just do Deck's recipe") is rare and not the design target.
- **Index**: no changes. Chris's audit: "Honestly no feedback here. Well organized and I reference this a lot."
- **PDF items A1-A5** (see Bucket A below): all ratified.
- **PDF item — official-vs-implied reframe**: approach ratified; substrate work belongs in Phase 3.

## Bucket A — Chris flagged, I agree, skip

### A1. Rename "GENERALIZED BREWING RECIPE FOR THIS ROASTER" → "Roasters Reference Brew Recipe"
Per PDF. Section title only; render unchanged in this item alone.

### A2. Promote `doseG` + `waterG` into the Reference Brew Recipe card
Per PDF. Currently `composeBaselineRecipe` ([page.tsx:34-41](../../app/%28app%29/roasters/%5Bslug%5D/page.tsx#L34)) composes only `tempC` / `ratio` / `typicalBrewTime` / `agitationLevel` into the inline string. Dose + water render only in the Additional Information collapsible.

**Cross-check**: the synthesis adapter ([lib/synthesis/adapters/roaster.ts:32-42](lib/synthesis/adapters/roaster.ts#L32)) DOES include dose + water + ratio + temp + time + agitation in its `Recipe baseline` line. So the synthesis prompt has the complete recipe; the page render was the only place this got truncated. Substrate-consistent fix.

### A3. `bmrHouseStyle` stays in Additional Information
Ratified per Chris's audio response. Reason: it's an input source feeding claude.ai brewing-strategy work, not above-the-fold output on the roaster page. Distinction from `houseStyle` (which stays in Brewing Philosophy) preserved.

### A4. `bmrNotes` stays in Additional Information
Same reasoning as A3. Both fields function as authored prose Chris reads when assembling a brewing approach in claude.ai, not when scanning the page for the brews-index job.

### A5. `url` field — low-priority defer
Chris in PDF: "Honestly i should have collected this when I put together the whole roaster taxonomy. I could do it again now but it honestly doesnt seem that high value. Can put it on a future cleanup item for the future but not very high priority."

Current state: 1/73 populated, never rendered anywhere on the page. Type-def field with no consumers.

Phase 3 recommendation: leave alone. If a future PR touches `RoasterEntry` for any other reason, either drop the field or wire a render path then. Don't open a PR just for this.

## Bucket B — Chris didn't flag, I recommend adding

### B1. "Coffees I Have Brewed" list ergonomics — surfaced by the job reframe ⚠️ **biggest add**

Chris's audio scenario (verbatim): "today, I had a coffee from MoonWake, and it was the Aloe Demencu station natural landres. Um, I haven't had it for a little while, and so I totally forgot what my brew recipe for this one was. And so when I pull the tube, I pull up MoonWake, the roaster card. I scroll down to find this one."

Given the page's load-bearing job is now explicitly "index into brews," the **Coffees I Have Brewed** section's ergonomics matter much more than Sub Pages 5 (2026-05-11) treated them.

**Today's render** ([page.tsx:232-256](../../app/%28app%29/roasters/%5Bslug%5D/page.tsx#L232)):
- Section position: 6th of 9 (after Hero / Brewing Philosophy / Roasting Philosophy / Generalized Recipe / Resting Info)
- Row content: cover swatch + coffee_name + meta `[variety, terroir.country, process]` + hover arrow
- Sort order: `created_at DESC`

**Observations Chris should weigh in Phase 3:**

a) **Meta row identifier ergonomics.** Frozen tubes typically carry roaster + coffee name + producer/farm on the bag label. Today's meta shows `variety / country / process` — country is the least distinctive of the three columns (Moonwake's beans span fewer countries than producers). **Producer/farm name is likely the more scannable identifier** for "find this coffee in my hand." Worth considering a swap or addition.

b) **Section position vs. job framing.** Section 6 of 9 is non-trivially down the page on a roaster with rich Reference Brew Recipe + Roasting Philosophy + Generalized Recipe + Resting Info. Chris's "I scroll down to find this one" confirms today's scroll cost. **If the page's primary job is index-into-brews, the section probably wants to be #2 (immediately after Hero), not #6.** The brewing-philosophy / reference recipe / resting info content all stays below as reference layer. This is the **biggest IA call** on the table for Phase 3 — flag for explicit audio-confirm before any reorder lands.

c) **Sort order.** `created_at DESC` puts recently-logged brews on top. Chris's scenario was a coffee he "haven't had for a little while," so recency-sorted means older brews scroll-cost more. Alternatives to consider: alphabetical by `coffee_name`, grouped by year, or a hybrid (most-recent ~5 above, older alphabetical below). Not a strong recommendation — depends on Chris's actual scroll pattern, which only Chris can validate.

d) **Brew-count threshold for friction.** Confidence threshold is HIGH ≥5 / MEDIUM ≥2 / LOW = 1. The ergonomics concern only meaningfully kicks in on HIGH-confidence roasters (Moonwake, Hydrangea, Sey, etc.). On a 1-2-brew roaster page, the list is trivially scannable. Phase 3 calls should be sized around the HIGH-confidence scenario.

**This bucket is the single most important Phase 2 finding** — the job reframe means the page's primary surface is the brews list, and today's render treats the brews list as secondary content.

### B2. Processes Explored tag-link block — technically working but low-information

Today's render ([page.tsx:314-320](../../app/%28app%29/roasters/%5Bslug%5D/page.tsx#L314)) builds slugs from `brew.base_process` (`processSet.add(brew.base_process)` on line 100), then renders `/processes/${kebab(p)}`.

**The good news**: this slug shape happens to match Sub Pages 4's base hub URL (`/processes/{base-slug}` → `/processes/washed`, `/processes/honey`, etc.). So **tag-link routing is NOT broken** despite my earlier suspicion. False alarm.

**The substantive observation**: the block only ever shows 1-4 tags (the 4 base processes — Washed / Honey / Natural / Wet-hulled). For a roaster like Hydrangea that's brewed across half a dozen processes — Anaerobic Natural, Yeast Inoculated Washed, Thermal Shock, etc. — the structurally richer Sub Pages 4 surfaces are completely absent from the cross-link. Today's block reads as "Hydrangea touches Washed and Natural" which is true but uninformative.

**Forward investment** (not bug fix): the richer cross-link block would include modifier-index tags ("Anaerobic" → `/processes/modifiers/anaerobic`) and signature tags ("Moonshadow" → `/processes/signatures/moonshadow`) when the brews touch them. Net-new code (modifier + signature aggregation across the brew list) but conceptually parallel to what already exists for flavor families.

**Phase 3 sizing**: probably too rich for the polish sprint. Flagging as a Sub-sprint 4f (Processes detail polish) candidate. Note in Phase 3 plan as "punt to 4f."

### B3. Hero subtitle composition — minor

[page.tsx:108-110](../../app/%28app%29/roasters/%5Bslug%5D/page.tsx#L108): `locationStr` composes `${entry.location}, ${entry.country}` when they differ. For Hydrangea this becomes "Berkeley, CA, USA" (city/state already includes the state code; appending USA is mild redundancy). For Tim Wendelboe → "Oslo, Norway" (clean). For Drop Coffee → "Stockholm, Sweden" (clean).

Roasters affected: any US/CA/AU entry where `location` already includes a state/province abbreviation. ~14 US entries in registry.

Minor enough to leave alone unless touched for some other reason.

## Bucket C — Chris flagged, scope different

### C1. Dose + water promotion reasoning — destination same, reason changed

My Phase 1 framing: "dose/water in collapsible is friction for brew prep."

Chris's reframe: the roaster page is not for brew prep — it's an index into brews + reference data feeding claude.ai brewing strategy.

**Destination unchanged**: promote dose + water into the Reference Brew Recipe card (A2).

**Reason update**: "the Reference Brew Recipe is your claude.ai input source; a complete reference reads better than a partial one." Drop my brew-prep friction framing from the Phase 3 plan; use Chris's reference-completeness framing.

Carrying this lock through the Phase 3 plan + any commit message + CLAUDE.md update on the page-job framing.

## Bucket D — Cross-cutting patterns

### D1. The "BMR" naming prefix is stale convention

`bmrHouseStyle` + `bmrNotes` carry a "BMR" prefix that's drift from a prior roaster-metadata sprint era (pre-1h.1 registry). The label is opaque to anyone — including future Claude sessions — reading the page today. "BMR house style" reads as either a typo or an undocumented acronym.

With Chris's lock that both fields stay in Additional Information, the naming convention has no scoping role to play; it's pure metadata-drift. Renaming to "Authored house style" / "Authored notes" (or similar Chris-locked phrase) would make the section more legible without changing IA.

**Phase 3 status**: optional polish — not blocking, but a clean place to attach a rename if Bundle A already touches the Additional Information render.

### D2. Additional Information's dual job is now explicit

Chris's Phase 1 + audio reframe makes explicit what the section was implicitly doing:

- **Job (a)**: archival metadata that legitimately stays hidden (strategy tag, brew guide source/type, calibration role, confidence level, dose/water-as-numbers when not promoted)
- **Job (b)**: input source feeding claude.ai brewing strategy (`bmrHouseStyle`, `bmrNotes`)

Both jobs ratified. **No structural split needed** — single CollapsibleBlock is the right container. But going forward, when fields land in the registry, the (a) vs (b) classification is now a deliberate design call, not implicit.

**Phase 3 status**: documentation-only. CLAUDE.md § Roasters section can absorb a 1-2 sentence note on this dual job when Bundle A/B docs land.

## Bucket E — Substrate gaps

### E1. `brewGuideSource` has 18 unique values — needs canonicalization for the official-vs-implied reframe ⚠️

Distribution across 70 populated entries (3 missing):

```
46  Official
 6  Unofficial
 3  None
 2  Unofficial / Aggregated
 2  Indirect
 1  Official / Secondary
 1  Official (archived)
 1  Inferred
 1  Indirect (Rao)
 1  Indirect (FAQ)
 1  Indirect (FAQ + collab)
 1  Direct
 1  Direct / Competition
 1  Direct (social)
 1  Direct (competition/official)
 1  Direct (community)
 1  Direct (brew card)
 1  Archived
```

Chris's official-vs-implied reframe collapses this into a 3-state classification:
- **Official** — Chris has a verified source (any surface: video, Instagram, blog, podcast, brew card, etc.). Recipe is taken from the roaster's own articulation.
- **Implied** — Chris derived a recipe from community sources (Reddit, brew cards passed around, others' brewing experience). Best estimate, not roaster-verified.
- **None** — no recipe known.

Mapping today's 18 values onto the 3-state classification (initial pass; needs Chris's review per-entry):

| Today's value | Likely target | Count |
|---|---|---|
| Official | Official | 46 |
| Official / Secondary | Official | 1 |
| Official (archived) | Official | 1 |
| Direct | Official | 1 |
| Direct / Competition | Official | 1 |
| Direct (competition/official) | Official | 1 |
| Direct (brew card) | Official | 1 |
| Archived | Official | 1 |
| **Subtotal Official** | | **53** |
| Unofficial | Implied | 6 |
| Unofficial / Aggregated | Implied | 2 |
| Inferred | Implied | 1 |
| Indirect | Implied | 2 |
| Indirect (Rao) | Implied | 1 |
| Indirect (FAQ) | Implied | 1 |
| Indirect (FAQ + collab) | Implied | 1 |
| Direct (social) | Implied? | 1 |
| Direct (community) | Implied? | 1 |
| **Subtotal Implied** | | **16** |
| None | None | 3 |
| **Subtotal None** | | **3** |

**Phase 3 work shape**:
- Add `brewGuideStatus: 'official' | 'implied' | 'none'` (or similar enum) to `RoasterEntry`
- Classify all 73 entries (per-entry review with Chris — table above is a starting point, not authoritative)
- Render gate: page shows the Reference Brew Recipe block when status ≠ 'none', with a small status badge distinguishing official vs implied
- Update `composeBaselineRecipe` / Brewing Philosophy block to read the status, not the link
- Keep `brewGuideSource` (or rename to `brewGuideSourceForm`) as a separate free-text "where did this come from" field for provenance — it still has signal (YouTube vs Instagram vs blog) but doesn't drive the render

**Sizing**: this is the largest substrate-touching item in the sprint. Probably its own Bundle B in Phase 3.

### E2. CLAUDE.md count drift

- Line 99: "21 canonical names" — pre-1h.1 stub, badly stale
- Line 150: "**70 canonical roasters**" — pre-drift (actual today: 73)
- Line 151: "wires the 70 canonicals" — same drift

Phase 3: tag along to whichever bundle touches CLAUDE.md § Roasters. Cheap fix; no DB or code touch.

### E3. `bmrHouseStyle` (22/73, 30%) + `bmrNotes` (21/73, 29%) sparse population — observation only

Per-roaster authoring rates are sparse. With Chris's lock placing both in Additional Information (collapsible), the sparse-population reads as graceful degradation — on the 51 entries without `bmrNotes`, the row simply doesn't render.

**Not actionable in this sprint.** Noted because future enrichment is a long-running side-task (Chris dripping in authored prose as he brews more). The 22 roasters that DO have `bmrHouseStyle` populated are presumably his most-brewed; the IA serves the long tail well.

## Bucket F — Bug root cause

### F1. "No official brew guide" false negative — 17 affected, not just Picolot ⚠️

[page.tsx:170-181](../../app/%28app%29/roasters/%5Bslug%5D/page.tsx#L170): render gates on `entry.brewGuideLink`. If absent, prints "No official brew guide" regardless of whether `brewGuideSource` and `brewGuideType` are populated.

**Affected entries (17)** — full list with status as classified today:

| Roaster | brewGuideSource | brewGuideType |
|---|---|---|
| Drop Coffee Roasters | Official | Website / PDF |
| Finca Coffee (Coffee Libre) | Inferred | No formal guide |
| Center Coffee | Official | In-store / Image |
| VWI by CHADWANG | Direct / Competition | Competition / Community |
| TM Coffee | None | (unset) |
| Shoebox Coffee | Unofficial | YouTube + Brew Cards |
| Oma Coffee Roaster | Direct (community) | Community / Social |
| Five Elephant Coffee | Official | Video / Website |
| Little Wolf Coffee | Indirect | Collab / Community |
| Colibri Coffee Roasters | None | (unset) |
| Picolot (Brian Quan) | Official | YouTube |
| September Coffee | Unofficial | Reddit + Community |
| H&S Coffee Roasters | Unofficial | Community (Reddit) |
| Thankfully Coffee | Direct (social) | Instagram/Community |
| Dongzhe | Direct (brew card) | Physical / Included Card |
| Switch Coffee | Indirect | No formal guide |
| Untold Coffee Lab | None | No formal guide |

3 of the 17 (TM, Colibri, Untold) genuinely have no guide — current render is correct for those.

**14 are false negatives** today — Drop / Finca / Center / VWI / Shoebox / Oma / Five Elephant / Little Wolf / Picolot / September / H&S / Thankfully / Dongzhe / Switch all have substantive guide information of some form, and the page currently denies it.

**This bug couples tightly with E1 (substrate gap)**. The fix lands cleanly only after the official-vs-implied 3-state classification. Bundle together in Phase 3.

## Bucket G — Out of scope for polish, defer

### G1. `url` field cleanup
Per A5 / Chris's PDF: low priority, defer.

### G2. Index page changes
Chris explicit: "Honestly no feedback here. Well organized and I reference this a lot." No changes.

### G3. Synthesis card position
Currently demoted below Coffees list per Sub Pages 5. The brews-index reframe doesn't argue for promotion (synthesis is reflective compounding knowledge, not "find this brew" content). Chris's audit didn't flag it. Stay where it is.

### G4. Mobile pass
Tablet spot-check per kickoff brief, not full mobile sprint. Bundle whatever touches the 2-col grid (Reference Brew Recipe → 1-col below `md:` 768px) with a `preview_resize` verification.

### G5. Per-roaster "deep archive" sub-view
Side-Quests absorbed framing. Chris's audio: today's coffees list mostly serves the brews-index role. No "deep archive" surface need has materialized. Defer indefinitely; revisit if his use pattern changes.

### G6. Family color tokens — System (#7B5A78) vs Varies (#8B6B7B)
Both sit in the purple/mauve range. Header comment in registry acknowledges the tension. Chris's audit: index is great. Leaving alone — flagging only as an observation for future eye-checks if the index ever gets a redesign.

## Phase 3 bundling — shape recommendation

**Not decisions** — sized for the Phase 3 plan-mode pass. Chris confirms bundles in audio before code changes.

### Plausible Bundle A — Reference Brew Recipe IA + render adds

Scope:
- A1 — Section rename
- A2 — Promote dose + water (+ optionally rename `composeBaselineRecipe`)
- Optionally: B1.a (producer in coffees list meta) if Chris wants the easy IA wins together
- Optionally: D1 (rename BMR prefix in Additional Information) — tagalong if touching the render path

Substrate touch: render-only on page.tsx. CLAUDE.md § Roasters needs a short text update for the section rename + new dose/water position.

Sizing: small (~30-50 LOC + doc update). Lowest risk. Ship first.

### Plausible Bundle B — Brew guide official-vs-implied substrate

Scope:
- E1 — Add `brewGuideStatus` enum to `RoasterEntry` + classify all 73 entries
- F1 — Render gate fix
- B render — small status badge ("Official guide" vs "Implied recipe — derived from community sources") on the Brewing Philosophy block
- E2 — CLAUDE.md count drift fix (tagalong)
- Substrate-practice gap audit: do `docs/taxonomies/roasters.md` authored entries need a `brewGuideStatus` column annotation? Likely yes.

Substrate touch: `RoasterEntry` type + 73 classifications + `docs/taxonomies/roasters.md` field + page.tsx render gate + CLAUDE.md.

Sizing: medium. The 73-entry classification is the time cost; the code is mechanical. Chris's per-entry review during classification is the only thing that gates the PR.

### Plausible Bundle C — Coffees list ergonomics (job reframe surface) — ⚠️ requires audio-confirm

Scope (deciding what's in/out is the audio-confirm topic):
- B1.a — Add producer to coffees list meta row
- B1.b — Reorder section position (Coffees → #2, between Hero and Brewing Philosophy)
- B1.c — Sort order alternatives (or leave at created_at DESC)

Substrate touch: render-only on page.tsx. CLAUDE.md § Roasters page-job framing paragraph needs a rewrite to reflect the brews-index reframe.

Sizing: small code, big interpretive surface. The section reorder is the load-bearing call; the other two ride on it.

**Phase 3 decision-surface for Chris to ratify before implementation**:
1. Section-reorder yes/no — promote Coffees list to slot #2?
2. Sort-order change yes/no — keep created_at DESC or switch?
3. Producer in meta row yes/no?
4. Bundle merge — A + C together (both render-only on the same page area), or two separate PRs?
5. BMR prefix rename — execute or defer? If execute, where (Bundle A or its own micro-PR)?

### Out-of-scope items

- B2 — Processes Explored richer cross-links (punt to 4f)
- A5 / G1 — `url` field cleanup
- G3-G6 — synthesis position / mobile / deep archive / family colors

## Six-actor cross-system audit reminder (for Phase 3)

When bundles ship, trace per CLAUDE.md sprint cadence #4:

| Actor | Bundle A | Bundle B | Bundle C |
|---|---|---|---|
| 6 — Schema/UI | ✓ render on `app/(app)/roasters/[slug]/page.tsx` | ✓ `RoasterEntry` type + render gate + 73 classifications | ✓ render on `app/(app)/roasters/[slug]/page.tsx` |
| 5 — Claude Code | ✓ CLAUDE.md § Roasters section rename | ✓ CLAUDE.md count drift + brewGuideStatus mention | ✓ CLAUDE.md § Roasters page-job framing |
| 4 — MCP | — | — `RoasterEntry` is read-only in Tool surface; verify | — |
| 3 — claude.ai | — | — verify roaster docs Resource re-pull picks up new status | — |
| 2 — Prompts | — | — synthesis adapter line could optionally read status | — |
| 1 — Chris | ✓ render verification per bundle | ✓ Reference Brew Recipe block reads correctly across 14 fixed entries | ✓ verify brews-index job feels right |

## Related docs

- [sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md](docs/sprints/sub-sprint-4b-roasters-polish-kickoff-2026-05-27.md) — kickoff brief
- [sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md](docs/sprints/sub-sprint-4a-green-bean-polish-complementary-pass-2026-05-27.md) — 4a Phase 2 shape reference
- [lib/roaster-registry.ts](lib/roaster-registry.ts) — registry + family colors
- [lib/synthesis/adapters/roaster.ts](lib/synthesis/adapters/roaster.ts) — synthesis prompt anchor
- [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md) — authored content (verify needs `brewGuideStatus` annotation for Bundle B)
- CLAUDE.md § Roasters (lines ~99, ~150-151) — drift fix targets
