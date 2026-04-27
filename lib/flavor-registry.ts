// Single source of truth for the 3-axis flavor taxonomy: base + modifiers + structure.
// Authored content lives in docs/taxonomies/flavors.md; this file is the validation mirror.
//
// Sprint 1g (2026-04-26) — refactored from flat 132-canonical map to composable 3-axis system.
// Source: Chris's authored Taxonomy Registry xlsx (2026-04-25, 6 sheets) + Bucket C transcript review.
// Adoption: brews.flavors jsonb + brews.structure_tags text[] + brews.flavor_notes (denormalized display).
//
// The composable system is governed by 17 rules — see docs/taxonomies/flavors.md § Rules.
//   - Every flavor note resolves to: base + 0-2 modifiers
//   - Every coffee additionally has 2-3 structure tags (per-coffee, not per-flavor)
//   - Aliases pre-decompose common composites (Blueberry Muffin → Blueberry + Cooked/Baked)
//   - Tea bases reverse the modifier direction (Peach Tea → Tea + Peach modifier)

import { makeCanonicalLookup, type CanonicalLookup } from './canonical-registry'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FlavorCategory =
  | 'Acid' | 'Beverage' | 'Defect' | 'Floral' | 'Fruit' | 'Nut'
  | 'Roasted' | 'Savory' | 'Spice' | 'Sweet' | 'Tea & Herbal' | 'Vegetative'

export type ModifierCategory =
  | 'Transformation' | 'Form' | 'State' | 'Processing' | 'Intensity'
  | 'Sweetness' | 'Texture' | 'Blending' | 'Other' | 'Structure'

export type StructureAxis =
  | 'Acidity' | 'Body' | 'Clarity' | 'Finish' | 'Sweetness' | 'Balance' | 'Overall'

export interface BaseFlavorEntry {
  name: string
  category: FlavorCategory
  subCategory: string
}

export interface ModifierEntry {
  name: string
  category: ModifierCategory
  priority: number
  description: string
}

export interface StructureTagEntry {
  axis: StructureAxis
  descriptor: string
  description: string
}

/** A composed flavor chip: base + 0-2 modifiers. Stored in brews.flavors jsonb. */
export interface FlavorChip {
  base: string
  modifiers: string[]
}

/** Decomposition of a legacy DB string. `drop: true` skips writing flavors. */
export interface LegacyDecomposition {
  flavors: FlavorChip[]
  structureTags: string[]
  drop?: boolean
}

// ---------------------------------------------------------------------------
// BASE_FLAVORS — 181 canonical bases across 12 categories
// (179 from Chris's authored xlsx + 2 net-new generic catch-alls: Tea + Sugar)
// ---------------------------------------------------------------------------

