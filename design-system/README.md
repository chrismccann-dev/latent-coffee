# Latent Coffee Design System

> **Snapshot — archived 2026-04-19 from the Claude-Design skill workspace.**
>
> This folder is a frozen copy of the design system as of the standardization sprint (PR #18). It mirrors what lived in `/Users/chrismccann/Dropbox (Personal)/Mac/Downloads/Latent Coffee Design System/` at that point in time. `fonts/` is excluded — see [fonts-note.md](fonts-note.md).
>
> **The code is the source of truth**, not this folder. `tailwind.config.ts` + `app/globals.css` win whenever they disagree with `colors_and_type.css`. See [PRODUCT.md § Design System](../PRODUCT.md#design-system) for the living spec.
>
> A larger redesign is expected to iterate on these tokens in a future sprint; when that happens, the live workspace (Dropbox) will diverge from this snapshot. Keep this snapshot as a reference for the 2026-04-19 state.

---

The design system for **Latent Coffee Research** — a personal coffee research journal built by Chris McCann to compound brewing and roasting knowledge over time. The product is an archival tool (not an iteration workspace): it stores the final optimized expression of each coffee — the best brew recipe, the sensory profile at peak, and the learnings from getting there.

The brand voice is that of a **quiet research notebook**: monospace labels, book-cover cards for each brew, uppercase terminology ("BREWS / TERROIRS / CULTIVARS / GREEN"), and a restrained sage/dark palette that lets coffee metadata do the talking. It is a library of tastings, not a marketing site.

---

## Source materials

- **Codebase:** `latent-coffee/` (local mount) — Next.js 14 App Router + Tailwind + Supabase. This is the source of truth for visuals, tokens, and components.
- **GitHub repo:** `chrismccann-dev/latent-coffee` (mirror of the same codebase).
- **Product doc:** `latent-coffee/PRODUCT.md` — vision, workflows, data model, current state.
- **Dev doc:** `latent-coffee/CLAUDE.md` — architecture notes, FK patterns, canonical registries.

---

## Products represented

There is **one product surface** today:

1. **Latent Research (web app)** — authenticated personal journal at `latentcoffee.com`.
   - Pages: `/brews`, `/brews/[id]`, `/terroirs`, `/terroirs/[id]`, `/cultivars`, `/cultivars/[id]`, `/green`, `/green/[id]`, `/add`, `/login`, `/signup`.
   - Single-user app (Chris McCann); Supabase Auth + Row Level Security.

There is no public marketing site, no mobile app, no docs site. The landing page at `/` is a stub that links to login.

---

## Core concepts (terminology reference)

| Term | Meaning |
|---|---|
| **Brew** | A single archived coffee tasting with its best recipe + sensory + learnings. |
| **Terroir** | Geographic/ecological zone. Hierarchy: Country → Admin Region → Macro Terroir → Meso Terroir. |
| **Cultivar** | Coffee variety. Hierarchy: Species → Genetic Family → Lineage → Cultivar. |
| **Green bean** | A raw coffee lot (self-roasted only). |
| **Roast / Cupping / Experiment** | Self-roasted workflow entities. |
| **Extraction Strategy** | One of three: Clarity-First, Balanced Intensity, Full Expression. |
| **Roaster** | Who sold the coffee (self-roasted = `"Latent"`). |
| **Producer** | The farm/estate that grew the coffee. |

---

## CONTENT FUNDAMENTALS

### Voice

The voice is **first-person research notebook**. Chris speaks about his coffee as *"I"* — e.g. "What I learned", "My taste profile". Never *"you"* or *"we"*. There is no customer; the audience is Chris's future self.

- **Register:** technical, precise, conversational. Taxonomic when discussing terroir/cultivar, poetic when discussing sensory ("rose character only emerges near 40°C", "tea-structured profile").
- **Tense:** past-participle when archiving ("backfilled", "confirmed", "diverged"), present-tense for rules ("new brews MUST set terroir_id").
- **No marketing copy.** No CTAs beyond `+ ADD`. No hero headlines. No emojis in interface chrome (a few section titles use `🌍` / `🧬` / `☕` as the only decorative icons).

### Casing

- **Uppercase monospace** for all navigation, section labels, badges, strategy pills, table headers, counts. Letter-spaced wide (`tracking-wide` → `0.1em`, `tracking-widest` → `0.15em`).
- **Title case sans-serif** for coffee names, terroir/cultivar names, user-facing headings.
- **Sentence case** for prose inside cards ("What I learned", sensory notes, synthesis).
- **Labels are monospace uppercase 10px**: `BREWS`, `COFFEE DETAILS`, `FLAVOR NOTES`, `PEAK EXPRESSION`.

### Examples (verbatim from the product)

- Brand lockup: `LATENT RESEARCH` (bold mono + light mono subtitle)
- Navigation: `BREWS · TERROIRS · CULTIVARS · GREEN`
- Action: `+ ADD`, `+ ADD YOUR FIRST BREW`, `+ ADD YOUR FIRST LOT`
- Count chrome: `55 COFFEES`, `22 REGIONS`, `4 LOTS`
- Strategy pills: `CLARITY`, `BALANCED`, `FULL` (short form)
- Section headings: `🌍 TERROIR`, `🧬 CULTIVAR`, `BEST BREW RECIPE`, `SENSORY NOTES`, `TEMPERATURE EVOLUTION`, `PEAK EXPRESSION`, `KEY TAKEAWAYS`, `WHAT I LEARNED`
- Field labels in detail: `Variety:`, `Process:`, `Roast:`, `Brewer:`, `Dose:`, `Water:`, `Grind:`, `Temp:`, `Bloom:`, `Pour:`
- Body footer: `LATENT RESEARCH` / `Personal Coffee Journal`
- Empty state: `NO BREWS YET`, `NO TERROIRS YET`, `NO GREEN BEANS YET`

### Tone rules

- **Singular, first-person.** "I learned", "my taste profile". Never "we" or "you".
- **Taxonomic over marketing.** Coffees are classified, not sold.
- **Sensory language is specific.** Use the product's own vocabulary: aroma / attack / mid palate / body / finish / temperature evolution / peak expression. Never "tastes great" or vague praise.
- **Emojis are sparing.** `🌍` for terroir, `🧬` for cultivar, `☕` / `🌱` for empty states only. Never in button labels or metadata.
- **Numbers are labels, not features.** Counts appear as quiet mono gray metadata (`55 COFFEES`), never as hero stats.

---

## VISUAL FOUNDATIONS

### Palette

A near-monochrome research-notebook palette built on **soft off-white paper** (`#FAFAFA`) with **near-black ink** (`#1A1A1A`), accented by a single **dark sage green** (`#2C3E2D`) and its lighter partner (`#4A7C59`). A pale highlight (`#F8FFF0` / `#C5E1A8`) marks editable/focused fields. Everything else is drawn from a narrow grayscale: `mid #888`, `subtle #BBB`, `border #E5E5E5`.

Book-cover covers for individual brews use a **process × flavor-driven palette**: sage green for Gesha/washed, warm brown for naturals, wine/burgundy for anaerobic/wine-berry, gold/ochre for honey, muted teal for floral, and cool slate `#5C6570` as the fallback. Country swatches on terroir pages are hardcoded (12 entries) and lean earth-toned.

See `colors_and_type.css` for the full token set.

### Type

- **Sans:** Inter (300/400/500/600/700) — for coffee names, headings, prose.
- **Mono:** JetBrains Mono (400/500/600/700) — for labels, navigation, tags, data tables, metadata, badges, buttons. This is the brand's signature voice.
- **Hierarchy is quiet.** Page titles are 10–12px mono uppercase labels, not large display type. The loudest sans text is a brew name at `text-2xl` (24px) semibold. There is no display/hero type.
- **Small sizes are first-class.** `xxs: 10.4px` and `xs: 11.5px` are the most-used sizes for chrome; base 14px for prose.
- **Letter-spacing:** `tracking-wide 0.1em` for most mono uppercase; `tracking-widest 0.15em` for the brand lockup and primary labels.

### Spacing & layout

- **Page shell:** `max-w-3xl` (768px) for detail pages and list grouping; `max-w-[1200px]` for the Brews library grid and header. Horizontal padding `px-6`. Vertical `py-8`.
- **Spacing scale** (Tailwind defaults, used densely): `4` (1rem), `6` (1.5rem), `8` (2rem) are the dominant rhythm.
- **Header height:** fixed 56px (`h-14`) with bottom border, sticky top-0.
- **Footer:** thin top-bordered strip, small mono text, 32px top margin.

### Backgrounds & imagery

- Surfaces are **flat**. Page background `#FAFAFA`, card surface pure white `#FFF`, dark accent card `#1A1A1A` (the inverted "peak expression" / "what I learned" treatments).
- **No gradients.** No textures. No illustrations. No hero imagery. No photography in the product. The one visual metaphor is the **book-cover card** — a colored rectangle with 3:4 aspect, monospace metadata top-left, faint wordmark bottom. The color carries semantic meaning (see `brew-colors.ts`).
- **No full-bleed imagery.** The product is paper white with gray rules, period.

### Corners & borders

- **Corner radius:** mostly `rounded` (4px) for chips, inputs, tags, small cards; `rounded-md` (6px) for surface cards; `rounded-full` for strategy short-form pills. No large pill radii; nothing squishy.
- **Borders:** 1px `#E5E5E5` everywhere. List items are separated by bottom borders rather than gap+shadow. The Brews grid uses an **outer-grid border system** (top+left on container, right+bottom on cells) — a ledger-style treatment, not cards floating on a background.

### Shadows & elevation

- **No shadows in resting state.** Elevation is expressed through borders + whitespace, not drop shadows.
- The **only shadow** is on brew-card hover: `shadow-lg` combined with a subtle `-translate-y-1 scale-[1.01]` lift. This is the ONE interactive flourish.
- Focus ring: `outline: 2px solid #4A7C59; outline-offset: 2px` (sage green).

### Animation & motion

- Extremely restrained. Every transition is `transition-colors` or `transition-all duration-150` (buttons) / `duration-200` (brew-card hover).
- **No bounces, no springs, no custom easing.** Default CSS ease.
- **No fade-ins on page load.** No skeleton shimmer. No scroll-linked effects.
- **No spinners beyond** `Logging in…` text state.

### Hover / press states

- **Hover on brew card:** `-translate-y-1`, `scale-1.01`, `shadow-lg` — the book lifts off the shelf.
- **Hover on list rows** (terroir, cultivar, green): `hover:bg-white` (from `#FAFAFA` background) or `hover:bg-latent-highlight/30` — a pale sage wash.
- **Hover on nav links:** text color `text-latent-mid #888` → `text-latent-fg #1A1A1A`.
- **Hover on primary button:** `bg-latent-fg` → `bg-latent-accent` (black → dark sage).
- **Hover on secondary button:** border `#E5E5E5` → `#1A1A1A`.
- **Hover-reveal arrow:** List rows expose a `→` arrow via `opacity-0 group-hover:opacity-100`.
- **Press state:** no active/shrink treatment. Relies on browser default + the transition-all settling.

### Transparency & blur

- **None.** No frosted glass, no semi-transparent overlays, no backdrop-blur. The one use of opacity is highlight row hover (`hover:bg-latent-highlight/30`) and `text-white/75` on book covers to establish dimness hierarchy.

### Selection & scrollbars

- Selection: `bg: #C5E1A8; color: #1A1A1A` (sage highlight on black text).
- Scrollbars: 6px wide, `#CCC` thumb, transparent track. Very thin.

### Cards

Two archetypes:
- **Surface card** (`.section-card`): white bg, 1px `#E5E5E5` border, `rounded-md` (6px), `p-6`, `mb-4`. Optional internal section label: mono 10.4px uppercase `#888` spaced wide.
- **Dark accent card** (`.section-card-dark`): `#1A1A1A` bg, white text, `rounded-md`, `p-6`. Used for the two "signature" content blocks: `WHAT I LEARNED` and `PEAK EXPRESSION`. It's the visual equivalent of a quote.

The **book-cover** is a special card: 3:4 aspect, flat color (from `brew-colors.ts`), small mono white metadata top, faint giant `LATENT` watermark bottom. Hover lifts it.

### Buttons

- **Primary** (`.btn-primary`): black bg, white text, mono 11.5px uppercase, `tracking-wide`, `px-4 py-3`, `rounded`. Hover → sage green.
- **Secondary** (`.btn-secondary`): white bg, black text, gray border. Hover → black border.
- **Strategy chip**: uppercase mono 9px, `rounded-full`, white text, `px-2 py-0.5`; per-strategy color (`CLARITY` sage / `BALANCED` ochre / `FULL` burgundy).

### Inputs

- **Text input / textarea**: white bg, 1px gray border, mono 13px, `px-3 py-2`, `rounded`. Focus → sage border + 1px sage ring. Always monospace — fields read as data entries.
- **Label**: mono 10.4px uppercase `#888` above the input.

### Iconography

**Almost none.** See ICONOGRAPHY below.

### Layout rules

- Fixed elements: sticky header (`h-14`), nothing else. No floating action buttons, no bottom bars.
- Content is centered and narrow. The Brews grid is the only wide layout.
- Lists use full-width horizontal rules (`border-b border-latent-border`) as their primary divider, not gap+shadow.

---

## ICONOGRAPHY

The product is **deliberately almost icon-free.** There is no icon font, no Lucide, no Heroicons, no sprite sheet. The codebase imports zero icon libraries (see `package.json`).

What is used:

- **Unicode glyphs for chrome:**
  - `+` as the literal character in button labels (`+ ADD`).
  - `←` for back links (`← Back to Brews`).
  - `→` for hover-revealed row affordance.
  - `·` (middle-dot) as metadata separator (`Country · Region · Macro`, `berry · wine · floral`).
- **Emoji for semantic category labels (sparingly):**
  - `🌍` prefix on the TERROIR section.
  - `🧬` prefix on the CULTIVAR section.
  - `☕` inside the empty-brew avatar square (large, single).
  - `🌱` inside the empty-green-bean avatar square (large, single).
  - `°C` for temperature units.
- **Color swatches as iconography.** Countries get a 16×16 or 40×40 `#colored` rounded rectangle on terroir pages. Families get one on cultivar pages. Brews get a full 3:4 book-cover rectangle.
- **The brand mark is typographic**, not pictorial: `LATENT` + `RESEARCH` in bold mono / light mono.

**Rules for this system:**

- Do **not** add Lucide, Heroicons, Phosphor, Feather, Material icons, etc. The restraint is intentional.
- Do **not** draw new pictorial SVG icons for the product.
- When a new indicator is needed, prefer: a color swatch, a mono uppercase label, or (as a last resort) a single Unicode arrow / bullet / mathematical operator.
- Emoji is acceptable **only** as a category prefix (`🌍`, `🧬`) or as the sole contents of an empty-state avatar square. Never in a button, never in a badge, never decorating a tag.

If a future surface genuinely needs a line-icon (e.g. a settings gear), use **Lucide** at `stroke-width: 1.5`, sized to match `12–16px`, colored `currentColor`, inheriting `#1A1A1A` or `#888`. Flag the addition.

---

## Index

Root files:

- `README.md` — this file.
- `colors_and_type.css` — design tokens: color vars, type vars, semantic CSS vars (`--fg1`, `--mono`, etc) + semantic classes (`.h1`, `.label`, `.tag`).
- `SKILL.md` — agent skill entrypoint for reuse in Claude Code.
- `assets/` — logos, color-swatch SVGs, anything visual.
- `fonts/` — self-hosted webfont CSS (falls back to Google Fonts).
- `preview/` — HTML cards registered for the Design System tab.
- `ui_kits/` — one folder per product surface:
  - `ui_kits/web/` — Latent Research web app kit (core screens as clickable prototype).

---
