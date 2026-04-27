# Flavor Note Taxonomy

Authoritative authored content for the flavor canonical registry.
Mirror file: [lib/flavor-registry.ts](../../lib/flavor-registry.ts).

**3-axis composable system** (Sprint 1g, 2026-04-26):

| Axis | Count | Use |
|---|---|---|
| Base Flavors | 181 across 12 categories | Noun — what is in the cup |
| Modifiers | 43 across 10 categories | Adjective — what happened to the noun (max 2 per flavor) |
| Structure | 29 across 7 axes | System-level — how it feels (per coffee, not per flavor) |

Aliases pre-decompose 112 common composites (`Blueberry Muffin → Blueberry + Cooked/Baked`).

Storage: every flavor note resolves to `{base, modifiers[]}` in `brews.flavors jsonb`. Per-coffee structure tags live in `brews.structure_tags text[]`. Legacy `brews.flavor_notes text[]` retained as denormalized display.

## Rules (17)

> The system stays clean only if the rules are followed. When a note doesn't fit cleanly, force it to fit — never expand the system.

### Core principle

1. **Every note must resolve to:** `Base flavor (noun)` → `Modifier (adjective, optional)` → `Structure (system, separate)`.

### Flavor selection

2. **Always resolve to a specific canonical.** Never allow `Fruit / Floral / Citrus / Tropical / Stone Fruit` as a base. Pick `Strawberry / Jasmine / Lemon / Mango / Peach`.
3. **Use the dominant anchor, not the most interesting note.** "Kiwi + peach + citrus" — pick what defines the cup, not what's unique. Default: lead with the structural anchor.
4. **Fallback anchors only when truly ambiguous:** `Floral → Jasmine`, `Citrus → Lemon`, `Stone Fruit → Peach`, `Tropical → Mango`, `Herbal → Mint`, `Berry → Strawberry`. Override immediately if a real note exists.

### Modifiers

5. **Modifiers must change perception.** Use only when they add information. `Strawberry + Candied` ✓ ; `Peach + Sweet` ✗ (redundant).
6. **Max 2 modifiers per flavor.** Prefer 0-1. Only use 2 when distinct: `Tea + Milky + Jasmine` ✓ ; `Strawberry + Candied + Syrupy + Ripe` ✗.
7. **Modifier hierarchy** (use in this order): Transformation (candied/dried/jam/fermented) → Form (zest/juice/pulp) → State (ripe/fresh) → Processing (carbonated/artificial). Don't stack lower priority unless necessary.

### Structure

8. **Structure is not flavor.** Move OUT: `Juicy / Bright / Creamy / Round / Clean / Sweet`.
9. **Use 2-3 structure tags per coffee** picked across axes: 1 Acidity / 1 Body / 1 Clarity-or-Finish (optional Sweetness).
10. **No duplication between modifier and structure.** "Juicy blackberry" → `Blackberry + Acidity:Juicy`, NOT `Blackberry + Juicy modifier`.

### Special cases

11. **Tea rule (critical):** Tea = base, fruit/floral = modifier. `Peach Tea → Tea + Peach`. `Jasmine Milk Tea → Tea + Milky + Jasmine`.
12. **Sweetness rule:** `Sweet → Structure: Sweetness`. `Candy sweetness → Sugar + Candy`. Never `Sweet Fruit` as flavor.
13. **Candy / dessert / beverage rule:** `Skittles → Fruit + Candy + Artificial`. `Cake → Vanilla + Baked`. `Wine → Grape + Fermented`. `Soda → Flavor + Carbonated`.

### Ambiguity

14. **Vague but recoverable → anchor.** "Floral aromatics" → Jasmine. "Stone fruit sweetness" → Peach + Sweetness:High.
15. **Vague and not recoverable → drop.** "Complex fruit notes", "Elegant fruit", "Sweet fruit", redundant "Floral".

### Multi-flavor

16. **Max 2-4 flavors per coffee.** Force-rank dominant. Drop supporting if too many. Collapse similar: `Strawberry + Raspberry + Blackberry → Strawberry + Mixed Berry`.

### Consistency

