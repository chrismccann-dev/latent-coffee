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

Here is the completed archive entry:
[paste the formatted archive recipe]
