# Varieties

**Enforcement bar:** Strict
**Canonical registry:** [lib/cultivar-registry.ts](../../lib/cultivar-registry.ts) (authoritative for validation)
**Last adopted:** 2026-04-22
**Adoption path:** Authored new (Chris, 2026-04-22 research pass drawing on World Coffee Research, Rob Hoo's *Cultivar: A Practical Guide for Coffee Roasters*, farm and roaster cultivar documentation, and Chris's 56-brew corpus for Observed sections)

Canonical cultivar reference for the latent-coffee app. 63 cultivars covering the species / family / lineage / cultivar hierarchy from the Variety sprint (part of the [Reference Taxonomies umbrella](../features/reference-taxonomies-attribution.md), sprint-1 Phylum A1 port). Four species scaffolded: Arabica (dominant), plus Eugenioides / Liberica / Robusta as placeholders for lots Chris hasn't yet cupped. Additions require a 3-step edit: this doc, `lib/cultivar-registry.ts`, and a DB migration if an existing row needs renaming.

External claims in this doc are cited at authoring time and rolled up in the `## Sources` block at the bottom of the page. Chris's own tested observations live in per-cultivar `#### Observed Across My Corpus` subsections in confirmed voice; external claims in tentative voice. No graduation — external claims stay cited forever.

---

## Canonical list

Matches `CULTIVARS` in [lib/cultivar-registry.ts](../../lib/cultivar-registry.ts) exactly. 63 entries.

**Arabica — Ethiopian Landrace Families**
- JARC selection lineage: 74110, 74112, 74148, 74158, 74165
- JARC blend lineage: 74158/74110/74112 blend, Ethiopian Landrace Blend (74110/74112)
- Gesha lineage: Gesha
- Ethiopian landrace-derived selection (non-JARC): Chiroso, Dega, Ethiopian landrace population, Java, Kurume, Ombligón, Papayo, Pink Bourbon, Rosado, SL9, Sudan Rume, Wolisho, Wush Wush, Yemenia
- SL Bourbon lineage: SL28, SL34

**Arabica — Typica Family**
- Typica lineage: Maragogype, Pache

**Arabica — Bourbon Family**
- Bourbon (classic): Aruzi, Bourbon, Mokka, Red Bourbon, Red Bourbon / Mibirizi blend
- Bourbon mutation lineage: Bourbon / Caturra blend, Bourbon Aji, Caturra, Laurina, Pacas, Purple Caturra, Villa Sarchi

**Arabica — Typica × Bourbon Crosses**
- Maragogype × Caturra lineage: Maracaturra
- Maragogype × Gesha lineage: Maragesha
- Mundo Novo × Caturra lineage: Catuaí
- Pacas × Maragogype lineage: Pacamara
- Typica × Bourbon cross lineage: Catucaí, Mejorado, Mundo Novo, Sidra

**Arabica — Modern Hybrids**
- Caturra × Timor Hybrid lineage: Castillo
- Multi-parent hybrid lineage: Batian, Icatu, Mandela, Mokkita, Ruiru 11
- Timor Hybrid-derived lineage: Ateng, Catimor (group), Garnica, Marsellesa, Sarchimor (group), Sigarar Utang, Tabi

**Non-Arabica (scaffolded for future lots)**
- Eugenioides: Eugenioides
- Liberica: Liberica, Excelsa
- Robusta: Robusta

---

## Reference content

### 74110

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC selection lineage

#### Genetics
- **Genetic Background:** JARC selection from Ethiopian landrace populations, selected for cup quality and CBD (coffee berry disease) resistance.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** >1800m.
- **Limiting Factors:** Yield variability, delayed thermal peak at roast.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Citrus, florals.
- **Acidity Style:** High, bright.
- **Body Style:** Light.
- **Aromatics:** Floral lift.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** Moderate EY; high-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low; prefers light.
- **Roast Behavior:** Delayed thermal peak; prefers short development.
- **Resting Behavior:** Needs rest.
- **Common Pitfalls:** Hollow if underdeveloped.

---

### 74112

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC selection lineage

#### Genetics
- **Genetic Background:** JARC selection; similar parentage to 74110 with slight structural variation.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** >1800m.
- **Limiting Factors:** Variable lot quality.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Lemon, peach.
- **Acidity Style:** High.
- **Body Style:** Light.
- **Aromatics:** Floral.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** Clean percolation; cooling improves clarity.

#### Reference Content — Roasting
- **Roast Tolerance:** Low.
- **Roast Behavior:** Light roast preference.
- **Resting Behavior:** Needs rest.
- **Common Pitfalls:** Thin if pushed.

---

### 74148

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC selection lineage

#### Genetics
- **Genetic Background:** JARC selection from Ethiopian landrace populations.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** 1800-2200 masl.
- **Limiting Factors:** Variability.
- **Market Context:** Specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed; natural.
- **Typical Flavor Notes:** Citrus, florals, light fruit.
- **Acidity Style:** High.
- **Body Style:** Light.
- **Aromatics:** Floral.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** Clean percolation.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate.
- **Roast Behavior:** Prefers light roast; easily mutes.
- **Resting Behavior:** Needs rest.
- **Common Pitfalls:** Thin if underdeveloped.

**Notes:** Less commonly surfaced as a named separated selection than 74110/74112.

---

### 74158

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC selection lineage

#### Genetics
- **Genetic Background:** Selected from Ethiopia's Metu Bishari selections; released 1979; Metu (Illuababora) origin. CBD resistance + high yield potential among the defining traits.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Southwestern Ethiopia.
- **Altitude Sensitivity:** 2,000-2,400+ masl.
- **Limiting Factors:** Variable seed purity at farm level; site sensitivity.
- **Market Context:** Specialty premium; competition-adjacent.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural / controlled natural, washed, experimental naturals.
- **Typical Flavor Notes:** Bright citrus and tropical fruit, purple fruit / grape / berry, florals, candy-like sweetness.
- **Acidity Style:** Bright, citric to winey.
- **Body Style:** Silky to medium.
- **Aromatics:** White florals + high fruit intensity.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity pour-over and bright, fruit-forward filter; can also make expressive modern espresso when dialed for sweetness.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium-light.
- **Roast Behavior:** Rewards shorter, clean development (preserves florals + fruit); extended development can mute top notes.
- **Resting Behavior:** Often improves with a bit of rest; high-aromatic lots can be volatile very early.
- **Common Pitfalls:** Underdevelopment → thin body, sharp acidity, muted sweetness. Over-processing / heavy fermentation → swamps florals with funk.

#### Observed Across My Corpus
4 brews as of 2026-04-22; [Sprint 1b corpus distillation to be authored alongside the synthesis review.]

---

### 74165

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC selection lineage

#### Genetics
- **Genetic Background:** JARC selection from Ethiopian landrace populations, 1970s breeding program.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia (Sidama, Guji).
- **Altitude Sensitivity:** 1800-2200 masl.
- **Limiting Factors:** Lot variability.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed; natural.
- **Typical Flavor Notes:** Citrus, florals, stone fruit, tea-like.
- **Acidity Style:** High citric.
- **Body Style:** Light-silky.
- **Aromatics:** Floral-citric.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** High-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate.
- **Roast Behavior:** Prefers short development; easily mutes.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Underdevelopment sharpness; variability.

**Notes:** Same functional class as 74110 / 74112.

---

### 74158/74110/74112 blend

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC blend lineage

#### Genetics
- **Genetic Background:** Field or mill blend of the three JARC selections; common in Sidama and Guji where plantings are mixed.
- **Market names normalized here:** "Ethiopian Landrace Blend (74158/74110/74112)" (alternate descriptive form).

#### Agronomy
- **Typical Origins:** Sidama, Guji.
- **Altitude Sensitivity:** Best >1800m.
- **Limiting Factors:** Uneven ripening across plant stock.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey.
- **Typical Flavor Notes:** Lemon, peach, chamomile.
- **Acidity Style:** High citrus.
- **Body Style:** Light-silky.
- **Aromatics:** Floral-citrus.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** Gentle percolation.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate.
- **Roast Behavior:** Performs best ultra-light.
- **Resting Behavior:** Under-rested tastes grassy; cooling unlocks expression.
- **Common Pitfalls:** Lot variability.

---

### Ethiopian Landrace Blend (74110/74112)

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** JARC blend lineage

#### Genetics
- **Genetic Background:** Field or mill blend of 74110 and 74112 JARC selections; canonical for lots that genuinely mix both (the Picolot Emerald / Heart Tagel Alemayehu archive pattern).
- **Market names normalized here:** `74110/74112` (legacy combined canonical, pre-Variety-sprint).

#### Agronomy
- **Typical Origins:** Ethiopia (Sidama, Guji, Yirgacheffe).
- **Altitude Sensitivity:** >1800m.
- **Limiting Factors:** Uneven ripening; mixed plant stock.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Citrus, florals, stone fruit (blend of 74110 citrus-floral + 74112 lemon-peach profiles).
- **Acidity Style:** High citric.
- **Body Style:** Light.
- **Aromatics:** Floral lift.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** High-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low.
- **Roast Behavior:** Prefers short development; mixed stock means some variability in thermal response.
- **Resting Behavior:** Needs rest.
- **Common Pitfalls:** Thin if pushed; lot variability.

---

### Gesha

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Gesha lineage

#### Genetics
- **Genetic Background:** Ethiopian forest origin (Bench Sheko / Gesha region); isolated lineage. "Gesha 1931" represents early-collection material used to propagate the cultivar globally. Regional selections (Panamanian, Colombian, Brazilian) are named adaptations of the same root lineage, not genetically distinct cultivars.
- **Market names normalized here:** Geisha, Panama Geisha, Panamanian Geisha, Ethiopian Gesha, Gesha (Brazilian Selection), Gesha (Colombian selection), Gesha (Panamanian selection), Gesha 1931, Gesha (green-tip selection), Gesha (peaberry selection), Gesha (Queen selection), Green tip Gesha, Gesha Queen, Gesha peaberry, Gesia, Guesha. Green-tip is a leaf-phenotype marker, peaberry is a seed-formation sorting attribute, and "Queen" is estate branding; none define separate genetics. All consolidate to `Gesha` per migration 016.