17. **Same phrase = same mapping every time. System > expressiveness.** Build the mental lookup table; don't reinterpret based on mood. Goal is comparability, not storytelling. If the mapped note feels less poetic than the raw, that's correct.

### Red flags

- Wanting to add a new base → probably wrong
- Using 5+ flavors → overfitting
- Repeating modifiers → redundant
- Mixing structure into flavor → leakage

### Final mental model

- **Flavor** = what object is in the cup
- **Modifier** = what happened to the object
- **Structure** = how the system behaves

Keep them separate, the taxonomy stays stable.

---

## Base Flavors (181)

Hierarchy: Category → Sub-Category → Descriptor. Pick the most specific descriptor that's still recognizable.

### Acid (1)
- Butyric

### Beverage (10)

> Per Rule 13, beverage names should usually decompose to (fruit/grape) + (modifier). These bases stay because some descriptors don't decompose cleanly (e.g. "Amaro" is a herbal-fermented complex), but prefer the alias-resolution form when possible.

- **Citrus:** Sprite, Sunny D
- **Dairy Based:** Calpico
- **Fermented:** Amaro, Chardonnay, Pinot Noir, Syrah, Winey
- **Tea:** Barley Tea, Jasmine Tea

### Defect (8)

> Off-notes. Fall here when something tasted wrong; useful for diagnostics.

- Cardboard, Earthy, Leather, Medicinal, Moldy, Rubber, Tar, Woody

### Floral (24)

- Cherry Blossom, Coffee Blossom, Elderflower, Geranium, Ginger Flower, Hibiscus, Honeysuckle, Hyacinth, Jasmine, Lavender, Lilac, Lily, Linden Flower, Magnolia, Orange Blossom, Osmanthus, Plumeria, Rose, Rosehip, Verbena, Violet, Wildflower, Wisteria, **+ Coffee Blossom**

> Fallback anchor: `Jasmine` (Rule 4).

### Fruit (66)

- **Berry (15):** Black Currant, Blackberry, Blueberry, Cassis, Cranberry, Currant, Forest Berry, Goji Berry, Gooseberry, Pomegranate, Raspberry, Red Currant, Sea Buckthorn, Strawberry, Wild Blueberry
- **Citrus (10):** Blood Orange, Cara Cara Orange, Clementine, Grapefruit, Hassaku, Kumquat, Lemon, Lime, Mandarin, Orange, Pomelo, Tangerine, Yuzu
- **Dried Fruit (3):** Fig, Prune, Raisin
- **Fermented (1):** Coffee Pulp
- **Grape (2):** Grape, Muscat
- **Other (1):** Persimmon
- **Pomaceous (4):** Apple, Asian Pear, Korean Pear, Pear
- **Stone Fruit (10):** Apricot, Cherry, Dark Cherry, Japanese Cherry, Nectarine, Peach, Plum, Pluot, Rainier Cherry, Yellow Plum
- **Tropical (15):** Banana, Dragon Fruit, Guava, Kiwi, Lychee, Mango, Mangosteen, Melon, Papaya, Passion Fruit, Pineapple, Prickly Pear, Rambutan, Starfruit, Watermelon, White Guava

> Fallback anchors: `Berry → Strawberry`, `Citrus → Lemon`, `Stone Fruit → Peach`, `Tropical → Mango`.

### Nut (7)
- Almond, Brazil Nut, Hazelnut, Macadamia, Peanut, Pecan, Walnut

### Roasted (6)
- Barley, Butter, Malt, Smoky, Toast, Tobacco

### Savory (2)
- Pastry, Tomato

### Spice (7)
- Cardamom, Cinnamon, Clove, Ginger, Nutmeg, Pepper, Star Anise

### Sweet (20)
- **Confection (12):** Cacao, Candy, Caramel, Caramelized, Chocolate, Dark Chocolate, Maple Syrup, Marzipan, Milk Candy, Milk Chocolate, Nougat, Vanilla, White Chocolate, **Baklava**, **Haw Flake**
- **Sugar (7):** Brown Sugar, Honey, Molasses, Panela, Raw Sugar, **Sugar** *(generic catch-all)*, Sugar Cane

