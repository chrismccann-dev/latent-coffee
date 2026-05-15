# Latent Coffee Research

Latent Coffee Research is Chris's personal coffee research journal. Two compounding workflows: **brewing is archive-driven** (claude.ai iterates, the app gets the final brew); **roasting is iterative** (lots evolve through experiment-rounds until a reference roast emerges). This glossary captures Latent-specific terminology — terms whose meaning is non-obvious to a first-time reader of the codebase or the foundational docs.

Single context (no `CONTEXT-MAP.md`). Grown via `/grill-with-docs` sessions, never bulk-authored. Implementation details live in [CLAUDE.md](CLAUDE.md), not here.

## Language

### Roasting

**V-set**:
One round of roasting experimentation on a green-bean lot, labeled `V1` / `V2` / ... and typically containing 3 recipe variants (with 1–4 as the legitimate range). Each V-set carries one primary question + an optional control baseline + one lever being tested.
_Avoid_: "experiment set", "iteration", "round", "batch series"

**Batch slot**:
One recipe variant within a V-set, labeled `a` / `b` / `c` (or sometimes `d`). The full identifier `{V-set}-{slot}` (e.g. `V1a`) is the same string carried through spreadsheet, Roest machine profile name, app records, and cupping notes — one label end-to-end.
_Avoid_: "variant", "batch", "recipe variant"