#### Agronomy
- **Typical Origins:** Panama (Boquete / Chiriquí), Ethiopia (Bench Sheko, Gesha region), Colombia highlands; smaller experimental plantings in Brazil, Costa Rica.
- **Altitude Sensitivity:** Extremely high; best >1700m. Performs best at 1,800-2,200+ masl.
- **Limiting Factors:** Low yield; fragile tall plant structure; disease sensitivity; requires careful farm management.
- **Market Context:** Ultra-premium; competition-driven; benchmark cultivar for high-end specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey, natural; washed is most transparent.
- **Typical Flavor Notes:** Jasmine, bergamot, peach, lime, citrus, stone fruit, honey sweetness; Colombian selections add slight body and grapefruit; Brazilian selections emphasize balance and cocoa.
- **Acidity Style:** High, floral-citric, high-definition.
- **Body Style:** Light, tea-like, delicate.
- **Aromatics:** Extremely high; volatile white florals, citrus oils.
- **Terroir Transparency:** Extremely high.
- **Extraction Sensitivity:** Very high; sensitive to grind, agitation, and temperature.
- **Brewing Tendencies:** High-clarity pour-over; low agitation; fast-flow brewers; delicate espresso possible with restraint. Peaks hot-warm.

#### Reference Content — Roasting
- **Roast Tolerance:** Low to moderate; best at light to light-medium.
- **Roast Behavior:** Prefers short, controlled development; easily mutes with excess heat; small roast changes shift expression significantly.
- **Resting Behavior:** Often volatile early; improves with rest (commonly 2-3+ weeks for peak clarity).
- **Common Pitfalls:** Over-extraction introduces bitterness; agitation collapses florals; overdevelopment flattens aromatics; underdevelopment can feel hollow.

#### Observed Across My Corpus
22 brews as of 2026-04-22; Gesha is the dominant cultivar in Chris's archive. [Sprint 1b corpus distillation to be authored alongside the lineage synthesis review — will capture peak rest windows, dripper preferences, the natural-vs-washed expression split, and the Colombian/Panamanian regional differences that have emerged across lots.]

**Notes:** Peaberry, green-tip, and "Queen" selections are phenotypic / sorting / branding markers within the Gesha population, not separate cultivars. Regional selections (Panamanian / Colombian / Brazilian / 1931) express variation around the same lineage root; consolidated to the single `Gesha` canonical per migration 016 to keep the taxonomy clean.

---

### Chiroso

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Originally misidentified as Caturra-type. Genetic work suggests Ethiopian landrace origin, likely introduced and adapted in Colombia. Now treated as a distinct named selection.
- **Market names normalized here:** Caturra Chiroso (incorrect legacy label).

#### Agronomy
- **Typical Origins:** Colombia (Antioquia primarily).
- **Altitude Sensitivity:** 1,600-2,200 masl.
- **Limiting Factors:** Limited planting; identity confusion historically.
- **Market Context:** Specialty premium / competition-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (primary), natural, honey.
- **Typical Flavor Notes:** Intense fruit (kiwi, tangerine, pear, apricot), high sweetness, light florals, herbal undertones.
- **Acidity Style:** High, citric-malic, vibrant.
- **Body Style:** Medium-light; slightly fuller than Gesha.
- **Aromatics:** Very high; fruit-forward with complexity.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High; can swing quickly.
- **Brewing Tendencies:** High-clarity pour-over; expressive filter; careful espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; best light.
- **Roast Behavior:** Prefers short development; easily mutes with excess heat.
- **Resting Behavior:** Often volatile early; improves with rest.
- **Common Pitfalls:** Overwhelming intensity; over-extraction dulls clarity; roast flattening.

**Notes:** Treat as a stable named selection within the Ethiopian-derived lineage; distinct from Pink Bourbon and Gesha despite occasional conflation in marketing.

---

### Dega

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Named Ethiopian landrace selection.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** 1800-2200 masl.
- **Limiting Factors:** Genetic diversity; seed-stock variability.
- **Market Context:** Specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Citrus, florals, stone fruit.
- **Acidity Style:** High.
- **Body Style:** Light.
- **Aromatics:** Very high.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** High-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate; light roast preferred.
- **Roast Behavior:** Easily mutes.
- **Resting Behavior:** Volatile early.
- **Common Pitfalls:** Misclassification risk.

**Notes:** Landrace subtype, part of the Ethiopian heirloom cluster often grouped with Kurume and Wolisho at the farm level.

---

### Ethiopian landrace population

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Indigenous Ethiopian coffee populations consisting of thousands of genetically diverse Arabica genotypes originating in Ethiopian forest systems. Typically not stabilized cultivars but mixed local selections maintained by farmers. Represents population genetics rather than a single selection.
- **Market names normalized here:** Heirloom, Ethiopian Heirloom, Local Landrace, Indigenous varieties.

#### Agronomy
- **Typical Origins:** Ethiopia (Sidama, Yirgacheffe, Guji, Bench Sheko, Limu, Kaffa, West Arsi, Bale Highlands).
- **Altitude Sensitivity:** 1,700-2,200 masl; very high.
- **Limiting Factors:** Genetic heterogeneity; variable yield; uneven ripening; lot-to-lot cup variability.
- **Market Context:** Specialty premium; foundation of high-end Ethiopian coffee; frequently used in competition coffees.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, honey, extended fermentation; traditional naturals are historically common.
- **Typical Flavor Notes:** Citrus (lemon, bergamot), floral (jasmine, orange blossom), stone fruit (peach, apricot), berry (blueberry, strawberry in naturals), honey sweetness.
- **Acidity Style:** Medium-high to high; typically citric with occasional malic brightness.
- **Body Style:** Light to medium-light; tea-like to silky.
- **Aromatics:** Very high; floral and fruit aromatics dominate.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** Medium-high; delicate lots can show bitterness if over-extracted.
- **Brewing Tendencies:** High-clarity pour-over; balanced omni brewing possible; lighter espresso possible with careful extraction.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; best at light to light-medium roasts.
- **Roast Behavior:** Prefers shorter development; extended development mutes florals.
- **Resting Behavior:** Often volatile early; improves with moderate rest.
- **Common Pitfalls:** Over-fermentation amplification in experimental processing; roast flattening; underdevelopment in very light roasts.

**Notes:** Population-level label — individual trees may belong to many distinct landrace genotypes within a single lot. This is the canonical catch-all when a lot is marketed as "heirloom" without a named selection.

---

### Java

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Ethiopian-origin landrace material introduced to Indonesia (Java) in the 19th century; selected and stabilized locally after Typica was largely wiped out by leaf rust. Not genetically Typica despite the name association.
- **Market names normalized here:** Typica Java (incorrect legacy label).

#### Agronomy
- **Typical Origins:** Indonesia (Java, Bali), Central America (Guatemala, Costa Rica), Africa (Rwanda).
- **Altitude Sensitivity:** 1,200-2,000 masl.
- **Limiting Factors:** Moderate yield; less widely planted; variability by selection.
- **Market Context:** Specialty premium; increasingly used in high-end Central American and Rwandan lots.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, honey.
- **Typical Flavor Notes:** Tea-like, citrus, lemongrass, light florals, raw sugar sweetness, spice accents.
- **Acidity Style:** Medium; often brisk citric with herbal lift.
- **Body Style:** Light to medium-light; crisp.
- **Aromatics:** High-toned, refined, tea-like.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high; sensitive to over-extraction.
- **Brewing Tendencies:** High-clarity pour-over; filter-focused; delicate espresso possible.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; best at light to light-medium.
- **Roast Behavior:** Prefers shorter development; easily loses clarity and aromatics with excess heat.
- **Resting Behavior:** Often improves with moderate rest; early cups can feel slightly sharp or thin.
- **Common Pitfalls:** Overdevelopment flattens tea-like structure; underdevelopment can feel grassy or hollow.

**Notes:** Despite the name "Java," genetically aligns with Ethiopian landrace material. Known for clean, transparent sweetness and tea-like structure rather than heavy body.

---

### Kurume

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Named Ethiopian landrace selection.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** 1800-2200 masl.
- **Limiting Factors:** Genetic diversity; stock variability.
- **Market Context:** Specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Citrus, florals, stone fruit.
- **Acidity Style:** High.
- **Body Style:** Light.
- **Aromatics:** Very high.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** High-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate; light roast preferred.
- **Roast Behavior:** Easily mutes.
- **Resting Behavior:** Volatile early.
- **Common Pitfalls:** Misclassification risk.

**Notes:** Landrace subtype often grouped with Dega and Wolisho at the farm level in Ethiopian specialty lots.

---

### Ombligón

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Colombian cultivar with unclear Ethiopian-derived genetics; limited genetic documentation. Often grouped with Papayo but the two should remain separate unless DNA-confirmed identical.
- **Market names normalized here:** Ombligon (no accent), Ombligone (misspelling).

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1600-2100 masl.
- **Limiting Factors:** Limited documentation; small planting base.
- **Market Context:** Experimental premium.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Tropical fruit, floral, sweet.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium-light.
- **Aromatics:** High.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; prefers light roast.
- **Roast Behavior:** Sensitive; easily muted.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Confusion with Papayo.

**Notes:** Treat as a provisional Ethiopian-derived selection. Do not merge with Papayo unless genetically confirmed.

---

### Papayo

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Recently "rediscovered" Colombian cultivar, often compared to Ombligón. Genetic testing is incomplete but current consensus suggests Ethiopian landrace origin rather than Bourbon / Typica parentage.
- **Market names normalized here:** none formalized.

#### Agronomy
- **Typical Origins:** Colombia (Huila primarily).
- **Altitude Sensitivity:** 1,600-2,100 masl.
- **Limiting Factors:** Limited genetic documentation; small planting base.
- **Market Context:** Experimental / specialty premium.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, experimental.
- **Typical Flavor Notes:** Highly variable; fruit-forward, tropical, sometimes candy-like depending on processing.
- **Acidity Style:** Medium-high; often fruit-driven.
- **Body Style:** Medium-light.
- **Aromatics:** High; often process-amplified.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter when clean; experimental profiles common.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium.
- **Roast Behavior:** Prefers careful development; easily masked by heavy processing.
- **Resting Behavior:** Often volatile early; improves with rest.
- **Common Pitfalls:** Process dominance masking cultivar; identity confusion with Ombligón.