### Tea & Herbal (21)
- **Citrus-Botanical (1):** Bergamot
- **Herbal (8):** Eucalyptus, Hops, Juniper, Lemon Verbena, Lemongrass, Mint, Peppermint, Spearmint
- **Tea (12):** Assam Tea, Black Tea, Chamomile, Dragon Well Tea, Earl Grey, Green Tea, Oolong, Pu'Er, Rooibos Tea, **Tea** *(generic catch-all)*, White Tea, Yunnan Red Tea

> Fallback anchor: `Herbal → Mint`. Tea base reverses modifier direction (see Rule 11).

### Vegetative (9)
- Cedar, Cucumber, Grass, Green Bell Pepper, Hay, Peapod, Pine, Potato, Thyme

---

## Modifiers (43)

Modifiers attach to a base flavor (max 2 per flavor). Use the priority order in Rule 7.

### Transformation (priority 1)

> The strongest modifier — fundamentally changes how the flavor presents.

| Modifier | Description |
|---|---|
| Baked | Explicit pastry/baked good character (stronger than Cooked) |
| Candied | Sugar-treated; elevated sweetness, reduced clarity |
| Candy | General candy-like processing (taffy, skittles, gummies) |
| Cooked / Baked | Heat-developed; pastry or caramelized tones |
| Dried | Dehydrated; concentrated sweetness, muted acidity |
| Dulce de Leche | Milk-caramel hybrid sweetness |
| Fermented | Alcoholic or lactic development; wine-like |
| Fruit Leather | Dense, dried fruit sheet character (distinct from dried) |
| Jam / Compote | Cooked fruit; integrated sweetness |
| Marmalade | Citrus cooked with peel; bitter-sweet integrated |
| Roasted | Browned or developed flavors (nutty, cocoa, toast) |
| Stewed | Soft-cooked fruit; deeper, heavier than jam |
| Toffee | Caramelized sugar with deeper cooked character |

### Form (priority 2)

| Modifier | Description |
|---|---|
| Juice | Liquid expression; high clarity, direct acidity |
| Pulp / Flesh | Inner fruit body; rounder, softer expression |
| Skin / Peel | Structural bitterness or tannic grip |
| Zest | Outer peel; aromatic, sharp, slightly bitter |

### State (priority 3)

| Modifier | Description |
|---|---|
| Fresh | Primary, unprocessed expression; crisp and raw |
| Overripe | Soft, heavy, slight fermented edge |
| Ripe | Peak maturity; rounder, sweeter |
| Ripe Fruit | Generalized ripe fruit expression when non-specific |

### Processing (priority 4)

| Modifier | Description |
|---|---|
| Artificial | Non-natural, processed or candy-like impression |
| Carbonated | Effervescent perception (sprite, sparkling, mimosa) |
| Processed | Packaged or confection-like profile (snacks, branded sweets) |

### Intensity (priority 5)

| Modifier | Description |
|---|---|
| Concentrated | Dense, compact flavor |
| Light | Delicate, low saturation |
| Pronounced | Clear, high-intensity |

### Sweetness (priority 5)

| Modifier | Description |
|---|---|
| High Sweetness | Elevated sweetness intensity beyond baseline |
| Intense Sweetness | High amplitude sweetness expression |
| Jam-like Sweetness | Integrated, thick fruit sweetness |
| Rich | Dense, desert like sweetness beyond simple sugar |
| Sugary | Simple sugar perception |
| Syrupy | Dense, viscous sweetness |

### Texture (priority 6)

| Modifier | Description |
|---|---|
| Buttery | Rich, fatty, soft coating texture |
| Creamy | Dairy-like, smooth, rounded texture |
| Dense | Heavy, compact, dessert-like weight |
| Whipped | Light, airy, cream-like texture (whipped cream, milkshake) |

### Blending (priority 7)

> Used when flavors blend without distinct individual notes. Pair with a fallback anchor base. Common as Modifier 2.