export const BASE_FLAVORS: readonly BaseFlavorEntry[] = [
  // ── Acid (1)
  { name: "Butyric", category: "Acid", subCategory: "Acid" },

  // ── Beverage (10)
  //    Fermented
  { name: "Amaro", category: "Beverage", subCategory: "Fermented" },
  { name: "Chardonnay", category: "Beverage", subCategory: "Fermented" },
  { name: "Syrah", category: "Beverage", subCategory: "Fermented" },
  { name: "Winey", category: "Beverage", subCategory: "Fermented" },
  { name: "Pinot Noir", category: "Beverage", subCategory: "Fermented" },
  //    Citrus
  { name: "Sprite", category: "Beverage", subCategory: "Citrus" },
  { name: "Sunny D", category: "Beverage", subCategory: "Citrus" },
  //    Dairy Based
  { name: "Calpico", category: "Beverage", subCategory: "Dairy Based" },
  //    Tea
  { name: "Barley Tea", category: "Beverage", subCategory: "Tea" },
  { name: "Jasmine Tea", category: "Beverage", subCategory: "Tea" },

  // ── Defect (8)
  { name: "Cardboard", category: "Defect", subCategory: "Defect" },
  { name: "Earthy", category: "Defect", subCategory: "Defect" },
  { name: "Leather", category: "Defect", subCategory: "Defect" },
  { name: "Medicinal", category: "Defect", subCategory: "Defect" },
  { name: "Moldy", category: "Defect", subCategory: "Defect" },
  { name: "Rubber", category: "Defect", subCategory: "Defect" },
  { name: "Tar", category: "Defect", subCategory: "Defect" },
  { name: "Woody", category: "Defect", subCategory: "Defect" },

  // ── Floral (23)
  { name: "Cherry Blossom", category: "Floral", subCategory: "Floral" },
  { name: "Elderflower", category: "Floral", subCategory: "Floral" },
  { name: "Ginger Flower", category: "Floral", subCategory: "Floral" },
  { name: "Hibiscus", category: "Floral", subCategory: "Floral" },
  { name: "Honeysuckle", category: "Floral", subCategory: "Floral" },
  { name: "Jasmine", category: "Floral", subCategory: "Floral" },
  { name: "Lavender", category: "Floral", subCategory: "Floral" },
  { name: "Magnolia", category: "Floral", subCategory: "Floral" },
  { name: "Rose", category: "Floral", subCategory: "Floral" },
  { name: "Rosehip", category: "Floral", subCategory: "Floral" },
  { name: "Verbena", category: "Floral", subCategory: "Floral" },
  { name: "Wildflower", category: "Floral", subCategory: "Floral" },
  { name: "Plumeria", category: "Floral", subCategory: "Floral" },
  { name: "Osmanthus", category: "Floral", subCategory: "Floral" },
  { name: "Lilac", category: "Floral", subCategory: "Floral" },
  { name: "Orange Blossom", category: "Floral", subCategory: "Floral" },
  { name: "Linden Flower", category: "Floral", subCategory: "Floral" },
  { name: "Coffee Blossom", category: "Floral", subCategory: "Floral" },
  { name: "Violet", category: "Floral", subCategory: "Floral" },
  { name: "Geranium", category: "Floral", subCategory: "Floral" },
  { name: "Wisteria", category: "Floral", subCategory: "Floral" },
  { name: "Hyacinth", category: "Floral", subCategory: "Floral" },
  { name: "Lily", category: "Floral", subCategory: "Floral" },

  // ── Fruit (65)
  //    Fermented
  { name: "Coffee Pulp", category: "Fruit", subCategory: "Fermented" },
  //    Berry
  { name: "Black Currant", category: "Fruit", subCategory: "Berry" },
  { name: "Blackberry", category: "Fruit", subCategory: "Berry" },
  { name: "Blueberry", category: "Fruit", subCategory: "Berry" },
  { name: "Cranberry", category: "Fruit", subCategory: "Berry" },
  { name: "Gooseberry", category: "Fruit", subCategory: "Berry" },
  { name: "Raspberry", category: "Fruit", subCategory: "Berry" },
  { name: "Strawberry", category: "Fruit", subCategory: "Berry" },
  { name: "Goji Berry", category: "Fruit", subCategory: "Berry" },
  { name: "Cassis", category: "Fruit", subCategory: "Berry" },
  { name: "Red Currant", category: "Fruit", subCategory: "Berry" },
  { name: "Wild Blueberry", category: "Fruit", subCategory: "Berry" },
  { name: "Currant", category: "Fruit", subCategory: "Berry" },
  { name: "Forest Berry", category: "Fruit", subCategory: "Berry" },
  { name: "Sea Buckthorn", category: "Fruit", subCategory: "Berry" },
  { name: "Pomegranate", category: "Fruit", subCategory: "Berry" },
  //    Citrus
  { name: "Grapefruit", category: "Fruit", subCategory: "Citrus" },
  { name: "Kumquat", category: "Fruit", subCategory: "Citrus" },
  { name: "Lemon", category: "Fruit", subCategory: "Citrus" },
  { name: "Lime", category: "Fruit", subCategory: "Citrus" },
  { name: "Mandarin", category: "Fruit", subCategory: "Citrus" },
  { name: "Orange", category: "Fruit", subCategory: "Citrus" },
  { name: "Pomelo", category: "Fruit", subCategory: "Citrus" },
  { name: "Tangerine", category: "Fruit", subCategory: "Citrus" },
  { name: "Blood Orange", category: "Fruit", subCategory: "Citrus" },
  { name: "Cara Cara Orange", category: "Fruit", subCategory: "Citrus" },
  { name: "Clementine", category: "Fruit", subCategory: "Citrus" },
  { name: "Yuzu", category: "Fruit", subCategory: "Citrus" },
  { name: "Hassaku", category: "Fruit", subCategory: "Citrus" },
  //    Dried Fruit
  { name: "Prune", category: "Fruit", subCategory: "Dried Fruit" },
  { name: "Raisin", category: "Fruit", subCategory: "Dried Fruit" },
  { name: "Fig", category: "Fruit", subCategory: "Dried Fruit" },
  //    Grape
  { name: "Grape", category: "Fruit", subCategory: "Grape" },
  { name: "Muscat", category: "Fruit", subCategory: "Grape" },
  //    Pomaceous
  { name: "Apple", category: "Fruit", subCategory: "Pomaceous" },
  { name: "Pear", category: "Fruit", subCategory: "Pomaceous" },
  { name: "Korean Pear", category: "Fruit", subCategory: "Pomaceous" },
  { name: "Asian Pear", category: "Fruit", subCategory: "Pomaceous" },
  //    Stone Fruit
  { name: "Apricot", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Cherry", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Nectarine", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Peach", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Plum", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Pluot", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Rainier Cherry", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Yellow Plum", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Dark Cherry", category: "Fruit", subCategory: "Stone Fruit" },
  { name: "Japanese Cherry", category: "Fruit", subCategory: "Stone Fruit" },
  //    Tropical
  { name: "Banana", category: "Fruit", subCategory: "Tropical" },
  { name: "Guava", category: "Fruit", subCategory: "Tropical" },
  { name: "Kiwi", category: "Fruit", subCategory: "Tropical" },
  { name: "Lychee", category: "Fruit", subCategory: "Tropical" },
  { name: "Mango", category: "Fruit", subCategory: "Tropical" },
  { name: "Mangosteen", category: "Fruit", subCategory: "Tropical" },
  { name: "Melon", category: "Fruit", subCategory: "Tropical" },
  { name: "Papaya", category: "Fruit", subCategory: "Tropical" },
  { name: "Passion Fruit", category: "Fruit", subCategory: "Tropical" },
  { name: "Pineapple", category: "Fruit", subCategory: "Tropical" },
  { name: "Watermelon", category: "Fruit", subCategory: "Tropical" },
  { name: "Starfruit", category: "Fruit", subCategory: "Tropical" },
  { name: "Prickly Pear", category: "Fruit", subCategory: "Tropical" },
  { name: "Dragon Fruit", category: "Fruit", subCategory: "Tropical" },
  { name: "White Guava", category: "Fruit", subCategory: "Tropical" },
  { name: "Rambutan", category: "Fruit", subCategory: "Tropical" },
  //    Other
  { name: "Persimmon", category: "Fruit", subCategory: "Other" },

  // ── Nut (7)
  { name: "Almond", category: "Nut", subCategory: "Nut" },
  { name: "Hazelnut", category: "Nut", subCategory: "Nut" },
  { name: "Peanut", category: "Nut", subCategory: "Nut" },
  { name: "Pecan", category: "Nut", subCategory: "Nut" },
  { name: "Walnut", category: "Nut", subCategory: "Nut" },
  { name: "Macadamia", category: "Nut", subCategory: "Nut" },
  { name: "Brazil Nut", category: "Nut", subCategory: "Nut" },

  // ── Roasted (6)
  { name: "Butter", category: "Roasted", subCategory: "Roasted" },
  { name: "Malt", category: "Roasted", subCategory: "Roasted" },
  { name: "Smoky", category: "Roasted", subCategory: "Roasted" },
  { name: "Toast", category: "Roasted", subCategory: "Roasted" },
  { name: "Tobacco", category: "Roasted", subCategory: "Roasted" },
  { name: "Barley", category: "Roasted", subCategory: "Roasted" },

  // ── Savory (2)
  { name: "Pastry", category: "Savory", subCategory: "Savory" },
  { name: "Tomato", category: "Savory", subCategory: "Savory" },

  // ── Spice (7)
  { name: "Cardamom", category: "Spice", subCategory: "Spice" },
  { name: "Cinnamon", category: "Spice", subCategory: "Spice" },
  { name: "Clove", category: "Spice", subCategory: "Spice" },
  { name: "Nutmeg", category: "Spice", subCategory: "Spice" },
  { name: "Pepper", category: "Spice", subCategory: "Spice" },
  { name: "Star Anise", category: "Spice", subCategory: "Spice" },
  { name: "Ginger", category: "Spice", subCategory: "Spice" },

  // ── Sweet (21)
  //    Confection
  { name: "Cacao", category: "Sweet", subCategory: "Confection" },
  { name: "Candy", category: "Sweet", subCategory: "Confection" },
  { name: "Caramel", category: "Sweet", subCategory: "Confection" },
  { name: "Caramelized", category: "Sweet", subCategory: "Confection" },
  { name: "Chocolate", category: "Sweet", subCategory: "Confection" },
  { name: "Dark Chocolate", category: "Sweet", subCategory: "Confection" },
  { name: "Maple Syrup", category: "Sweet", subCategory: "Confection" },
  { name: "Milk Candy", category: "Sweet", subCategory: "Confection" },
  { name: "Milk Chocolate", category: "Sweet", subCategory: "Confection" },
  { name: "Vanilla", category: "Sweet", subCategory: "Confection" },
  { name: "Nougat", category: "Sweet", subCategory: "Confection" },
  { name: "Marzipan", category: "Sweet", subCategory: "Confection" },
  { name: "White Chocolate", category: "Sweet", subCategory: "Confection" },
  { name: "Baklava", category: "Sweet", subCategory: "Confection" },
  { name: "Haw Flake", category: "Sweet", subCategory: "Confection" },
  //    Sugar
  { name: "Brown Sugar", category: "Sweet", subCategory: "Sugar" },
  { name: "Honey", category: "Sweet", subCategory: "Sugar" },
  { name: "Raw Sugar", category: "Sweet", subCategory: "Sugar" },
  { name: "Sugar Cane", category: "Sweet", subCategory: "Sugar" },
  { name: "Panela", category: "Sweet", subCategory: "Sugar" },
  { name: "Molasses", category: "Sweet", subCategory: "Sugar" },
  // Generic Sugar catch-all — used for "Hard candy sweetness" and other
  // generic sugar-bound expressions when the specific sugar isn't named.
  { name: "Sugar", category: "Sweet", subCategory: "Sugar" },

  // ── Tea & Herbal (21)
  //    Citrus-Botanical
  { name: "Bergamot", category: "Tea & Herbal", subCategory: "Citrus-Botanical" },
  //    Herbal
  { name: "Eucalyptus", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Juniper", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Lemongrass", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Mint", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Spearmint", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Peppermint", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Hops", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Lemon Verbena", category: "Tea & Herbal", subCategory: "Herbal" },
  { name: "Rosemary", category: "Tea & Herbal", subCategory: "Herbal" },
  //    Tea
  { name: "Black Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Chamomile", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Earl Grey", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Green Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Pu'Er", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "White Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Oolong", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Assam Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Yunnan Red Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Rooibos Tea", category: "Tea & Herbal", subCategory: "Tea" },
  { name: "Dragon Well Tea", category: "Tea & Herbal", subCategory: "Tea" },
  // Generic Tea catch-all — used when the specific tea variety isn't named.
  // Per Chris's Tea rule (flavors.md Rule 11), Tea is always the base; the
  // fruit/floral becomes the modifier (Peach Tea → Tea + Peach modifier).
  { name: "Tea", category: "Tea & Herbal", subCategory: "Tea" },

  // ── Vegetative (9)
  { name: "Cedar", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Cucumber", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Grass", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Green Bell Pepper", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Hay", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Peapod", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Pine", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Potato", category: "Vegetative", subCategory: "Vegetative" },
  { name: "Thyme", category: "Vegetative", subCategory: "Vegetative" },
]

const BASE_NAMES = BASE_FLAVORS.map(b => b.name).sort((a, b) => a.localeCompare(b))

// ---------------------------------------------------------------------------
// FLAVOR_MODIFIERS — 43 canonical modifiers across 10 categories
// Priority order per Rule 5: Transformation > Form > State > Processing > others
// ---------------------------------------------------------------------------

export const FLAVOR_MODIFIERS: readonly ModifierEntry[] = [
  // ── Transformation (priority 1)
  { name: "Dried", category: "Transformation", priority: 1, description: "Dehydrated; concentrated sweetness, muted acidity" },
  { name: "Candied", category: "Transformation", priority: 1, description: "Sugar-treated; elevated sweetness, reduced clarity" },
  { name: "Jam / Compote", category: "Transformation", priority: 1, description: "Cooked fruit; integrated sweetness" },
  { name: "Fermented", category: "Transformation", priority: 1, description: "Alcoholic or lactic development; wine-like" },
  { name: "Cooked / Baked", category: "Transformation", priority: 1, description: "Heat-developed; pastry or caramelized tones" },
  { name: "Roasted", category: "Transformation", priority: 1, description: "Browned or developed flavors (nutty, cocoa, toast)" },
  { name: "Stewed", category: "Transformation", priority: 1, description: "Soft-cooked fruit; deeper, heavier than jam" },
  { name: "Baked", category: "Transformation", priority: 1, description: "Explicit pastry/baked good character (stronger than Cooked)" },
  { name: "Fruit Leather", category: "Transformation", priority: 1, description: "Dense, dried fruit sheet character (distinct from dried)" },
  { name: "Marmalade", category: "Transformation", priority: 1, description: "Citrus cooked with peel; bitter-sweet integrated" },
  { name: "Candy", category: "Transformation", priority: 1, description: "General candy-like processing (taffy, skittles, gummies)" },
  { name: "Toffee", category: "Transformation", priority: 1, description: "Caramelized sugar with deeper cooked character" },
  { name: "Dulce de Leche", category: "Transformation", priority: 1, description: "Milk-caramel hybrid sweetness" },

  // ── Form (priority 2)
  { name: "Juice", category: "Form", priority: 2, description: "Liquid expression; high clarity, direct acidity" },
  { name: "Zest", category: "Form", priority: 2, description: "Outer peel; aromatic, sharp, slightly bitter" },
  { name: "Pulp / Flesh", category: "Form", priority: 2, description: "Inner fruit body; rounder, softer expression" },
  { name: "Skin / Peel", category: "Form", priority: 2, description: "Structural bitterness or tannic grip" },

  // ── State (priority 3)
  { name: "Fresh", category: "State", priority: 3, description: "Primary, unprocessed expression; crisp and raw" },
  { name: "Ripe", category: "State", priority: 3, description: "Peak maturity; rounder, sweeter" },
  { name: "Overripe", category: "State", priority: 3, description: "Soft, heavy, slight fermented edge" },
  { name: "Ripe Fruit", category: "State", priority: 3, description: "Generalized ripe fruit expression when non-specific" },

  // ── Processing (priority 4)
  { name: "Carbonated", category: "Processing", priority: 4, description: "Effervescent perception (sprite, sparkling, mimosa)" },
  { name: "Artificial", category: "Processing", priority: 4, description: "Non-natural, processed or candy-like impression" },
  { name: "Processed", category: "Processing", priority: 4, description: "Packaged or confection-like profile (snacks, branded sweets)" },

  // ── Intensity (priority 5)
  { name: "Light", category: "Intensity", priority: 5, description: "Delicate, low saturation" },
  { name: "Pronounced", category: "Intensity", priority: 5, description: "Clear, high-intensity" },
  { name: "Concentrated", category: "Intensity", priority: 5, description: "Dense, compact flavor" },

  // ── Sweetness (priority 5)
  { name: "Sugary", category: "Sweetness", priority: 5, description: "Simple sugar perception" },
  { name: "Syrupy", category: "Sweetness", priority: 5, description: "Dense, viscous sweetness" },
  { name: "Rich", category: "Sweetness", priority: 5, description: "Dense, desert like sweetness beyond simple sugar" },
  { name: "High Sweetness", category: "Sweetness", priority: 5, description: "Elevated sweetness intensity beyond baseline" },
  { name: "Jam-like Sweetness", category: "Sweetness", priority: 5, description: "Integrated, thick fruit sweetness" },
  { name: "Intense Sweetness", category: "Sweetness", priority: 5, description: "High amplitude sweetness expression" },

  // ── Texture (priority 6)
  { name: "Creamy", category: "Texture", priority: 6, description: "Dairy-like, smooth, rounded exture" },
  { name: "Buttery", category: "Texture", priority: 6, description: "Rich, fatty, soft coating texture" },
  { name: "Whipped", category: "Texture", priority: 6, description: "Light, airy, cream-like texture (whipped cream, milkshake)" },
  { name: "Dense", category: "Texture", priority: 6, description: "Heavy, compact, dessert-like weight" },

  // ── Blending (priority 7)
  { name: "Mixed Fruit", category: "Blending", priority: 7, description: "Composite or non-distinct fruit blend" },
  { name: "Mixed Floral", category: "Blending", priority: 7, description: "Composite floral impression (non-distinct flowers)" },
  { name: "Mixed Tropical", category: "Blending", priority: 7, description: "Composite tropical fruit impression" },
  { name: "Mixed Berry", category: "Blending", priority: 7, description: "Composite berry expression" },

  // ── Other (priority 7)
  { name: "Botanical", category: "Other", priority: 7, description: "Non-floral plant aromatics (hops, herbal blends)" },

  // ── Structure (priority 8)
  { name: "Tannic", category: "Structure", priority: 8, description: "Light astringency; drying grip (common in tea-like coffees)" },
]

const MODIFIER_NAMES = FLAVOR_MODIFIERS.map(m => m.name).sort((a, b) => a.localeCompare(b))

// ---------------------------------------------------------------------------
// STRUCTURE_TAGS — 29 canonical descriptors across 7 axes
// Per-coffee, not per-flavor. Stored in brews.structure_tags as "Axis:Descriptor".
// ---------------------------------------------------------------------------

export const STRUCTURE_TAGS: readonly StructureTagEntry[] = [
  // ── Acidity
  { axis: "Acidity", descriptor: "Bright", description: "High-energy, sharp, clearly defined acidity" },
  { axis: "Acidity", descriptor: "Juicy", description: "Salivating, fruit-driven acidity" },
  { axis: "Acidity", descriptor: "Soft", description: "Rounded, low-intensity acidity" },
  { axis: "Acidity", descriptor: "Sparkling", description: "Effervescent, high-frequency acidity" },

  // ── Body
  { axis: "Body", descriptor: "Aerated", description: "Light, whipped or mousse-like texture" },
  { axis: "Body", descriptor: "Creamy", description: "Rich, smooth, dairy-like texture" },
  { axis: "Body", descriptor: "Light", description: "Low weight, tea-like" },
  { axis: "Body", descriptor: "Milky", description: "Soft, rounded, milk-integrated texture" },
  { axis: "Body", descriptor: "Round", description: "Balanced, centered weight" },
  { axis: "Body", descriptor: "Silky", description: "Smooth, fine texture" },
  { axis: "Body", descriptor: "Syrupy", description: "Heavy, viscous, coating" },

  // ── Clarity
  { axis: "Clarity", descriptor: "Clean", description: "Well-separated flavors; minimal muddling" },
  { axis: "Clarity", descriptor: "Complex", description: "Multiple simultaneous notes" },
  { axis: "Clarity", descriptor: "Delicate", description: "Light, precise, low-intensity but refined expression" },
  { axis: "Clarity", descriptor: "Expressive", description: "High aromatic and flavor intensity" },
  { axis: "Clarity", descriptor: "Layered", description: "Distinct flavor progression" },
  { axis: "Clarity", descriptor: "Refined", description: "High precision, minimal noise, very polished expression" },
  { axis: "Clarity", descriptor: "Subtle", description: "Low-intensity, restrained expression" },
  { axis: "Clarity", descriptor: "Transparent", description: "Extremely clear, origin-distinct expression" },

  // ── Finish
  { axis: "Finish", descriptor: "Clean", description: "No residue; quick clarity after swallow" },
  { axis: "Finish", descriptor: "Coating", description: "Lingers on palate; physical persistence" },
  { axis: "Finish", descriptor: "Drying", description: "Light tannic or dehydrating finish (common in tea-like coffees)" },
  { axis: "Finish", descriptor: "Lingering", description: "Long-lasting flavor persistence after swallow" },
  { axis: "Finish", descriptor: "Short", description: "Quick resolution; minimal persistence" },

  // ── Sweetness
  { axis: "Sweetness", descriptor: "High", description: "Pronounced sweetness presence" },
  { axis: "Sweetness", descriptor: "Low", description: "Minimal perceived sweetness" },
  { axis: "Sweetness", descriptor: "Moderate", description: "Balanced sweetness" },

  // ── Balance
  { axis: "Balance", descriptor: "Balanced", description: "No dominant axis; integrated acidity, sweetness, and body" },

  // ── Overall
  { axis: "Overall", descriptor: "Tea-like", description: "Light body, high clarity, tea-like structure" },
]

/** Serialize a structure tag entry to its text[] storage form ("Acidity:Bright"). */
export function structureTagKey(tag: { axis: StructureAxis | string; descriptor: string }): string {
  return `${tag.axis}:${tag.descriptor}`
}

/** Parse a "Axis:Descriptor" key back to its parts. */
export function parseStructureTag(key: string): { axis: StructureAxis; descriptor: string } | null {
  const idx = key.indexOf(':')
  if (idx < 0) return null
  return { axis: key.slice(0, idx) as StructureAxis, descriptor: key.slice(idx + 1) }
}

const STRUCTURE_KEYS = STRUCTURE_TAGS.map(structureTagKey).sort()

// Group structure tags by axis for axis-grouped pickers in StructureTagsPicker.
export const STRUCTURE_BY_AXIS: Record<StructureAxis, readonly string[]> = (() => {
  const out = {} as Record<StructureAxis, string[]>
  for (const tag of STRUCTURE_TAGS) {
    if (!out[tag.axis]) out[tag.axis] = []
    out[tag.axis].push(tag.descriptor)
  }
  return out as Record<StructureAxis, readonly string[]>
})()

export const STRUCTURE_AXES: readonly StructureAxis[] =
  ['Acidity', 'Body', 'Clarity', 'Finish', 'Sweetness', 'Balance', 'Overall']

// ---------------------------------------------------------------------------
// ALIAS_MAP — 112 raw → {base, modifiers} mappings
// Pre-decomposes common composites so users can type "Blueberry Muffin"
// and the composer auto-fills (Blueberry, [Cooked / Baked]).
// ---------------------------------------------------------------------------

export const ALIAS_MAP: Record<string, FlavorChip> = {
  "Amaro": { base: "Herbal", modifiers: ["Fermented"] },
  "Apple Cider": { base: "Apple", modifiers: ["Fermented"] },
  "Apple Jam": { base: "Apple", modifiers: ["Jam / Compote"] },
  "Baked Apple": { base: "Apple", modifiers: ["Cooked / Baked"] },
  "Berry Compote": { base: "Strawberry", modifiers: ["Jam / Compote", "Mixed Berry"] },
  "Birthday Cake": { base: "Vanilla", modifiers: ["Cooked / Baked"] },
  "Blueberry Candy": { base: "Blueberry", modifiers: ["Candy"] },
  "Blueberry Ice Cream": { base: "Blueberry", modifiers: ["Creamy"] },
  "Blueberry Muffin": { base: "Blueberry", modifiers: ["Cooked / Baked"] },
  "Blueberry Yogurt": { base: "Blueberry", modifiers: ["Creamy"] },
  "Bubble Tea": { base: "Tea", modifiers: ["Milky"] },
  "Buttery": { base: "Butter", modifiers: [] },
  "Cacao Nibs": { base: "Chocolate", modifiers: ["Roasted"] },
  "Candied Floral": { base: "Jasmine", modifiers: ["Candied"] },
  "Candied Lemon": { base: "Lemon", modifiers: ["Candied"] },
  "Candied Orange": { base: "Orange", modifiers: ["Candied"] },
  "Candied Strawberry": { base: "Strawberry", modifiers: ["Candied"] },
  "Candied Sweetness": { base: "Plum", modifiers: ["Candied"] },
  "Caramelized Sugar": { base: "Caramel", modifiers: ["Cooked / Baked"] },
  "Chardonnay": { base: "Grape", modifiers: ["Fermented"] },
  "Cherry Cola": { base: "Cherry", modifiers: ["Carbonated"] },
  "Cherry Soda": { base: "Cherry", modifiers: ["Carbonated"] },
  "Chocolate Cake": { base: "Chocolate", modifiers: ["Cooked / Baked"] },
  "Chocolate Mousse": { base: "Chocolate", modifiers: ["Aerated"] },
  "Chocolate Truffle": { base: "Chocolate", modifiers: ["Dense"] },
  "Citrus clarity": { base: "Lemon", modifiers: [] },
  "Cotton Candy": { base: "Sugar", modifiers: ["Candy"] },
  "Cream": { base: "Milk", modifiers: ["Creamy"] },
  "Dark Chocolate Mousse": { base: "Chocolate", modifiers: ["Aerated"] },
  "Dried Apple": { base: "Apple", modifiers: ["Dried"] },
  "Dried Apricot": { base: "Apricot", modifiers: ["Dried"] },
  "Dried Mango": { base: "Mango", modifiers: ["Dried"] },
  "Dulce de Leche": { base: "Caramel", modifiers: ["Creamy"] },
  "Earl Grey Tea": { base: "Earl Grey", modifiers: [] },
  "Faint soft fruit": { base: "Peach", modifiers: ["Light"] },
  "Floral aromatics": { base: "Jasmine", modifiers: ["Mixed Floral"] },
  "Floral sweetness": { base: "Jasmine", modifiers: ["Mixed Floral"] },
  "Floral tea": { base: "Tea", modifiers: ["Jasmine"] },
  "Floral Tea": { base: "Tea", modifiers: ["Jasmine"] },
  "Forest Berries": { base: "Strawberry", modifiers: ["Mixed Berry"] },
  "Fresh Grape": { base: "Grape", modifiers: ["Fresh"] },
  "Fresh Raspberry": { base: "Raspberry", modifiers: ["Fresh"] },
  "Fruit Leather": { base: "Mango", modifiers: ["Fruit Leather"] },
  "Fruit Roll Up": { base: "Strawberry", modifiers: ["Candy", "Mixed Fruit"] },
  "Fruity Tea": { base: "Tea", modifiers: ["Mixed Fruit"] },
  "Ginger Ale": { base: "Ginger", modifiers: ["Carbonated"] },
  "Gingerbread": { base: "Cinnamon", modifiers: ["Cooked / Baked"] },
  "Grape Soda": { base: "Grape", modifiers: ["Carbonated"] },
  "Grapefruit Zest": { base: "Grapefruit", modifiers: ["Zest"] },
  "Gummies": { base: "Strawberry", modifiers: ["Candy"] },
  "Hard candy sweetness": { base: "Sugar", modifiers: ["Candy"] },
  "Hazelnut Spread": { base: "Hazelnut", modifiers: ["Creamy"] },
  "Herbal florality": { base: "Jasmine", modifiers: ["Herbal"] },
  "Herbal sweetness": { base: "Mint", modifiers: [] },
  "High-definition florality": { base: "Jasmine", modifiers: ["Mixed Floral"] },
  "Honeyed Tea": { base: "Tea", modifiers: ["Sugary"] },
  "Jolly Rancher": { base: "Strawberry", modifiers: ["Candy", "Artificial"] },
  "Juicy Blackberry": { base: "Blackberry", modifiers: [] },
  "Lemon Zest": { base: "Lemon", modifiers: ["Zest"] },
  "Lemonade": { base: "Lemon", modifiers: ["Juice", "Sugary"] },
  "Lime Zest": { base: "Lime", modifiers: ["Zest"] },
  "Limeade": { base: "Lime", modifiers: ["Juice", "Sugary"] },
  "Limoncello": { base: "Lemon", modifiers: ["Fermented"] },
  "Lollipop": { base: "Sugar", modifiers: ["Candy"] },
  "Mango Lassi": { base: "Mango", modifiers: ["Creamy"] },
  "Maple Syrup": { base: "Maple Syrup", modifiers: [] },
  "Marshmallow": { base: "Vanilla", modifiers: ["Aerated"] },
  "Milk Chocolate": { base: "Chocolate", modifiers: [] },
  "Milk Tea": { base: "Tea", modifiers: ["Milky"] },
  "Milkshake": { base: "Vanilla", modifiers: ["Whipped"] },
  "Mixed Berries": { base: "Strawberry", modifiers: ["Mixed Berry"] },
  "Nougat": { base: "Caramel", modifiers: ["Nut"] },
  "Nutty": { base: "Almond", modifiers: [] },
  "Orange Marmalade": { base: "Orange", modifiers: ["Marmalade"] },
  "Orange Zest": { base: "Orange", modifiers: ["Zest"] },
  "Overripe Mango": { base: "Mango", modifiers: ["Overripe"] },
  "Peach Candy": { base: "Peach", modifiers: ["Candy"] },
  "Peach Soda": { base: "Peach", modifiers: ["Carbonated"] },
  "Peach Tea": { base: "Tea", modifiers: ["Peach"] },
  "Peanut Butter": { base: "Peanut", modifiers: ["Creamy"] },
  "Pear Tart": { base: "Pear", modifiers: ["Cooked / Baked"] },
  "Pink Lemonade": { base: "Lemon", modifiers: ["Juice", "Sugary"] },
  "Poached Pear": { base: "Pear", modifiers: ["Cooked / Baked"] },
  "Praline": { base: "Caramel", modifiers: ["Nut"] },
  "pu'er": { base: "Pu'Er", modifiers: [] },
  "Red Wine": { base: "Grape", modifiers: ["Fermented"] },
  "Ripe Peach": { base: "Peach", modifiers: ["Ripe"] },
  "Sangria": { base: "Grape", modifiers: ["Fermented", "Mixed Fruit"] },
  "Savory-sweet tomato": { base: "Tomato", modifiers: ["Ripe"] },
  "Silky": { base: "Milk", modifiers: ["Creamy"] },
  "Skittles": { base: "Strawberry", modifiers: ["Candy", "Artificial"] },
  "Soft Florals": { base: "Jasmine", modifiers: ["Light"] },
  "Sparkling Red Grape": { base: "Grape", modifiers: ["Carbonated"] },
  "Spices": { base: "Spices", modifiers: [] },
  "Spring Honey": { base: "Honey", modifiers: ["Fresh"] },
  "Stone fruit sweetness": { base: "Peach", modifiers: [] },
  "Strawberry Compote": { base: "Strawberry", modifiers: ["Jam / Compote"] },
  "Strawberry Jam": { base: "Strawberry", modifiers: ["Jam / Compote"] },
  "Sugar Cookie": { base: "Vanilla", modifiers: ["Cooked / Baked"] },
  "Sweet Pineapple": { base: "Pineapple", modifiers: ["Sugary"] },
  "Syrah": { base: "Grape", modifiers: ["Fermented"] },
  "Toffee": { base: "Caramel", modifiers: ["Cooked / Baked"] },
  "Tropical fruit sweetness": { base: "Mango", modifiers: ["Mixed Fruit"] },
  "Tropical Fruits": { base: "Mango", modifiers: ["Mixed Fruit"] },
  "Vanilla Bean": { base: "Vanilla", modifiers: [] },
  "Vanilla Cake": { base: "Vanilla", modifiers: ["Cooked / Baked"] },
  "Vanilla Cream": { base: "Vanilla", modifiers: ["Creamy"] },
  "Watermelon Candy": { base: "Watermelon", modifiers: ["Candy"] },
  "White Wine": { base: "Grape", modifiers: ["Fermented"] },
  "Wine": { base: "Grape", modifiers: ["Fermented"] },
  "Wine-like fruit": { base: "Grape", modifiers: ["Fermented"] },
  "Yellow Florals": { base: "Jasmine", modifiers: ["Mixed Floral"] },
}

// ---------------------------------------------------------------------------
// FALLBACK_ANCHORS — when a Category-name is typed without specifics,
// suggest these defaults per Chris's Rule 3 (use real note when available).
// ---------------------------------------------------------------------------

export const FALLBACK_ANCHORS: Record<string, string> = {
  "Floral": "Jasmine",
  "Citrus": "Lemon",
  "Stone Fruit": "Peach",
  "Tropical": "Mango",
  "Herbal": "Mint",
  "Berry": "Strawberry",
  "Fruit": "Mango",
}

// ---------------------------------------------------------------------------
// TEA_BASES — Tea-as-base rule (Rule: Tea = base, fruit/floral = modifier)
// When base is in this set, the composer's modifier slot expands to include
// base flavor names as candidate modifier values (so "Tea + Peach" works).
// ---------------------------------------------------------------------------

export const TEA_BASES: readonly string[] = ["Tea", "Assam Tea", "Black Tea", "Chamomile", "Dragon Well Tea", "Earl Grey", "Green Tea", "Oolong", "Pu'Er", "Rooibos Tea", "White Tea", "Yunnan Red Tea"]

export function isTeaBase(base: string): boolean {
  return TEA_BASES.includes(base)
}

// ---------------------------------------------------------------------------
// LEGACY_FLAVOR_DECOMPOSITIONS — every distinct DB string mapped (Bucket A + B + legacy)
// Per-brew Bucket C overrides via LEGACY_FLAVOR_DECOMPOSITIONS_PER_BREW (key: "brewId|raw")
// ---------------------------------------------------------------------------

export const LEGACY_FLAVOR_DECOMPOSITIONS: Record<string, LegacyDecomposition> = {
  "Apple": { flavors: [{ base: "Apple", modifiers: [] }], structureTags: [] },
  "Apple Cider": { flavors: [{ base: "Apple", modifiers: ["Fermented"] }], structureTags: [] },
  "Apple Jam": { flavors: [{ base: "Apple", modifiers: ["Jam / Compote"] }], structureTags: [] },
  "Apricot": { flavors: [{ base: "Apricot", modifiers: [] }], structureTags: [] },
  "Baklava": { flavors: [{ base: "Baklava", modifiers: [] }], structureTags: [] },
  "Bergamot": { flavors: [{ base: "Bergamot", modifiers: [] }], structureTags: [] },
  "Black Tea": { flavors: [{ base: "Black Tea", modifiers: [] }], structureTags: [] },
  "Blackberry": { flavors: [{ base: "Blackberry", modifiers: [] }], structureTags: [] },
  "blue and black fruits": { flavors: [], structureTags: [], drop: true },
  "Bright": { flavors: [], structureTags: ["Acidity:Bright"], drop: true },
  "Cacao": { flavors: [{ base: "Cacao", modifiers: [] }], structureTags: [] },
  "Candied Strawberry": { flavors: [{ base: "Strawberry", modifiers: ["Candied"] }], structureTags: [] },
  "Caramel": { flavors: [{ base: "Caramel", modifiers: [] }], structureTags: [] },
  "Cardamom": { flavors: [{ base: "Cardamom", modifiers: [] }], structureTags: [] },
  "Chamomile": { flavors: [{ base: "Chamomile", modifiers: [] }], structureTags: [] },
  "Chardonnay": { flavors: [{ base: "Chardonnay", modifiers: [] }], structureTags: [] },
  "Cherry": { flavors: [{ base: "Cherry", modifiers: [] }], structureTags: [] },
  "Cherry Blossom": { flavors: [{ base: "Cherry Blossom", modifiers: [] }], structureTags: [] },
  "Cinnamon": { flavors: [{ base: "Cinnamon", modifiers: [] }], structureTags: [] },
  "Cinnamon French Toast": { flavors: [{ base: "Cinnamon", modifiers: ["Cooked / Baked"] }], structureTags: [] },
  "Clean but expressive finish": { flavors: [], structureTags: ["Finish:Clean", "Clarity:Expressive"], drop: true },
  "Complex": { flavors: [], structureTags: ["Clarity:Complex"], drop: true },
  "Earl Grey": { flavors: [{ base: "Earl Grey", modifiers: [] }], structureTags: [] },
  "Earl Grey Tea": { flavors: [{ base: "Earl Grey", modifiers: [] }], structureTags: [] },
  "Eucalyptus": { flavors: [{ base: "Eucalyptus", modifiers: [] }], structureTags: [] },
  "Floral tea": { flavors: [{ base: "Tea", modifiers: ["Jasmine"] }], structureTags: [] },
  "Ginger Flower": { flavors: [{ base: "Ginger Flower", modifiers: [] }], structureTags: [] },
  "Grape": { flavors: [{ base: "Grape", modifiers: [] }], structureTags: [] },
  "Grapefruit": { flavors: [{ base: "Grapefruit", modifiers: [] }], structureTags: [] },
  "Green Apple": { flavors: [{ base: "Apple", modifiers: ["Fresh"] }], structureTags: [] },
  "Green Tea": { flavors: [{ base: "Green Tea", modifiers: [] }], structureTags: [] },
  "Haw Flake": { flavors: [{ base: "Haw Flake", modifiers: [] }], structureTags: [] },
  "Hibiscus": { flavors: [{ base: "Hibiscus", modifiers: [] }], structureTags: [] },
  "Honey": { flavors: [{ base: "Honey", modifiers: [] }], structureTags: [] },
  "Honeysuckle": { flavors: [{ base: "Honeysuckle", modifiers: [] }], structureTags: [] },
  "Jasmine": { flavors: [{ base: "Jasmine", modifiers: [] }], structureTags: [] },
  "Jasmine Milk Tea": { flavors: [{ base: "Tea", modifiers: ["Milky", "Jasmine"] }], structureTags: [] },
  "Jasmine Pearls": { flavors: [{ base: "Jasmine", modifiers: [] }], structureTags: [] },
  "Key Lime": { flavors: [{ base: "Lime", modifiers: [] }], structureTags: [] },
  "Kiwi": { flavors: [{ base: "Kiwi", modifiers: [] }], structureTags: [] },
  "Lavender": { flavors: [{ base: "Lavender", modifiers: [] }], structureTags: [] },
  "Layered": { flavors: [], structureTags: ["Clarity:Layered"], drop: true },
  "Lemon": { flavors: [{ base: "Lemon", modifiers: [] }], structureTags: [] },
  "Lemon Zest": { flavors: [{ base: "Lemon", modifiers: ["Zest"] }], structureTags: [] },
  "Lemongrass": { flavors: [{ base: "Lemongrass", modifiers: [] }], structureTags: [] },
  "Light, tea-like body": { flavors: [], structureTags: ["Body:Light", "Overall:Tea-like"], drop: true },
  "Lime": { flavors: [{ base: "Lime", modifiers: [] }], structureTags: [] },
  "Lime Juice": { flavors: [{ base: "Lime", modifiers: ["Juice"] }], structureTags: [] },
  "Long, composed finish": { flavors: [], structureTags: ["Finish:Lingering"], drop: true },
  "Lychee": { flavors: [{ base: "Lychee", modifiers: [] }], structureTags: [] },
  "Mandarin": { flavors: [{ base: "Mandarin", modifiers: [] }], structureTags: [] },
  "Mango": { flavors: [{ base: "Mango", modifiers: [] }], structureTags: [] },
  "Maple Syrup": { flavors: [{ base: "Maple Syrup", modifiers: [] }], structureTags: [] },
  "Marmalade": { flavors: [{ base: "Orange", modifiers: ["Marmalade"] }], structureTags: [] },
  "Meyer Lemon": { flavors: [{ base: "Lemon", modifiers: [] }], structureTags: [] },
  "Milk Candy": { flavors: [{ base: "Milk Candy", modifiers: [] }], structureTags: [] },
  "Milk Tea": { flavors: [{ base: "Tea", modifiers: ["Milky"] }], structureTags: [] },
  "Mint": { flavors: [{ base: "Mint", modifiers: [] }], structureTags: [] },
  "Muscat": { flavors: [{ base: "Muscat", modifiers: [] }], structureTags: [] },
  "Muscat Rouge": { flavors: [{ base: "Muscat", modifiers: [] }], structureTags: [] },
  "Nectarine": { flavors: [{ base: "Nectarine", modifiers: [] }], structureTags: [] },
  "Oolong": { flavors: [{ base: "Oolong", modifiers: [] }], structureTags: [] },
  "Orange": { flavors: [{ base: "Orange", modifiers: [] }], structureTags: [] },
  "Passion Fruit": { flavors: [{ base: "Passion Fruit", modifiers: [] }], structureTags: [] },
  "Passionfruit": { flavors: [{ base: "Passion Fruit", modifiers: [] }], structureTags: [] },
  "Peach": { flavors: [{ base: "Peach", modifiers: [] }], structureTags: [] },
  "Pear": { flavors: [{ base: "Pear", modifiers: [] }], structureTags: [] },
  "Pineapple": { flavors: [{ base: "Pineapple", modifiers: [] }], structureTags: [] },
  "Plum": { flavors: [{ base: "Plum", modifiers: [] }], structureTags: [] },
  "Pomegranate": { flavors: [{ base: "Pomegranate", modifiers: [] }], structureTags: [] },
  "Pomelo": { flavors: [{ base: "Pomelo", modifiers: [] }], structureTags: [] },
  "Prune": { flavors: [{ base: "Prune", modifiers: [] }], structureTags: [] },
  "pu'er": { flavors: [{ base: "Pu'Er", modifiers: [] }], structureTags: [] },
  "Raspberry": { flavors: [{ base: "Raspberry", modifiers: [] }], structureTags: [] },
  "Raspberry Compote": { flavors: [{ base: "Raspberry", modifiers: ["Jam / Compote"] }], structureTags: [] },
  "Raw Sugar": { flavors: [{ base: "Raw Sugar", modifiers: [] }], structureTags: [] },
  "Red Apple": { flavors: [{ base: "Apple", modifiers: [] }], structureTags: [] },
  "Red Grape": { flavors: [{ base: "Grape", modifiers: [] }], structureTags: [] },
  "Refined tea-like structure": { flavors: [], structureTags: ["Clarity:Refined", "Overall:Tea-like"], drop: true },
  "Rose": { flavors: [{ base: "Rose", modifiers: [] }], structureTags: [] },
  "Rose Water": { flavors: [{ base: "Rose", modifiers: [] }], structureTags: [] },
  "Round": { flavors: [], structureTags: ["Body:Round"], drop: true },
  "Silky": { flavors: [], structureTags: ["Body:Silky"], drop: true },
  "Spices": { flavors: [{ base: "Spices", modifiers: [] }], structureTags: [] },
  "Strawberry": { flavors: [{ base: "Strawberry", modifiers: [] }], structureTags: [] },
  "Subtle sweetness": { flavors: [], structureTags: ["Clarity:Subtle"], drop: true },
  "Sugar Cane": { flavors: [{ base: "Sugar Cane", modifiers: [] }], structureTags: [] },
  "Sweet": { flavors: [], structureTags: ["Sweetness:Moderate"], drop: true },
  "Syrupy Coating": { flavors: [], structureTags: ["Body:Syrupy", "Finish:Coating"], drop: true },
  "Tangerine": { flavors: [{ base: "Tangerine", modifiers: [] }], structureTags: [] },
  "Tea Spice": { flavors: [{ base: "Spices", modifiers: [] }], structureTags: [] },
  "Tea-like finish": { flavors: [], structureTags: ["Overall:Tea-like"], drop: true },
  "Tea-like undertone": { flavors: [], structureTags: ["Overall:Tea-like"], drop: true },
  "Tomato": { flavors: [{ base: "Tomato", modifiers: [] }], structureTags: [] },
  "Tomato Leaf": { flavors: [{ base: "Tomato", modifiers: ["Botanical"] }], structureTags: [] },
  "Vanilla": { flavors: [{ base: "Vanilla", modifiers: [] }], structureTags: [] },
  "Vanilla Bean": { flavors: [{ base: "Vanilla", modifiers: [] }], structureTags: [] },
  "Violet": { flavors: [{ base: "Violet", modifiers: [] }], structureTags: [] },
  "Watermelon": { flavors: [{ base: "Watermelon", modifiers: [] }], structureTags: [] },
  "White Grape": { flavors: [{ base: "Grape", modifiers: [] }], structureTags: [] },
  "White Nectarine": { flavors: [{ base: "Nectarine", modifiers: [] }], structureTags: [] },
  "White Tea": { flavors: [{ base: "White Tea", modifiers: [] }], structureTags: [] },
  "Wine-like Fruit": { flavors: [{ base: "Grape", modifiers: ["Fermented"] }], structureTags: [] },
  "Wine-like fruit": { flavors: [{ base: "Grape", modifiers: ["Fermented"] }], structureTags: [] },
}

export const LEGACY_FLAVOR_DECOMPOSITIONS_PER_BREW: Record<string, LegacyDecomposition> = {
  "1e84af99-f059-46e1-af0e-34f1c3329755|Soft Florals": { flavors: [{ base: "Jasmine", modifiers: ["Light"] }], structureTags: ["Clarity:Subtle"] },
  "2fdfbb95-3582-46e8-8262-9c2422809bb3|Fruit": { flavors: [{ base: "Peach", modifiers: [] }], structureTags: ["Clarity:Layered", "Sweetness:High"] },
  "3aef599b-8339-45eb-ae9b-5e91d6eda123|Stone Fruit": { flavors: [{ base: "Peach", modifiers: [] }], structureTags: ["Body:Tea-like"] },
  "3e781561-7bf7-405e-ba57-b712f2756932|Citrus": { flavors: [{ base: "Pineapple", modifiers: [] }], structureTags: ["Acidity:Juicy"] },
  "3e781561-7bf7-405e-ba57-b712f2756932|Juicy Blackberry": { flavors: [{ base: "Blackberry", modifiers: [] }], structureTags: ["Acidity:Juicy"] },
  "3e781561-7bf7-405e-ba57-b712f2756932|Sweet Pineapple": { flavors: [{ base: "Pineapple", modifiers: ["Sugary"] }], structureTags: [] },
  "4884a010-a981-49ae-ab0f-34d8b650dc17|Stone Fruit": { flavors: [{ base: "Watermelon", modifiers: [] }], structureTags: ["Acidity:Juicy"] },
  "5b6530c0-4bc9-46b9-a00f-722412ac7aff|Floral": { flavors: [{ base: "Jasmine", modifiers: [] }], structureTags: [] },
  "643c6b5d-609c-4a1b-944a-4264ecc0df02|Citrus": { flavors: [{ base: "Lemon", modifiers: [] }], structureTags: ["Finish:Clean"] },
  "7aef16d6-2ea3-482f-ac52-d7b9e31e7162|Jasmine Milk Tea": { flavors: [{ base: "Tea", modifiers: ["Milky", "Jasmine"] }], structureTags: ["Body:Creamy"] },
  "7aef16d6-2ea3-482f-ac52-d7b9e31e7162|Peach Candy": { flavors: [{ base: "Peach", modifiers: ["Candy"] }], structureTags: [] },
  "7b54b706-ddc5-4148-8777-237ad8ffd728|Sparkling Red Grape": { flavors: [{ base: "Grape", modifiers: ["Carbonated"] }], structureTags: ["Acidity:Sparkling"] },
  "7bbf561e-cc48-4c9d-bb3d-12e3a52836a9|Faint soft fruit": { flavors: [{ base: "Peach", modifiers: ["Light"] }], structureTags: [] },
  "7bbf561e-cc48-4c9d-bb3d-12e3a52836a9|Floral": { flavors: [{ base: "Honey", modifiers: [] }], structureTags: ["Body:Tea-like"] },
  "7bbf561e-cc48-4c9d-bb3d-12e3a52836a9|Honeyed Tea": { flavors: [{ base: "Tea", modifiers: ["Sugary"] }], structureTags: ["Body:Tea-like"] },
  "7bbf561e-cc48-4c9d-bb3d-12e3a52836a9|Spring Honey": { flavors: [{ base: "Honey", modifiers: ["Fresh"] }], structureTags: [] },
  "874b021f-0a5a-48c1-b6ec-fc0416e6f607|Herbal sweetness": { flavors: [{ base: "Mint", modifiers: [] }], structureTags: ["Sweetness:High"] },
  "903a364a-2877-44dc-b60c-f1529d9ba6b4|Citrus clarity": { flavors: [{ base: "Lemon", modifiers: [] }], structureTags: ["Clarity:Clean"] },
  "903a364a-2877-44dc-b60c-f1529d9ba6b4|Floral aromatics": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: [] },
  "903a364a-2877-44dc-b60c-f1529d9ba6b4|High-definition florality": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: ["Clarity:Expressive"] },
  "903a364a-2877-44dc-b60c-f1529d9ba6b4|Stone fruit sweetness": { flavors: [{ base: "Peach", modifiers: [] }], structureTags: ["Sweetness:High"] },
  "94fb57ac-c04a-49ef-b281-97de4d0e9c46|Cup": { flavors: [], structureTags: [], drop: true },
  "950728e4-6448-413d-b5e0-d974685a451d|Fresh Grape": { flavors: [{ base: "Grape", modifiers: ["Fresh"] }], structureTags: [] },
  "950728e4-6448-413d-b5e0-d974685a451d|Fruity Tea": { flavors: [{ base: "Tea", modifiers: ["Mixed Fruit"] }], structureTags: ["Body:Tea-like"] },
  "a881c09f-d496-4d2d-a796-4f79f16862ad|Candied Floral": { flavors: [{ base: "Jasmine", modifiers: ["Candied"] }], structureTags: ["Sweetness:High"] },
  "a881c09f-d496-4d2d-a796-4f79f16862ad|Floral": { flavors: [{ base: "Jasmine", modifiers: [] }], structureTags: [] },
  "b6975998-3ff2-4d3f-b1b5-137eb237f24d|Round": { flavors: [], structureTags: ["Body:Round"], drop: true },
  "b6975998-3ff2-4d3f-b1b5-137eb237f24d|Sweet": { flavors: [], structureTags: ["Sweetness:Moderate"], drop: true },
  "b6975998-3ff2-4d3f-b1b5-137eb237f24d|Tropical Fruits": { flavors: [{ base: "Mango", modifiers: ["Mixed Fruit"] }], structureTags: ["Body:Silky", "Sweetness:High"] },
  "ba1740c3-b57b-42e5-92f6-b6a804d2f96d|Watermelon Candy": { flavors: [{ base: "Watermelon", modifiers: ["Candy"] }], structureTags: ["Sweetness:High"] },
  "c66302a0-979e-4a41-9536-6df89c2fa4d2|Floral": { flavors: [{ base: "Lavender", modifiers: [] }], structureTags: ["Clarity:Subtle"] },
  "c6819156-570e-4e6f-9a1e-d7c643a02a87|Citrus": { flavors: [{ base: "Lemon", modifiers: [] }], structureTags: ["Acidity:Bright"] },
  "c8a5ce46-3fa2-46fa-8ead-1e2f8a3d68ad|Floral sweetness": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: ["Sweetness:High"] },
  "cb4c9bbc-018c-437f-8648-f74b05098b04|Hard candy sweetness": { flavors: [{ base: "Sugar", modifiers: ["Candy"] }], structureTags: ["Sweetness:High"] },
  "cb4c9bbc-018c-437f-8648-f74b05098b04|Peach Tea": { flavors: [{ base: "Tea", modifiers: ["Peach"] }], structureTags: ["Body:Tea-like"] },
  "d6c43257-e09f-44c5-aa88-ebbc262037c3|Herbal florality": { flavors: [{ base: "Jasmine", modifiers: ["Herbal"] }], structureTags: [] },
  "d6c43257-e09f-44c5-aa88-ebbc262037c3|Savory-sweet tomato": { flavors: [{ base: "Tomato", modifiers: ["Ripe"] }], structureTags: [] },
  "dcad1ffa-f2bc-443c-9cd1-f18e27fe1b1f|Candied Sweetness": { flavors: [{ base: "Plum", modifiers: ["Candied"] }], structureTags: ["Sweetness:High"] },
  "dcad1ffa-f2bc-443c-9cd1-f18e27fe1b1f|Floral": { flavors: [{ base: "Jasmine", modifiers: [] }], structureTags: [] },
  "e7a82e0a-7c9c-41cd-b5da-9d5b9589361e|Tropical": { flavors: [{ base: "Mango", modifiers: ["Candied"] }], structureTags: ["Acidity:Juicy"] },
  "ecad5cba-4491-4868-bcb3-463d39642636|Floral sweetness": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: ["Sweetness:High"] },
  "ecad5cba-4491-4868-bcb3-463d39642636|Stone Fruit": { flavors: [{ base: "Pineapple", modifiers: ["Fresh"] }], structureTags: ["Finish:Clean"] },
  "fd2f0a72-83e9-4d6f-ad9c-4aca75287a98|Yellow Florals": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: [] },
  "fd346045-b3ac-4ee2-b9e8-8dbb682e448e|Sweet Fruit": { flavors: [{ base: "Strawberry", modifiers: ["Candied"] }], structureTags: ["Sweetness:High"] },
  "fd7c6ec1-bb13-4ec3-b167-c665547a57f6|Fermentation-driven complexity": { flavors: [], structureTags: ["Clarity:Complex"], drop: true },
  "fd7c6ec1-bb13-4ec3-b167-c665547a57f6|Floral aromatics": { flavors: [{ base: "Jasmine", modifiers: ["Mixed Floral"] }], structureTags: [] },
  "fd7c6ec1-bb13-4ec3-b167-c665547a57f6|Tropical fruit sweetness": { flavors: [{ base: "Mango", modifiers: ["Mixed Fruit"] }], structureTags: ["Sweetness:High"] },
  "ffc53a3b-0931-43af-a2c9-1ed4dfd5545f|Vanilla Cream": { flavors: [{ base: "Vanilla", modifiers: ["Creamy"] }], structureTags: [] },
}

