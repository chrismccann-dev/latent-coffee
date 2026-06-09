# Role discipline — the three-role split

**Canonical:** [ADR-0024 § 3](docs/adr/0024-lot-coordinator-claude-code-native.md). This doc is the operational primitive.

The Lot Coordinator workflow has **three session roles, no overlap.** The split is the predicted/actual boundary + the one-skill-one-job decomposition of the old `log-cupping.md` (which did record + design-next + propose-docs = three jobs).

| Session role | Owns | Does NOT do |
|---|---|---|
| **Coordinator** (Brief-persistent, session-transient) | Brief authoring + state; every V-set *design* (`roast_recipes` + `experiments.predicted_cup`); route decisions; SPG decision + verdict consumption; reference declaration; close-out writes; scoping the substrate-fold | Run a roast; pull Roest logs; write `roasts`/`cuppings`; apply the substrate-fold doc edits |
| **V-Set Assistant** (ephemeral, one per V-set) | The full V_n cycle — roast execution, `pull_roest_log`, `roasts` writes, the **durable post-roast cup re-prediction**, `cuppings` writes, cup-side `experiment` patch, the Results Packet | Design V_(n+1); decide close-vs-iterate; touch the Brief; propose doc changes |
| **Substrate-fold Execution** (fresh session at close) | Apply the Coordinator's scoped substrate-fold plan via `propose_doc_changes` (cluster-doc / CONTEXT / registry edits the `roast_learnings` imply) | Re-interpret the plan; design follow-up V-sets; run a cycle |

## Why the split is rigid

The single-session-per-lot model was the root cause of the context-bloat-as-correctness failure ([severity handoff](docs/features/roasting-context-window-severity-handoff-2026-06-06.md)). The split fixes it structurally: the V-Set Assistant's prose dies with its ephemeral session and never accumulates into the lot's long-lived memory; the Coordinator holds only the durable Brief + thin packets, reconstructed per-session. If the roles blur (a Coordinator that runs cycles, or an Assistant that designs forward), the bloat returns.

## The reconstruct discipline (Model B)

Every Coordinator session is **transient**. It adopts the role by reading `docs/lots/<lot>.md` + pulling `get_bean_pipeline`. Therefore: **the Brief must be written at every natural break, and no session is trusted to survive one.** Keeping a session warm within a single sitting is an allowed convenience, never a thing the design depends on. Updating the Brief is a first-class Coordinator responsibility, not an afterthought.

## The Assistant's hard stop

The V-Set Assistant **terminates after emitting the Results Packet.** It does not "finish the job" by designing the next V-set or proposing docs — those are the Coordinator's and the Execution session's jobs. Its forward hypothesis travels in the Results Packet as *input-not-canon*; the Coordinator authors the actual design. (This mirrors the Research Assistant's load-bearing role-discipline block — see [research-assistant SKILL.md](docs/skills/research-assistant/SKILL.md).)