| Modifier | Description |
|---|---|
| Mixed Berry | Composite berry expression / distinct but blended berry profile |
| Mixed Floral | Composite floral impression (non-distinct flowers) |
| Mixed Fruit | Composite or non-distinct fruit blend / distinct but blended fruit profile |
| Mixed Tropical | Composite tropical fruit impression |

### Other (priority 7)

| Modifier | Description |
|---|---|
| Botanical | Non-floral plant aromatics (hops, herbal blends) |
| Herbal | Herbal-floral hybrid (used as Modifier 2 for floral-herbal crossover, e.g. Jasmine + Herbal) |

### Structure-as-modifier (priority 8 — rare)

| Modifier | Description |
|---|---|
| Tannic | Light astringency; drying grip (common in tea-like coffees) |

> `Milky` is in this table as a Texture modifier — used heavily for the Tea-base rule (`Milk Tea → Tea + Milky`).

---

## Structure (29)

Structure tags are per-coffee, not per-flavor. Pick 2-3 across axes (Rule 8). Storage form: `"Axis:Descriptor"` (e.g. `Acidity:Bright`).

### Acidity (4)

| Descriptor | Description |
|---|---|
| Bright | High-energy, sharp, clearly defined acidity |
| Juicy | Salivating, fruit-driven acidity |
| Soft | Rounded, low-intensity acidity |
| Sparkling | Effervescent, high-frequency acidity |

### Body (7)

| Descriptor | Description |
|---|---|
| Aerated | Light, whipped or mousse-like texture |
| Creamy | Rich, smooth, dairy-like texture |
| Light | Low weight, tea-like |
| Milky | Soft, rounded, milk-integrated texture |
| Round | Balanced, centered weight |
| Silky | Smooth, fine texture |
| Syrupy | Heavy, viscous, coating |

### Clarity (8)

| Descriptor | Description |
|---|---|
| Clean | Well-separated flavors; minimal muddling |
| Complex | Multiple simultaneous notes |
| Delicate | Light, precise, low-intensity but refined expression |
| Expressive | High aromatic and flavor intensity |
| Layered | Distinct flavor progression |
| Refined | High precision, minimal noise, very polished expression |
| Subtle | Low-intensity, restrained expression |
| Transparent | Extremely clear, origin-distinct expression |

### Finish (4)

| Descriptor | Description |
|---|---|
| Clean | No residue; quick clarity after swallow |
| Coating | Lingers on palate; physical persistence |
| Drying | Light tannic or dehydrating finish (common in tea-like coffees) |
| Lingering | Long-lasting flavor persistence after swallow |
| Short | Quick resolution; minimal persistence |

### Sweetness (3)

| Descriptor | Description |
|---|---|
| High | Pronounced sweetness presence |
| Low | Minimal perceived sweetness |
| Moderate | Balanced sweetness |

### Balance (1)

| Descriptor | Description |
|---|---|
| Balanced | No dominant axis; integrated acidity, sweetness, and body |

### Overall (1)

| Descriptor | Description |
|---|---|
| Tea-like | Light body, high clarity, tea-like structure |

---

## Aliases (112)

Aliases pre-decompose common composite phrases into `base + 0-2 modifiers`. Type the alias, get the structured form. **Add aliases freely** (Rule 1 of alias maintenance) — but **don't expand bases** without strong corroboration.

### Composite fruit forms