// ---------------------------------------------------------------------------
// composeFlavorNote / decomposeFlavorNote helpers
// ---------------------------------------------------------------------------

/** Render a flavor chip to its display string ("Blueberry (Baked)"). */
export function composeFlavorNote(chip: FlavorChip): string {
  if (!chip.modifiers || chip.modifiers.length === 0) return chip.base
  return `${chip.base} (${chip.modifiers.join(', ')})`
}

/** Render a list of chips to a list of display strings (for back-compat flavor_notes). */
export function composeFlavorNotes(chips: FlavorChip[]): string[] {
  return chips.map(composeFlavorNote)
}

// Module-level O(1) lookups — built once at import time. Hot-path callers
// (composer keystroke, render-loop chipFamily) hit these instead of Array.find.
const ALIAS_LOWER_MAP: Map<string, FlavorChip> = new Map(
  Object.entries(ALIAS_MAP).map(([k, v]) => [k.toLowerCase(), v])
)
const BASE_LOWER_SET: Set<string> = new Set(BASE_FLAVORS.map(b => b.name.toLowerCase()))
const BASE_ENTRY_BY_NAME: Map<string, BaseFlavorEntry> = new Map(
  BASE_FLAVORS.map(b => [b.name, b])
)
const MODIFIER_ENTRY_BY_NAME: Map<string, ModifierEntry> = new Map(
  FLAVOR_MODIFIERS.map(m => [m.name, m])
)