**Notes:** Treat as provisional Ethiopian-derived selection; do not merge with Ombligón unless genetically confirmed.

---

### Pink Bourbon

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Originally believed to be a natural hybrid between Red Bourbon and Yellow Bourbon due to cherry color. Modern genetic testing indicates Pink Bourbon is not part of the Bourbon Family but instead derives from Ethiopian landrace material introduced into Colombia. It is a stabilized selection identified by pink / orange cherry coloration. Lineage within Ethiopian landrace remains unresolved at finer resolution.
- **Market names normalized here:** Bourbon Rosado.

#### Agronomy
- **Typical Origins:** Colombia — Huila (San Agustín, Pitalito); Cauca; increasing plantings in Nariño and Tolima.
- **Altitude Sensitivity:** 1,700-2,000m; high.
- **Limiting Factors:** Moderate yield; genetic instability in some seed stock; requires elevation for peak aromatic expression.
- **Market Context:** Specialty premium; often positioned as a "Gesha alternative" with stronger fruit character; popular in competition and high-end Colombian microlots.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (clarity-driven, benchmark style), honey, natural, controlled fermentations (anaerobic washed, co-ferments, thermal shock increasingly common).
- **Typical Flavor Notes:** Citrus (pink grapefruit, sweet lemon), red fruit (strawberry, raspberry), stone fruit (white peach), floral (rose, jasmine-adjacent), cane sugar sweetness.
- **Acidity Style:** Medium-high to high; citric-malic blend; juicy, often rounded rather than sharp.
- **Body Style:** Medium-light; silky, slightly more weight than Gesha; balanced rather than tea-thin.
- **Aromatics:** High; floral-fruit forward; less purely white-floral than Gesha, more fruit-integrated.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Medium to high; over-extraction introduces dryness quickly; requires moderate agitation control for clarity.
- **Brewing Tendencies:** High-clarity pour-over; balanced omni possible with careful extraction; espresso works if extraction restrained and development slightly extended.

#### Reference Content — Roasting
- **Roast Tolerance:** Low to medium; performs best at light to light-medium; extended development mutes florals and red fruit.
- **Roast Behavior:** Prefers shorter development; easily mutes under excess heat; can taste thin if underdeveloped.
- **Resting Behavior:** Volatile early; improves with moderate rest; peak window often narrower than Bourbon classic.
- **Common Pitfalls:** Underdevelopment risk; over-fermentation amplification in experimental lots; roast flattening when pushed darker.

**Notes:** Sits structurally between Gesha and 74110 in cup behavior — more fruit weight than Gesha but retains Ethiopian-derived clarity. Genetic identity is Ethiopian landrace-based despite historical Bourbon labeling. Distinct from Rosado (kept as a separate canonical).

---

### Rosado

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Refers to pink / orange-fruited selections found primarily in Colombia and nearby regions. Historically conflated with Pink Bourbon, but many Rosado lots are distinct selections with unclear or mixed pedigree. Genetic testing is limited and inconsistent across producers.
- **Market names normalized here:** none (Rosado stays canonical; `Bourbon Rosado` aliases to Pink Bourbon, not to Rosado).

#### Agronomy
- **Typical Origins:** Colombia (Huila, Nariño, Cauca); limited plantings elsewhere.
- **Altitude Sensitivity:** 1,600-2,000 masl (context dependent).
- **Limiting Factors:** Genetic inconsistency; unclear pedigree; variable plant stock across farms.
- **Market Context:** Specialty premium / experimental micro-lots.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey, natural, experimental fermentations.
- **Typical Flavor Notes:** Citrus (grapefruit, sweet lemon), red fruit, light florals, cane sugar sweetness.
- **Acidity Style:** Medium-high; citric-malic, often rounded.
- **Body Style:** Medium-light; silky.
- **Aromatics:** High; fruit-forward with some floral lift.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high; sensitive to over-extraction.
- **Brewing Tendencies:** High-clarity pour-over; balanced omni possible; careful espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; best at light to light-medium.
- **Roast Behavior:** Prefers shorter development; easily mutes with excess heat; can feel thin if underdeveloped.
- **Resting Behavior:** Often volatile early; improves with moderate rest.
- **Common Pitfalls:** Mislabeling (confusion with Pink Bourbon); process amplification masking cultivar; roast flattening.

**Notes:** Treat Rosado as a named selection with unclear pedigree. Do not automatically equate with Pink Bourbon. If a specific lot is verified as Pink Bourbon via producer documentation or DNA, reclassify it under that cultivar. Otherwise retain Rosado and flag uncertainty in genetics.

---

### SL9

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Poorly defined cultivar label. Likely related to SL09 or Ethiopian-derived material; may represent local selections (e.g. Peru "Gesha Inca") rather than a formal Scott Labs release. Genetic identity unresolved.
- **Market names normalized here:** SL09, Gesha Inca (Peruvian market name).

#### Agronomy
- **Typical Origins:** India (SLN context), Peru (Inkawasi), possibly other regions.
- **Altitude Sensitivity:** 1,400-2,000 masl (context dependent).
- **Limiting Factors:** Undefined genetics; inconsistent labeling across regions.
- **Market Context:** Experimental / emerging specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Clean fruit, citrus, light sweetness; varies widely depending on origin.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium-light.
- **Aromatics:** Moderate-high.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter when clean; variable behavior.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium.
- **Roast Behavior:** Prefers lighter roasting; identity shifts significantly with roast.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Naming confusion; mixing SL, SLN, and local selections; false expectations.

**Notes:** Treat as a provisional cultivar label. Do not assume SL28 / SL34 lineage. Normalize only when genetic identity is confirmed on a specific lot.

---

### Sudan Rume

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Historic Ethiopian-related landrace material originating from the Boma Plateau in South Sudan; represents indigenous Arabica populations rather than a stabilized modern cultivar or breeding program.
- **Market names normalized here:** Rume Sudan (word-order variant).

#### Agronomy
- **Typical Origins:** South Sudan; now also grown in limited specialty lots in Latin America.
- **Altitude Sensitivity:** 1,500-2,000+ masl; very high.
- **Limiting Factors:** Low yield; disease sensitivity; limited global planting base.
- **Market Context:** Specialty premium; rare / competition-adjacent.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, experimental lots.
- **Typical Flavor Notes:** Floral, tropical fruit, citrus, complex sweetness.
- **Acidity Style:** Bright, elegant.
- **Body Style:** Light to medium.
- **Aromatics:** High-toned floral and fruit aromatics.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity pour-over; filter-focused; competition-style presentation.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to light-medium.
- **Roast Behavior:** Easily muted if overdeveloped; benefits from preserving aromatic lift.
- **Resting Behavior:** Benefits from a careful rest rather than very early opening.
- **Common Pitfalls:** Low yield; disease vulnerability; roast flattening if pushed too far.

---

### Wolisho

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Named Ethiopian landrace selection.
- **Market names normalized here:** Walisho (misspelling).

#### Agronomy
- **Typical Origins:** Ethiopia.
- **Altitude Sensitivity:** 1800-2200 masl.
- **Limiting Factors:** Genetic diversity; stock variability.
- **Market Context:** Specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Citrus, florals, stone fruit.
- **Acidity Style:** High.
- **Body Style:** Light.
- **Aromatics:** Very high.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High.
- **Brewing Tendencies:** High-clarity pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-moderate; light roast preferred.
- **Roast Behavior:** Easily mutes.
- **Resting Behavior:** Volatile early.
- **Common Pitfalls:** Misclassification risk.

**Notes:** Landrace subtype often grouped with Dega and Kurume.

---

### Wush Wush

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Named after the Wushwush region (Keffa, Ethiopia). Originally part of Ethiopian landrace populations; later propagated in Colombia and Costa Rica as a more stabilized selection.
- **Market names normalized here:** Wushwush.

#### Agronomy
- **Typical Origins:** Ethiopia, Colombia, Costa Rica.
- **Altitude Sensitivity:** 1,600-2,200 masl.
- **Limiting Factors:** Limited genetic standardization; variability across regions.
- **Market Context:** Specialty premium / competition-adjacent.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, carbonic maceration, anaerobic, washed.
- **Typical Flavor Notes:** Berry jam, tropical fruit, red fruit, floral (purple / floral tones), sometimes wine-like.
- **Acidity Style:** Medium-high; fruit-driven, often rounded.
- **Body Style:** Medium; fuller than Gesha.
- **Aromatics:** High; fruit-heavy, less purely floral than Gesha.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter; expressive processed espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium.
- **Roast Behavior:** Prefers lighter roasting; excessive development dulls fruit and florals.
- **Resting Behavior:** Often volatile early; improves with rest, especially processed lots.
- **Common Pitfalls:** Process dominance masking cultivar; can become overly "funky."

**Notes:** Ethiopian origin but non-uniform outside Ethiopia; Colombia / Costa Rica plantings tend to be more consistent selections than in-Ethiopia field blends.

---

### Yemenia

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** Ethiopian landrace-derived selection (non-JARC)

#### Genetics
- **Genetic Background:** Indigenous Yemeni coffee population. Likely part of the broader Ethiopian-Yemeni Arabica gene pool (historic diffusion from Ethiopia) but not formally classified or stabilized.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Yemen.
- **Altitude Sensitivity:** 1,800-2,400 masl.
- **Limiting Factors:** Lack of genetic documentation; fragmented production; small-scale farming.
- **Market Context:** Ultra-specialty / origin-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural (dominant), anaerobic natural, local processing styles (e.g. "alchemy").
- **Typical Flavor Notes:** Red fruit, wine-like, tropical fruit (guava, watermelon, pineapple), florals (lavender, hibiscus).
- **Acidity Style:** Medium-high; winey or bright-fruit driven.
- **Body Style:** Medium; often textured.
- **Aromatics:** High; complex, layered.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** Filter-focused; expressive modern espresso possible.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; prefers light roasting.
- **Roast Behavior:** Can become heavy or muddy with excessive development.
- **Resting Behavior:** Benefits from rest; naturals stabilize over time.
- **Common Pitfalls:** Over-fermentation; inconsistency between lots; unclear expectations.

