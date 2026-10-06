**Claude Code entry note (brewing is Claude-Code-native; claude.ai brewing retired 2026-06-18,
roadmap #4).** The ergonomic entry is the `brew` skill (`.claude/skills/brew/SKILL.md`, trigger
"brew a coffee" / "start a brew"); THIS prompt is the **fallback** when a fresh mobile session
does not surface that skill (paste it as the operator one-liner and proceed against the same
operational guide), and the substrate the skill references for the self-roasted optimized-brew
carve-out below. The `read_doc_section` / `read_canonical` calls are client-agnostic; the write
path is `push_brew` via the Latent MCP server regardless of client (the migration changed the
orchestration surface, never the write path).

**Running tasting-arc state block (Phase 2 compaction discipline; all clients, load-bearing on
Claude Code mobile).** Phase-2 iteration is audio-heavy and can span an idle gap (brew, return
hours later). Compaction preserves load-bearing identifiers verbatim but compresses long
tool-result bodies, including per-iteration tasting detail, to gist (mobile-probe finding,
2026-06-09/10), so the iteration arc is exactly what is at risk. Maintain a compact running
ARC-STATE block in the conversation (coffee · current recipe params · per-brew tasting arc
aroma / hot ~59 / warm ~54 / cool ≤50 · leading direction · next single-variable change) and
restate + update it every iteration turn so the arc lives in recent context (which compaction
keeps) rather than only in old tool-result bodies (which it compresses). It is the in-thread
analog of the roasting Brief's write-at-every-break discipline. When the operator dictates a long
multi-fact tasting turn, extract every implicit term into the right station, fold it into the
block, and keep the response tight (`feedback_audio_dictation`).

---

New coffee. **Every pourover starts from the Latent house style** (CONTEXT-brewing.md
headword; ADR-0026): SWORKS + xBloom Premium · 1:16, 15 g · 6.5 · 94°C on base · 45 g Dial 0 /
45 s → 150 g Dial 5 → 240 g Dial 5, Dial 6 at the end; labelled Hybrid (Sequential). Step 1 names
the delta or adjustment row, Step 2 emits the chassis with it applied, Step 3 iterates by row.
Do not design from zero; leave the SWORKS only on the four rotation triggers.

Fetch the two stage-keyed sections of the operational guide via:
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 1 — Coffee Brief (Claude runs this automatically)") and
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 2 — Recipe Output (after strategy is confirmed)"). When iteration
begins (Phase 2, the operator returns with tasting notes), pull
read_doc_section(uri="docs://skills/brewing-assistant/cluster/operational-guide.md",
anchor="Step 3 — Iteration Loop (Phase 2 — in-thread iteration)") at that point —
not before. The Step 4 Resolved Brew Output Format lives in
`bundled-brewing-completion.md`'s session start and does NOT need to be
pre-loaded here. The anchor strings above are the verbatim h2 headings in the
operational guide (em-dashes preserved). If an anchor fails to resolve, fall
back to list_doc_sections(uri="docs://skills/brewing-assistant/cluster/operational-guide.md")
to discover the current heading set rather than re-fetching the whole doc.

Step 1 specifies its own lookups (purchased: the freezer-stock section lookup, whole-bean Agtron
is the load-bearing pull, never whole-doc read_doc the table; archive: query_brews + the
brewing-historian pattern docs + the roaster card). For brewing equipment knowledge once a
rotation trigger has moved the brew off the SWORKS, dispatch to the Brewing Equipment Expert
(docs://skills/brewing-equipment-expert/cluster/operational-reference.md + brewers.md +
filters.md + grinder-eg1.md + sworks.md). For WBC competitor recipe anchors + cross-cutting
control patterns (Step 1d Named Consideration), dispatch to the WBC Brewing Archivist
(docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md + wbc-recipes.md +
wbc-recipes-by-family.md). For canonical lookups, call read_canonical with the axis name per
docs://skills/coordinator/operator-guide.md § Canonical taxonomy lookups.

Run Step 1; pause at Step 1d for confirmation of the one-sentence brief ("house style +
<row / delta>, labelled <strategy>, modifiers <list / none>") before producing the recipe. Output
the recipe in the Step 2 Output Format: Bloom + Pour Structure in the labeled, CUMULATIVE-target
shape (one labeled line per pour; trailing `Sworks Valve:` / `Switch:` clause on valve/lever
brewers), water source in the Water Recipe field, kettle stance / ramps in a `thermal_staging`
modifier, gear beyond brewer+filter in an `equipment` modifier with a free-text `scope`.

**Self-roasted optimized-brew entry (no Coffee URL — an OPTIMIZED BREW PACKET instead).**
When the input is an `OPTIMIZED BREW PACKET` block (or the operator declares "this is
the optimized brew for <lot>") rather than a Coffee URL, this is the lot's optimized
brew crossing from the roasting project (emitted by `one-shot.md` STAGE 4 for one-shot
lots, or the V-set reference-roast kickoff). Handle it as follows:
- Pull the lot from the shared DB instead of fetching a URL: `get_green_bean({green_bean_id})`
  for identity (origin / variety / producer / process / producer_tasting_notes) +
  `get_bean_pipeline({green_bean_id, roast_id})` with the packet's `roast_id` (the batch this
  brew is dialed for) - returns just that roast row, its cuppings, its recipe and
  `roast_learnings`. Always pass `roast_id`: the unscoped pipeline on a resolved V-set lot is
  67-118K chars and overflows the tool-result cap (hard block on mobile).
- Build the Step 1 Coffee Brief from that roast + cupping (the roasted-bean state IS the
  "coffee"): the producer tasting notes are the target anchor, the cupping prose is what
  the roast actually delivered, and the WB / ground Agtron + dev signals are the
  roasted-bean characteristic. There is no roaster brew guide.
- Seed the Step 1d confirmation from the packet's `starting brewing direction` (the
  operator's read off the cupping table). The default is the Latent house style + the
  roast-level row; a direction that leaves the house style (e.g. "intensity-clarity split,
  push hard upfront") governs over any stale design-time hypothesis on the recipe row and is
  recorded in one line of `strategy_notes`. Confirm it with the operator before producing the
  recipe, same as any other brief.
- Carry the optimized-brew declaration to completion: at `bundled-brewing-completion.md`
  this brew is the self-roasted **carve-out** (it does NOT stop at the self-roasted gate) —
  it runs `push_brew` (`source: "self-roasted"`, `roaster: "Latent"`, `green_bean_id` +
  the packet's `roast_id` both set, regardless of whether the roast is reference-quality)
  and hands back the `brew_id` for the roasting thread's close-out prompt to LINK via
  `green_beans.optimized_brew_id`. Iterate normally (Phase 2 loop) until the recipe is final.

Coffee URL:  (or paste an OPTIMIZED BREW PACKET in place of the URL — see the self-roasted entry above)
Dose: 15g
Brewing location: [Home or Office]
Reference experience (optional):
Roaster brew guide URL (optional):