/** Resolve a raw input string via aliases. Returns null if not aliased and not a canonical base. */
export function decomposeFlavorNote(raw: string): FlavorChip | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const alias = ALIAS_MAP[trimmed] ?? ALIAS_LOWER_MAP.get(trimmed.toLowerCase())
  if (alias) return alias
  if (BASE_LOWER_SET.has(trimmed.toLowerCase())) return { base: trimmed, modifiers: [] }
  return null
}

// ---------------------------------------------------------------------------
// Canonical lookups via shared factory
// ---------------------------------------------------------------------------

const ALIAS_KEYS_FOR_LOOKUP = Object.fromEntries(
  Object.entries(ALIAS_MAP).map(([alias, decomp]) => [alias, decomp.base])
)

export const BASE_FLAVOR_LOOKUP: CanonicalLookup = makeCanonicalLookup(BASE_NAMES, ALIAS_KEYS_FOR_LOOKUP)
export const MODIFIER_LOOKUP: CanonicalLookup = makeCanonicalLookup(MODIFIER_NAMES)
export const STRUCTURE_LOOKUP: CanonicalLookup = makeCanonicalLookup(STRUCTURE_KEYS)

export function getBaseEntry(name: string): BaseFlavorEntry | undefined {
  return BASE_ENTRY_BY_NAME.get(name)
}