**Notes:** Treat as a population-level cultivar label similar to Ethiopian landrace population — not a single stabilized cultivar.

---

### SL28

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** SL Bourbon lineage

#### Genetics
- **Genetic Background:** Selected by Scott Agricultural Laboratories (Kenya, 1930s) from drought-resistant Tanganyika material. Despite "Bourbon" labeling, genetic work places it closer to Ethiopian-derived populations.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Kenya (primary), also Colombia, Costa Rica, Ecuador.
- **Altitude Sensitivity:** 1,400-2,000 masl; very high.
- **Limiting Factors:** Disease susceptibility; yield variability.
- **Market Context:** Specialty benchmark (Kenya profile).

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (classic); also natural / experimental.
- **Typical Flavor Notes:** Grapefruit, blackcurrant, hibiscus, citrus, tea.
- **Acidity Style:** High; sharp citric with winey structure.
- **Body Style:** Medium-light; structured.
- **Aromatics:** Very high; intense, vivid.
- **Terroir Transparency:** Very high.
- **Extraction Sensitivity:** High; extraction-sensitive.
- **Brewing Tendencies:** High-clarity filter; expressive espresso possible.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium.
- **Roast Behavior:** Prefers short development; easily mutes or becomes savory if overdeveloped.
- **Resting Behavior:** Improves with rest; early cups can be sharp.
- **Common Pitfalls:** Overdevelopment → tomato / savory; underdevelopment → sharp / empty.

**Notes:** One of the clearest "terroir-transparent" cultivars; highly expressive across origins.

---

### SL34

**Species:** Arabica  **Genetic Family:** Ethiopian Landrace Families  **Lineage:** SL Bourbon lineage

#### Genetics
- **Genetic Background:** Selected by Scott Labs from French Mission-type material; adapted for Kenyan conditions. Structurally similar to SL28 but with broader body and slightly less acidity.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Kenya, Colombia, Costa Rica, Bolivia, Taiwan.
- **Altitude Sensitivity:** 1,400-2,000 masl; high.
- **Limiting Factors:** Disease susceptibility; lower yields vs hybrids.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (classic); also natural / experimental.
- **Typical Flavor Notes:** Grapefruit, berry, brown sugar, tea, occasional savory notes.
- **Acidity Style:** Medium-high; rounder than SL28.
- **Body Style:** Medium; fuller than SL28.
- **Aromatics:** High; slightly softer than SL28.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** Balanced filter; strong washed profile; adaptable espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Handles development slightly better than SL28; still sensitive.
- **Resting Behavior:** Stable; benefits from moderate rest.
- **Common Pitfalls:** Overdevelopment → muted fruit; savory drift.

**Notes:** Often paired with SL28; provides body and balance in Kenyan profiles.

---

### Maragogype

**Species:** Arabica  **Genetic Family:** Typica Family  **Lineage:** Typica lineage

#### Genetics
- **Genetic Background:** Natural mutation of Typica discovered in Brazil (Maragogipe). Known for extremely large bean size ("elephant beans").
- **Market names normalized here:** Maragogipe.

#### Agronomy
- **Typical Origins:** Brazil (origin); also Central and South America.
- **Altitude Sensitivity:** 1,200-1,800 masl.
- **Limiting Factors:** Large bean size; low density; inconsistent quality.
- **Market Context:** Specialty niche.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed.
- **Typical Flavor Notes:** Red fruit, jammy berry, cocoa, sometimes savory.
- **Acidity Style:** Medium; softer.
- **Body Style:** Medium; can feel broad / heavy.
- **Aromatics:** Moderate; not highly floral.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Slightly coarser grind; longer contact works well.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Requires careful heat; large beans need deeper heat penetration; can taste hollow if underdeveloped.
- **Resting Behavior:** Benefits from rest.
- **Common Pitfalls:** Underdevelopment (common); uneven extraction due to size; roast flattening.

**Notes:** Bean size drives extraction challenges more than genetics; often confused with Pacamara, which is a separate cross.

---

### Pache

**Species:** Arabica  **Genetic Family:** Typica Family  **Lineage:** Typica lineage

#### Genetics
- **Genetic Background:** Natural mutation of Typica identified in Guatemala. Selected for higher yield and compact growth compared to traditional Typica.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Guatemala, El Salvador, Honduras.
- **Altitude Sensitivity:** 1,200-1,600 masl.
- **Limiting Factors:** Yield-focused breeding; lower cup ceiling.
- **Market Context:** Commercial to lower-end specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Lemon, nuts, mild florals, light sweetness.
- **Acidity Style:** Medium; soft citric.
- **Body Style:** Medium.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low-moderate.
- **Brewing Tendencies:** Balanced omni; forgiving.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles development well; tends toward simplicity with heavier roasting.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Expecting high complexity; often simple; can flatten easily.

**Notes:** Structurally similar to Typica but with less clarity and complexity.

---

### Aruzi

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon (classic)

#### Genetics
- **Genetic Background:** Bourbon mutation; Colombian selection.
- **Market names normalized here:** Bourbon Aruzi (prior canonical form, consolidated to `Aruzi` during the 2026-04-22 Variety sprint).

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1500-1800m; medium-high.
- **Limiting Factors:** Rust susceptibility.
- **Market Context:** Estate-focused specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Red apple, caramel, rose.
- **Acidity Style:** Medium malic.
- **Body Style:** Medium.
- **Aromatics:** Soft florals.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Wide tolerance.

#### Reference Content — Roasting
- **Roast Tolerance:** Moderate-high.
- **Roast Behavior:** Handles light-medium.
- **Resting Behavior:** Stable; improves cooled.
- **Common Pitfalls:** Over-fermentation risk.

---

### Bourbon

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon (classic)

