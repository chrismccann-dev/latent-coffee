**Completion engine for the Claude Code `/brew` skill (brewing is Claude-Code-native;
claude.ai brewing retired 2026-06-18).** This is the shared purchased-brew completion path the
`/brew` skill hands off to (and that `peer-variant-completion.md` wraps as STEP A); it is
client-agnostic and composed via `read_doc`. The former `log-brew.md` +
`propose-doc-changes-from-brew.md` redirect stubs were removed at retirement.

Use when a PURCHASED brew is finished. **HARD GATE — STOP before STEP 1
if this brew is self-roasted.** Self-roasted brews (`roaster: "Latent"`,
or brewed from a coffee with a `green_bean_id` in the Latent app) push via
`close-lot.md` STAGE 4 as part of lot close-out — NOT through this prompt.
A push_brew here on a self-roasted lot creates an orphan brew row that the
architecture explicitly routes elsewhere. Recovery from accidental push:
patch_brew to update the row, but prefer not pushing in the first place.

**Self-roasted detection at session start** (do this BEFORE any other STEP):
ask "is this brew from a coffee Chris roasted himself?" Signals: explicit
"self-roasted" or "Latent" framing in the user message, batch # references,
a roast date instead of a roaster purchase date, the coffee URL pointing
at a green-bean PRODUCT-PATH on a green-bean source (e.g. Sweet Maria's
`/products/<green-bean-name>`, Showroom Coffee, Untold Coffee Lab's *green*
product pages, JA Coffee, Forest Coffee). NOTE: some roasters sell BOTH
green and roasted from the same domain (Untold Coffee Lab is the canonical
example — `untoldcoffeelab.com` carries both). Discriminate by URL PATH /
product type, NOT by bare domain: `/products/...-roasted` or `/coffee/...`
is roasted; `/products/...-green` or `/green/...` is green. If the URL is
ambiguous, ASK Chris (this single question survives the no-confirmation
rule below). If self-roasted, STOP — give Chris the handoff context
(recipe + tasting arc + brewing-side learnings worth carrying into the
lot record), and tell him to run `close-lot.md` (or `one-shot-closeout.md`
if `green_beans.is_one_shot=true`) in the roasting thread instead.