export function getModifierEntry(name: string): ModifierEntry | undefined {
  return MODIFIER_ENTRY_BY_NAME.get(name)
}

// ---------------------------------------------------------------------------
// Shared cleaning helpers — single source of truth for flavors + structure
// validation across the PATCH route + persistBrew (rule-of-2 extraction).
// ---------------------------------------------------------------------------

export type CleanResult<T> = { ok: true; value: T } | { ok: false; error: string }

/** Validate + canonicalize a list of flavor chips. Per-chip: canonicalize base
 *  (verbatim fallback for net-new bases), normalize modifiers via
 *  MODIFIER_LOOKUP or BASE_FLAVOR_LOOKUP (Tea-base rule), clamp at 2 mods. */
export function cleanFlavors(input: unknown): CleanResult<FlavorChip[]> {
  if (input == null) return { ok: true, value: [] }
  if (!Array.isArray(input)) return { ok: false, error: 'flavors must be an array' }
  const cleaned: FlavorChip[] = []
  for (const chip of input) {
    if (!chip || typeof chip !== 'object') {
      return { ok: false, error: 'each flavor chip must be an object' }
    }
    const c = chip as { base?: unknown; modifiers?: unknown }
    if (typeof c.base !== 'string' || !c.base.trim()) {
      return { ok: false, error: 'flavor chip base must be a non-empty string' }
    }
    const base = BASE_FLAVOR_LOOKUP.canonicalize(c.base) ?? c.base.trim()
    const mods: string[] = []
    if (Array.isArray(c.modifiers)) {
      for (const m of c.modifiers) {
        if (typeof m !== 'string' || !m.trim()) continue
        // Modifier may be a canonical modifier OR (Tea-base rule) a base flavor name.
        const canonical = MODIFIER_LOOKUP.canonicalize(m) ?? BASE_FLAVOR_LOOKUP.canonicalize(m) ?? m.trim()
        mods.push(canonical)
        if (mods.length >= 2) break
      }
    }
    cleaned.push({ base, modifiers: mods })
  }
  return { ok: true, value: cleaned }
}

