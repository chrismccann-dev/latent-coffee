# Kickoff — Priority-stack recount follow-up (bundled session)

> Paste-ready brief for a fresh Claude Code session. Three items from the 2026-06-02
> design-system priority-stack recount, run as one session. Two need a preview
> sign-off; one is a verify-and-fix. **This is an execution session** (not grilling) —
> the autonomy rule applies: branch, build, PR, merge as one flow once each item is
> verified. BUT the two visual items (1 + 2) require a Chris preview screenshot
> before merge — don't ship a visual change unseen.

## Background

The 2026-06-02 session reconciled the claude.ai/design v2 system against
`docs/design-system.md` and formalized the **priority stack** model (primary /
secondary / tertiary content ranking per detail page). See
[docs/design-system.md § Detail-page grammar](docs/design-system.md) for the model and
the per-surface ranking table — read it first; items 1 and 2 are direct consequences
of it. Doc PR: #354 (main `5eef651`).

## Goal

Ship three code changes the recount surfaced: recolor brew covers by extraction
strategy, reorder the roaster detail page to its true priority stack, and fix the
one-shot lifecycle mis-bucket.

---

## Item 1 — Recolor `/brews` book-cover by extraction strategy (visual; preview sign-off)

**Problem.** The brew-cover color drifted from intent. It was originally flavor-keyed
(sage Gesha/washed, burgundy anaerobic/wine, gold honey, brown natural, teal floral,
slate fallback) back when extraction strategy was a *single* axis. There are now **6
strategies**, each already carrying its own color in `lib/extraction-strategy.ts`, and
the cover color no longer signifies anything to Chris.

**Direction.** Cover color = extraction strategy. Pull the strategy hues from
`lib/extraction-strategy.ts` (the single source of truth) so the card cover, the
strategy pill, and any other strategy signal all read the same hue. Chris's mapping
intuition: suppression cooler/bluer, clarity tea-like, balanced mid, full bolder,
hybrid purple.

**Files.**
- `lib/brew-colors.ts` — the cover-color helper (currently process×flavor keyed). This
  is the change site.
- `lib/extraction-strategy.ts` — source of the 6 strategy hues (read, don't duplicate).
- `components/BrewCard.tsx` — `/brews` index cover consumer.
- **`components/CoffeesList.tsx`** — book-cover swatch consumer on **every aggregation
  detail page** (roaster / cultivar / terroir / processes). Recoloring `brew-colors.ts`
  changes those swatches too — trace it and confirm it still reads well there.

**Open question for Chris (ask up front).** Extraction-push is the ambiguous one — it's
"full expression but held for clarity / lower agitation (Melodrip etc.)". Decide its
hue relative to full-expression (a darker/cooler full? its own hue?).

**Verification.** Preview `/brews` at 1024 + 390; screenshot. Confirm the 6 strategies
read as distinct **hues, not lightness steps** (hue-not-lightness rule). Spot-check one
aggregation page's `CoffeesList` rows. **Chris visual sign-off before merge.**

---

## Item 2 — Reorder `/roasters/[id]` to its priority stack (visual; preview sign-off)

**Problem.** The current page leads with the Brewing Template and buries the Coffees
list mid-page. The recount established that **roaster is the navigational spine into
brews** — Chris recalls coffees by roaster (and bag style), not by coffee name, so he
lands on the roaster page to reach a specific brew. The Coffees list is the *primary
job* of the page, not a reference list.

**Direction (priority stack for `/roasters/[id]`).**
- **Primary** — Coffees list (promote to top, right after hero/identity).
- **Secondary** — Roaster info (brewing template · philosophy · resting info).
- **Tertiary** — Synthesis (demote to collapsible / `details.ssp-coll`) · Additional ·
  Confidence footer.

**Files.**
- `app/(app)/roasters/[slug]/page.tsx` — reorder the sections.
- `components/CoffeesList.tsx`, `components/SynthesisCard.tsx` (collapse synthesis).
- `docs/architecture/page-ia.md § Roasters` — update the documented section order to
  match (Actor 5/6 audit hop).

**Verification.** Preview `/roasters/[slug]` (use Picolot — the page Chris referenced)
at 1024 + 390. Confirm Coffees leads and synthesis is collapsed. **Chris visual sign-off
before merge.**

---

## Item 3 — One-shot lifecycle mis-bucket bug (verify-and-fix; no visual call)

**Problem.** A one-shot lot (`green_beans.is_one_shot = true`) shows under "waiting for
next roast" on the `/green` index — but a one-shot has **no next roast**. After cupping
it's on the optimized-pourover-recipe step. Surfaced on the **Mountain Harvest** lot.

**Likely cause.** `computeLifecycleState` (in `lib/lifecycle-state.ts`) is missing an
`is_one_shot` branch for the post-cupping case, so it falls through to
waiting-for-next-roast.

**Files.**
- `lib/lifecycle-state.ts` — the derivation (`computeLifecycleState(bean)`).
- `app/(app)/green/page.tsx` — index bucketing consumer.
- `docs/architecture/page-ia.md § Green` — the 5-state derivation rules (update if the
  rule changes).

**Open question for Chris (may need a quick answer).** Where *should* a post-cupping
one-shot lot live on the `/green` index? There's no dedicated "optimized-pourover" bucket
(Chris noted he didn't want to over-design a sub-step). Candidates: route it to the
resolved/unresolved (one-shot closeout) section, or give one-shots their own line. Pick
the smallest correct answer — likely "treat a cupped one-shot as resolved-class," since
the one-shot closeout prompt already exists.

**Verification.** Use MCP `execute_sql` (project_id `uhqxyxglyuhmpxegqsrt`) to inspect
the Mountain Harvest lot's state inputs, confirm `computeLifecycleState` returns the
corrected state, and check the `/green` index renders it in the right section. No visual
sign-off needed beyond correct placement.

---

## Close-out

- One PR (or split if the visual items want separate sign-off beats). Update
  `page-ia.md` for items 2 + 3. Move the resolved roadmap items out of
  `PRODUCT.md § Longer Term Items § Small / opportunistic` and add a `shipped.md` row.
- `npm run build` / `tsc --noEmit` (main repo) before push — items 1–3 touch `lib/` + TSX.
- Six-actor: Actor 6 (UI + lifecycle logic + color helper) + Actor 5 (page-ia.md). No
  schema / MCP / prompt.