| Alias | → Base | Modifiers |
|---|---|---|
| Apple Cider | Apple | Fermented |
| Apple Jam | Apple | Jam / Compote |
| Baked Apple | Apple | Cooked / Baked |
| Dried Apple | Apple | Dried |
| Dried Apricot | Apricot | Dried |
| Blueberry Muffin | Blueberry | Cooked / Baked |
| Blueberry Ice Cream | Blueberry | Creamy |
| Blueberry Yogurt | Blueberry | Creamy |
| Blueberry Candy | Blueberry | Candy |
| Cherry Cola | Cherry | Carbonated |
| Cherry Soda | Cherry | Carbonated |
| Fresh Grape | Grape | Fresh |
| Sparkling Red Grape | Grape | Carbonated |
| Grape Soda | Grape | Carbonated |
| Wine / Red Wine / White Wine | Grape | Fermented |
| Chardonnay / Syrah | Grape | Fermented |
| Sangria | Grape | Fermented + Mixed Fruit |
| Grapefruit Zest | Grapefruit | Zest |
| Lemonade / Pink Lemonade | Lemon | Juice + Sugary |
| Limoncello | Lemon | Fermented |
| Lemon Zest | Lemon | Zest |
| Candied Lemon | Lemon | Candied |
| Lime Juice | Lime | Juice |
| Limeade | Lime | Juice + Sugary |
| Lime Zest | Lime | Zest |
| Mango Lassi | Mango | Creamy |
| Dried Mango | Mango | Dried |
| Fruit Leather | Mango | Fruit Leather |
| Overripe Mango | Mango | Overripe |
| Orange Zest | Orange | Zest |
| Candied Orange | Orange | Candied |
| Orange Marmalade / Marmalade | Orange | Marmalade |
| Peach Soda | Peach | Carbonated |
| Ripe Peach | Peach | Ripe |
| Peach Candy | Peach | Candy |
| Pineapple (Sweet) | Pineapple | Sugary |
| Fresh Raspberry | Raspberry | Fresh |
| Raspberry Compote | Raspberry | Jam / Compote |
| Candied Strawberry | Strawberry | Candied |
| Strawberry Jam / Compote | Strawberry | Jam / Compote |
| Berry Compote | Strawberry | Jam / Compote + Mixed Berry |
| Mixed Berries / Forest Berries | Strawberry | Mixed Berry |
| Watermelon Candy | Watermelon | Candy |

### Fallback / abstract → anchor

| Alias | → Base | Modifiers |
|---|---|---|
| Floral aromatics | Jasmine | Mixed Floral |
| Floral sweetness | Jasmine | Mixed Floral |
| Soft Florals | Jasmine | Light |
| Yellow Florals | Jasmine | Mixed Floral |
| Candied Floral | Jasmine | Candied |
| High-definition florality | Jasmine | Mixed Floral |
| Herbal florality | Jasmine | Herbal |
| Citrus clarity | Lemon | — |
| Stone fruit sweetness | Peach | — |
| Tropical fruit sweetness | Mango | Mixed Fruit |
| Tropical Fruits | Mango | Mixed Fruit |
| Faint soft fruit | Peach | Light |
| Hard candy sweetness | Sugar | Candy |
| Herbal sweetness | Mint | — |
| Candied Sweetness | Plum | Candied |
| Savory-sweet tomato | Tomato | Ripe |

### Tea base reversal (Rule 11)

| Alias | → Base | Modifiers |
|---|---|---|
| Peach Tea | Tea | Peach |
| Honeyed Tea | Tea | Sugary |
| Fruity Tea | Tea | Mixed Fruit |
| Floral tea / Floral Tea | Tea | Jasmine |
| Milk Tea | Tea | Milky |
| Bubble Tea | Tea | Milky |
| Jasmine Milk Tea | Tea | Milky + Jasmine |

### Confection / candy

| Alias | → Base | Modifiers |
|---|---|---|
| Caramelized Sugar | Caramel | Cooked / Baked |
| Toffee | Caramel | Cooked / Baked |
| Dulce de Leche | Caramel | Creamy |
| Praline / Nougat | Caramel | Nut |
| Chocolate Cake | Chocolate | Cooked / Baked |
| Chocolate Mousse | Chocolate | Aerated |
| Chocolate Truffle | Chocolate | Dense |
| Dark Chocolate Mousse | Chocolate | Aerated |
| Milk Chocolate | Chocolate | — |
| Cacao Nibs | Chocolate | Roasted |
| Gingerbread | Cinnamon | Cooked / Baked |
| Cinnamon French Toast | Cinnamon | Cooked / Baked |
| Vanilla Cake / Birthday Cake / Sugar Cookie | Vanilla | Cooked / Baked |
| Marshmallow | Vanilla | Aerated |
| Milkshake | Vanilla | Whipped |
| Vanilla Cream | Vanilla | Creamy |
| Cotton Candy / Lollipop | Sugar | Candy |
| Skittles / Jolly Rancher | Strawberry | Candy + Artificial |
| Fruit Roll Up | Strawberry | Candy + Mixed Fruit |
| Gummies | Strawberry | Candy |