/** Validate a list of structure tags. Strict — every entry must be canonical
 *  ("Axis:Descriptor"). Empty input is valid. */
export function cleanStructureTags(input: unknown): CleanResult<string[]> {
  if (input == null) return { ok: true, value: [] }
  if (!Array.isArray(input)) return { ok: false, error: 'structure_tags must be an array' }
  const cleaned: string[] = []
  for (const tag of input) {
    if (typeof tag !== 'string' || !tag.trim()) continue
    const trimmed = tag.trim()
    if (!STRUCTURE_LOOKUP.isCanonical(trimmed)) {
      return { ok: false, error: `structure_tag "${trimmed}" is not in the canonical registry` }
    }
    cleaned.push(trimmed)
  }
  return { ok: true, value: cleaned }
}

// ---------------------------------------------------------------------------
// Family render — back-compat for FlavorNotesByFamily
// ---------------------------------------------------------------------------

// 8-family palette (post sprint 1g, mapped from 12 base Categories)
export const FLAVOR_FAMILIES = [
  'Citrus',
  'Stone Fruit',
  'Berry',
  'Tropical',
  'Grape & Wine',
  'Floral',
  'Tea & Herbal',
  'Sweet & Confection',
] as const

export type FlavorFamily = (typeof FLAVOR_FAMILIES)[number]

