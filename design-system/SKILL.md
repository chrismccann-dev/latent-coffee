---
name: latent-coffee-design
description: Use this skill to generate well-branded interfaces and assets for Latent Coffee Research (Chris McCann's personal coffee research journal), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `colors_and_type.css` from your HTML to get the full token set, then build with the documented components and patterns. The web UI kit in `ui_kits/web/` is the best source of component implementations — copy its JSX components when building app-style prototypes.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. The real codebase lives at `latent-coffee/` (Next.js 14 + Tailwind + Supabase); `colors_and_type.css` mirrors its token set.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key brand reminders:
- First-person research-notebook voice; never marketing copy.
- Mono uppercase (JetBrains Mono) for chrome; Inter sans for prose.
- Sage green (#2C3E2D / #4A7C59) on warm paper (#FAFAFA) + near-black ink.
- Book-cover cards for individual coffees; color encodes process/flavor semantics.
- Zero icon library — Unicode + four category emoji (🌍 🧬 ☕ 🌱) only.
- No gradients, no shadows (except one hover lift), no large hero type.