### Other

| Alias | → Base | Modifiers |
|---|---|---|
| Nutty | Almond | — |
| Buttery | Butter | — |
| Cream | Milk | Creamy |
| Silky | Milk | Creamy *(but Body:Silky structure overrides per Rule 10 when used standalone)* |
| Hazelnut Spread | Hazelnut | Creamy |
| Amaro | Herbal | Fermented |
| Peanut Butter | Peanut | Creamy |
| Poached Pear / Pear Tart | Pear | Cooked / Baked |
| Ginger Ale | Ginger | Carbonated |
| Spring Honey | Honey | Fresh |
| Rose Water | Rose | — |
| Earl Grey Tea | Earl Grey | — |
| Vanilla Bean | Vanilla | — |
| pu'er | Pu'Er | — |
| Wine-like fruit / Wine-like Fruit | Grape | Fermented |
| Passionfruit | Passion Fruit | — |
| Meyer Lemon / Key Lime | Lemon / Lime | — |
| Red Apple / Red Grape / White Grape / White Nectarine / Muscat Rouge | (variety strip — base only) | — |
| Green Apple | Apple | Fresh |
| Tomato Leaf | Tomato | Botanical |
| Jasmine Pearls | Jasmine | — |

---

## Sources

- **Le Nez du Café aroma kit** — 36 of the 179 base flavors come from the standard SCA aroma reference set. ([https://www.lenez.com/en/aroma-kits/coffee/](https://www.lenez.com/en/aroma-kits/coffee/))
- **Roaster crowdsource** — Chris pulled flavor descriptors from a wide cross-section of his canonical roaster list (Sey, Hydrangea, Moonwake, Heart, Olympia, Picolot, Rose, Picky Chemist, etc.) and the recent roasts they did to validate coverage of contemporary expression.
- **Existing flavor-registry.ts (132 canonicals, pre-1g)** — folded in; ~80% overlap with new bases. ~30 entries reclassified as aliases (Apple Cider, Lemon Zest, Vanilla Cream, etc.). ~14 entries migrated to structure tags (Bright, Silky, Round, etc.).
- **Bucket C transcript review** — Chris reviewed 48 ambiguous entries against raw tasting transcripts to lock per-brew decompositions for migration 033.
- **Rules layer** — composed by Chris from prior brewing notes + edge cases observed during Bucket C work.

---

## Net-new bases beyond Chris's authored 176

Three bases added in 1g.1 because they appeared in legacy DB rows + are common flavor descriptors:

- **Pomegranate** (Fruit:Berry)
- **Baklava** (Sweet:Confection)
- **Haw Flake** (Sweet:Confection)

All three were in the pre-1g flat 132-canonical registry and continue to be valid bases.

---

## Adding entries

Per Rule 1 of alias maintenance: **only add aliases, not new canonicals**. If a new phrase appears, alias-map it to an existing base + modifiers. Promote to a new base only when the phrase repeats across many coffees AND can't be expressed cleanly via modifiers.

For a new base (rare): edit `BASE_FLAVORS` in `lib/flavor-registry.ts` + add a section to this file. Category + sub-category required.

For a new alias (common): edit `ALIAS_MAP` in `lib/flavor-registry.ts` + add a row to the relevant Aliases sub-section above.

For a new modifier (very rare): would require a new modifier category or expanding an existing one — bring to Chris before doing.

For a new structure descriptor (very rare): same caution — structure axes are deliberately small; expanding them risks breaking the 2-3-tags-per-coffee constraint.

---

## Changelog

- **2026-04-26 (Sprint 1g, this commit):** First-time port. 3-axis composable system from Chris's 6-sheet authored xlsx + 17-rule guide + 48 Bucket C per-brew decisions. Migration 033 backfilled all 51 brews with non-empty flavor_notes. Net-new bases: Pomegranate, Baklava, Haw Flake.
