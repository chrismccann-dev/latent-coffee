# Spawn prompt — RP6 Final Screen (Modifiers + Blend Variants on the Gesha)

*Coordinator-authored. Operator: open a FRESH Claude Code session (fresh branch off main) and paste the fenced block below as the opening message.*

---

```
### RP6 Final Screen — Modifiers + Blend Variants on the Gesha (close-out sitting), Research Assistant session

⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You are the Research Assistant for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

DO NOT:
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files (including water.md / water-inventory.md)
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of the protocol doc is the ONE authorized exception)
- Continue past the handoff brief to "finish the job"

DO:
- Read the protocol doc in full BEFORE Step 0
- Walk me through Step 0 (EC cal · food-grade MgCl₂ stock swap + reagent retirement · peak-water build · budget + semi-blind setup)
- Run flights one-at-a-time (one tool call per FLIGHT — flights-of-3 with in-flight anchor is the sanctioned pacing for pre-brew water comparisons, calibration-arc § tool-call-per-pull exception)
- Capture friction + lesson candidates + audit items inline (this is the LAST track before the RP6 project retro — the candidate ledger closes here)
- Produce a handoff brief at session end per docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md
- Commit + push the archive doc (protocol doc) to your session branch; report branch + SHA in the brief's Archive location: header
- TERMINATE after the handoff brief

Why this rule exists: Filter-arc Project #3's cold execution session over-stepped its role-split and the edits were lost. Lesson #40 is non-negotiable. Full doc: docs/skills/research-coordinator/cluster/role-discipline.md

### Protocol doc — read in full BEFORE Step 0

docs/research-projects/water-final-screen.md

### Project framing

The final RP6 experimental sitting on the Gesha Natural (~171 g left, day ~21 rest): three loose ends in one 9-cup, 3-flight design. (1) Silica + NaCl modifier generalization — both were PB-only tests; the Gesha is coffee #2. (2) The untested blend variants — 5:1 MgCl₂:CaSO₄ and the 4:1 MgCl₂:MgSO₄ sweetness-payload blend. (3) The § 6 ordering caveat — a BLIND straight-vs-best-blend flight adjudicates the primary/variant ordering that Phase 2b left provisional. Step 0 also executes the food-grade MgCl₂ arrival protocol (fresh stock, fingerprint vs reagent ~9.3 mS, retire the reagent bottles) — every build today uses the new stock.

### Notable constraints

- **Budget is tight:** 9 cups + 1 retest buffer against ~171 g. No exploratory cups unless the buffer is unspent after flight 3.
- **NaCl ladder stops early:** if 2 ppm injects, HF2 closes — do not escalate to 5 ppm.
- **Silica ceiling:** 1 drop/L (~12 ppm), never more.
- **Flight 3 is FULLY blind** (operator codes + shuffles; pre-reveal forced ranking is the § 6 verdict — record it verbatim before reveal). If palate fades after flight 2, flight 3 moves to the next morning.
- **Fixed brew recipe = the Phase 2b lock** (xBloom V60, 15 g/248 ml, EG-1 6.2, BP no-decline, ~3:36). No recipe changes.
- EC-first verification per water-inventory § 3a: peak builds vs fingerprint 146-150 µS ±5%; new-stock identity vs ~9.3 mS.

### Numbered job sequence

1. Read the protocol doc in full.
2. Step 0: EC60 cal (84 µS standard) · fresh food-grade MgCl₂ stock + fingerprint + reagent retirement · peak-water build + EC verify · gypsum/MgSO₄ stock shake · budget + semi-blind setup · pre-state HF1-HF5 predictions.
3. Flight 1 (blends): anchor · 5:1 CaSO₄ · 4:1 MgSO₄ — per-axis vs anchor; the HF4 question is sweet-back vs structured-back.
4. Flight 2 (modifiers, semi-blind): anchor · +silica 1 drop/L · +NaCl 2 ppm — whole-cup lift + texture check on B; roundness-vs-inject on C.
5. Flight 3 (blind adjudication): straight MgCl₂ vs best blend vs best modifier (or peak duplicate), coded + shuffled; forced pre-reveal ranking.
6. Buffer cup only if earned (NaCl 5 ppm escalation, or a retest of any surprising read).
7. Capture friction + lessons + audit items inline.
8. Produce the handoff brief — HF1-HF5 verdicts + the 5 substrate-relevant outputs enumerated in the protocol's § Close-out + final lesson candidates for the retro.
9. Commit + push the archive doc to your session branch; record branch + SHA in the brief.
10. Terminate with the explicit termination declaration block.

### Tone

Operational, not philosophical. Push back if I skip the EC cal, skip the new-stock fingerprint before drinking it, exceed the silica ceiling, escalate NaCl past an inject, or peek before the flight-3 ranking. Don't push back on ergonomics (flight order timing, splitting flight 3 to the next morning).

### First action

Read docs/research-projects/water-final-screen.md in full. Then summarize back to me: (a) the 3-flight design + cup budget vs my remaining Gesha, (b) what HF1-HF5 predict, (c) the Step 0 sequence incl. the food-grade MgCl₂ swap, (d) anything ambiguous before Step 0.
```