#### Genetics
- **Genetic Background:** Classic Arabica lineage historically disseminated from Yemen / East Africa routes into the Indian Ocean and the Americas.
- **Market names normalized here:** Yellow Bourbon, Orange Bourbon (color-phenotype variants — Chris's rule: simplified to base `Bourbon` unless a specific stabilized selection is documented). Red Bourbon is kept as a separate canonical.

#### Agronomy
- **Typical Origins:** Latin America, Africa, Asia.
- **Altitude Sensitivity:** 1,000-2,000 masl; high.
- **Limiting Factors:** Rust susceptibility; yield lower than modern hybrids.
- **Market Context:** Specialty staple; quality-driven, also volume in some regions.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey, natural.
- **Typical Flavor Notes:** Sweet, round stonefruit / caramel, balanced citrus, often "classic" cup.
- **Acidity Style:** Medium to bright; usually rounded.
- **Body Style:** Medium, silky.
- **Aromatics:** Brown sugar, fruit, light florals depending on terroir.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Medium.
- **Brewing Tendencies:** Versatile omni; solid espresso base for sweetness.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium.
- **Roast Behavior:** Handles extended development better than Gesha; too dark becomes generic cocoa.
- **Resting Behavior:** Moderate rest beneficial.
- **Common Pitfalls:** Flatness if roasted too dark; confusion between "Bourbon" and "Red / Yellow / Orange Bourbon" mutations.

**Notes:** Reliable "sweetness chassis" cultivar; when it tastes unusually perfumed or candy-like, that's usually terroir or fermentation-driven.

---

### Mokka

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon (classic)

#### Genetics
- **Genetic Background:** Ancient dwarf Bourbon-type cultivar historically associated with Yemen (Mocha region). Considered one of the oldest cultivated Arabica types with long-standing genetic lineage within the Bourbon family.
- **Market names normalized here:** Moka, Mokha, Mocha. (Mocha can also reference an origin / brewing style — canonical assignment here resolves the cultivar-name case only.)

#### Agronomy
- **Typical Origins:** Yemen (historical), Ethiopia; limited modern plantings in Latin America and specialty estates.
- **Altitude Sensitivity:** 1,400-2,000 masl; high.
- **Limiting Factors:** Extremely low yield; tiny bean size; agronomically difficult; limited availability.
- **Market Context:** Ultra-specialty / niche / curiosity-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural (traditional), washed, experimental micro-lots.
- **Typical Flavor Notes:** Intense fruit (berry, dried fruit), chocolate, spice, wine-like sweetness.
- **Acidity Style:** Medium-high; often winey or fruit-driven.
- **Body Style:** Light to medium; concentrated despite small beans.
- **Aromatics:** High; dense, aromatic, often perfumed.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** High; small beans extract quickly and unevenly if not controlled.
- **Brewing Tendencies:** High-clarity pour-over; expressive as modern espresso with careful control.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; best at light to light-medium.
- **Roast Behavior:** Prefers short, careful development; easily overdeveloped; small changes strongly impact cup.
- **Resting Behavior:** Often benefits from rest; early cups can feel sharp or unintegrated.
- **Common Pitfalls:** Uneven extraction due to very small beans; over-extraction leads to bitterness; roast flattening if pushed.

**Notes:** True historical cultivar. Very small bean size requires grind adjustment (often slightly coarser than expected). Distinct from Mokkita despite name similarity — Mokka is Bourbon-family heritage, Mokkita is a modern Panamanian multi-parent hybrid.

---

### Red Bourbon

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon (classic)

#### Genetics
- **Genetic Background:** A red-fruited phenotype within the Bourbon group, commonly treated as a Bourbon "color type" rather than a distinct new genetic root. Bourbon itself traces through Réunion (Île Bourbon) dissemination and is a foundational Arabica line.
- **Market names normalized here:** none (kept canonical; other color variants Yellow / Orange collapse to base `Bourbon`).

#### Agronomy
- **Typical Origins:** Latin America and Africa.
- **Altitude Sensitivity:** 1,100-2,000 masl; high.
- **Limiting Factors:** Disease susceptibility (Bourbon family is generally susceptible to rust); yield lower than modern hybrids.
- **Market Context:** Specialty staple / quality premium; also appears in volume contexts depending on origin.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (classic), honey, natural.
- **Typical Flavor Notes:** High sweetness (caramel, brown sugar), red-fruit / stonefruit, balanced citrus; can show vanilla / chocolate depending on terroir and roast.
- **Acidity Style:** Medium to medium-high; typically citric and rounded.
- **Body Style:** Medium; smooth / creamy when well grown.
- **Aromatics:** Sweet fruit, light florals, confectionary notes.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Medium.
- **Brewing Tendencies:** Omni (filter + espresso); great "sweet base" espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium.
- **Roast Behavior:** Handles moderate development; too much development flattens fruit into generic caramel.
- **Resting Behavior:** Stable; improves with moderate rest.
- **Common Pitfalls:** Confusing "Red Bourbon" (color type) with a separate lineage; over-roasting leading to dull cups.

**Notes:** If a producer documents a specific stabilized selection called "Red Bourbon" (rare), treat it as a named selection; otherwise it reads as a Bourbon color phenotype.

---

### Red Bourbon / Mibirizi blend

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon (classic)

#### Genetics
- **Genetic Background:** Traditional Bourbon-derived cultivars grown in Burundi; Mibirizi is a locally distributed Bourbon selection alongside Red Bourbon. Field blends are common due to mixed plantings.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Burundi (Kayanza, Ngozi, Muyinga regions).
- **Altitude Sensitivity:** 1,600-2,000 masl; high.
- **Limiting Factors:** Mixed plant stock; variable yield.
- **Market Context:** Specialty staple.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (most common), natural.
- **Typical Flavor Notes:** Citrus, red fruit, tea, sugar sweetness.
- **Acidity Style:** Medium-high, citric.
- **Body Style:** Medium-light, tea-like.
- **Aromatics:** Floral, citrus, light fruit.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** High-clarity pour-over; clean percolation.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium.
- **Roast Behavior:** Handles moderate development; too much flattens acidity.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Expecting single-cultivar precision; lot variability.

**Notes:** Treat as a field blend; do not attempt to separate into component cultivars unless the lot is explicitly separated at the mill level.

---

### Bourbon / Caturra blend

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Blend of Bourbon (classic lineage) and Caturra (Bourbon mutation). Typical Central American farm composition where Bourbon-derived cultivars dominate and are processed together at mill level.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Guatemala — Huehuetenango (La Libertad); broader Central America.
- **Altitude Sensitivity:** 1,600-2,000 masl; medium-high.
- **Limiting Factors:** Mixed plant stock; not optimized for single-cultivar expression.
- **Market Context:** Specialty-commercial bridge; classic Guatemala profile.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed (wet process).
- **Typical Flavor Notes:** Citrus, cocoa, brown sugar, dried fruit, light spice.
- **Acidity Style:** Medium; rounded citric.
- **Body Style:** Medium; structured, slightly weighty.
- **Aromatics:** Moderate; sweetness-forward with mild florals.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Low-moderate; forgiving.
- **Brewing Tendencies:** Balanced omni; strong espresso performance; forgiving pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium; wide workable range.
- **Roast Behavior:** Handles moderate development well; increased development emphasizes cocoa and sugar browning.
- **Resting Behavior:** Stable; performs consistently across rest windows.
- **Common Pitfalls:** Expecting high-aromatic clarity; can flatten if pushed too dark; blend reduces distinct top-note expression.

**Notes:** Normalize as blend; do not include Typica or "modern hybrids" in the name since those are not explicitly documented parents.

---

### Bourbon Aji

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Bourbon-derived Colombian selection.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1600-2000 masl; high.
- **Limiting Factors:** Limited planting.
- **Market Context:** Specialty premium; emerging cultivar.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, experimental.
- **Typical Flavor Notes:** Tropical fruit, citrus, candy-like.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium-light.
- **Aromatics:** High.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium; prefers light roast.
- **Roast Behavior:** Easily muted if over-developed.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Over-fermentation risk.

---

### Caturra

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Dwarf Bourbon mutation.
- **Market names normalized here:** Red Caturra, Yellow Caturra (color phenotypes; Purple Caturra kept separately canonical).

#### Agronomy
- **Typical Origins:** Latin America.
- **Altitude Sensitivity:** 1400-1800m.
- **Limiting Factors:** Rust susceptibility.
- **Market Context:** Classic cultivar.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Orange, caramel.
- **Acidity Style:** Medium.
- **Body Style:** Medium.
- **Aromatics:** Moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Wide tolerance.

#### Reference Content — Roasting
- **Roast Tolerance:** Moderate.
- **Roast Behavior:** Even heat.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Over-ferments easily.

**Notes:** Balanced baseline; reliable reference when comparing rarer Bourbon-family selections.

---

### Laurina

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Low caffeine mutation of Bourbon.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Brazil, Colombia.
- **Altitude Sensitivity:** >1500m; medium-high.
- **Limiting Factors:** Moderate yield.
- **Market Context:** Boutique novelty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Plum, citrus.
- **Acidity Style:** Medium soft.
- **Body Style:** Light silky.
- **Aromatics:** Subtle.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Gentle percolation.

#### Reference Content — Roasting
- **Roast Tolerance:** Moderate.
- **Roast Behavior:** Light-medium tolerant.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Forcing body ruins clarity.

**Notes:** Intrinsically light body — trying to brew it for density fights the cultivar.

---

### Pacas

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Natural dwarf mutation of Bourbon discovered in El Salvador by the Pacas family. Genetically similar to Bourbon but with compact plant structure. Parent of Pacamara.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** El Salvador, Honduras.
- **Altitude Sensitivity:** 1,200-1,700 masl; medium-high.
- **Limiting Factors:** Moderate yield; variability by farm.
- **Market Context:** Specialty staple (regional).

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Red fruit, mild wine notes, caramel, light citrus.
- **Acidity Style:** Medium; often rounded with occasional winey edge.
- **Body Style:** Medium.
- **Aromatics:** Moderate; sweetness-forward.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Balanced omni; good filter and espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Handles moderate development; can show more character than Caturra when well grown.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Inconsistent quality; can be flat if grown at lower elevations.

**Notes:** Often behaves like a more expressive Caturra; good baseline cultivar.

---

### Purple Caturra

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** A Caturra-type Bourbon mutation expression characterized by purple / cherry coloration. Typically treated as a fruit-color phenotype rather than a fully standardized genetic cultivar.
- **Market names normalized here:** none (kept canonical; Red / Yellow Caturra aliases collapse to base `Caturra`).

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1,730-1,850m; medium.
- **Limiting Factors:** Genetic documentation / standardization; consistency across farms and harvests.
- **Market Context:** Experimental / specialty premium micro-lots.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, anaerobic washed, experimental fermentations.
- **Typical Flavor Notes:** Vibrant fruit (red / purple fruit), candy-like sweetness, sometimes floral.
- **Acidity Style:** Bright, fruit-driven.
- **Body Style:** Medium, juicy.
- **Aromatics:** Red fruit, florals depending on roast + process.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Medium.
- **Brewing Tendencies:** Filter-forward for clarity; espresso can be punchy but can over-emphasize ferment notes.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to light-medium.
- **Roast Behavior:** Too much development turns fruit into generic caramel; too light can emphasize ferment sharpness.
- **Resting Behavior:** Can be volatile early if heavily processed; often stabilizes after moderate rest.
- **Common Pitfalls:** Over-fermentation amplification; confusing "purple" phenotype with a fully documented genetic cultivar.

---

### Villa Sarchi

**Species:** Arabica  **Genetic Family:** Bourbon Family  **Lineage:** Bourbon mutation lineage

#### Genetics
- **Genetic Background:** Bourbon mutation from Costa Rica. Parent of the Sarchimor group.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Central America.
- **Altitude Sensitivity:** 1200-1800 masl; medium-high.
- **Limiting Factors:** Moderate yield.
- **Market Context:** Specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey.
- **Typical Flavor Notes:** Citrus, sweetness, light florals.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium.
- **Aromatics:** Moderate.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Omni.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Tolerates development.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Can flatten.

**Notes:** Parent cultivar in the Sarchimor breeding group.

---

### Maracaturra

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Maragogype × Caturra lineage

#### Genetics
- **Genetic Background:** Hybrid between Maragogype (Typica mutation, large-bean) and Caturra (Bourbon mutation). Combines large bean size and structure with more compact plant traits from Caturra.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Nicaragua (origin); also El Salvador, Guatemala, Brazil, Colombia.
- **Altitude Sensitivity:** 1,200-1,800 masl; medium-high.
- **Limiting Factors:** Large bean size variability; inconsistent cup quality across farms; moderate disease susceptibility.
- **Market Context:** Specialty premium (recognizable but variable); used in competitions occasionally.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, honey, experimental fermentations.
- **Typical Flavor Notes:** Citrus, stone fruit, tropical fruit, cocoa; can show both clarity and heavier sweetness depending on processing.
- **Acidity Style:** Medium to medium-high; often rounder than Gesha but more lifted than Catuaí.
- **Body Style:** Medium to medium-full; more weight than Ethiopian cultivars.
- **Aromatics:** Moderate-high; less purely floral, more fruit + sweetness driven.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Balanced omni; slightly coarser grind often helps due to large beans.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Handles development better than Gesha; too much heat flattens fruit into cocoa-heavy profile.
- **Resting Behavior:** Benefits from rest; stabilizes and sweetens after initial degassing.
- **Common Pitfalls:** Uneven extraction due to large bean size; can become heavy / muddy with aggressive processing or overdevelopment.

**Notes:** Often confused with Pacamara (different cross — Pacas × Maragogype). Larger beans require grind adjustments; tends to express more structure than Gesha but more clarity than standard Bourbon / Caturra.

---

### Maragesha

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Maragogype × Gesha lineage

#### Genetics
- **Genetic Background:** Cross between Maragogype (Typica mutation) and Gesha (Ethiopian landrace). Combines large-bean Typica structure with Gesha aromatic potential.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Colombia (limited plantings).
- **Altitude Sensitivity:** 1,600-2,100 masl; high.
- **Limiting Factors:** Limited planting; genetic stability unclear.
- **Market Context:** Rare / experimental specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed, experimental.
- **Typical Flavor Notes:** Fruit-forward, sometimes tropical, partial florals, sweetness.
- **Acidity Style:** Medium-high; variable.
- **Body Style:** Medium.
- **Aromatics:** Moderate-high; less pure than Gesha.
- **Terroir Transparency:** Medium-high.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity filter; experimental espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Low-medium.
- **Roast Behavior:** Prefers careful development; too much heat suppresses Gesha-like aromatics.
- **Resting Behavior:** Improves with rest.
- **Common Pitfalls:** Expecting Gesha-level florals; can feel heavier or less precise.

**Notes:** Often fails to fully express Gesha clarity, leaning more toward structured sweetness.

---

### Catuaí

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Mundo Novo × Caturra lineage

#### Genetics
- **Genetic Background:** Developed in Brazil (Instituto Agronômico de Campinas, mid-20th century). Cross between Mundo Novo (Typica × Bourbon natural hybrid) and Caturra (Bourbon mutation). Selected for compact plant structure, high yield, wind resistance, and productivity.
- **Market names normalized here:** Catuai (no diacritic), Yellow Catuaí, Red Catuaí.

#### Agronomy
- **Typical Origins:** Brazil (Minas Gerais, São Paulo, Bahia), Honduras (Santa Bárbara, Marcala), Guatemala, Costa Rica, Nicaragua.
- **Altitude Sensitivity:** 1,000-1,800 masl; moderate.
- **Limiting Factors:** Moderate disease susceptibility; cup ceiling lower than high-aromatic cultivars; can become generic if grown at low elevation.
- **Market Context:** Volume stable; widely planted workhorse cultivar valued for reliability, yield, and balanced cup profile.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed; natural (very common in Brazil); honey (common in Central America); anaerobic variants increasingly used.
- **Typical Flavor Notes:** Citrus (orange, mild lemon), brown sugar / caramel, milk chocolate, nutty (almond, hazelnut), light red fruit at higher elevations.
- **Acidity Style:** Low to medium; soft citric; rounded and approachable rather than sharp.
- **Body Style:** Medium; balanced, slightly creamy; more weight than Ethiopian cultivars, less than Pacamara.
- **Aromatics:** Low to moderate; sweet, nutty, cocoa-forward; aromatics support flavor rather than lead.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low to medium; forgiving across brew styles; can taste dull if severely under-extracted.
- **Brewing Tendencies:** Balanced omni; strong espresso performer; stable in batch brew and immersion.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium to high; performs well from light-medium through medium; very light roasts can taste grassy or hollow.
- **Roast Behavior:** Handles extended development; prefers moderate development to build sweetness; easily mutes if pushed too dark.
- **Resting Behavior:** Fast opener; stable profile with moderate rest; does not require extended aging.
- **Common Pitfalls:** Underdevelopment risk at very light roast; roast flattening when pushed too dark; expecting high florality or volatility.

**Notes:** Structurally dependable. Excels when positioned as a sweetness-and-balance cultivar rather than an aromatic one. At higher elevations, especially in Honduras and Guatemala, can show surprising clarity relative to its reputation.

---

### Pacamara

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Pacas × Maragogype lineage

#### Genetics
- **Genetic Background:** Hybrid large-seed cultivar from Pacas × Maragogype.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** El Salvador, Panama.
- **Altitude Sensitivity:** >1600m; medium.
- **Limiting Factors:** Bean size inconsistency.
- **Market Context:** Recognized but variable.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Orange, melon, papaya.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium-full.
- **Aromatics:** Herbal-floral.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** Slightly coarser grind.

#### Reference Content — Roasting
- **Roast Tolerance:** Moderate.
- **Roast Behavior:** Requires careful heat.
- **Resting Behavior:** Benefits from rest.
- **Common Pitfalls:** Uneven extraction risk; natural lots can muddle.

**Notes:** Sibling to Maracaturra but with different structural parentage (Pacas-derived, not Caturra-derived).

---

### Catucaí

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Typica × Bourbon cross lineage

#### Genetics
- **Genetic Background:** Cross between Catuaí (Mundo Novo × Caturra) and Icatu (which includes Robusta-derived disease resistance). Despite Icatu ancestry, classification is kept in Typica × Bourbon Crosses for taxonomy stability at the farm-facing level.
- **Market names normalized here:** Catucai (no diacritic).

#### Agronomy
- **Typical Origins:** Brazil, Central and South America.
- **Altitude Sensitivity:** 800-1,400 masl; low-medium.
- **Limiting Factors:** Yield-focused breeding; cup ceiling lower than high-aromatic cultivars.
- **Market Context:** Volume stable; commercial to mid-specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Nutty, chocolate, mild fruit, caramel sweetness.
- **Acidity Style:** Low-medium.
- **Body Style:** Medium to full.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low; forgiving.
- **Brewing Tendencies:** Strong espresso, batch brew, forgiving pour-over.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles extended development; benefits from sweetness-building roast.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Expecting high clarity; can taste flat if pushed light.

**Notes:** Hybrid optimized for yield and disease resistance; not clarity-driven.

---

### Mejorado

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Typica × Bourbon cross lineage

#### Genetics
- **Genetic Background:** Ecuadorian Typica selection.
- **Market names normalized here:** Typica Mejorado.

#### Agronomy
- **Typical Origins:** Ecuador, Peru.
- **Altitude Sensitivity:** 1600-1900m; high.
- **Limiting Factors:** Low yield.
- **Market Context:** Niche high-end.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, oxidative.
- **Typical Flavor Notes:** Orange, apple, tea.
- **Acidity Style:** Medium-high malic.
- **Body Style:** Medium soft.
- **Aromatics:** Subtle florals.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Longer contact helpful.

#### Reference Content — Roasting
- **Roast Tolerance:** Moderate.
- **Roast Behavior:** Accepts more development than Gesha.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Savory if over-bloomed; oxidative lots require restraint.

---

### Mundo Novo

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Typica × Bourbon cross lineage

#### Genetics
- **Genetic Background:** Natural hybrid between Typica and Bourbon identified in Brazil. Selected for vigor, yield, and adaptability at lower elevations. Parent of Catuaí.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Brazil (primary); also Mexico, Peru.
- **Altitude Sensitivity:** 800-1,400 masl; medium.
- **Limiting Factors:** Yield-focused breeding; lower aromatic ceiling.
- **Market Context:** Volume stable / commercial-specialty bridge.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed.
- **Typical Flavor Notes:** Cocoa, nutty, mild fruit, brown sugar.
- **Acidity Style:** Medium; soft citric.
- **Body Style:** Medium to full.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low; forgiving.
- **Brewing Tendencies:** Strong espresso, batch brew, forgiving filter.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles extended development; sweetness builds with development; can flatten if pushed too far.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Expecting high clarity; can taste generic; overdevelopment → flat cocoa profile.

**Notes:** Structural backbone cultivar; rarely used for high-aromatic microlots.

---

### Sidra

**Species:** Arabica  **Genetic Family:** Typica × Bourbon Crosses  **Lineage:** Typica × Bourbon cross lineage

#### Genetics
- **Genetic Background:** Ecuador-associated cultivar with uncertain breeding history; commonly believed to involve Typica and Bourbon ancestry though genetic documentation remains limited.
- **Market names normalized here:** Bourbon Sidra, Sidra Bourbon, Sydra.

#### Agronomy
- **Typical Origins:** Ecuador (primary), Colombia.
- **Altitude Sensitivity:** 1500-2100m; high.
- **Limiting Factors:** Traceability + varietal purity risk due to unclear seed system.
- **Market Context:** Specialty premium / competition-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, controlled fermentations.
- **Typical Flavor Notes:** Floral + fruit-forward with high sweetness and complexity.
- **Acidity Style:** Vibrant, sparkling.
- **Body Style:** Velvety / silky, medium.
- **Aromatics:** Floral, perfumed, high-toned fruit aromatics.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** High-clarity pour-over; strong fruit-forward espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium-light.
- **Roast Behavior:** Prefers shorter development to preserve aromatics; heavier development can mute florals.
- **Resting Behavior:** Often improves with rest; early cups may be volatile in aromatic lots.
- **Common Pitfalls:** Seed / identity inconsistency; heavy fermentation can overshadow varietal character.

**Notes:** "Bourbon Sidra" labels reflect suspected pedigree rather than a formally-recognized distinct cultivar.

---

### Castillo

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Caturra × Timor Hybrid lineage

#### Genetics
- **Genetic Background:** Rust-resistant Colombian hybrid.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1400-1900m; medium.
- **Limiting Factors:** Hybrid genetics.
- **Market Context:** Widely planted; built for yield + resistance.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Citrus, caramel.
- **Acidity Style:** Medium.
- **Body Style:** Medium.
- **Aromatics:** Moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low-medium.
- **Brewing Tendencies:** Forgiving.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Even heat.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Can taste generic.

---

### Batian

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Multi-parent hybrid lineage

#### Genetics
- **Genetic Background:** Kenyan hybrid (SL + Timor Hybrid derivatives) bred for disease resistance.
- **Market names normalized here:** Batián (diacritic variant).

#### Agronomy
- **Typical Origins:** Kenya.
- **Altitude Sensitivity:** 1400-2000 masl; medium-high.
- **Limiting Factors:** Hybrid variability.
- **Market Context:** Specialty / production.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Citrus, blackcurrant, sweetness.
- **Acidity Style:** Medium-high.
- **Body Style:** Medium.
- **Aromatics:** Moderate-high.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Filter, espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** More forgiving than SL28.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Lower intensity vs SL28.

**Notes:** Positioned as an SL replacement cultivar in Kenya.

---

### Icatu

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Multi-parent hybrid lineage

#### Genetics
- **Genetic Background:** Brazilian hybrid with direct Arabica × Robusta introgression (Bourbon Vermelho × tetraploid C. canephora × Mundo Novo). Not Timor Hybrid-derived despite the shared Robusta-resistance outcome — classified under Multi-parent hybrid lineage as of the 2026-04-22 sprint to keep the genetic lineage honest.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Brazil.
- **Altitude Sensitivity:** 800-1400 masl; medium.
- **Limiting Factors:** Hybrid genetics.
- **Market Context:** Volume stable.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed.
- **Typical Flavor Notes:** Cocoa, nutty, mild fruit.
- **Acidity Style:** Low-medium.
- **Body Style:** Medium-full.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low.
- **Brewing Tendencies:** Espresso, blends.

#### Reference Content — Roasting
- **Roast Tolerance:** High.
- **Roast Behavior:** Handles extended development.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Low clarity ceiling.

**Notes:** Parent of Catucaí (which shares the Robusta introgression via this lineage).

---

### Mandela

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Multi-parent hybrid lineage

#### Genetics
- **Genetic Background:** Cross developed by CGLE involving Caturra (Bourbon mutation), Timor Hybrid (Robusta introgression), and Sudan Rume (Ethiopian landrace). True multi-parent breeding line.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Colombia (CGLE farms).
- **Altitude Sensitivity:** 1,600-2,000 masl; medium.
- **Limiting Factors:** Proprietary genetics; process dependence.
- **Market Context:** Experimental / competition-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, anaerobic natural, XO / extreme fermentations.
- **Typical Flavor Notes:** Liquor-like, boozy fruit, heavy fermentation, tropical + alcohol-forward.
- **Acidity Style:** Medium; often masked by fermentation.
- **Body Style:** Medium to heavy.
- **Aromatics:** Very high but process-driven.
- **Terroir Transparency:** Low (process-dominant).
- **Extraction Sensitivity:** High; extraction swings quickly depending on processing.
- **Brewing Tendencies:** Expressive filter, modern espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Handles moderate development; too much heat muddies fermentation complexity.
- **Resting Behavior:** Volatile early; benefits from rest.
- **Common Pitfalls:** Process dominance masking cultivar; over-extraction → harsh alcohol.

**Notes:** One of the few cases where genetics are known but cup is dominated by processing layer.

---

### Mokkita

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Multi-parent hybrid lineage

#### Genetics
- **Genetic Background:** Modern proprietary or semi-proprietary cultivar (often associated with specific Panamanian producers such as Garrido). Likely derived from multi-parent breeding involving Bourbon / Typica backgrounds and possibly disease-resistant material, but exact pedigree is not publicly disclosed.
- **Market names normalized here:** none. Distinct from Mokka despite name similarity.

#### Agronomy
- **Typical Origins:** Panama (notably Chiriquí / Boquete regions); limited distribution.
- **Altitude Sensitivity:** 1,400-2,100 masl; medium-high.
- **Limiting Factors:** Unclear pedigree; limited transparency; availability restricted to specific farms; consistency depends on selection.
- **Market Context:** Experimental / specialty premium / producer-driven.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed, experimental fermentations.
- **Typical Flavor Notes:** Red fruit, tropical fruit, confectionary sweetness, wine-like notes depending on processing.
- **Acidity Style:** Medium; often rounded, fruit-driven.
- **Body Style:** Medium; more structure than Ethiopian landrace types.
- **Aromatics:** Medium-high; fruit-forward rather than purely floral.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate; more forgiving than delicate heirloom cultivars.
- **Brewing Tendencies:** Balanced omni; performs well in both filter and espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium; tolerates wider roast range than Gesha.
- **Roast Behavior:** Handles moderate development; excessive development can mute fruit and increase generic sweetness.
- **Resting Behavior:** Typically stable; benefits from moderate rest, especially for processed lots.
- **Common Pitfalls:** Process-driven variability; over-extraction can dull fruit clarity; identity confusion due to unclear genetics.

**Notes:** Treat as a named cultivar with uncertain genetics. Do not infer Bourbon or Mokka lineage from name — Mokkita is genetically distinct from Mokka.

---

### Ruiru 11

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Multi-parent hybrid lineage

#### Genetics
- **Genetic Background:** Complex hybrid (SL28 / SL34, Catimor, Sudan Rume components) developed in Kenya.
- **Market names normalized here:** Ruiru, Ruiru-11, Ruiru11 (spacing variants).

#### Agronomy
- **Typical Origins:** Kenya.
- **Altitude Sensitivity:** 1200-1800 masl; medium.
- **Limiting Factors:** Hybrid complexity.
- **Market Context:** Volume stable.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed.
- **Typical Flavor Notes:** Citrus, mild fruit, cocoa.
- **Acidity Style:** Medium.
- **Body Style:** Medium.
- **Aromatics:** Moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low-moderate.
- **Brewing Tendencies:** Omni, espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles development; can flatten.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Generic cup risk.

**Notes:** Often blended; less terroir-transparent than SL28 / SL34.

---

### Ateng

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Indonesian Catimor-type dwarf hybrid.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Indonesia.
- **Altitude Sensitivity:** 1000-1600 masl; low-medium.
- **Limiting Factors:** Hybrid ceiling.
- **Market Context:** Commercial.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Wet-hulled, natural.
- **Typical Flavor Notes:** Earthy, spice, cocoa.
- **Acidity Style:** Low-medium.
- **Body Style:** Medium-heavy.
- **Aromatics:** Low.
- **Terroir Transparency:** Low.
- **Extraction Sensitivity:** Low.
- **Brewing Tendencies:** Espresso, blends.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles development.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Poor clarity at light roast.

**Notes:** Overlaps with Catimor in Indonesia usage; keep separate but note the relationship.

---

### Catimor (group)

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Not a single distinct cultivar but a group of many distinct varieties with similar parentage, generally deriving from Caturra crossed with Timor Hybrid material. World Coffee Research explicitly notes it is a group rather than one uniform variety.
- **Market names normalized here:** Catimor, Catimor Group.

#### Agronomy
- **Typical Origins:** Widely distributed across Latin America, Asia, and other rust-affected producing regions as selected local derivatives.
- **Altitude Sensitivity:** 700-1,600 masl; low to medium.
- **Limiting Factors:** Cup quality ceiling varies widely by selection; lineage often oversimplified.
- **Market Context:** Volume-stable, disease-management-driven; commercial-to-specialty depending on selection.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, commercial naturals, some improved specialty processing in better selections.
- **Typical Flavor Notes:** Broad range, but often nutty, cocoa, spice, mild fruit; higher-end selections can perform better.
- **Acidity Style:** Usually moderate to lower-brightness.
- **Body Style:** Medium to heavier.
- **Aromatics:** Less overtly floral; selection-dependent.
- **Terroir Transparency:** Low-medium.
- **Extraction Sensitivity:** Generally forgiving.
- **Brewing Tendencies:** Balanced omni; approachable espresso; practical production brewing.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium to medium-dark.
- **Roast Behavior:** Tends to tolerate more development than delicate heirloom types, but can flatten quickly.
- **Resting Behavior:** Usually stable and not especially volatile.
- **Common Pitfalls:** Mislabeling Catimor as a single cultivar; expecting high-aromatic clarity; roast flattening with excessive development.

**Notes:** Catimor is a cultivar group, not a single canonical cultivar. When a specific released selection (e.g. Castillo, Marsellesa) is known, classify using that cultivar instead. Otherwise use `Catimor (group)` and flag uncertainty.

---

### Garnica

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Bourbon × Timor ancestry; rust-resistant.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Mexico, Colombia.
- **Altitude Sensitivity:** Mid elevations; medium.
- **Limiting Factors:** Disease resistance breeding.
- **Market Context:** Commercial-specialty bridge.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Nutty, grain-sweet, soft fruit.
- **Acidity Style:** Low-medium citric.
- **Body Style:** Medium rounded.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low-medium.
- **Brewing Tendencies:** Forgiving.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Accepts more development.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Can taste dull if pushed; less aromatic intensity than heirloom types.

**Notes:** Moved to Modern Hybrids per migration 017 (previously classified under Typica × Bourbon Crosses — Bourbon × Timor ancestry is the modern-hybrid fit).

---

### Marsellesa

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Cross between Timor Hybrid 832/2 and Villa Sarchi (CIFC 971/10); selected by ECOM / CIRAD in Nicaragua for leaf rust resistance; released ~2009. A rust-resistant Sarchimor-type line.
- **Market names normalized here:** Marshell (misspelling).

#### Agronomy
- **Typical Origins:** Central America; broader Latin American production.
- **Altitude Sensitivity:** 1,400-1,900 masl; medium.
- **Limiting Factors:** Cup quality depends heavily on selection + farm management; perception bias in some markets.
- **Market Context:** Volume-stable + specialty-capable (workhorse with upside).

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, honey, natural depending on site and quality goals.
- **Typical Flavor Notes:** Sweet citrus, cocoa, stonefruit, red fruit, balanced chocolate / caramel depending on terroir and process.
- **Acidity Style:** Medium, often citric / structured.
- **Body Style:** Medium, rounded.
- **Aromatics:** Fruit + sweet spice; less overtly floral than Gesha.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Medium; fairly forgiving.
- **Brewing Tendencies:** Omni (filter / espresso) depending on roast intent.

#### Reference Content — Roasting
- **Roast Tolerance:** Light to medium.
- **Roast Behavior:** Handles extended development better than Gesha; avoid baking which can make hybrids taste woody.
- **Resting Behavior:** Typically stable after moderate rest.
- **Common Pitfalls:** Treating "rust-resistant" as "low quality" (can be excellent); roast flattening if baked; generic character if site quality is weak or roast is too developed.

**Notes:** Can deliver genuinely specialty-grade cups when grown / processed well, but won't typically mimic Gesha-like perfume — expect more structured sweetness + citrus / cocoa.

---

### Sarchimor (group)

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Villa Sarchi × Timor Hybrid group.
- **Market names normalized here:** Sarchimor, Villa Sarchi Hybrid.

#### Agronomy
- **Typical Origins:** Latin America; Indonesia.
- **Altitude Sensitivity:** 1200-1800 masl; medium.
- **Limiting Factors:** Variable cup ceiling.
- **Market Context:** Volume stable.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural.
- **Typical Flavor Notes:** Cocoa, citrus, mild fruit.
- **Acidity Style:** Medium.
- **Body Style:** Medium.
- **Aromatics:** Moderate.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Low-moderate.
- **Brewing Tendencies:** Omni.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles development; can flatten.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Generic cup risk.

**Notes:** Group label, not a single cultivar. When a specific released selection is known (e.g. Marsellesa), use that cultivar instead.

---

### Sigarar Utang

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Indonesian cultivar developed from Caturra × Timor Hybrid for high yield, disease resistance, and rapid productivity ("quick debt repayment").
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Indonesia (Sumatra primarily).
- **Altitude Sensitivity:** 900-1,500 masl; low-medium.
- **Limiting Factors:** Quality ceiling limited by genetics and processing norms.
- **Market Context:** Volume stable / commercial.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Wet-hulled, natural, anaerobic natural.
- **Typical Flavor Notes:** Earthy, spice, wood, muted fruit; naturals can show red fruit.
- **Acidity Style:** Low-medium.
- **Body Style:** Medium to heavy.
- **Aromatics:** Low-moderate.
- **Terroir Transparency:** Low.
- **Extraction Sensitivity:** Low; forgiving.
- **Brewing Tendencies:** Espresso, blends, commercial brewing; less suited for high-clarity filter.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles extended development; often benefits from more development than light-roast styles.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Expecting high clarity; underdevelopment produces harsh, woody notes.

**Notes:** Classic Sarchimor-type structure; quality highly dependent on processing improvements.

---

### Tabi

**Species:** Arabica  **Genetic Family:** Modern Hybrids  **Lineage:** Timor Hybrid-derived lineage

#### Genetics
- **Genetic Background:** Developed in Colombia (Cenicafé) as a cross of Typica, Bourbon, and Timor Hybrid. Designed for rust resistance while maintaining cup quality.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Colombia.
- **Altitude Sensitivity:** 1,200-2,000 masl; medium-high.
- **Limiting Factors:** Hybrid genetics; identity overshadowed by trendier cultivars.
- **Market Context:** Specialty / experimental (under-recognized).

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, natural, experimental fermentations.
- **Typical Flavor Notes:** Red fruit, citrus, sweetness, spice depending on processing.
- **Acidity Style:** Medium-high; often tart, fruit-driven.
- **Body Style:** Medium.
- **Aromatics:** Moderate-high.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Balanced omni; expressive in processed filter and modern espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Handles development better than Gesha; can support experimental processing.
- **Resting Behavior:** Stable; benefits from rest in processed lots.
- **Common Pitfalls:** Over-processing can dominate; can lack clarity vs Gesha.

**Notes:** One of the few hybrids capable of strong specialty expression when processed well.

---

### Eugenioides

**Species:** Eugenioides  **Genetic Family:** Eugenioides  **Lineage:** Eugenioides lineage

#### Genetics
- **Genetic Background:** One of the parent species of Arabica (Arabica = Eugenioides × Canephora hybrid); extremely low caffeine. Not a cultivar within Arabica — a separate species entirely.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** East Africa (Rwanda, Uganda).
- **Altitude Sensitivity:** 1,400-2,000 masl; high.
- **Limiting Factors:** Very low yield; fragile; rare.
- **Market Context:** Experimental / competition novelty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Washed, experimental.
- **Typical Flavor Notes:** Sweet, cereal, honey, mild fruit.
- **Acidity Style:** Very low.
- **Body Style:** Very light, tea-like.
- **Aromatics:** Subtle, delicate.
- **Terroir Transparency:** High.
- **Extraction Sensitivity:** High; easy to under-extract or over-dilute.
- **Brewing Tendencies:** Gentle pour-over; low extraction intensity.

#### Reference Content — Roasting
- **Roast Tolerance:** Low; best very light.
- **Roast Behavior:** Extremely sensitive; easy to mute.
- **Resting Behavior:** Often benefits from rest.
- **Common Pitfalls:** Weak structure; easy to lose flavor.

**Notes:** Important genetically; behaves unlike typical coffee in brewing. Non-Arabica species scaffolded in the registry for when a lot lands — Chris hasn't cupped one yet.

---

### Excelsa

**Species:** Liberica  **Genetic Family:** Liberica  **Lineage:** Excelsa lineage

#### Genetics
- **Genetic Background:** Subspecies of Coffea liberica (C. liberica var. dewevrei); previously classified separately; distinct cup profile vs main Liberica.
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** Southeast Asia (Vietnam, Philippines).
- **Altitude Sensitivity:** 0-1,000 masl; medium-high.
- **Limiting Factors:** Limited cultivation and knowledge base.
- **Market Context:** Emerging specialty niche.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, experimental.
- **Typical Flavor Notes:** Tart fruit, tamarind, dark fruit, tea-like finish.
- **Acidity Style:** Medium; tart, structured.
- **Body Style:** Medium; lighter than Liberica.
- **Aromatics:** High; unique fruit-acid contrast.
- **Terroir Transparency:** Medium.
- **Extraction Sensitivity:** Moderate-high.
- **Brewing Tendencies:** Filter, experimental espresso.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium.
- **Roast Behavior:** Holds structure across roast levels.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Sharp acidity if underdeveloped.

**Notes:** Treat as a Liberica subspecies; keep separate for flavor-behavior clarity.

---

### Liberica

**Species:** Liberica  **Genetic Family:** Liberica  **Lineage:** Liberica lineage

#### Genetics
- **Genetic Background:** Coffea liberica species; genetically distant from Arabica; includes the Excelsa subgroup (C. liberica var. dewevrei).
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** West Africa, Philippines, Malaysia.
- **Altitude Sensitivity:** 0-800 masl; medium.
- **Limiting Factors:** Large tree size; low adoption; processing variability.
- **Market Context:** Niche / experimental specialty.

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, experimental processing.
- **Typical Flavor Notes:** Jackfruit, tropical fruit, smoky, woody.
- **Acidity Style:** Low-medium.
- **Body Style:** Heavy, syrupy.
- **Aromatics:** Unusual, fermented, fruit-heavy.
- **Terroir Transparency:** Low-medium.
- **Extraction Sensitivity:** Moderate.
- **Brewing Tendencies:** Experimental specialty; niche filter.

#### Reference Content — Roasting
- **Roast Tolerance:** Medium-high.
- **Roast Behavior:** Handles development; unique aromatics persist.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Polarizing flavors; can be overly funky.

**Notes:** Distinct species; not interchangeable with Arabica profiles. Scaffolded for when Chris's pending Liberica lot lands.

---

### Robusta

**Species:** Robusta  **Genetic Family:** Robusta  **Lineage:** Robusta lineage

#### Genetics
- **Genetic Background:** Coffea canephora species; genetically distinct from Arabica; includes many regional clones (e.g. Conilon, Nganda).
- **Market names normalized here:** none.

#### Agronomy
- **Typical Origins:** West & Central Africa; Vietnam; Brazil; India.
- **Altitude Sensitivity:** 0-800 masl (can grow higher); low-medium.
- **Limiting Factors:** Lower cup ceiling vs Arabica; quality depends heavily on processing.
- **Market Context:** Commodity to emerging specialty (fine Robusta).

#### Reference Content — Brewing & Cup Profile
- **Common Processing Methods:** Natural, washed, commercial processing.
- **Typical Flavor Notes:** Earthy, nutty, cocoa, bitter chocolate.
- **Acidity Style:** Low.
- **Body Style:** Heavy, dense.
- **Aromatics:** Low; harsh, woody tones.
- **Terroir Transparency:** Low-medium.
- **Extraction Sensitivity:** Low; forgiving but coarse.
- **Brewing Tendencies:** Espresso blends, instant, commercial brewing.

#### Reference Content — Roasting
- **Roast Tolerance:** High; tolerates dark roast.
- **Roast Behavior:** Handles aggressive development; often improved by darker roasting.
- **Resting Behavior:** Stable.
- **Common Pitfalls:** Harsh bitterness, astringency.

**Notes:** Treat as species-level entry unless a specific clone is known.

---

## Sources

Per-claim citations at authoring time; rollup below.

- **World Coffee Research — Arabica Varieties** (varieties.worldcoffeeresearch.org). Primary source for Catimor group classification, Marsellesa pedigree, Sigarar Utang breeding history, and the Typica Family / Bourbon Family / Modern Hybrids scaffolding.
- **Rob Hoo — *Cultivar: A Practical Guide for Coffee Roasters*** (book, 2024). Primary source for roast behavior, resting, and aromatic-volatility claims across Gesha, Pink Bourbon, 74158, and most Ethiopian landrace content. Hoo's framing of "roast tolerance" as a non-linear variable informs the Roasting sections throughout.
- **Instituto Agronômico de Campinas (IAC)** — Brazilian cultivar breeding history (Catuaí, Mundo Novo, Icatu). Referenced via WCR and Brazilian coffee research archives.
- **Cenicafé (Colombia)** — Castillo and Tabi breeding documentation. Referenced via WCR and Cenicafé publications.
- **ECOM / CIRAD Nicaragua** — Marsellesa development and release timing (~2009).
- **Hacienda La Esmeralda** — Gesha 1931 provenance and Panamanian selection history, via public farm documentation.
- **Gesha Village Coffee Estate** — Gesha 1931 Ethiopian selection lineage and preservation context.
- **CGLE (Colombia)** — Mandela cultivar composition (Caturra × Timor Hybrid × Sudan Rume).
- **Jaime Barba / Garrido** (Panamanian producers) — Mokkita provenance and process-dependence framing.
- **Chris's ChatGPT context doc** (`context for chatgpt on coffee info, terroir, cultivar, best brew`, pre-2026-04-22). Ruleset framework (species / family / lineage / cultivar hierarchy, genetics-vs-behavior separation rule, blends-are-cultivars rule, Ethiopian-landrace-population catch-all rule).
- **Chris's 56-brew corpus** (latent-coffee DB, 2026-04-22 snapshot). Source for the sparse `Observed Across My Corpus` subsections; Sprint 1b will deepen these for cultivars with ≥3 brews (Gesha 22, 74158 4, Sidra 3).

---

## Changelog

- **2026-04-22:** Initial adoption. 63 canonical cultivars ported from Chris's 72-row CSV research, reconciled with DB snapshot (26 rows), 10 collapses applied (Gesha 7→1 sub-selections; Aruzi = Bourbon Aruzi merged; Ethiopian landrace population dedup; Marsellesa lineage disambiguated; Mokkita dedup). Non-Arabica species scaffolded (Eugenioides, Liberica / Excelsa, Robusta). Mokka classified as Bourbon (classic) — resolves SYNC V1 step (d) pre-req. Icatu reclassified from Timor Hybrid-derived to Multi-parent hybrid lineage (direct Arabica × Robusta introgression, not Timor). Garnica reclassification to Modern Hybrids / Timor Hybrid-derived confirmed (migration 017 retained). Laurina moved from Bourbon (classic) to Bourbon mutation lineage. New lineages adopted: Typica, SL Bourbon, Maragogype × Gesha, Eugenioides, Liberica, Excelsa, Robusta. Alias map extended to 48 structural mappings.
