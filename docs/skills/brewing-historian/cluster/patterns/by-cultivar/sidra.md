# Sidra — per-cultivar brewing patterns

*Coffee Research · Latent · Brewing Historian cluster · by-cultivar*

**Corpus:** N=5 brews (Finca Soledad TyOxidator, Sidra Cold Fermented Washed DRD, Sidra Wave Hybrid, others).

**Sydra/Sidra-family default:** Clarity-First, moderate extraction, long bloom, uninterrupted pour. Savory if bloom is too long or agitation too high. Variety signal overrides experimental process flag when flavor targets are bright and citric. (Sibling variety: [Mejorado](docs/skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md).)

**Per-strategy entries referencing Sidra:**

- [Clarity-First](docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md) — Finca Soledad TyOxidator, Sidra Cold Fermented Washed DRD.
- [Extraction Push](docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md) — Pepe Jijón Sidra Wave Hybrid (the strategy's first-confirmed brew; reference recipe + failure-mode diagnostic + drying-tail-as-unintegrated-rose finding).

**Notable cross-strategy finding:** Sidra hard ceilings to its variety-intrinsic light brown-tea body. Pushing finer (below EG-1 5.8 at 15g dose) breaches the tannin ceiling without meaningful body upside. The 5.8 / 95°C / 4-pour Melodrip on Orea v4 + Sibarist FLAT FAST is the validated Extraction Push parameter cluster; standard Clarity-First on Sidra lives at 6.5-6.7 with similar vehicle discipline.

**Cooling behavior:** Sidra / cold-fermented washed lots (Finca Soledad) improve progressively on cooling - white grape and pear clarity increase below ~55°C. Evaluate down the cooling arc rather than locking a verdict warm.

Patterns specific to Sidra processing sub-types (TyOxidator vs Cold Fermented Washed vs Wave Hybrid) will accrue here as the corpus grows.

---

**First Sidra Natural in the corpus - 2026-06-06 - Terraform Coffee Roasters Loja Ecuador Clara Luz Sidra Natural (Servio Lenin González Jiménez, Finca Clara Luz; Loja / Quilanga; WB Agtron 62.4 Light-Medium; 2025/09 harvest).** brew_id 37affc20-67ce-438d-a255-ad801afe1644. Resolved to **Hybrid (Intensity-Clarity Split)** on the April Switch + April Paper Filter, 15g / 250g / EG-1 6.4 / 94°C kettle on base / closed bloom 45s + closed Pour 1 + open Pour 2. NOT the cultivar default of Clarity-First.

N now 6 brews; first Natural in the Sidra corpus (the prior 5 are all washed or controlled-fermentation washed variants: Finca Soledad TyOxidator, Sidra Cold Fermented Washed DRD, Sidra Wave Hybrid). Three things worth carrying forward:

1. **Cupping-muted is a Sidra strategy-override signal. The cultivar default (Clarity-First) assumes typical Sidra aromatic projection. When a Sidra lot reads quiet on a cupping (independent of how it brews), the variety default is wrong-direction.** This lot read muted on both v1 (UFO + Sibarist Fast Cone / 6.6 / 91°C / 1:17 - the canonical Sidra Clarity-First execution from the corpus) AND on a third-party cupping. The cupping signal overrode the variety default; resolution was structural front-loading (closed-immersion Hybrid), not deeper extraction. This is genuinely new for the Sidra corpus - prior brews all had typical Sidra aromatic projection and the Clarity-First default held. See [cross-coffee-insights.md Pattern 7](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) for the axis-agnostic version of this rule.

2. **Sidra Natural at Light-Medium development (Agtron 62.4) does NOT necessarily mean a lower temperature ceiling than the corpus baseline.** The instinct on v1 was to drop to 91°C to "protect against roast" given this lot was the third-darkest Sidra in inventory (most Sidras in the inventory live at 76-90 whole-bean Agtron). 94°C across v2-v4 surfaced zero roast bleed across the full cooling arc, confirming the darker-than-typical-for-variety roast was not the limiter. Operational rule: do not assume a low-temperature ceiling on Sidra based on Agtron alone; test 94°C and let the cup say.

3. **Sidra Natural cooling behavior is NOT the same as Sidra Cold-Fermented Washed cooling behavior.** The corpus baseline for Finca Soledad cold-fermented washed lots is progressive improvement on cooling (white grape / pear clarity increase below ~55°C). This Natural lot held FLAT across the cooling arc - same apricot-tart-pie / lemon-rind / black-tea-body register hot through cool, with only slight tart sharpness softening as it cooled. Integration was won UP FRONT by the closed-immersion structure, not papered over by cooling chemistry. Distinct cooling shapes for Sidra processed in different ways - the cold-fermented washed lots benefit from a cooling-arc evaluation, this Natural lot did not need one.

Flag: this is a one-data-point caveat to the Sidra cultivar default. The default (Clarity-First) holds when Sidra projects normally; the override (Hybrid Intensity-Clarity Split) is reserved for when cupping behavior signals an aromatic-ceiling problem at the source. Second non-Terraform confirmation of a cupping-muted Sidra would graduate this from caveat to subtype rule.

---

**Washed Sidra confirming the Clarity-First cultivar default - 2026-07 - Hydrangea Coffee (Guadalupe Hill Auction Lot, Washed Sidra; CGLE Las Margaritas, Valle del Cauca, Colombia; Rigoberto & Luis Eduardo Herrera; roasted 2026-05-16).** brew_id f466bfe1-35d9-4fde-801e-5d0578d0d483. Office SWORKS Bottomless / xBloom Premium, 15g / 250g (1:16.7) / EG-1 6.4 / 95°C / valve Half-Open (Dial 6) throughout (no closed-immersion phase). N now 7 brews.

The cultivar default (Clarity-First) held - no cupping-muted override (contrast the 2026-06-06 Terraform Natural). Three carry-forwards:

1. **Under-extraction on a washed Sidra reads as a generic nutty / brown-tea floor, worst hot.** Cleared with temperature (93->95°C) + grind (6.6->6.4) while keeping the SWORKS valve open - extraction pushed via temp+grind, not valve restriction, per operator preference for open flow. Confirms the corpus note that standard Sidra Clarity-First lives at 6.5-6.7; finer than ~5.8 was never needed and would breach the tea-like body ceiling into tannin.
2. **The residual flat brown-tea body after extraction was dialed was WATER, not roast or extraction** - Palo Alto office tap over-filled the body; a post-brew in-cup APAX correction (1 drop Tonik #1 + 1 drop Jamm) lifted it. See [cross-coffee-insights.md Pattern 6](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md).
3. **Cooling behavior matched the washed-Sidra baseline** - the cup opened on cooling (lemon/lime + honeyed-tea sweetness + coriander-seed spice leading cool), consistent with the cold-fermented-washed progressive-improvement shape rather than the flat-hold Natural shape. Peak cool. The coriander-seed note matched the roaster's bag descriptor - the express-not-fight signal.