**Experiment frame**:
The design-time framing of a V-set: six fields set before any roasting happens — the primary question (what's being tested), an optional control baseline (if comparing to a prior roast), the shared constants held steady, the levels being varied, the expected outcomes at both the roast layer and the cup layer, and the failure boundary if a variable is pushed too far. Required fields are primary question, levels, and expected outcomes (both layers); shared constants and control baseline are usually given by the question; failure boundary is nice-to-have.
_Avoid_: "experimental design", "experiment setup", "V-set design", bare "frame"

**Variable**:
A roast parameter being deliberately moved across batch slots within a V-set's levels-tested (peak inlet, dev time, drop temp, charge temp, ROR shape, fan curve, etc.). Design-time term — pre-judgment, before outcomes are in. A V-set tests 1–2 variables; everything else is held still as shared constants.
_Avoid_: "knob", "dimension", "parameter" (when referring to the thing being moved), "lever" (lever is post-hoc — see below)

**Lever**:
A variable that, after roasting and cupping, turned out to produce an observable difference in the end cup — a post-hoc promotion from variable status. Subdivided into **primary lever** (the biggest difference-maker for this lot) and **secondary lever** (meaningful but smaller). A variable only earns lever status when cross-batch-slot or cross-V-set evidence supports the promotion.
_Avoid_: "key variable", "winning variable", "critical parameter"

**Non-factor**:
A variable that was tested across batch slots but produced no clear effect in the end cup. Doesn't get promoted to lever status, but the absence of effect is itself a useful lesson — recorded as a carry-forward learning.
_Avoid_: "null variable", "inert variable", "dud", "what didn't matter" (use the noun form)

**Roast→cup trace**:
The causal-attribution chain across two layers — roast (predicted → actual → delta) and cup (predicted-initial → updated-after-roast → actual → delta) — that lets observed surprises be localized to either the roast deviating from plan or the prediction itself being wrong. The whole point of comparative 3-batch V-sets is that the trace becomes tasteable across slots.
_Avoid_: "prediction trace", "delta chain", "expectation pipeline", "predict-observe loop"

**Taste-for**:
A focal-attention hint set per batch slot before cupping (one entry per slot in the experiment row) — *not* a prediction of what the cup will taste like, but a directional list of what to *listen for* on the cupping table. Carries three reference points: producer tasting notes (external ballpark check), prior-V-set tasting memory (where am I vs the last try on this lot), and the specific adjustment being tested this round (where the lever is supposed to move the cup).
_Avoid_: "cup prediction" (different slot — that's `updated_cup_prediction`), "tasting plan"

**Producer tasting notes**:
The flavor notes the producer / farm / exporter prints on the bag or website, recorded against the green-bean inventory row. Used as an external *ballpark check* during cupping ("am I in the right zone?"), never as a target — tasting is single-palate (Chris is the only taster) and the goal is calibrated self-experience, not producer-match.
_Avoid_: "producer notes" (ambiguous — could mean roast notes), "vendor description"

**Reference roast**:
The single batch slot (one roast execution in one V-set) designated at lot-close as the winning expression — the roast Chris would repeat if he had more green. Chosen by judgment call when the cup matches producer-notes ballpark + Chris's expectations + diminishing returns set in; typically locked in by running one final **control experiment** (a replicate V-set with two slight adjustments) before declaring the winner. Deliberately called "reference" not "best" — tasting is subjective and there is no objective best.
_Avoid_: "best roast", "winning batch", "final roast", "optimal roast"

**Reference cup**:
The xBloom pour-over cupping of the reference roast at day-7 of rest — one standardized, mechanically-repeatable evaluation that defines what this coffee tastes like at peak roasted-bean state. Replaces an earlier 2-stage protocol (cupping-bowl day-4 + xBloom day-7); the bowl methodology was deprecated because too many coffees that tasted great on the bowl table "fell apart" at the xBloom step and couldn't hold up during the optimized brew — i.e. the bowl signal had too much brewing-tolerance noise mixed in. xBloom's mechanically-consistent recipe specifically isolates cup-side signals from brewing variance, which is what makes the underdev/overdev signal attribution possible.
_Avoid_: "cupping bowl cupping" (deprecated), "tasting", "best cup", "final cup"

**Optimized brew**:
The pour-over recipe Chris dials in for daily consumption of the reference roast — real dripper, real filter, real water, finalized brewing variables. Produced by handing the reference roast into the brewing-side workflow (same flow used for purchased roasted beans). The **consumption-condition endpoint** of the full pipeline; all post-hoc attribution traces backward from here, since this — not the reference cup — is what the lot actually tastes like when drunk normally.
_Avoid_: "optimized recipe" (recipe is one component, not the whole), "final brew", "best brew"

**xBloom**:
A physical automated pour-over machine that runs one mechanically-consistent recipe every time (same temperature, pour pattern, agitation, ratio). Used as the **gate** for reference-cup evaluation — every reference roast gets exactly one xBloom pour-over at day-7 of rest, and that result *is* the reference cup. Not the consumption-condition cup (that's the optimized brew), but a standardized cross-lot anchor that's repeatable.
_Avoid_: "automated pour over" (xBloom is a specific machine), "pour over machine"

**Control experiment**:
A V-set whose purpose is to *lock in* a candidate reference roast rather than explore new variables — replicates the leading batch slot with two slight adjustments to confirm the winner before lot-close. Distinct from an exploratory V-set (which tests variables to discover levers).
_Avoid_: "confirmation V-set", "final V-set", "verification roast"

**Acceptable roast window**:
The range of values for the primary lever within which the cup stays in the desired zone for this lot — e.g. "dev time 25–35s, with 30s as the best point; below 25s tastes grassy, above 35s tastes roasty". The playable zone for repeating the reference roast. Narrow window = unforgiving lot; wide window = lot tolerates roast deviation.
_Avoid_: "roast window" (under-specified — the qualifier is load-bearing), "tolerance band", "playable zone", "latitude"

**Brewing tolerance**:
How well the reference roast holds up when brewing variables are pushed toward extremes (Full Expression / Suppression / Extraction Push / etc.). High brewing tolerance = the cup stays coherent across a wide brew range; low brewing tolerance = the cup "falls in on itself" when pushed. Distinct from acceptable roast window: this is *brew* deviation latitude, that is *roast* deviation latitude. A 3-axis "Roast Character" attribute alongside primary lever and acceptable roast window.
_Avoid_: "elasticity" (deprecated — physics metaphor was confusing and the polarity was ambiguous), "brew robustness", "flex", "roast resilience"

**Roasted bean characteristic**:
The attributes of the reference roast that carry through to the brewing step — its expressiveness (loud / muted), its preferred brewing direction (suits Full Expression vs Suppression vs Clarity-First, etc.), and its brewing tolerance. Determined by the roast end-state; consumed by the brewing-side workflow when dialing in the optimized brew.
_Avoid_: "roast profile" (overloaded — already means the Roest machine recipe), "bean character", "roast result", "post-roast profile"

### Lifecycle states (4-state machine per green-bean lot)

**In inventory**:
A green-bean lot that has been purchased and is physically at home but has not yet been onboarded into the V-set workflow — no experiment frame, no roast profile, no Latent app row. Tracked in the claude.ai project's inventory sheet, not in the Latent app today (deliberate scope choice — may surface later).
_Avoid_: "uncommitted", "pre-experiment", "not started", "queued", "fresh"

**Waiting for next roast**:
A green-bean lot whose latest V-set has been designed and the recipes pushed to the Roest machine, but the physical roasting hasn't happened yet. Covers both the first V-set (just-onboarded lot, V1) and mid-cycle V-sets (V_{n+1} designed by claude.ai right after V_n's cupping update). The next move is physical: Chris roasts at the machine.
_Avoid_: "ready to roast", "roast pending", "in queue"

**Waiting for next cupping**:
A green-bean lot whose latest V-set has been fully roasted but not yet xBloom-cupped at day-7 of rest. Roast data is back in the app; the next move is physical: Chris does the day-7 cupping (which then triggers claude.ai to design V_{n+1} and the lot bounces back to "Waiting for next roast"). Day-7 is the target; actual days-post-roast varies with calendar affordances and gets recorded per cupping.
_Avoid_: "ready to cup", "cupping pending"

**Resolved**:
A green-bean lot whose lifecycle is closed: a reference roast has been declared after a winning xBloom cupping, the reference roast has been handed off to the brewing-side workflow and an optimized brew has been dialed in, and all learnings have been rolled up. No further V-sets planned. Replaces the active sage-tile rendering with the green-tile + "Resolved" badge.
_Avoid_: "closed", "complete", "done", "archived", "final"

### The unit

**Lot**:
A specific green-bean purchase from one producer/farm at one point in time — uniquely identified by its `green_lot_id` (the seller's lot reference). One purchase = one lot, even when the same farm + same cultivar is bought twice in different seasons or from slightly different sub-locations on the farm: agricultural variability (moisture, density, soil, sun, processing) means the two will behave and taste differently. The unit of all roasting research in Latent.
_Avoid_: "bean", "coffee", "batch" (batch is a slot inside a V-set), "SKU", "purchase", "variety" (variety is the cultivar, not the lot)

### Lot-close synthesis

**Lot-specific learnings**:
The full reflective synthesis of one closed lot — its character (primary lever, acceptable roast window, brewing tolerance), its variable promotions (secondary levers + non-factors), and its diagnostic + behavioral fingerprint (underdev signal, overdev signal, aromatic / structural / rest behavior). Backward-looking audit-trail, scoped to this lot. Written by claude.ai at lot-close based on the full roast→cup trace; Chris does not hand-author.
_Avoid_: "lot learnings", "audit trail", "retrospective", "lot summary"

**Carry-forward learnings**:
The compressed subset of lessons that generalize beyond this lot to future ones — what to try first when next roasting a similar cultivar, terroir, process, or general roast-style. Forward-looking, designed to shorten time-to-reference-roast on the next lot. The **compounding-knowledge primitive** of Latent: claude.ai consumes prior lots' carry-forward when designing V1 on a new lot with overlapping attributes. Four conceptual axes in Chris's mental model — cultivar takeaway, terroir takeaway, general takeaway, starting hypothesis for similar lots — though the schema today is missing the terroir takeaway field.
_Avoid_: "lessons learned" (too generic), "general learnings", "forward recipe", "roadmap"

**Development** (roasting sense):
The whole-curve completeness of a roast — *not* the classical post-first-crack-only definition, but the full curve shape from charge → Maillard → FC → drop, *plus* the internal-vs-external uniformity measured by the Agtron delta between whole bean (WB) and ground bean (Gnd). A large WB→Gnd delta means the bean looked roasted on the outside but stalled inside; a small delta means even development.
_Avoid_: "dev time" (too narrow — that's only the post-FC slice), "roast completeness" (close, but doesn't capture WB/Gnd uniformity), "roast level" (refers to color, not completeness)

**Underdev signal**:
The **cup-side** sensory marker that appears in batches of this lot when development is too low — too-short whole-curve completeness OR uneven development (high WB→Gnd Agtron delta). Lot-specific fingerprint (grassy / hay / sour / underextracted-acidity vary by cultivar/terroir). Distinct from roast-side observations like "the roast looked stalled" (different concept).
_Avoid_: "under-roast", "stalled roast" (roast-side, not cup-side), "underextraction" (brewing concept)

**Overdev signal**:
The **cup-side** mirror — sensory marker that appears in batches of this lot when development runs too long or too hot. Lot-specific (roasty / nutty / ashy / muted / dark-chocolate-heavy vary by cultivar/terroir). Same cup-side framing as underdev signal.
_Avoid_: "over-roast", "burnt", "carbonized" (roast-side or pejorative-aesthetic)

### Cup character (currently misplaced in schema)

These describe what a cup IS when roasted correctly, distinct from diagnostic signals (which describe failure modes). Conceptually they belong on cupping records or the reference cup synthesis, not on `roast_learnings` — schema relocation is a flagged follow-up.

**Aromatic behavior**:
How a cup's aromatics present in time and intensity — immediate vs late-blooming, expressive vs muted, lifted vs grounded, sustained vs transient. Cup-side character data tied to a specific cupping (or synthesized from the reference cup), not a lot-level lesson.
_Avoid_: "aroma profile", "aromatic signature"

**Structural behavior**:
How a cup presents structurally — the shape and balance of acidity, body, and finish, separate from flavor. Cup-side character data; what the coffee tastes like when dialed in well.
_Avoid_: "mouthfeel" (too narrow — that's just body), "cup structure"

**Rest behavior**:
How a roasted lot evolves across post-roast rest days — peaks early (day-7), peaks late (day-21+), holds a long plateau, or declines sharply. Currently *not* actively used as a variable in Chris's workflow (he targets day-7 xBloom and moves on); on the long-term radar as WBC-competition work often treats rest time as an explicit lever. Sits awkwardly in `roast_learnings` today since it's not really a lesson and isn't actively measured.
_Avoid_: "rest curve" (already used elsewhere as `RoasterEntry.restCurve` — different concept), "aging behavior"

### Forward design

**Adjustment**:
The deliberate design move from V_n to V_{n+1} that changes one or more variable levels with the intent of moving the cup in a specific direction. Informed by V_n's cupping deltas + carry-forward learnings of prior lots + the producer-notes ballpark check. **Scale-dependent**: big and often multi-variable in early V-sets (exploring the response map, finding the zones), small and typically single-variable in late V-sets (converging on the reference roast, fine-tuning). The unit of forward design between V-sets — authored by claude.ai as part of the post-cupping update.
_Avoid_: "tweak" (too casual, implies small), "iteration" (V-set is the iteration), "variation"

## Relationships

- A **V-set** belongs to exactly one green-bean lot.
- A **V-set** contains 1–4 **batch slots** (typically 3, occasionally 4, rarely 1–2 for one-shot lots).
- A green-bean lot progresses through one or more **V-sets** until a reference roast emerges.
- Each **batch slot** corresponds to exactly one roast execution and exactly one Roest machine profile (same name everywhere).
- A later **V-set** (e.g. V2) is informed by the outcomes of the earlier V-set on the same lot.
- Each **V-set** has exactly one **experiment frame**, authored before any roasting happens.
- An **experiment frame** predicts outcomes at both the roast layer (what the curve will look like) and the cup layer (what the brew will taste like); these predictions get compared against actuals to produce two distinct deltas per batch slot.
- A **variable** becomes a **lever** post-hoc once cross-batch-slot or cross-V-set evidence shows it meaningfully affects the cup; if the same evidence shows no effect, it becomes a **non-factor** instead.
- An experiment frame's `levels_tested` enumerates the values a **variable** takes across batch slots (e.g. fast / medium / slow, or 240°C / 250°C / 260°C peak inlet).
- A **roast→cup trace** runs per batch slot — each slot has its own predicted-roast, actual-roast, roast-delta, predicted-cup-initial (on the recipe), updated-cup-prediction (post-roast), taste-for, actual-cup, and cup-delta.
- A V-set's **taste-for** for slot `n` is informed by what was tasted in the corresponding slot of prior V-sets on the same lot, plus the producer tasting notes, plus the adjustment being tested this round.
- All taste-based terms in this glossary are **single-palate** (Chris's). Producer tasting notes are an external ballpark anchor, not a target.
- A **reference roast** emerges from a V-set when the cup matches expectations + diminishing returns set in, and is typically locked via one final **control experiment**.
- A **reference cup** is the xBloom day-7 pour-over of the reference roast — one cup, one method, one row.
- An **optimized brew** is dialed in *after* the reference cup, by feeding the reference roast into the brewing-side workflow (same as a purchased roasted bean).
- The end target of the full roast→cup trace is the **optimized brew**, not the reference cup. Post-hoc attribution flows backward: optimized brew → reference cup → reference roast → variables / levers / non-factors.
- Green-bean inventory is finite: each lot supports a bounded number of V-sets (typically ~10 100g batches per pound), making the trace time-constrained. Faster lessons-learned compounding = fewer V-sets needed to reach a reference roast.
- A **reference roast** has a **roasted bean characteristic** that the brewing-side workflow reads when dialing in the optimized brew.
- The "Roast Character" mini-card on the resolved page surfaces three attributes side-by-side: **primary lever**, **acceptable roast window** (roast-deviation latitude), and **brewing tolerance** (brew-deviation latitude). They're three different facets, not three names for the same thing.
- Chris's roasting/brewing style **deprioritizes brewing tolerance** in favor of expressiveness — he intentionally pushes extremes (very light + Full Expression on one side, very dark + Suppression on the other), so a low-tolerance lot is acceptable provided it doesn't fully collapse.
- A green-bean lot moves through lifecycle states in this order: **In inventory** → **Waiting for next roast** → **Waiting for next cupping** → (loop back to Waiting for next roast for V_{n+1}, or progress to) **Resolved**.
- The loop between Waiting for next roast and Waiting for next cupping repeats N times (one per V-set) until a reference roast is declared.
- The transition from a winning cupping to Resolved compresses two sub-events: (1) reference roast designation immediately after a winning xBloom cupping, (2) optimized-brew dial-in by handing the reference roast into the brewing-side workflow (same flow as a purchased roasted bean). Both must complete before the lot is marked Resolved.
- Concurrent multi-lot mode is the normal operating state: Chris typically has several lots in different lifecycle states simultaneously, visible side-by-side on the /green index.
- **Division of labor across the workflow**: Chris does all physical work (roast, cup, taste, judge); **claude.ai** designs experiment frames, writes hypotheses, and inserts/updates app rows via the MCP server; the **Latent app** archives the resulting state. claude.ai is the canonical author for every roasting-side entity.
- A **lot** is uniquely identified by `green_lot_id`; same producer + same cultivar across two purchases = two distinct lots that behave and taste differently (agricultural variability).
- A lot is **typically single-cultivar single-origin**, but green-bean SKUs are occasionally sold as **incoming blends** (e.g. Libertad: Bourbon + Caturra from the same processing station). The current schema (one cultivar / terroir per `green_beans` row) is lossy for these — known limitation.
- **Intentional roasted-blending** (WBC-style: same bean roasted three ways and blended, or two varieties blended) is NOT in current scope but is on the long-term roadmap as Chris's interests move toward competition-style work.
- A resolved lot produces both **lot-specific learnings** (backward-looking audit-trail) and **carry-forward learnings** (forward-looking compounding-knowledge primitive). Two cards, two roles, two audiences.
- **Carry-forward learnings are the compounding-knowledge primitive** — claude.ai reads them when designing V1 on a new lot with overlapping cultivar/terroir/process. Faster compounding = fewer V-sets needed to reach a reference roast on future lots. This is the *whole point* of Latent as a journal.
- **Non-intervention principle**: Chris does not hand-author or edit any roasting-side records. claude.ai writes via MCP based on the cupping/roast trace; Chris's role is physical execution + judgment. Manual intervention is reserved for "glaringly wrong" cases (and even then he asks claude.ai to fix it rather than editing directly). The goal is a self-sustaining knowledge system.
- **Underdev signal** and **overdev signal** key off **development** (whole-curve completeness, including WB→Gnd Agtron uniformity), not classical post-FC time alone.
- The xBloom gate exists precisely **because cup-side signals must be isolated from brewing variance** — bowl cupping's variance smuggled too much brewing-tolerance noise into what looked like cup-side observations.
- **Diagnostic signals** (underdev / overdev) describe *failure modes* — what goes wrong when development is pushed off-target. **Character descriptors** (aromatic / structural / rest behavior) describe *what the cup is* when roasted well. Two different jobs, two different homes.

## Example dialogue

_To be populated once enough terms exist to demonstrate them in conversation._

## Flagged ambiguities

- "Experiment set" was Chris's prior term for the same concept (used interchangeably during the transition to V notation). Resolved: **V-set** is canonical; the V prefix is already encoded in the spreadsheet labels, Roest profile names, and DB identifiers.
- Initial grilling attempt conflated **variable** and **lever** into one term. Resolved: they're distinct — variable is the design-time noun (pre-judgment about whether it matters), lever is the post-hoc promotion (variable that turned out to affect the cup), and **non-factor** names a variable that was tested but didn't matter.
- "Reference cup" was initially treated as the umbrella for "everything tasted from the reference roast". Resolved: it's specifically the xBloom day-7 pour-over cupping; the optimized pour-over recipe is the **optimized brew** (separate entry). Three distinct things: reference roast (the bean state) → reference cup (the xBloom evaluation) → optimized brew (the consumption-condition cup).
- "Best roast" / "winning roast" naming was rejected in favor of **reference roast** because tasting is subjective and there is no objective best — "reference" reflects the calibration role this roast plays for the lot.
- "Elasticity" was previously a single concept conflating roast-side latitude (range of acceptable lever values) and brew-side latitude (how the cup holds up under brewing push/pull). Resolved: split into **acceptable roast window** (roast deviation) and **brewing tolerance** (brew deviation). The `roast_learnings.elasticity` column should be renamed to `brewing_tolerance` and the `roast_window` column relabeled in UI as `acceptable_roast_window` — both are open follow-ups.
- "Lot" cleanly handles single-cultivar single-origin purchases but is lossy for **incoming blends** (a single green-bean SKU sold as a 2-cultivar mix from the same processing station — e.g. Libertad Bourbon + Caturra). **Roasted blends** (multiple lots roasted separately then combined) aren't modeled at all yet — future schema concern if WBC-style work enters scope.
- **Carry-forward learnings is missing a terroir-takeaway axis.** Chris articulated four axes in his mental model (cultivar / terroir / general / starting-hypothesis); the schema today only has three (cultivar / general / starting-hypothesis). Open follow-up: add a `roast_learnings.terroir_takeaway` column. Surfaced during the 2026-05-14 grilling session.
- **Existing roast_learnings underdev/overdev data may intermix cup-side signals with roast-side observations** (e.g. "the roast stalled at the end" is roast-side, but might have been written into a cup-side signal field). Chris flagged this himself during 2026-05-14 grilling. Open follow-up: data audit + claude.ai prompt update so future writes are strictly cup-side, with roast-side observations going somewhere else (potentially a new field or `roast_learnings.roast_anomalies`).
- **Aromatic and structural behavior are misplaced in the current schema.** They live on `roast_learnings` today but conceptually describe a cup (a single tasting event or the synthesized reference cup), not a lot-level lesson. Chris flagged this himself during 2026-05-14 grilling. Open follow-up: relocate `roast_learnings.aromatic_behavior` + `structural_behavior` to a more appropriate home (probably `cuppings` columns or a synthesized field on the reference-cup view). Rest behavior is more ambiguous — currently unused; could stay or move when rest-time-as-variable enters scope.