**Optimized/reference-brew carve-out (Cluster A / MB-7, 2026-06-01).** There is
exactly ONE self-roasted brew that completes HERE rather than via close-lot
STAGE 4: the lot's optimized brew - the daily-consumption pour-over dialed in
for a roast already declared `is_reference: true`, brewed in its own dedicated
brewing thread at lot resolution. Pushing it here (not inline in the close-lot
roasting thread) keeps the full brewing context out of the roasting thread and
gives the optimized brew a real brewing cycle; only its `brew_id` crosses the
project boundary. Signal for the carve-out: the operator says up front "this is
the optimized / reference brew for <lot>" AND the green lot is at
Resolved-pending (reference roast already chosen). **One-shot case
(`green_beans.is_one_shot=true`):** the carve-out fires on `is_one_shot=true` +
Resolved-pending + the operator declaration - NOT on `is_reference` being set
yet. On one-shots the single batch is *structurally* the reference (one roast,
one cup), but the `is_reference: true` flag doesn't land until
`one-shot-closeout.md` STAGE 2, which runs AFTER this brew. So at brew-push time
the roast may still read `is_reference: false` - link the brew to that single
roast anyway. One-shots also commonly hit Outcome B (off-target roast, salvage
brew): link regardless of cup quality. (The Optimized Brew Packet emitted by
`one-shot.md` STAGE 4 is the operator's declaration here.) When it applies, do
NOT stop at the gate - run STEP 1 push_brew as normal (`source:
"self-roasted"`, `roaster: "Latent"`, `green_bean_id` + `roast_id` of the
single/reference roast both set), then emit the closing handoff line at the end
of this prompt so `close-lot.md` STAGE 4 (V-set) / `one-shot-closeout.md` STAGE
3 (one-shot) LINKS the brew via `green_beans.optimized_brew_id` instead of
re-pushing it. All OTHER self-roasted brews still STOP at the gate
above and route to close-lot - the carve-out is narrow and operator-declared
(one brew, at lot resolution), so it does not reopen the orphan-row hazard the
gate guards against; this brew is the most-linked row in the system, not an
orphan. **Invariant: pushed exactly ONCE (here) and linked exactly ONCE
(close-lot STAGE 4).** This thread pushes the brew row; close-lot only LINKS it
via `optimized_brew_id` and must NOT re-push. Never push on both sides - that
creates a duplicate brew row.

**No-confirmation rule scope** (STEP 1 below says "Treat fields as final,
no confirmation"): this applies to FIELD VALUES inside the push_brew payload
(roaster name, terroir, cultivar, recipe parameters, prose) — fire push_brew
without asking Chris to re-confirm each field. The no-confirmation rule does
NOT override the self-roasted gate question above — when the URL or other
signals are genuinely ambiguous, asking Chris one yes/no question to avoid
creating an orphan row is the correct move. The gate question is the only
exception.

**Pre-warm push_brew + propose_doc_changes at session start** (do this
BEFORE STEP 1's tool invocation): `tool_search` ranking can outrank push_brew
behind its siblings (patch_brew / push_green_bean / push_roast_learnings /
get_brew) when the query token matches multiple tools. To avoid an empty-recall
loop at STEP 1, explicitly call `tool_search(query: "INSERT CREATE new brew row primary write path push_brew")`
and `tool_search(query: "propose_doc_changes")` after the catalog fetch and
before STEP 1. If push_brew still doesn't surface in the top-3 result set,
fall back to invoking the tool directly by name (`push_brew`) — the discovery
layer's ranking is advisory; the tool exists in the registry regardless.

At session start (after the self-roasted gate clears), fetch
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 4 — Resolved Brew Output Format") to load the resolved-brew
output shape for STEP 1's push_brew composition. Step 4 is the only
operational-guide section this prompt needs; Steps 1-3 live in start-brew.md's
session and never load here. The anchor string above is the verbatim h2
heading (em-dash preserved); if it fails to resolve, fall back to
list_doc_sections(uri="docs://skills/brewing-assistant/cluster/operational-guide.md")
rather than re-fetching the whole doc. For brewing equipment validation
(brewer / filter / grinder / SWORKS dial behavior), dispatch to the Brewing
Equipment Expert (docs://skills/brewing-equipment-expert/cluster/). For WBC
competitor recipe references and cross-cutting control patterns, dispatch to
the WBC Brewing Archivist (docs://skills/wbc-brewing-archivist/cluster/ —
Wave 2 PR 1, ADR-0011).

Complete this brew session: push_brew first, then propose any doc updates.
If you have feedback for Claude Code on either path, mention it.

STEP 1 - push_brew. Treat fields as final, no confirmation. Validation
errors aggregate in one response - fix all in one retry round. For canonical
lookups call read_canonical(axis: "<name>"). For net-new roaster / producer /
brewer / filter / grinder, set *_override: true (the override path also queues
the value for canonical promotion via taxonomy_overrides_queue; push_brew echoes
queued_for_taxonomy_review[] in the response). Cultivars and terroirs are
strict (no override) — net-new requires a registry edit or a propose_canonical_addition
call. Capture the brew_id from the success response.

When the source coffee's process detail indicates sealed-container / no-headspace /
Grain-Pro-at-low-moisture fermentation execution, set fermentation_qualifiers: ['Anoxic']
on push_brew (Sprint T3 / CR-5 / migration 059, 2026-05-18). Canonical via
FERMENTATION_QUALIFIER_LOOKUP; aliases No Oxygen / Zero O2 / Oxygen Free resolve to
Anoxic. Record-when-known annotation — does not dictate strategy (aggregation stays
at the [Anaerobic] modifier per docs/reference/canonical-registries.md § Qualifier). Omit (leave as []) when not
applicable or not knowable from the source.

Recipe-substrate fields (Sub-sprint 4c, 2026-05-28):
- `water_recipe` (free-text) — the water formula / source. Set it rather than cramming
  water into bloom / pour_structure / strategy_notes (e.g. "Third Wave Water Light Roast
  ~1:3 concentrate:distilled", "Palo Alto office tap", "home remineralized"). No canonical
  registry — store verbatim.
- `modifiers` — two recipe-substrate additions. `thermal_staging` (renamed from
  `inverted_temperature_staging`; legacy name still accepted) covers BOTH the kettle thermal
  stance ("kettle off after bloom, natural cooling", "on-base constant") AND active ramps
  ("86°C → 92°C across two phases") — set `{type:'thermal_staging', phases:'<free-text>'}`.
  `equipment` captures persistent/timed gear beyond brewer+filter (Melodrip, booster,
  Paragon ball) — set `{type:'equipment', name:'Melodrip', scope:'throughout'}` where
  `scope` is free-text ("throughout" / "bloom + P1" / "bloom + P1, removed at P2"). Leave
  existing Paragon-as-aroma_capture usage alone; use `equipment` going forward for
  flow/agitation gear.

Pour structure — write the STRUCTURED `pours` array (migration 074, 2026-05-30). This is now
the canonical shape; it replaces the legacy free-text `bloom` + `pour_structure` (those still
exist as a fallback for un-migrated rows — when you send `pours`, you may omit them). Emit ONE
flat object per real step; `/brews/[id]` renders the array directly, so there is no parser to
fight — getting the array right is the whole job. Shape:
- `pours`: array of `{ type, at, to_g?, pour_s?, hold_s?, valve?, detail? }`.
  - `type`: `"bloom"` (ALWAYS index 0) or `"pour"`.
  - `at`: start time `"m:ss"` — REQUIRED. The next step's `at` reads as this step's end, so
    Chris never does mental math at the bench. Number the pours by reading order.
  - `to_g`: cumulative grams at the end of the step (cumulative, NOT incremental).
  - `pour_s` / `hold_s`: pour duration / closed-immersion (steep) hold, in seconds. Optional;
    these are queryable mirrors, not rendered — fill when known.
  - `valve`: valve state for valve brewers (`"closed"` | `"open"` | `"Dial 5"` | `"Dial 6 (Half-Open)"`);
    null for non-valve brewers (Kalita / April / Orea / V60). Queryable mirror.
  - `detail`: the readable technique line — this is what renders. Pattern (center/spiral),
    agitation (gentle/brisk), kettle on/off-base stance, drain-and-reclose, and valve
    transitions ("crack to Dial 7 as bed drops below half") ALL go here as prose. Do NOT type
    them into separate fields.
- One-step-per-real-step discipline (this is the failure mode the structure exists to kill):
  do NOT restate the bloom as a pour step (it is already index 0); do NOT emit a step for a
  non-pour like "office tap water" or "kettle on base throughout" (that's `water_recipe` +
  per-step `detail`); do NOT emit a step for technique-level meta like "manual lever-staged
  immersion, three closed steeps" or "no Melodrip, boiling throughout" — that belongs in
  `strategy_notes`. Drawdown is not a step; rely on `total_time`.
- Worked example (Hario Switch, manual-lever immersion): `[{type:"bloom", at:"0:00", to_g:50,
  hold_s:45, valve:"closed", detail:"gentle saturation + single swirl; open and drain (~10s), re-close"},
  {type:"pour", at:"0:55", to_g:130, hold_s:60, valve:"closed", detail:"Steep 1 — pour closed, hold, ~10s drain"},
  {type:"pour", at:"2:05", to_g:240, hold_s:75, valve:"closed → open", detail:"Steep 2 — pour closed, hold, then open and drain completely"}]`.

STEP 2 - propose_doc_changes for lessons from this session. source =
{kind: "brew", id: "<brew_id from STEP 1>"}. BEFORE drafting any citation,
fetch the live cluster doc with read_doc(uri="docs://skills/<cluster-path>.md")
(or read_doc_section against the same URI) so current_text is verbatim.
target_doc shapes: "skills/<path>.md" for composable sub-skill cluster docs
(canonical post Wave 4 PR 4b — e.g. "skills/wbc-brewing-archivist/cluster/wbc-reference.md"
to amend the WBC reference; validated against the registered SKILL_FILES
allow-list), "roaster/<Canonical Name>" for roaster cards (live at
docs://brewing/roasters.md), or "taxonomies/<axis>.md" for taxonomy edits
(axes: regions, varieties, processes, roasters, producers, flavors,
roast-levels — note: brewers, filters, grinders, sworks have migrated to
the Brewing Equipment Expert cluster; use "skills/brewing-equipment-expert/cluster/<axis>.md").
`'brewing.md'` as target_doc is deprecated post Wave 4 PR 4b per ARBITER.md §
target_doc routing — BREWING.md is now a 3KB redirect stub. Per-citation
target_doc overrides the proposal-level default. For replace, copy
current_text VERBATIM. Multi-citation + multi-target_doc proposals supported.

**Auto-split when citations span multiple target_docs** (Round 15 diagnostic,
2026-05-26 / Sub-sprint 2 Item 15(b)). If your proposal would carry citations
targeting more than one distinct `target_doc` (e.g. a roaster-card update AND
a brewing-historian cross-coffee-insights append), issue ONE `propose_doc_changes`
call per `(target_doc, section_anchor)` pair instead of a single multi-citation
bundle. The aggregate payload (proposed_text + rationale sum) across multiple
target_docs trips claude.ai's client-side approval-gating ceiling that doesn't
fire on single-citation calls. Each split call carries exactly one citation,
one target_doc, one section_anchor — keeps each payload small and the approval
flow smooth. Reuse the same `source` shape across split calls; use the same
`summary` (or append a short `(1/N)` suffix per call). Auto-supersede operates
per `(target_doc, section_anchor)`, so split calls remain idempotent on re-run.
When all citations target the SAME target_doc, a single multi-citation call
stays correct — the split rule only fires on cross-target_doc bundles.

Most likely targets (all brewing-side learnings now live in cluster docs):

  - target_doc="skills/brewing-historian/cluster/patterns/cross-coffee-insights.md"
    for By Process / By Variety / Cooling Behavior / Office Brewing Notes /
    By Modifier / Open Questions entries
  - target_doc="skills/brewing-historian/cluster/patterns/by-strategy/<strategy>.md"
    for new "Coffees That Confirmed X" data points (clarity-first / suppression /
    balanced-intensity / full-expression / extraction-push / hybrid)
  - target_doc="skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md"
    or by-coffee-family/<family>.md for per-cluster deep-dive patterns
  - target_doc="skills/brewing-assistant/cluster/operational-guide.md" for
    the BREW PROMPT operational guidance (Step 1-4 Coffee Brief / Recipe
    Output / Iteration Loop / Resolved Brew Output Format)
  - target_doc="skills/brewing-equipment-expert/cluster/operational-reference.md"
    (or brewers.md / filters.md / grinder-eg1.md / sworks.md) for equipment-side updates
  - target_doc="skills/wbc-brewing-archivist/cluster/wbc-reference.md" (or
    wbc-recipes.md) for WBC reference updates
  - target_doc="skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md"
    for cross-domain (roasting + brewing) patterns
  - target_doc="roaster/<Canonical Roaster Name>" for roaster card updates

STEP 3 - closing handoff (optimized/reference-brew carve-out ONLY; skip for
ordinary purchased brews). If this brew was the optimized/reference brew per the
carve-out above, after STEP 1 + STEP 2 emit one plain-text line I can paste into
the roasting thread: `Optimized brew pushed: brew_id=<id from STEP 1> for lot
<green_bean_id or lot_id>. Paste into close-lot.md STAGE 4 (V-set) or
one-shot-closeout.md STAGE 3 (one-shot) to set green_beans.optimized_brew_id
(link, do not re-push).` Setting the FK itself is the close-out prompt's job,
not this prompt's - this thread only pushes the brew and hands back the id,
keeping the brewing/roasting project boundary clean.

Here is the completed archive entry:
[paste the formatted archive recipe]
