# Kickoff — One-shot lot: emit the Optimized Brew Packet (+ close the close-out link gap)

THIS IS A DOGFOOD-FIRST BUILD modeled on the just-shipped Simulated Pourover
Packet (PR #344 / Cluster A). The *shape* is largely settled by that precedent,
but the packet FIELDS, the one-shot-vs-generalize SCOPE, and the NAMING are
interpretive — settle those WITH Chris before finalizing prompt wording (ask,
don't ship on those three). Mechanical mirroring + six-actor wiring follow the
autonomy rule once the interpretive calls are locked.

## Goal
For a one-shot lot, after the Day-7 xBloom cupping, emit a thin roasting→brewing
**Optimized Brew Packet** (no URL) that kick-starts the optimized-brew dial-in on
the brewing side — because a one-shot has no choice (one roast, one cup, it ALWAYS
goes to brewing, on both Outcome A and Outcome B). Mirror of the SPG Packet, but
it kicks off the FULL optimization (which pushes + persists), not an ephemeral
non-iterated recipe.

## Live dogfood (do this FIRST, author from it)
Chris just finished a one-shot lot and has the Day-7 cupping notes NOT yet fed
back. Bring: the lot_id/green_bean_id + the cupping notes. Walk the real case by
hand — construct what the packet SHOULD carry to start a good brewing thread for
THIS coffee — then encode that shape into the prompt. (Same "author from the live
case" discipline as the Cluster A dogfood.)

## Scope — two prompt edits
1. **`one-shot.md` STAGE 4 (end)** — after the cupping is captured, emit the thin
   Optimized Brew Packet. Emit UNCONDITIONALLY (Outcome A *and* B — "regardless how
   the cup went, it goes to brewing"; same logic as `is_reference` being set
   unconditionally for one-shots). Keep it a few lines — no recipe design
   roasting-side (context-protection, like the SPG packet).
2. **`one-shot-closeout.md` STAGE 3 — flip "Push" → LINK-not-push.** Reconcile to
   the Cluster A pushed-once-linked-once invariant: the optimized brew is pushed
   BREWING-side (via `bundled-brewing-completion.md`'s optimized-brew carve-out,
   which hands back a brew_id); STAGE 3 reads that brew_id and sets
   `green_beans.optimized_brew_id` (ask-if-missing), inline `push_brew` as the
   legacy fallback only. Carbon-copy the `close-lot.md` STAGE 4 shape.

## Interpretive checkpoints (settle with Chris — DO NOT pre-pick)
- **Packet fields.** What does it carry to start the optimization cold (no URL)?
  Candidates from the dogfood: green_bean_id + the single roast/batch_id + roasted-
  bean characteristic (loud/muted, preferred brewing direction, brewing tolerance) +
  the cup character/notes + producer tasting notes as the target anchor + roast
  level/Agtron. Let the live case prune this.
- **One-shot-only, or generalize?** Chris scoped it one-shot. But the V-set
  optimized-brew kickoff (post-reference-roast, in `close-lot.md`) ALSO has no
  formalized outbound trigger today — operator just "starts a fresh brewing thread
  with the reference roast in mind." Recommendation to put to Chris: design the
  packet so it COULD generalize, but BUILD only the one-shot path now; note
  close-lot.md could adopt it later (same "add later if it gets annoying" discipline
  as Cluster A's peer-variant auto-discovery). Don't build the V-set path unasked.
- **Naming.** Recommend **"Optimized Brew Packet"** — per CONTEXT-roasting § Optimized
  brew, canonical is "optimized brew" (avoid "optimized pourover"/"optimized recipe").
  Confirm with Chris.

## Six-actor
- Actor 2 (prompts): one-shot.md STAGE 4 emit; one-shot-closeout.md STAGE 3 link.
  Verify `bundled-brewing-completion.md`'s carve-out language covers the one-shot
  case (it keys on "this is the optimized/reference brew for <lot>" — should, but check).
- Actor 5 (CONTEXT): the Optimized Brew Packet is a 4th instance of the
  brewing-to-roasting handoff brief (the OUTBOUND optimized-brew trigger, distinct
  from Cluster A's inbound brew_id-carrying handoff). Extend CONTEXT-shared §
  Cross-domain Workflow + a thin note in CONTEXT-roasting § Optimized brew (one-shot
  emission point + the closeout LINK-not-push reconciliation).
- Actor 4 (MCP): NONE — `optimized_brew_id` (075) exists and is verified live in
  prod (9/14 lots, confirmed 2026-06-01). The link uses `patch_green_bean`.
- Actor 3 (claude.ai): MANUAL Chris action — the roasting project instructions need
  a one-shot pointer ("one-shot cupping → emit Optimized Brew Packet → brewing
  project"). Flag at build close.
- New `docs://` resource? Only if you create a NEW prompt file. Default is NO new
  file (the packet emits from within one-shot.md, like the SPG packet emits from
  log-cupping.md STAGE 4). If a new file IS created → add DOC_FILES entry +
  `npm run check:mcp-bundle`.

## Build-kickoff migration gate
PRE-SATISFIED — `optimized_brew_id` confirmed live in prod this session. No re-check
needed. (`check:migrations` itself is still broken — see the "Repair the
migration-drift gate" roadmap item; don't rely on it.)

## Verification
- Docs-only unless a new file lands → no tsc/build. (`check:mcp-bundle` only if a
  new docs:// resource is added.)
- Dogfood: feed the live one-shot's cupping notes → confirm the emitted packet is
  enough to start a good brewing thread cold → close the loop (link optimized_brew_id).

## Branch
Off latest main (includes #344). Decompose: one-shot.md emit + one-shot-closeout.md
link as one PR; CONTEXT extension as a sibling or same PR.

---

## Where this sits in the queue (ordered, set 2026-06-02)
1. **One-shot lot — emit Optimized Brew Packet** (this brief).
2. **Repair the migration-drift gate** (PRODUCT.md § Bugs).
3. **CLAUDE.md root-doc compaction** (~149KB, over the 120KB tripwire).
4. **Optional grill** — only if new concepts surface during 1–3.
5. **PRODUCT.md roadmap review** — decide the next course of action once 1–4 are complete.
