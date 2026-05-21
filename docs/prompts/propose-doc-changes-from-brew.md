Take the lessons from this brewing session and propose doc updates via
propose_doc_changes. If you have feedback for Claude Code on the proposal
path, mention it.

BEFORE drafting any citation, fetch the live document so current_text is
verbatim from what's deployed (project-uploaded copies may have drifted):

  - Brewing Historian cluster (post-Wave-2-PR-2 home for By Process / By Variety /
    Cross-Coffee Insight Layer / Cooling Behavior / Office Brewing Notes / By
    Modifier / Open Questions / per-strategy "Coffees That Confirmed X" /
    per-cultivar / per-coffee-family content):
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/cross-coffee-insights.md", anchor="<Section Name>")
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/by-strategy/<strategy>.md", anchor="<Section Name>")
      read_doc_section(uri="docs://skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md", anchor="<Section Name>")
    target_doc is "skills/brewing-historian/cluster/patterns/<path>.md".

  - Brew Prompt operational guide (Step 1-4 Coffee Brief / Recipe Output /
    Iteration Loop / Resolved Brew Output Format — post-Wave-4-PR-4b home):
      read_doc(uri="docs://skills/brewing-assistant/cluster/operational-guide.md")
      read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md", anchor="<Section Name>")
    target_doc is "skills/brewing-assistant/cluster/operational-guide.md".

  - Equipment reference (Location Constraints / Brewer / Filter / Grinder /
    SWORKS dial — post-Wave-4-PR-4b home):
      read_doc(uri="docs://skills/brewing-equipment-expert/cluster/operational-reference.md")
    target_doc is "skills/brewing-equipment-expert/cluster/<file>.md"
    (operational-reference.md / brewers.md / filters.md / grinder-eg1.md / sworks.md).

  - WBC reference (Section 4 + 102-recipe corpus — post-Wave-2-PR-1 home):
      read_doc(uri="docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md")
      read_doc(uri="docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md")
    target_doc is "skills/wbc-brewing-archivist/cluster/<file>.md".

  - Cross-domain (roasting + brewing) patterns — CCIL cluster:
      read_doc(uri="docs://skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md")
    target_doc is "skills/ccil/cluster/coffee/<cultivar-slug>/across-roasting-and-brewing.md".

  - Roaster cards live at docs://brewing/roasters.md (legacy path retained):
      read_doc_section(uri="docs://brewing/roasters.md", anchor="<Canonical Roaster Name>")
    Verify the canonical roaster name via read_canonical(axis: "roasters")
    if unsure. target_doc for these citations is "roaster/<Canonical Roaster Name>".

  - Taxonomy edits (rare from a brew session - new flavor alias, new
    producer entry): read_doc_section(uri="docs://taxonomies/<axis>.md",
    anchor="<Section>"). Doc-path axes that remain in taxonomies/: regions,
    varieties, processes, roasters, producers, flavors, roast-levels.
    target_doc is "taxonomies/<axis>.md". NOTE: brewers / filters / grinders /
    sworks have migrated to the Brewing Equipment Expert cluster (Wave 1 /
    2026-05-26) — use "skills/brewing-equipment-expert/cluster/<axis>.md"
    instead. `'brewing.md'` as target_doc is deprecated post Wave 4 PR 4b
    per ARBITER.md § target_doc routing — BREWING.md is now a 3KB redirect stub.

For replace operations, copy the existing text VERBATIM from the fetched
section into current_text so the arbiter detects drift. For append /
prepend, omit current_text unless a positional hint is helpful.

Submit as a single multi-citation propose_doc_changes call with source =
{kind: "brew", id: "<brew_id>"}. Per-citation target_doc overrides the
proposal-level default; one proposal can update a roaster card +
brewing-historian cluster doc + Open Questions entry simultaneously.

Most likely sections from a brew session: By Process, By Variety,
per-strategy "Coffees That Confirmed X", Cooling Behavior, the relevant
roaster card, Open Questions — all now under the Brewing Historian cluster
at docs/skills/brewing-historian/cluster/patterns/*.
