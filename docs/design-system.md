# Design system

Single source of truth for Latent's design system — the full token map, palette, type scale, component-primitive reference, and the design/UX conventions. **Pointed at by both CLAUDE.md § Design / UX conventions and PRODUCT.md § Design System.** Claude-Code-facing reference; read on demand. The code-level *enforcement checklist* (the few rules wanted every UI session) stays inline in CLAUDE.md § Design / UX conventions. Extracted 2026-06-02 (root-doc compaction) — move-never-delete: CLAUDE.md § Design conventions + PRODUCT.md § Design System combined here verbatim.

## Design / UX conventions

**See [PRODUCT.md § Design System](PRODUCT.md#design-system) for the full token map, palette, type scale, and component primitive reference.** The rules below are the code-level enforcement points.

- **Desktop-primary default + named mobile-primary "workflow-companion" surfaces (Q3, 2026-05-29).** Default: desktop-primary, mobile-must-not-regress for reference/study surfaces (aggregation pages, indexes, resolved lots, archive reading). **Exception:** workflow-companion surfaces are mobile-primary — `/brews/[id]` recipe (brew bench), `/green/[id]` waiting-for-cupping (cupping table), (soft) `/green/[id]` waiting-for-roast. Mobile pass folds into each surface's own per-surface sprint + a light closing regression sweep. Spot-check at **390 + 1024** via `preview_resize`.
- **Responsive infra = CSS container queries, not `@media` (ratification #3, 2026-05-29).** The `.ssp-*` primitives are responsive via `@container ssppage (min-width: …)` — wrap a page in `.ssp-page` (carries `container-type: inline-size; container-name: ssppage`) to activate. Two-point model: **390** + **1024**; the 768 tablet breakpoint is dropped. No Tailwind container-query plugin — raw CSS in `globals.css`. **Per-surface mobile pattern rule:** use `order-*` reordering (single tree) where mobile is a resequence of the same blocks; use a container-query dual-subtree (`.s2-desktop`/`.s2-mobile`, both in DOM) where mobile needs a genuinely different composition (e.g. cupping transposed-table → slot-cards; 520px crossover). Both are no-`@media`. Formalized in [ADR-0018](docs/adr/0018-per-surface-mobile-pattern.md).
- **Mobile as forcing function (single shared IA) — [ADR-0018](docs/adr/0018-per-surface-mobile-pattern.md).** A surface has ONE information architecture, not a desktop IA plus a separate mobile IA. The most-constrained surface (the mobile / workflow-companion width) is the forcing function that ranks information by importance; that single priority order is then expressed at every width — desktop was edited to match the mobile-derived ranking, not the reverse. Mobile and desktop differ only in how much of the tertiary tier folds behind progressive disclosure (a `<details>`), never in *what* is shown or its priority. The `order-*` single-tree vs dual-subtree choice (above) is the *implementation* of that one shared IA, never a license for divergent mobile content — two subtrees carrying different information is the smell that the shared-IA rule was violated. Partner term to "workflow-companion surface" above.
- **Tokens live in `tailwind.config.ts` + `app/globals.css`.** Adding a token = a deliberate decision, not drift. No arbitrary `text-[Npx]` / `p-[Npx]` in JSX for anything chrome-related — if a size isn't in the scale, add it to the theme (and document what it's for) or don't use it. **v2 re-skin (Redesign Sprint 0, 2026-05-29):** `latent-*` token NAMES stay primary (all app code unchanged); values re-pointed to warm paper. v2's CSS-var names (`--acc-*` etc.) live in `:root` + back the `.ssp-*` family.
- **Typography scale:** `text-chip` (8px), `text-micro` (9px), `text-xxs` (10.4px), `text-xs` (11.5px), `text-sm` (13px, body — v2), `text-lg` (18px, mono card titles per ratification #2), `text-xl` (20px), `text-2xl` (22px, detail hero `<h1>` sans). The loudest in-product text is a hero `<h1>` at `text-2xl font-semibold`. Index card variety/lot names go mono (per-surface flip); detail `<h1>` stays sans. No display type.
- **Chrome vs semantic colors:**
  - Chrome (warm paper post v2 re-skin): `latent-fg #0E0E0E / bg #F2F1EC / mid / subtle / border / paper / surface / hairline / accent / accent-light / highlight / highlight-border`. Use these via Tailwind utility classes; never hardcode hex for chrome.
  - **Flavor accents (v2, 2026-05-29):** `latent-acc-{green,coral,teal,amber,plum}` each with `-bg` + `-br`. Labels / chips / dots / swatches only — consumed by the `Chip` primitive's 5 tones + `SspFlavorAxis`. Distinct from the semantic-chrome roles below.
  - **Semantic-chrome / temporal-salience tokens (Sub Pages 6.4, 2026-05-13; re-derived + extended v2 2026-05-29):** `latent-roast-emphasis` (amber — design intent / drop rules / varying-lever cells / delta callouts), `latent-cup-emphasis` (lavender — cupping hypothesis / taste-for / reference signals), `latent-resolved-emphasis` (green — resolved lots / reference-roast cards / "why this roast won"), `latent-archive-emphasis` (grey — archive / read-once provenance, **new 4th role**). Each has `-surface` + `-br`. Named by meaning, not color, so the palette can shift without rename. Pairing: `bg-latent-X-emphasis-surface border border-latent-X-emphasis-br` for a colored card; `text-latent-X-emphasis` / `border-l-2 border-latent-X-emphasis` for accents in neutral cards.
  - **Lifecycle-tile gradient (v2, 2026-05-29):** `latent-tile-{inventory(grey),next-roast(sage),next-cupping(olive-bronze),resolved(roasted-brown #3a2418)}` — green-coffee → roasted-coffee. `/green` index binds states to these (resolved = brown per ratification #5, replacing the prior near-black `fg`); unresolved keeps neutral `mid`. Detail-view hero tiles still use the old per-surface emphasis bindings (cupping = lavender `#7A6E9E` / waiting-roast = amber `#A88037` / resolved = green). **Reconciliation decided at the resync grill (2026-05-31): the hero cover reconciles ONTO the lifecycle gradient (hero per state = sage / olive-bronze / roasted-brown / grey, matching the index card the user tapped from), while the in-content emphasis accents STAY (amber on drop-temp + drop-rules, lavender on predicted-cup + producer-notes, green on the resolved verdict + reference-cup).** Two separated color axes: **hero = lifecycle state** (consistent index→detail), **content accent = task salience** (points the eye at the field that matters at the bench). They never compete because they live in different page zones. Rebind the 3 `SspNamePlate` cover colors on the green detail views (amber/lavender → `--tile-*` token) — small touch-up queued post-resync-grill; the accents are load-bearing and untouched.
  - Semantic palettes live in `lib/brew-colors.ts`, `lib/extraction-strategy.ts`, `lib/process-registry.ts`, `lib/flavor-registry.ts`, `lib/roaster-registry.ts`, `lib/country-colors.ts`, `lib/cultivar-family-colors.ts`, `lib/process-axis-colors.ts`. Each is the single source of truth for its signal; do not copy the constants into page files. **These keep Latent's hues** — the v2 re-skin did NOT re-derive them (pull from v2 only where a value clashes with warm paper).
  - Hue-separated colors — if a signal deserves its own color, shift hue, not lightness.
- **Primitive components — use, don't reimplement:**
  - (`SectionCard` + `Tag` were **deleted** in Redesign Sprint 5 — every detail surface is `Ssp*` now; don't reintroduce them.)
  - `<TagLinkList>` for every cross-link tag block on aggregation detail pages.
  - `<StrategyPill>`, `<FlavorNotesByFamily>` are canonical — don't redraw them.
  - **Index-page family (`@/components/IndexList`, Redesign Sprint 6, 2026-05-29):** `IndexCap` (page caption — every index page) / `GrlRow` (grouped-list row, `count`+`max` → `.cnt` + 5-block `barBlocks` bar, OR `right` → `.simple` free-meta variant) / `GrlGroupHeader` (swatch + group name + count) / `LotStage` (/green lifecycle section header) + the `barBlocks(count, max)` helper. CSS = the `.cap` / `.grl-*` / `.lot-stage` block in `globals.css` (the v2 "legacy" index family, distinct from `.ssp-*`). The /brews book-cover card is its own primitive (`@/components/BrewCard`). Index pages are fluid reference surfaces — no `.ssp-page` container query (grl/lot rows are inherently fluid; the brew grid uses Tailwind responsive cols).
  - `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-sm` for every button-shaped element; `.input` / `.textarea` for every form field; `.label` for every mono-uppercase section header.
  - **`Ssp*` family (`@/components/Ssp`, Redesign Sprint 0; grown through Sprint 5):** `Chip` / `StatusPill` / `SspTopBar` / `SspNamePlate` / `SspShead` / `SspKVStrip`(=`SspRecipeHead`) / `SspTimeline` / `SspModifier` / `SspFlavorAxis` / `SspStructure` / `SspIdentGrid` / `SspExpGrid` / `SspProseRows` + `compactRows` helper (Sprint 5 — drops empty prose rows; feeds the section-visibility gate too) / `SspInset` (Sprint 4 — grid/stack modes, amber/cup tones) + CSS-only `.blk`/`.hero`/`details.ssp-coll`. The v2 "lab-document" primitives — RSC over the `.ssp-*` CSS in `globals.css`. **Shared aggregation chrome (Sprint 5):** `CoffeesList` (`@/components/CoffeesList` — `SspShead` header + book-cover hairline rows + 10+`<details>` expander; `metaFor`/`showProcessBadge` props) + `ConfidenceCard` (`@/components/ConfidenceCard` — `.ssp-card.dark`, shared `confidenceFor`, optional `desc` override) + the re-skinned `CollapsibleBlock` (`.ssp-coll`) / `FlavorNotesByFamily` + `TagLinkList` (both now `.ssp-sub` blocks of `Chip`s) / `SynthesisCard` (`.ssp-card` + `SspShead`, keeps the `md:` short/long content split) — consumed by all 4 aggregation detail families. **MIGRATION WINDOW CLOSED FOR ALL DETAIL PAGES (Sprint 5, 2026-05-29):** `/brews/[id]`, all 5 `/green` views, AND the 4 aggregation detail families (roaster / cultivar / terroir / processes) are now `Ssp*`. The legacy `SectionCard` + `Tag` components were **deleted** (zero consumers), along with the process-only `ProcessCoffeesList` / `ProcessConfidenceCard` / `ProcessBreakdownRow` (subsumed by `CoffeesList` / `ConfidenceCard` / `SspStructure`). Only the index pages (`/brews`, `/green`, `/roasters`, `/cultivars`, `/terroirs`, `/processes`) remain un-migrated.
- **Content on cards** — the `/brews` book-cover card splits into a colored cover **face** (variety / process / flavor + strategy-abbrev pill) and a warm-paper **foot** (producer / region / roaster), per the v2 paper-foot adoption (Redesign Sprint 6 PR3, 2026-05-29 — supersedes the prior "everything on the cover, no text below" rule). Face = identity + flavor signal; foot = sourcing provenance. Still avoid "where does this data live" duplication across the two zones.
- **`next dev` does not hot-reload `tailwind.config.ts` theme-extend changes.** When adding a new token, restart the dev server before verifying in `preview_*`, or you'll see the browser default and not the token.
- **Confidence bars use ONE canonical brew-count rule app-wide (Chris-locked 2026-05-28):** `1 = LOW · 2-4 = MEDIUM · 5+ = HIGH`, label uppercase (`LOW` / `MEDIUM` / `HIGH`). All four aggregation surfaces — process / roaster / cultivar / terroir — call the shared [lib/confidence.ts](lib/confidence.ts) `confidenceFor(brewCount)` helper (consolidated 2026-05-28 so they can't drift apart; terroir spreads the result and overrides `desc` for its `nonProcessCount`-based MEDIUM line while keeping the shared label/emoji). Any new confidence bar imports `confidenceFor` — do NOT re-inline the thresholds or introduce a per-surface variant.


## Design System

The brand voice is **quiet research notebook**: monospace labels, book-cover cards per brew, uppercase taxonomy, a restrained palette that lets coffee metadata do the talking. Code-level source of truth is `tailwind.config.ts` + `app/globals.css`. The Dropbox folder `Latent Coffee Design System/` is the **Claude Design skill workspace** (UI-kit prototypes, preview HTML, the mirrored `colors_and_type.css` reference) — it is not mirrored into this repo; the Tailwind config wins whenever they disagree.

**v2 re-skin (Redesign Sprint 0, 2026-05-29).** The palette moved from cool near-white + single sage to **warm paper** (`bg #F2F1EC` / `fg #0E0E0E`) with a 5-tone flavor-accent family + a formalized lifecycle-tile gradient, and a new `.ssp-*` "lab-document" primitive family (`components/Ssp.tsx`) landed alongside the legacy `SectionCard`/`Tag` chrome. Token *names* stay `latent-*` (zero JSX churn); only values changed + new families were added. v2's CSS-var names live in `:root` (`app/globals.css`) and back the `.ssp-*` classes. Governing principle: the claude.ai/design v2 system is a **source to pull from, not adopt carte blanche** — Latent's framework (Tailwind tokens, `lib/*` source-of-truth, RSC) wins on every naming/structure divergence. The semantic palettes in `lib/*` keep **Latent's** hues (not re-derived from v2). Per-surface layout re-skins follow in Sprints 1..N; Sprint 0 propagated the look via tokens + primitives with zero layout reorganization. Full scope: [docs/features/claude-design-redesign-scope-2026-05-29.md](docs/features/claude-design-redesign-scope-2026-05-29.md).

### Voice & casing

- **First-person research notebook.** Chris speaks as *"I"* — "What I learned", "My taste profile". Never *"you"* or *"we"*. No marketing copy, no CTAs beyond `+ ADD`, no hero headlines.
- **Taxonomic over marketing.** Coffees are classified, not sold. Numbers are labels, not features (`55 COFFEES`, never "55+ coffees tasted!").
- **Uppercase mono** for every label, nav item, badge, pill, section header, count chrome. **Title-case sans** for coffee names, terroir/cultivar names. **Sentence case prose** for the narrative content inside cards.

### Palette

- **Chrome (warm paper, post v2 re-skin):** `latent-bg #F2F1EC` (page), `latent-fg #0E0E0E` (ink), `latent-mid #6B6B66` (secondary text), `latent-subtle #B4B4AE` (tertiary), `latent-border #E0DFDA` (hairline), `latent-paper #FAFAF7` (tinted card surface), `latent-surface #FFFFFF` (pure-white surface / nav bar), `latent-hairline #EDEBE5` (in-card dividers), `latent-accent #2C4A35` (dark green, primary-button hover), `latent-accent-light #4A7C59` (focus ring, sage), `latent-highlight #EDF3EC` + `latent-highlight-border #C9DBC4` (tag/chip background).
- **Flavor accents (labels / chips / dots / swatches only):** `latent-acc-{green,coral,teal,amber,plum}` each with `-bg` + `-br` (green `#5B8A5A`, coral `#C77A5C`, teal `#5C8A8C`, amber `#A88037`, plum `#8E5A6E`). Consumed by the `Chip` primitive's 5 tones + the `SspFlavorAxis` 4-cell (teal/coral/amber/plum). Distinct from semantic chrome.
- **Semantic chrome (workflow-state roles):** `latent-roast-emphasis` (amber `#A88037` — design intent / drop rules / predictions), `latent-cup-emphasis` (lavender `#7A6E9E` — cupping hypothesis / reference signals; was plum), `latent-resolved-emphasis` (green `#4A7C59` — resolved lots / reference roast / peak), `latent-archive-emphasis` (grey `#6B6B66` — archive / read-once provenance, **new 4th role**). Each has `-surface` + `-br` variants. Named by meaning, not color.
- **Lifecycle tiles (green-coffee → roasted-coffee gradient):** `latent-tile-inventory` (grey `#B4B4AE`) → `latent-tile-next-roast` (sage `#4A7C59`) → `latent-tile-next-cupping` (olive-bronze `#6B5E3A`) → `latent-tile-resolved` (roasted brown `#3a2418`). The `/green` index binds states to these (resolved = brown per ratification #5, replacing the prior near-black `fg`); unresolved keeps neutral `mid` (outside the green-brown axis).
- **Semantic palettes (Latent's hues — kept, not re-derived from v2):**
  - Book-cover colors: `lib/brew-colors.ts` — process × flavor signals (sage for Gesha/washed, burgundy for anaerobic/wine, gold for honey, brown for natural, teal for floral, slate fallback).
  - Extraction-strategy pills: `lib/extraction-strategy.ts` — Clarity-First (sage), Balanced (ochre), Full (burgundy).
  - Process families: `lib/process-registry.ts` — 5 families × per-family hue (back-compat shape; post 1e.1 the file also exports the full composable process registry).
  - Flavor families: `lib/flavor-registry.ts` — 8 families × per-family hue, hue-separated not lightness-separated.
  - Roaster families: `lib/roaster-registry.ts` — 5 BMR-mirrored families + warm-neutral per-roaster swatches.
  - Country swatches: `lib/country-colors.ts` — 12 earth-toned hues, one per producing country.
  - Cultivar family swatches: `lib/cultivar-family-colors.ts` — 6 warm/cool hues, one per genetic family.
  - Process modifier-axis swatches: `lib/process-axis-colors.ts` — fermentation/drying/intervention/experimental + signature swatch + neutral fallback (centralized Sprint 0 from a map duplicated across two `/processes` pages).
- **Hue-separation rule** — two colors at different saturation still read as "the same color." If a signal deserves its own color, shift hue, not lightness.
- **One helper per visual system.** Each semantic palette has exactly one source-of-truth file. Do not copy palette maps into pages.

### Type scale

- **Sans:** Inter (300/400/500/600/700) — coffee names, prose, headings.
- **Mono:** JetBrains Mono (400/500/600/700) — labels, nav, tags, data, badges, buttons. This is the brand's signature voice.
- **Scale** (defined in `tailwind.config.ts`):

| Token | Size | Use |
|---|---|---|
| `text-chip` | 0.5rem (8px) | Strategy-pill short-form, hero cover meta |
| `text-micro` | 0.5625rem (9px) | Strategy-pill row variant, brew-cover flavor line |
| `text-xxs` | 0.65rem (10.4px) | Labels, tags, badges, section headers, metadata |
| `text-xs` | 0.72rem (11.5px) | Nav links, buttons, small chrome |
| `text-sm` | 0.8125rem (13px) | Body prose, inputs (v2 body 13px) |
| `text-lg` | 1.125rem (18px) | Brand wordmark, mono card titles (ratification #2) |
| `text-xl` | 1.25rem (20px) | Wizard step titles |
| `text-2xl` | 1.375rem (22px) | Detail-page hero `<h1>`, sans (largest in-product) |

- **Quiet hierarchy.** The loudest sans text is a detail-page hero `<h1>` at 22px semibold. There is no display/hero type. Page titles are 11.5px mono uppercase labels.
- **Card titles go mono (ratification #2).** Index card variety/lot names use mono (brew-card 18px / lot-card 17px) — a deliberate change from the prior title-case-sans convention. Detail-page hero `<h1>` stays **sans** 22px. (Sprint 0 establishes the scale + builds `.ssp-name h1` sans; the index card-title flip lands per-surface.)
- **Letter-spacing:** `tracking-wide` (0.1em) for most mono uppercase, `tracking-widest` (0.15em) for the brand lockup.

### Spacing

Tailwind defaults, used densely on a narrow set: **1 / 1.5 / 2 / 3 / 4 / 5 / 6 / 8 / 12 / 16**. Page shell is `max-w-3xl` (768px) for detail pages, `max-w-[1200px]` for the /brews grid and header. Horizontal padding `px-6`, vertical `py-8`. Header height fixed `h-14` (56px). No arbitrary `p-[17px]` anywhere — if a size isn't on the scale, it's drift. The v2 `--s1..--s8` CSS-var scale (4/8/12/16/22/32/48/64) lives in `:root` for the `.ssp-*` family's internal padding.

**Responsive infra (Redesign Sprint 0, ratification #3): CSS container queries, two-point model.** The `.ssp-*` primitives are responsive via `@container ssppage (min-width: …)` (not `@media`) — wrap a page in `.ssp-page` (carries `container-type: inline-size`) to activate. Anchors are **390** (mobile) + **1024** (desktop); the hard 768 tablet breakpoint is dropped (tablet falls out of fluid container behavior + a spot-check). No new Tailwind plugin — raw CSS `@container` in `globals.css`.

### Component primitives

Chrome utilities (via `@apply` in `app/globals.css`):
- **`.section-card`** / **`.section-card-dark`** — white/inverse 1px-border card, `rounded-md`, `p-6 mb-4`.
- **`.label`** — mono xxs semibold uppercase `text-latent-mid`, `mb-2 block`. The canonical section-label treatment.
- **`.tag`** — inline-block mono xxs, sage-highlight bg + border, `rounded`, `px-2 py-1`.
- **`.btn` / `.btn-primary` / `.btn-secondary` / `.btn-sm`** — mono xs semibold uppercase, `px-4 py-3` (default) or `px-3 py-2` (`sm`), `rounded`.
- **`.input` / `.textarea`** — mono sm, 1px latent-border, `px-3 py-2`, sage focus ring. (Auth/login + index filter chrome only — no data-editing surface exists; see the read-only-chrome principle below.)
- **`.coffee-card`** — list-row card with hover border shift.
- **`.data-table`** — mono xs table with hairline row dividers + highlight-on-hover.

React components (in `components/`):
- **`<SectionCard title? dark? children>`** — wraps the `.section-card` / `.section-card-dark` treatment with optional `.label`-style title. Every section-of-content on a detail page uses this; do not reimplement inline.
- **`<Tag>`** — renders the `.tag` class.
- **`<TagLinkList title items>`** — `SectionCard` + flex-wrap of `<Link><Tag>`. Used for every cross-link tag block on aggregation detail pages.
- **`<StrategyPill strategy variant="row"|"card">`** — extraction-strategy badge; `card` on book covers, `row` reserved for future use.
- **`<FlavorNotesByFamily>`** — renders `aggregateFlavorNotes(brews)` grouped into the 8 flavor families.
- **`<FlavorComposer>`** — chip composer for the 3-axis flavor system. Single typeahead per chip (autocomplete mixes bases + aliases); click chip to expand 3-slot inline editor (base + 2 modifier dropdowns). Tea-base modifier expansion + allowOverride. Replaces the deprecated `<FlavorNotesInput>`.
- **`<StructureTagsPicker>`** — axis-grouped pickers for per-coffee structure descriptors (4 always-shown + 3 collapsible).
- **`<Header>`** — sticky brand + nav + mobile hamburger. Re-skinned Sprint 0 to the v2 centered-destinations shape (white surface bar, balanced `nav-tail` spacer, 6 destinations; `+ ADD` gone since Writing-path Sub-sprint 4).

**`Ssp*` family (`components/Ssp.tsx`, Redesign Sprint 0; grown through Sprint 5).** The v2 "lab-document" primitive vocabulary, built as React server components driven by the `.ssp-*`/`.chip` CSS in `globals.css`. **Migration window CLOSED for all detail pages (Sprint 5, 2026-05-29)** — `/brews/[id]`, all 5 `/green` views, AND the 4 aggregation detail families (roaster / cultivar / terroir / processes) are `Ssp*`; the legacy `SectionCard` + `Tag` chrome was **deleted** (zero consumers). The shared aggregation chrome lives in `CoffeesList` / `ConfidenceCard` + the re-skinned `CollapsibleBlock` / `FlavorNotesByFamily` / `TagLinkList` / `SynthesisCard`. Only the index surfaces remain un-migrated. Members: `Chip` (5 accent tones) · `StatusPill` (dot + mono label, lifecycle tones) · `SspTopBar` (black mono ID strip) · `SspNamePlate` (plum-edged plate, sans h1) · `SspShead` (hairline-prefixed section head) · `SspKVStrip` (dark mono key-value strip; alias `SspRecipeHead`) · `SspTimeline` (brew time/label/desc) · `SspModifier` (strategy + modifier chips + prose) · `SspFlavorAxis` (4-cell categorical) · `SspStructure` (label-row + chip-row) · `SspIdentGrid` (5-cell tabular metadata) · `SspExpGrid` (transposed experiment grid, Sprint 2) · `SspProseRows` (label/value rows, Sprint 2) · `SspInset` (amber/cup reference inset, grid/stack modes, Sprint 4). Plus CSS-only `.blk`/`.blk.dark`, `.hero`, `details.ssp-coll`. Use, don't reimplement.

### Detail-page grammar — the priority stack

`design-system.md` above documents the `Ssp*` *primitives* (the vocabulary); `docs/architecture/page-ia.md` documents each page's *concrete render* (the finished sentence). This section is the **grammar in between** — how primitives arrange into a page. Concept preserved from the claude.ai/design v2 system in the 2026-06-02 reconciliation (it had been dropped when the design system was consolidated into this doc); per-surface rankings re-derived page-by-page with Chris in the same pass, not inherited.

Every detail page ranks its content into three levels of importance: **primary / secondary / tertiary**. This is the **priority stack** — *not* "tiers." "Tier" is already overloaded across corpus tiers (synthesis), canonical-strictness tiers, the 3-tier sub-skills architecture, and the 3-tier `/processes` IA; reusing it here would collide on sight. **Lineage:** this was T1–T4 in the claude.ai/design system; T3 ("concise guidance") folded into tertiary because it already merged into T4 in practice on every page except brew.

The ranking is derived from the **most-constrained surface** — the 390px mobile width is the forcing function (per [ADR-0018](adr/0018-per-surface-mobile-pattern.md)): least room forces the question "what is the single most important thing, and in what order?" That same ranking is then expressed at every width.

- **Primary** — the job the user came for. Leads the page; never collapses; leads on mobile.
- **Secondary** — confirmation / the why / supporting context. Visible, below primary.
- **Tertiary** — reference, provenance, archive, read-once metadata. **Collapsed by default** behind the Additional Information `<details>`.

**Position ≠ priority.** The stack ranks *importance* — what leads on mobile, what never collapses, what's emphasized. A framing line may sit visually first for reading flow while ranking secondary (e.g. the Primary Question on `/green/[id]` waiting-for-roast leads the read but is secondary to the recipe + drop rules). Priority governs emphasis and collapse, not strictly literal DOM order.

**Per-surface rankings** (`›` = "more important than" within a level):

| Surface | Primary | Secondary | Tertiary (collapsed) |
|---|---|---|---|
| `/brews/[id]` | Reference brew recipe + pour procedure + identity | Flavor notes › Peak Expression | Coffee Overview · What I Learned · Additional Info |
| `/green/[id]` waiting-for-roast | Roast Hypothesis table + Drop Rules | Primary Question › Anchor Baseline | green-bean info · roast log · additional |
| `/green/[id]` waiting-for-cupping | Producer notes + Predicted cup + batch identity | Roast Actuals | everything else |
| `/green/[id]` resolved | Reference Roast (won + why + design/achieved) | Reference Cup › Roasting Learnings + Carry-Forward | green-bean · log · cuppings · journey · additional |
| `/green/[id]` resolved-no-ref · one-shot | *inherit resolved* (no-ref drops the verdict / leading-candidate vocab; one-shot is the constrained single-batch shape) | | |
| `/terroirs/[id]` | Place info (one block) | Synthesis › Coffees | Additional · Confidence |
| `/cultivars/[id]` | Cultivar info | Synthesis › Coffees | Additional · Confidence |
| `/processes/[id]` family | Process info + observed variants + archetypes | Synthesis › Coffees | Additional · Confidence |
| `/processes/[id]` variant | Process info | Synthesis › Coffees | Additional · Confidence |
| **`/roasters/[id]`** | **Coffees list (gateway) + identity** | Roaster info (brewing template · philosophy · resting) | **Synthesis (collapsible)** · Additional · Confidence |

Two generalizations fall out:
- **Default aggregation stack** — info (primary) → synthesis (secondary) → coffees (low secondary) → additional + confidence (tertiary). Terroir / cultivar / process-family / process-variant all follow it.
- **The roaster exception** — roaster is not a reference page, it's the **navigational spine into brews** (recall is by roaster, not coffee name — Chris recognizes a roaster's bag style and reaches the coffee through it). So `/roasters/[id]` inverts the default: the **Coffees list is primary** and **synthesis drops to collapsible tertiary**.

A standing tension the recount surfaced: **synthesis is demoted below the info block on every aggregation page because of its *length*, not its value.** That's an intended-priority-vs-render-weight mismatch — the fix is shortening synthesis so its weight matches its secondary rank, not reordering. Tracked in the roadmap (synthesis rethink).

### Information architecture — six load-bearing principles

Why every page looks the way it looks. Each is load-bearing — break it on one screen and the rest stop reading as a coherent product. (Preserved from the claude.ai/design v2 §03 in the 2026-06-02 reconciliation.)

1. **Read-only chrome.** claude.ai via MCP is the canonical input path. The app has no `/add`, no `/edit`, no draft / save / publish states (both human-write surfaces deprecated — Sub Pages 6.6 + Writing-path Sub-sprint 4). Every surface is a *render* of structured data, never a form. UI affordances ban anything that implies "you can type here." (`.input` / `.textarea` survive only for auth + index filters — not data editing.)
2. **Above the fold = the job you came for.** Every detail page answers *one* primary job at the top; secondary jobs and archive context sit lower or collapse. This is the priority-stack primary, restated as an IA law.
3. **Lifecycle drives color.** Green-coffee → roasted-coffee is the page-level metaphor (sage = waiting to roast; olive-bronze = between roast and cup; roasted-brown = resolved). The tile color is the single fastest read on any lot card — the metaphor doing the work, not a status pill.
4. **Four semantic chrome roles, no more.** Roast-amber (design intent), cup-lavender (cupping hypothesis / reference signals), resolved-green (reference roast / cup / peak), archive-grey (read-once provenance). Every *other* accent is a flavor category, not a chrome signal. Named by meaning, not color (see Palette above).
5. **The unit is the lot, not the roast.** No `/roasts` top-level page — individual roasts live inside the lot's detail as table rows. The `/green` card grid shows one card per lot (a V-set's three batches are a unit of inquiry, not three separate artifacts).
6. **Tables are the gold standard for design intent.** Roast Hypothesis (one row per attribute, one column per batch slot), Cupping Hypothesis, and Roast Actuals all share one shape — same scan path, every time, so pre-roast / pre-cupping / post-roast review read identically.

### Detail-page composition rules

- **Dark vs light surfaces are semantic.** Dark (`#0E0E0E`) = the page's *narrative anchor* (brew recipe, peak expression, synthesis, confidence footer). Light = characterization grids and reference data. Don't dark-treat a reference grid — the surface tone signals "anchor" vs "reference," not decoration.
- **Topbar = identity. Hero meta = differentiation. Never duplicate.** The black `SspTopBar` carries entity ID + count + category anchor (and the lot code Chris grabs constantly); the `SspNamePlate` meta carries differentiating attributes *not* already in the topbar. (Known drift: the topbar is still duplicated against the hero in places — an enforcement sweep is parked on the roadmap.)
- **Synthesis is the cross-page unifier** — every detail page carries a "what I've learned" block (`SynthesisCard` / `SspEssay`): a few always-visible takeaways + the essay behind an expand toggle, compact by default at every width. *Held lightly* — the synthesis surface is flagged for a future rethink (it's the demotion driver noted above), so don't calcify its shape.

### Iconography

**Zero icon library.** No Lucide, no Heroicons, no SVG icon sprites. What's allowed:
- Unicode glyphs as chrome: `+ ADD`, `← Back to Brews`, `→` for hover-revealed affordance, `·` as metadata separator.
- Exactly four emoji used as category prefixes only: `🌍` (terroir), `🧬` (cultivar), `☕` (empty brew avatar), `🌱` (empty green-bean avatar). Never in buttons, never in badges, never decorating tags.
- Color swatches as visual identifiers: country swatches on terroir pages, family swatches on cultivar pages, full book-cover tiles for brews.
- The brand mark is typographic (`LATENT` + `RESEARCH` in bold mono / light mono) — not pictorial.

If a future surface genuinely needs a line-icon (e.g. a settings gear), use Lucide at `stroke-width: 1.5`, 12–16px, `currentColor` — and flag the addition. Don't sneak one in.

### Surfaces, motion, interaction

- **Flat surfaces.** Page `#F2F1EC` (warm paper), card `#FAFAF7` (paper) / `#FFF` (surface), dark-accent card `#0E0E0E`. No gradients, no textures, no hero imagery, no photography.
- **No shadows at rest.** The only shadow in the product is brew-card hover — `shadow-lg` + `-translate-y-1 scale-[1.01]`, the book-lifts-off-the-shelf moment. Focus ring is 2px sage `outline` + 2px offset.
- **Restrained motion.** Every transition is `transition-colors` or `transition-all duration-150` (buttons) / `duration-200` (brew-card hover). Default CSS ease. No bounces, springs, skeleton shimmer, page-load fades, or scroll-linked effects.
- **No transparency.** No frosted glass, no backdrop-blur. `text-white/75` on book covers (dimness hierarchy) and `hover:bg-latent-highlight/30` on list rows (pale sage wash) are the only opacity uses.
- **Selection / scrollbars.** Selection: sage-highlight bg on black text. Scrollbars: 6px, `#CCC` thumb, transparent track.

### Discipline

- **Adding a token = a deliberate decision.** Same energy as adding to the flavor-registry or roaster-registry. If a color / size / spacing isn't on the canonical list, it's drift, not creativity.
- **Desktop-primary default; named mobile-primary "workflow-companion" surfaces (Q3, 2026-05-29).** Default is desktop-primary + mobile-must-not-regress for reference/study surfaces (aggregation pages, indexes, resolved lots, archive reading). **Exception:** workflow-companion surfaces are mobile-primary — pages whose moment-of-use is physically at a station with phone in hand: `/brews/[id]` recipe (brew bench), `/green/[id]` waiting-for-cupping (cupping table), and (soft) `/green/[id]` waiting-for-roast. Defensible by job, not guess. Mobile pass folds into each surface's own per-surface sprint + a light closing regression sweep (not a separate big mobile sprint). Responsive infra is container queries + 390/1024 (no 768) per ratification #3.
- **Mobile as forcing function (single shared IA) — [ADR-0018](../adr/0018-per-surface-mobile-pattern.md).** Partner principle to workflow-companion surfaces. A surface has ONE information architecture, not a desktop IA plus a separate mobile IA. The most-constrained (mobile) width is the forcing function that ranks information by importance; that single ranking is then pushed back into the desktop surface so both widths serve one priority order. Mobile and desktop differ only in how much of the tertiary tier folds behind progressive disclosure, never in what is shown or its priority. The single-tree vs container-query dual-subtree choice is the *implementation* of that one IA, never divergent mobile content. (Derived from the cupping-table re-skin: the 390 constraint forced "producer notes + taste-for primary, roast actuals secondary, rest tertiary," which then re-shaped the desktop layout to match.)
- **When in doubt, match the document.** The Dropbox folder's `README.md` + `colors_and_type.css` are a high-fidelity mirror of the code. If the code disagrees with itself between two pages, the documented token wins.

---
