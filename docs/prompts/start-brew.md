New coffee. For the Coffee Brief + starting-recipe construction, fetch the
two stage-keyed sections of the BREW PROMPT operational guide via:
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 1 — Coffee Brief (Claude runs this automatically)") and
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 2 — Recipe Output (after strategy is confirmed)"). When iteration
begins (Phase 2, the operator returns with tasting notes), pull
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 3 — Iteration Loop (Phase 2 — in-thread iteration)") at that point —
not before. The Step 4 Resolved Brew Output Format lives in
`bundled-brewing-completion.md`'s session start and does NOT need to be
pre-loaded here; that prompt pulls it when the resolved brew gets composed at
log time. The anchor strings above are the verbatim h2 headings in the
operational-guide (em-dashes preserved). If an anchor fails to resolve, fall
back to list_doc_sections(uri="docs://skills/brewing-assistant/cluster/operational-guide.md")
to discover the current heading set rather than re-fetching the whole doc.

For brewing equipment knowledge (brewer / filter / grinder / SWORKS dial
behavior + Location Constraints + Equipment + Valve + Filter System + Example
Outputs), dispatch to the Brewing Equipment Expert
(docs://skills/brewing-equipment-expert/cluster/operational-reference.md +
brewers.md + filters.md + grinder-eg1.md + sworks.md). For WBC competitor
recipe anchors + cross-cutting control patterns (Step 1d Named Consideration),
dispatch to the WBC Brewing Archivist
(docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md +
docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md). For canonical
lookups, call read_canonical Tool with the axis name per
docs://skills/coordinator/operator-guide.md § Canonical taxonomy lookups. Run
Step 1 Coffee Brief; pause at Step 1d for strategy + modifier confirmation
before producing the recipe.

Coffee URL:
Dose: 15g
Brewing location: [Home or Office]
Reference experience (optional):
Roaster brew guide URL (optional):