// Map 12 base Categories → 8 family colors + Other (per Sprint 1g locked decision)
// Fruit splits across families by sub-category — see FRUIT_SUB_TO_FAMILY below.
const CATEGORY_TO_FAMILY: Record<FlavorCategory, FlavorFamily | 'Other'> = {
  "Floral": "Floral",
  "Sweet": "Sweet & Confection",
  "Tea & Herbal": "Tea & Herbal",
  "Fruit": "Stone Fruit",
  "Acid": "Other",
  "Beverage": "Other",
  "Defect": "Other",
  "Nut": "Other",
  "Roasted": "Other",
  "Savory": "Other",
  "Spice": "Other",
  "Vegetative": "Other",
}

// Fruit splits across 4+ families by sub-category
const FRUIT_SUB_TO_FAMILY: Record<string, FlavorFamily> = {
  "Citrus": "Citrus",
  "Berry": "Berry",
  "Stone Fruit": "Stone Fruit",
  "Tropical": "Tropical",
  "Pomaceous": "Stone Fruit",
  "Grape": "Grape & Wine",
  "Dried Fruit": "Stone Fruit",
  "Fermented": "Grape & Wine",
  "Other": "Stone Fruit",
}

/** Map a base flavor's Category + Sub-Category to a family color. */
export function getCategoryFamily(category: FlavorCategory, subCategory?: string): FlavorFamily | 'Other' {
  if (category === 'Fruit' && subCategory) {
    return FRUIT_SUB_TO_FAMILY[subCategory] ?? 'Stone Fruit'
  }
  return CATEGORY_TO_FAMILY[category] ?? 'Other'
}

