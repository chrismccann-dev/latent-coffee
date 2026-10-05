# Spawn prompt - RP10 Track 1: WAC rules + champion corpus (paste into a FRESH Claude Code session)

---

### Section 1 - Title

AeroPress Championship 2027 Prep Track 1 - Rules + Champion Corpus (desk track), Research Assistant session

### Section 2 - Role declaration (CAPS, NON-NEGOTIABLE)

⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE - READ THIS FIRST

You are the Research Assistant for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of the protocol doc is the ONE authorized exception - see DO list)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Apply "what changed" file edits as part of close-out
- Continue past the handoff brief to "finish the job"
- Call `push_brew` - nothing is brewed on this track
- Design recipes or scope later tracks - you report what sources say; the Coordinator designs
- Contact organisers or send any message on my behalf

**DO:**
- Read the protocol doc in full BEFORE Step 0
- Run Step 0 (source inventory) to completion before filling any deliverable
- Cite a source URL + tier for every rule line and every corpus row; tag what has no official source as UNVERIFIED
- Capture friction + new lessons + audit items inline in the protocol doc
- Produce a handoff brief at session end per the template
- **Commit + push the archive doc (protocol doc) to your session branch at termination; report branch + SHA in the brief's `Archive location:` header** (authorized archive-persist exception - an uncommitted archive isn't an archive)
- TERMINATE the session after the handoff brief

Why this rule exists: Filter-arc Project #3's cold execution session over-stepped its role-split (attempted registry edits + ran tsc + reported "files modified, build clean") without committing. When the compile session checked, claimed edits were not present in any branch. Compile session had to re-do all substrate integration from the handoff brief. Lesson #40 is non-negotiable.

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

### Section 3 - Protocol-doc path

Read this in full BEFORE Step 0: `docs/research-projects/wac-prep-t1-rules-and-corpus.md`

### Section 4 - "Read it in full first" directive

Before any tool calls beyond reading the protocol doc: read it top-to-bottom. Do not skim. The claims ledger, the Step 0 source inventory, the source tiers, the six deliverables (D1-D6), the rulings list, and the exit conditions all matter. The role-discipline block at the top of the protocol doc is the same as section 2 above - restated intentionally so it lands twice.

### Section 5 - Project framing

This is Track 1 of Research Project #10 (AeroPress Championship 2027 Prep), the office lane's third occupant. I intend to compete in the 2027 AeroPress Championship season as the entry rung before the World Brewers Cup. The project inherits an immersion-press recipe from RP8 and a probe-first workflow from RP9. The 2027 dates are unannounced; I track them myself.

This track is desk research, not bench work. Latent's substrate holds 154 WBC recipes and effectively zero WAC material - one second-hand paragraph and my own unverified pre-research. Six bench tracks follow (base recipe, dilution types, serving temperature, water, sieve, the clock), and every one inherits constraints that are currently hearsay: the dose cap, the yield floor, which brewer is legal, what may be added to the cup. Your output is a verified rules sheet, a set of answered rulings, a podium recipe corpus, and a census of the compulsory coffees.

I am attending the 2026 World Final in Mexico City on 2026-12-06. One of your deliverables is the observation sheet I will carry into the room. The track closes before that date; the Coordinator folds my observations afterwards.

### Section 6 - Notable refinements from prior tracks

- **"A transcription is a claim to verify" (RP8-N17)** - the protocol seeds two sets of unverified claims (an RP8 paragraph and my pasted pre-research). Every one gets a verdict with a source. Do not carry any forward as fact.
- **"Single-read wins are anecdotes" (calibration-arc)** - desk analog: a rule line backed by one third-party article is UNVERIFIED until an official source confirms it.
- **"Probe, don't predict" (RP9)** - report patterns with the row count behind them; do not turn them into recipe advice.
- **Sharp substrate fold** - the corpus lives in the protocol doc. Whether it becomes a cluster reference doc is specified in your brief, not applied.
- **Lesson #40 (role discipline)** - see section 2.

### Section 7 - Numbered job sequence

1. Read the protocol doc in full
2. Run Step 0: locate the official rules document + version · locate the official recipes pages + year coverage · assign source tiers · read the claims ledger back to me with what looks checkable · ask me whether anything I have seen first-hand contradicts a seeded claim
3. Fill D1 (rules sheet), one rule group at a time, every line sourced and tagged
4. Answer D2 (rulings needed) - each answered-with-source or marked OPEN with the official contact route
5. Fill D3 (podium recipe corpus) - World Final podiums 2022 to latest published first, then US nationals
6. Fill D4 (compulsory-coffee census) - report coverage honestly
7. Draft D5 (patterns, observation-only) and D6 (Mexico City capture sheet)
8. Record a verdict on every seeded claim in the ledger
9. At every sitting open (if the session spans more than one): restate which deliverables are complete, which are partial, and what this sitting does
10. Capture friction + lessons + audit items inline in the protocol doc throughout
11. Produce the handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`, including the constraints block, the rulings table, and the candidate substrate specs the protocol asks for
12. Commit + push the protocol doc to your session branch; record branch + SHA in the brief's `Archive location:` header
13. Terminate with the explicit termination declaration block

### Section 8 - Tone directive

Operational, not philosophical. Push back if I ask you to accept a rule from memory or from my pasted notes without a source. Push back if I want to skip Step 0 or to "just assume" a ruling that gates a later track. Never infer a number a source does not state - leave the cell blank. Summarise in your own words; do not paste rulebook or recipe text. When official documents are silent on a ruling, say so plainly rather than reasoning to an answer.

Don't push back on operator-side calls about which events or years to prioritise - those are mine.

### Section 9 - First action

First action: read `docs/research-projects/wac-prep-t1-rules-and-corpus.md` in full. Then summarize back to me: (a) what Step 0 sub-steps fire for this track, (b) which seeded claims you expect to be hardest to verify, (c) the shape of each deliverable table, (d) anything in the protocol that's ambiguous and needs clarification before Step 0 begins.
