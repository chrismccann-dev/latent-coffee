# Packet shapes — thin via MCP shared state

**Canonical:** [ADR-0024 § 5](docs/adr/0024-lot-coordinator-claude-code-native.md). The MCP DB is shared state between every session, so packets carry **interpretation + pointers, never numbers.** A fresh session reconstructs the numbers from `get_bean_pipeline`.

## 1. V-set Handoff Packet (Coordinator → V-Set Assistant, down) — near-empty

The Coordinator stages everything to the DB before spawning (recipe rows written via `push_roast_recipe`; Roest profiles pushed). So the packet is minimal:

```
V-SET HANDOFF — <lot-slug> V<n>
- green_bean_id: <uuid>
- experiment_id: <uuid>   (recipe rows v<n>a/b/c already in DB; Roest profiles staged)
- focus: <the one-line lever this V-set tests, e.g. "the 108°C drop hypothesis">
- anything not captured in the recipe rows (rare)
```

Plus the **operator prep packet** (run order, profile names on Roest, FC marking protocol, drop rules, what to record). The Assistant reconstructs the full design from the DB.

## 2. V-set Results Packet (V-Set Assistant → Coordinator, up) — thin

Interpretation travels; numbers stay in the DB.

```
V-SET RESULTS — <lot-slug> V<n>
- pointers: roast_ids {a,b,c}, cupping_ids {…}   (Coordinator pulls the numbers)
- leading slot + why: <interpretation>
- did the roast behave: <which drop rules fired; divergence from design intent>
- cup vs roast-actual re-prediction: <did the actual roast predict the cup>
- cup vs producer notes: <on-track / off-track against the anchor>
- next-step hypothesis: <INPUT-NOT-CANON — what I'd try next>
- route recommendation: <INPUT — next-V | SPG | reference; Coordinator decides>
```

The next-step hypothesis + route recommendation are **input**; the Coordinator owns both decisions (it holds the plan + the cross-V-set context). The Assistant's value is the freshest lived read of the cycle.

## 3. Cross-domain brewing packets (Coordinator → claude.ai, both thin)

These cross the surface boundary (Claude Code → claude.ai). Still thin — the brewing side reads the bean + pipeline itself.

**Simulated Pourover Packet** (route to SPG; flip `lot_status → waiting_for_brewing`):
```
SIMULATED POUROVER — <lot-slug>
- green_bean_id: <uuid>
- finalist batches: <batch numbers>
- intent: <what the runoff should decide — reference-grade? which finalist?>
```
Do NOT include cupping notes, roast data, or recipe design. (The SPG *execution* — one recipe, both finalists, side-by-side, reference-grade reasoning — is a brewing exercise that lives claude.ai-side; the verdict comes back as `cuppings` rows + a thin verdict.)

**Optimized-Brew Packet** (after reference declared):
```
OPTIMIZED BREW — <lot-slug>
- green_bean_id: <uuid> · reference roast_id: <uuid>
- goal: preserve the reference roast's strengths; lock the drinking recipe; decide intrinsic-vs-brew-driven defects
- constraints: no new roast design unless brew optimization fails; push nothing until locked
```
Returns a locked `brew_id` (linked to the lot) + a thin return packet the Coordinator consumes at close.

## Why thin matters here

The verbose cross-domain packet that started this whole redesign was verbose *because the bloated single session emitted it*. A thin Coordinator emitting it makes it thin for free — the cause-fix is structural, not a template-tightening exercise.