const FAMILY_COLORS: Record<FlavorFamily | 'Other', string> = {
  'Citrus':             '#B8A247',
  'Stone Fruit':        '#C67B68',
  'Berry':              '#8B3B4B',
  'Tropical':           '#D88248',
  'Grape & Wine':       '#5C3A6B',
  'Floral':             '#4A8B7C',
  'Tea & Herbal':       '#6B7B4A',
  'Sweet & Confection': '#8B5A3C',
  'Other':              '#5C6570',
}

export function getFamilyColor(family: FlavorFamily | 'Other' | string): string {
  return FAMILY_COLORS[family as FlavorFamily | 'Other'] || FAMILY_COLORS.Other
}

/** Family for a flavor name. Now backed by base + sub-category lookup via composedNote → base parse. */
export function getFlavorFamily(note: string | null | undefined): FlavorFamily | 'Other' {
  if (!note) return 'Other'
  const trimmed = note.trim()
  if (!trimmed) return 'Other'

  // Strip parenthetical modifier ("Blueberry (Baked)" → "Blueberry")
  const baseName = trimmed.replace(/\s*\([^)]*\)\s*$/, '').trim()

  // Look up the base in BASE_FLAVORS
  const entry = getBaseEntry(baseName)
  if (entry) return getCategoryFamily(entry.category, entry.subCategory)

  // Fallback for legacy free-text or alias targets that don't match a base directly
  const alias = ALIAS_MAP[baseName]
  if (alias) {
    const aliasEntry = getBaseEntry(alias.base)
    if (aliasEntry) return getCategoryFamily(aliasEntry.category, aliasEntry.subCategory)
  }

  return 'Other'
}

// ---------------------------------------------------------------------------
// Aggregation helper — used by all 4 aggregation detail pages
// (terroir / cultivar / processes / roasters detail)
// Reads from legacy flavor_notes for back-compat through 1g.1.
// 1g.2 follow-up will add aggregateBaseFlavors(brews) reading from brews.flavors jsonb.
// ---------------------------------------------------------------------------

export function aggregateFlavorNotes(
  brews: Array<{ flavor_notes: string[] | null }>
): [string, number][] {
  const counts: Record<string, number> = {}
  for (const brew of brews) {
    for (const note of brew.flavor_notes || []) {
      counts[note] = (counts[note] || 0) + 1
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}

// ---------------------------------------------------------------------------
// Back-compat exports preserved verbatim — used by /add (purchased + SR), /edit,
// FlavorNotesByFamily, terroir/cultivar/process/roaster detail pages.
// ---------------------------------------------------------------------------

export const FLAVOR_REGISTRY = BASE_NAMES
export const FLAVOR_LOOKUP = BASE_FLAVOR_LOOKUP
export const isCanonicalFlavor = BASE_FLAVOR_LOOKUP.isCanonical
export const findClosestFlavor = BASE_FLAVOR_LOOKUP.findClosest
