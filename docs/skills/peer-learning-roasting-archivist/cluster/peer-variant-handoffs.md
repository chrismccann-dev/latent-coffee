# Peer-Variant Handoffs

Durable home for filed **peer-variant handoffs** — the 5-field calibration assessment produced brewing-side via `docs/prompts/peer-variant-completion.md` when an external roaster's version of one of Chris's own green lots is brewed. One record per green lot that (a) has a peer-roasted variant brewed + (b) has an existing `green_beans` row (the `peer_reference_brew_id` FK is set). Not-yet-started peer lots stay operator-carried until their green row exists (see SKILL.md § Peer-variant handoff consumption); Panama Janson is the canonical courier-carried case and is intentionally NOT filed here.

Consumption reasoning (weight by info-value, consult per lifecycle stage) lives in [SKILL.md § Peer-variant handoff consumption](../SKILL.md). Seeded Cluster A, 2026-06-01.

---

## Fazenda Um Wush Wush Natural (BRA-FAZENDAUM-WUSHWUSH-NAT-2026)

- **Pairing + provenance:** peer roaster Untold Coffee Lab; brew `25b4465b-0aa0-4f9d-bdac-bd013999e616`; green lot `038ef36d-0b9f-4630-be61-eec176694910`. Same farm/producer/variety/process: Fazenda Um (Stefano Um), Sul de Minas / Mantiqueira Highlands, Carmo de Minas, Brazil; Wush Wush; raised-bed Natural. `peer_reference_brew_id` SET.
- **Roast-level read (the dial):** Untold roasts this **Medium** — Agtron WB 65.4, "medium-light color," well below Chris's light/ultra-light norm (75-90+), ~25 Agtron points darker. Cup confirms a developed register (dark black-tea/dark-chocolate body; mandarin only emerges late on cooling).
- **Information-value rating: Low (upper edge, near Low/Medium).** The roast is the loudest thing in the cup; Balanced Intensity amplified developed-roast solubles into an oversteeped wall, and the bean's stated notes only emerged through a structural Hybrid (Intensity-Clarity Split) workaround.
- **Cup read, bean vs roast:**
  - *Bean-attributable:* prune (survives all four brews — low-elevation natural Wush Wush register); mandarin (fragile, present only late-cooling — the variety's aromatic lift, the FIRST thing the roast suppressed; its mere existence confirms it's in the green); a faint lemongrass/herbal whisper matching the aromatic-landrace family.
  - *Roast-attributable:* dark black-tea body (dominant hot); dark-chocolate base; burnt-dark-chocolate finish edge (the medium-roast ceiling); the "oversteeped wall" failure mode on Balanced Intensity (a roast×brew-strategy collision, not a bean trait).
  - *Entangled (flag, don't transfer):* cacao (partly low-elevation natural register, partly roast development); "deep, hard-to-reach sweetness" (partly bean density at 1000-1260m, partly roast pushing sweetness deeper); dark-fruit lean overall.
- **Roast-design takeaway for MY roast (hypothesis, LOW):** the green carries enough aromatic reserve (prune / mandarin) to come through even when badly over-roasted, so a light/ultra-light roast should have ample fruit to work with → treat it as a fruit-forward natural and roast for clarity, not development; the mandarin/floral lift is the protected target and the first thing to disappear under over-development (early-warning canary in V-set cupping). Confirms the standing "bias lighter than Untold" hypothesis. Nothing about drop temp / dev time / RoR / Maillard / end-condition transfers — derive those fresh at start-lot.
- **Discount list (must NOT drive roast design):** bitterness, ashiness, smokiness (pure roast contamination); dark/black-tea body + the heavy "molasses" depth (roast-developed); the drying/oversteep tail; any instinct to chase the dark cup's body or "richness" — that's the roast talking.

---

## CGLE Sudan Rume Natural (CGLE-SRUME-NATURAL-2026)

- **Pairing + provenance:** peer roaster Special Guests Coffee (London; Paul Ross); brew `ddbcc147-ab2d-458a-979b-81995363c83b`; green lot `1cf02eb8-accb-4e74-8ce5-52892b4ecfd7`. Café Granja La Esperanza / Finca Las Margaritas, Valle del Cauca; Sudan Rume; traditional Natural (48hr silo ferment, 28-day solar dry). **Same-lot caveat:** confirmed at producer / farm / variety / process level; the peer is Edition 0326-42 and the exact crop-lot match was operator-ratified as same lot (the thread could only verify to producer/process). `peer_reference_brew_id` SET.
- **Roast-level read (the dial):** Special Guests roasted this **Light (medium-of-light)** — Agtron WB 71.7, no oil; ~4-6 points darker than Chris's light/ultra-light anchor band, darker than SPG's typical 78-86. Mildly off window, biased medium-of-light.
- **Information-value rating: Medium.** Same-lot substrate transfers cleanly; the roast-development register (light brown-sugar weight, "round" character) is partly theirs, not the bean's.
- **Cup read, bean vs roast:**
  - *Bean-attributable (high confidence):* lemongrass (varietal/process signature), stem ginger / cardamom, blueberry, light brown-tea body (variety-intrinsic, Sudan Rume = SL-28 parent, transparency-driven), cooling integration / aromatic durability.
  - *Roast-attributable (discount):* any "filled-in" body beyond light brown-tea structure; reduced cooling-window sensitivity (roast softening sharp edges ultra-light would expose).
  - *Entangled (flag, don't transfer):* "round" blueberry-leaning sweetness on attack (the roundness is partly light Maillard weight — expect brighter/more-nectar fruit at a lighter roast); "light brown sugar" register (variety vs caramelization — lean roast-attributable until confirmed lighter); cooling integration "ease."
- **Roast-design takeaway for MY roast (hypothesis, MEDIUM):** roast lighter than 71.7 (target ~78-82 Agtron WB — far enough into light to show transparency, not so ultra-light it goes vegetal/closed); protect the aromatic-spicy fraction (lemongrass + ginger + cardamom — they extract readily / go pungent under heat, and Maillard-weighting blunts them); don't chase body via roast (light brown-tea is the variety; roasting darker compresses aromatics before adding weight); watch cooling behavior carefully on the lighter roast (lemongrass may sharpen on cooling). **Baseline-floor frame** (no prior hypothesis — first peer brew on this green): at 71.7 the green is already this expressive; at 78-82 it should be more so.
- **Discount list (must NOT drive roast design):** "round"/compote sweetness; light brown-sugar weight (a roast-development artifact — don't roast darker to "find" caramelized sweetness); easy cooling integration / softened edges; any body beyond light tea-like structure.
