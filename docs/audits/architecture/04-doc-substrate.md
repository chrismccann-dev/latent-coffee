# Architecture audit 04 — Doc-substrate navigability + dead anchors

**Session:** 2026-06-04. Dogfood session 4 of the architecture-review-skill derivation ([brainstorm](../../features/architecture-review-skill-brainstorm-2026-06-04.md), Part D). **Read-only — no code edited, no refactor performed.**
**Surface:** the whole doc substrate agents navigate — `docs/skills/` cluster tree + `CONTEXT-*` + `docs/prompts/` + root living docs + the broken-link population.
**Centered smell:** doc-substrate non-navigability (the Latent-specific extension to the rubric, Part B Step 3).
**Method:** Part B rubric, adapted. Mechanical scan was a purpose-built link checker (`/tmp/linkcheck.py`, throwaway) over all 330 `.md` files, then judgment segmentation by *who the link breaks for*.

---

## TL;DR

- **Headline reframe:** the seed "~282 broken / 1,747 links" undercounts and, more importantly, **mis-frames**. The raw count is **409 broken / 2,399 internal link instances** under strict markdown (file-relative) semantics. But "broken" is renderer-dependent, and that distinction is the whole finding.
- After stripping **33 checker artifacts / known-skeleton forward-refs** (the false-positive taxonomy — see Friction Log, this is the CI-gate spec) → **376 genuinely-wrong links**.
- Those 376 split into two populations with **very different severity**:
  - **~167 are dead for the Claude Code agent itself** (resolve under neither file-relative nor cwd-relative, OR point at a real file whose anchor is gone). *These are the real navigability emergencies.* 70 of them sit in **live, agent-navigated substrate** (CONTEXT-*, cluster docs, architecture reference docs).
  - **~169 are GitHub-only-broken** — root-relative links that resolve fine for the agent (whose cwd is the repo root) but 404 on GitHub web view. This is a **link-convention schism**, not rot. Lower urgency, needs one operator decision.
- **Best-maintained surface:** `docs/prompts/` (the claude.ai entry prompts) — **zero** genuine agent-dead links. The rot is concentrated in cluster pattern docs and the on-demand architecture reference docs.
- **Top 3 candidates:** (1) CONTEXT-* over-deep `../../` outbound pointers [every-session glossary, dead for everyone], (2) redirect-stub dead anchors [the high-value seed class + the CI-gate spec], (3) `docs/architecture/page-ia.md` stale component pointers [on-demand doc actively misleads].

---

## Step 1-2 — Explore + mechanical scan (what I ran)

330 `.md` files (excl `node_modules`/`.git`/`.next`). Extracted every `[text](target)` link; classified each. Heading anchors generated GitHub-slug-style per target file. Memory refs (`~/.claude/...`, `/Users/...`) correctly skipped (84 instances).

Raw class counts:

| count | class |
|---|---|
| 1806 | ok-file (resolves, no anchor) |
| 66 | ok-anchor (resolves + anchor present) |
| 34 | anchor-same (in-file `#anchor`, present) |
| 84 | memory-skip (`~/.claude/...` — out of repo, skipped) |
| **169** | **BROKEN-should-be-root-relative** (file-relative fails, **cwd-relative succeeds**) |
| **88** | **BROKEN-file-missing** (no target under any convention) |
| **70** | **BROKEN-missing-dotdot** (needs one more `../`) |
| **40** | **BROKEN-redundant-docs-prefix** (`docs/x` from inside `docs/` → `docs/docs/x`) |
| **36** | **BROKEN-anchor-missing** (file resolves, anchor gone) |
| **6** | **BROKEN-anchor-same** (in-file anchor gone) |

**Total internal link instances: 2,399. Raw broken: 409.**

### The severity re-segmentation (the load-bearing move)

A link's "brokenness" depends on the renderer. Latent has **four** doc consumers, and they resolve relative links differently:

| Consumer | Resolves links relative to | Affected by root-relative links? |
|---|---|---|
| **Claude Code agent** (this session) | **cwd = repo root** (per CLAUDE.md's own link instruction) | No — root-relative works |
| **claude.ai via MCP** | doesn't follow markdown links — reads `docs://` Resources + `read_doc` | N/A |
| **GitHub web / editor preview** | **the containing file** (standard markdown) | **Yes — root-relative 404s** |
| **Human (Chris) in GitHub** | same as GitHub | Yes |

Re-segmenting the 409 by *does it resolve relative to repo-root (the agent's reality)*:

| bucket | count | meaning |
|---|---|---|
| **github-only (agent-OK)** | 169 | root-relative; agent follows it, GitHub 404s. **95 live / 74 archive.** |
| **AGENT-DEAD** | 125 | resolves under *neither* convention → broken for everyone, agent included. **70 live / 55 archive.** |
| **dead-anchor** | 42 | target file resolves but the `#fragment` is gone → lands on wrong/stub content |
| agent-ok-rootrel | 73 | (subset overlap) file-relative fails but cwd-relative works |

After removing the 33 false-positives/skeleton (below), **~167 links are genuinely dead for the agent** (AGENT-DEAD + dead-anchor, net of FPs), **~169 are the GitHub-only convention schism.**

---

## Step 3-4 — Smell findings as candidate cards

### Candidate 1: CONTEXT-* over-deep `../../` outbound pointers `[STRONG]`
- **Files involved:** `CONTEXT-brewing.md` (5), `CONTEXT-shared.md` (3) — both at **repo root**.
- **Current shape:** Links written as `../../docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md`, `../../BREWING.md`, `../../lib/mcp/docs.ts`, `../../docs/brewing/roasters.md`. From a root-level file, `../../` escapes the repository entirely.
- **Problem:** doc-substrate non-navigability, **maximum blast radius**. CONTEXT-brewing/shared are part of the every-session glossary trio (the zone-split successors to CONTEXT.md, root-level since 2026-05-25). Their outbound pointers are dead for **every** consumer — agent, GitHub, human. An agent told "see `[wbc-reference]`" for the WBC corpus follows a link out of the repo. Root cause: paths inherited from when the content lived deeper (pre-zone-split) or copy-pasted from cluster docs that legitimately need `../../`.
- **Proposed deepening:** strip the leading `../../` so they're root-relative (`docs/skills/.../wbc-reference.md`, `BREWING.md`, `lib/mcp/docs.ts`). NO code. (Convention choice interacts with Candidate 5 — pick the convention first, then this is mechanical.)
- **Verification to lock first:** re-run the link checker; confirm each rewritten target resolves root-relative. Six-actor audit hop: Actor 1 (Chris reads CONTEXT-* in claude.ai) + Actor 5 (agent reads at session start).
- **Recommendation:** Strong · **Size:** S (1 PR) · **Risk:** Low
- **Why first:** every-session surface × dead-for-everyone × trivial fix = the highest leverage-per-byte item in the audit.

### Candidate 2: Redirect-stub dead anchors `[STRONG]` — *the high-value seed class + the CI-gate spec*
- **Files involved:** ~42 links into `ROASTING.md#...` (8KB stub), `BREWING.md#...` (4KB stub), `PRODUCT.md#active-sprints`, `SYNC_V2.md#propose_doc_changes`, plus in-cluster anchors. Sources include `docs/roasting/archive.md`, `docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md`, `ARBITER.md`, sprint docs.
- **Current shape:** The link's **file half resolves** (ROASTING.md exists) so the link *looks* alive — but ROASTING.md/BREWING.md are now ~3-8KB **redirect stubs** (Wave 3-4 migration). The deep-section anchors (`#cross-coffee-insight-layer`, `#hopper-pre-load-timing`, `#cgle-srume-washed-2026...`) were migrated into cluster docs; the fragments are gone.
- **Problem:** the **most insidious** navigability failure — an agent following the link lands on a stub pointer-table, not the content, and gets no error signal. This is exactly the class the seed flagged as high-value. It is invisible to a naive "does the file exist" checker.
- **Proposed deepening:** for each dead anchor, repoint to the migrated location (the stub itself names the new home in its pointer table) OR drop the fragment. NO code.
- **Verification to lock first:** anchor-aware link checker (the checker built this session generates per-file anchor sets — this is the deterministic spin-out).
- **Recommendation:** Strong · **Size:** M (2-3 PRs; spread across cluster docs) · **Risk:** Low
- **Why first:** the seed's named high-value class, and authoring the fix-verification *is* the dead-anchor CI gate the brainstorm wants spun out.

### Candidate 3: `docs/architecture/page-ia.md` stale component pointers `[STRONG]`
- **Files involved:** `docs/architecture/page-ia.md` (8 dead component links), secondary in `docs/reference/synthesis-pipeline.md`, `docs/architecture/data-model.md`.
- **Current shape:** `[components/SectionCard.tsx](components/SectionCard.tsx)`, `Tag.tsx`, `ProcessBreakdownRow.tsx`, `ProcessConfidenceCard.tsx`, `ProcessCoffeesList.tsx`, `RecipeTable.tsx`, `PourStructureList.tsx`, `StrategyPill.tsx` — **all 8 missing on disk.** SectionCard + Tag are **confirmed deleted** (Redesign Sprint 5, per CLAUDE.md). StrategyPill has no file anywhere despite CLAUDE.md citing it as a shared primitive.
- **Problem:** `page-ia.md` is an **on-demand reference** CLAUDE.md instructs agents to read *"when touching a page."* Dead links to **deleted** components don't just fail to navigate — they **actively mislead**: an agent trusts the IA doc's component inventory and reaches for primitives that no longer exist. Also root-relative-from-`docs/` (Candidate 5 schism) on top of being stale.
- **Proposed deepening:** reconcile the component-pointer block against the live `components/` tree; drop/rename deleted entries. Flag StrategyPill's true status (renamed? inlined? gone?). NO code.
- **Verification to lock first:** `ls components/<name>.tsx` per pointer (done this session — all 8 missing). Six-actor: Actor 6 (the deleted-component reality) vs Actor 5 (the doc).
- **Recommendation:** Strong · **Size:** S · **Risk:** Low
- **Why first:** stale-and-misleading > merely-dead. The cost is paid on every "touch a page" task.

### Candidate 4: cluster-doc off-by-one `../` depth `[WORTH EXPLORING]`
- **Files involved:** `docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (12), `.../by-process/honey.md` (3), `docs/grilling-queue.md` (28), and ~70 `missing-dotdot` instances total.
- **Current shape:** `cross-coffee-insights.md` lives at depth `docs/skills/roasting-historian/cluster/patterns/` (5 levels below root) but links to root docs with `../../../../CONTEXT-roasting.md` (4 `../`) — lands in `docs/`, one level short. Every one of its 12 outbound root-doc links has the **same off-by-one**, implying the file was authored at, or copied from, a shallower depth.
- **Problem:** systematic, single-root-cause depth error replicated across a file (and the pattern recurs across cluster docs). Fragile: any cluster reorg silently breaks the whole batch. This is the "deep relative paths are an interface no one can hold in their head" smell — the cluster tree is 5-6 levels deep and hand-authored `../../../../` is error-prone by construction.
- **Proposed deepening:** two options — (a) mechanical: add the missing `../` per file; (b) deeper: **migrate cluster→root links to root-relative** (resolves the depth-counting problem permanently for the agent, ties into Candidate 5). Recommend (b) if the convention decision goes root-relative.
- **Verification to lock first:** link checker post-rewrite.
- **Recommendation:** Worth exploring (pending Candidate 5 decision) · **Size:** M · **Risk:** Low
- **Why later:** the fix shape depends on the convention decision; don't hand-patch `../` counts only to re-migrate them.

### Candidate 5: the link-convention schism `[STRONG — but needs one Chris decision first]` — *the architectural root cause*
- **Files involved:** repo-wide. 169 root-relative links break on GitHub but work for the agent (95 in live substrate).
- **Current shape:** **the repo has no single link convention.** Two coexist, split by author-era:
  - **Root-relative** (`[x](app/x)`, `[y](docs/y.md)`) — used in `docs/architecture/*`, `docs/sprints/*`, `docs/reference/*`. Correct for the Claude Code agent (CLAUDE.md's own instruction says *"path relative to the working directory"*). **Breaks on GitHub.**
  - **File-relative** (`[x](../../../app/x)`) — used in `docs/skills/cluster/*`. Correct for GitHub and the agent. **Error-prone at 5-6 levels deep** (Candidate 4).
- **Problem:** this is the "**is this concept scattered / inconsistent across surfaces**" finding from the rubric, applied to linking convention itself. The inconsistency is *why* Candidates 1/3/4 exist — they're symptoms. No checker can pass/fail "broken" cleanly until the repo declares which renderer is authoritative.
- **Proposed deepening (the decision):** declare the authoritative consumer.
  - **Option A — root-relative everywhere** (recommended): matches CLAUDE.md's stated convention + the agent (primary consumer) + MCP-irrelevant. Accept GitHub-web 404s as out-of-scope (Chris navigates via Claude Code / claude.ai, not GitHub file browsing). Cheapest, aligns the existing majority.
  - **Option B — file-relative everywhere**: GitHub-correct, but reintroduces the deep-`../` fragility Candidate 4 documents, and contradicts CLAUDE.md's link instruction.
- **Recommendation:** Strong (decision), then the CI gate enforces it · **Size:** L (staged: decide → gate → migrate the minority) · **Risk:** Low (no behavior change; doc-only)
- **Why:** locking the convention is the prerequisite that makes the dead-anchor CI gate authorable. **This is the one item that needs Chris, not autonomy.**

### Calibration NON-candidate: the false-positive taxonomy `[DO NOT "FIX"]`
The 33 raw-broken links below are **not rot** — they are checker artifacts or deliberate skeleton. Cataloguing them is the most valuable output for the CI-gate spec (what the gate must **not** flag):

| FP class | n | why it's not a bug |
|---|---|---|
| **CCIL skeleton forward-refs** | 17 | `docs/skills/ccil/cluster/coffee/sudan-rume/*` deliberately points at not-yet-authored cluster docs (Wave 4 PR 4a seed). Aspirational, by design. |
| **`:NN` / `#LNN` line suffixes** | 10 | `lib/synthesis/humanizer.ts:23`, `roaster.ts#L32` — the file *exists*; the Claude-Code clickable-line suffix wasn't stripped before the existence check. |
| **grill-with-docs generic-template `./src/...`** | 3 | `CONTEXT-FORMAT.md` is a portable skill template; its `./src/ordering/CONTEXT.md` examples reference a hypothetical project, not this repo. |
| **`docs://` Resource URIs** | 2 | `docs://skills/coordinator/catalog.md` — a valid **MCP Resource** reference claude.ai resolves via the server catalog, not a filesystem path. |
| **`<placeholder>.md` template tokens** | 1 | `../learnings/<lot-slug>.md` — a fill-in-the-blank in a prompt template. |

A naive checker reports 409; the honest number is **376**. The 33-link gap **is the spec** for the gate's skip/translate rules.

---

## Step 5 — Score + prioritize

`priority = change_freq + cognitive_load + coupling + interface_mess + leverage − risk` (each 1-5). For docs: *change_freq* = how often read/touched; *cognitive_load* = how misleading when wrong; *coupling* = downstream surfaces depending on it; *interface_mess* = tangle of the pointer web; *leverage* = fix-once value.

| Candidate | chg | cog | coup | mess | lev | risk | **priority** |
|---|--:|--:|--:|--:|--:|--:|--:|
| **1 — CONTEXT-* `../../`** | 5 | 4 | 5 | 2 | 5 | 1 | **20** |
| **2 — redirect-stub dead anchors** | 4 | 5 | 4 | 3 | 4 | 1 | **19** |
| **3 — page-ia.md stale components** | 4 | 5 | 3 | 2 | 4 | 1 | **17** |
| **5 — convention schism** | 5 | 3 | 5 | 5 | 5 | 2 | **21**\* |
| **4 — cluster `../` off-by-one** | 3 | 3 | 3 | 4 | 3 | 1 | **15** |

\* Candidate 5 scores highest on raw leverage but is a **decision, not a refactor** — it gates the others. Sequence: **decide 5 → fix 1 (mechanical, dead-for-everyone) → fix 2 + spin the CI gate → fix 3 → fix 4 under the locked convention.**

**The top items are not the ugliest files — they're the ones whose ugliness taxes every future navigation.** CONTEXT-* (every session) and page-ia.md (every page task) beat the 28-link `grilling-queue.md` (archive, read rarely).

---

## The deterministic spin-out: `check:doc-links` CI-gate spec

The brainstorm wants the dead-anchor checker spun out as a `check:*` gate (Part E.5). This session's throwaway checker is the prototype. Spec for `scripts/check-doc-links.ts` (sibling of the 6 existing `check:*` scripts):

**Must do:**
1. Walk all `*.md` (excl `node_modules`/`.git`/`.next`). Extract `[text](target)` links.
2. Resolve file half **relative to repo root** (per the Candidate-5 decision — assumes Option A). Check existence.
3. Generate GitHub-slug anchor sets per target file; validate `#fragment` against the target's anchors (catches the redirect-stub class — the highest-value check).
4. **Exit non-zero with a per-miss report** (file:line → target → reason), matching the `check:doc-sizes` / `check:mcp-bundle` pattern. Daily CI cron as catch-all.

**Must NOT flag (the skip/translate rules — from the FP taxonomy):**
- `~/.claude/...`, `/Users/...` — memory refs (out of repo).
- `http(s)://`, `mailto:`, `tel:` — external.
- `docs://...` — **translate to the MCP Resource catalog** (`lib/mcp/docs.ts` `DOC_FILES`) and validate *there*, not on the filesystem. (Bonus: this catches a docs:// pointing at an unregistered Resource — a real bug class the prose checks miss.)
- Strip trailing `:NN` and `#LNN` **line-number suffixes** before existence check.
- `<...>` template-placeholder targets.
- An **allowlist** for known-skeleton trees (`docs/skills/ccil/**` forward-refs) — or better, a per-file `<!-- skeleton -->` opt-out marker so the exclusion is local and self-documenting.
- grill-with-docs `CONTEXT-FORMAT.md` generic-template examples (portable-skill paths) — allowlist that file.

**Open gate question:** should it gate on GitHub-correctness (file-relative) or agent-correctness (root-relative)? **Resolve Candidate 5 first** — the gate's resolution base IS the convention decision. Until then the gate would either pass 169 GitHub-broken links or fail 169 agent-fine links.

---

## FRICTION LOG (the most important output — what the standing skill must absorb)

**F1 — "Broken" is not a boolean; it's per-renderer. The v0 rubric has no vocabulary for this.** The single biggest finding of the session is that the seed framing ("~282 broken links") hides a 169-vs-167 severity split that only appears once you ask *which consumer resolves the link, and relative to what*. The rubric's "doc-substrate non-navigability" smell needs a sub-axis: **broken-for-the-agent (emergency) vs broken-for-GitHub-only (convention debt) vs checker-artifact (noise)**. Without that axis, an audit either over-reports (cry-wolf 409) or under-acts (ignores the real 167). The standing skill should *lead* with the consumer/renderer matrix, not the raw count.

**F2 — the naive checker's false-positive rate (33/409 ≈ 8%) is itself the deliverable, not contamination.** I almost reported 409. The judgment work was entirely in *subtracting* — docs:// Resource URIs, `:NN` suffixes, skeleton forward-refs, template placeholders, portable-skill example paths. Each FP class maps 1:1 to a Latent-specific doc convention the brainstorm's external sources (Pocock / the audit doc) never anticipated. **The friction of distinguishing rot from convention is exactly the judgment a CI gate can't have** — which validates the brainstorm's skill-vs-gate split, but also means the gate's skip-list is non-trivial and must be derived from a human pass like this one first.

**F3 — dead anchors are invisible to the obvious tool and need anchor-set generation.** A "does the file exist" checker (the first thing anyone writes) passes every redirect-stub link — the file exists; only the section is gone. Catching the seed's high-value class *requires* generating GitHub-slug anchor sets per file and validating fragments. That's ~30 lines of slug logic with edge cases (duplicate headings → `-1` suffix, `<a name>` explicit anchors, markdown formatting in heading text). The rubric should ship this as a named sub-procedure, not leave each session to reinvent slug generation.

**F4 — the rubric had no "stale-vs-dead" distinction, and stale is worse.** A link to a *missing* file fails loudly (agent notices). A link to a *deleted-and-replaced* concept (page-ia.md → SectionCard.tsx, deleted Redesign Sprint 5) **actively misleads** — the agent trusts the inventory and reaches for a ghost. The smell taxonomy weights "dead code / dead link" as low-severity (Part C: "dead code LOW"). For *docs*, dead-and-misleading should rank **above** merely-dead. Add a `stale-pointer` smell that cross-checks doc claims against live `components/`/`lib/` reality (this needs a filesystem read the pure-link-checker doesn't do).

**F5 — surface segmentation (live vs archive) was load-bearing and the rubric doesn't mention it.** 55 of 125 agent-dead links are in `docs/sprints/`/`docs/features/` archive docs nobody navigates live. Treating those at the same priority as a CONTEXT-* dead link would waste the whole budget on dead history. The standing skill needs an explicit **live-substrate manifest** (root living docs + `docs/skills/**` + `docs/prompts/**` + `docs/architecture/**` + `docs/reference/**`) and should down-weight or exclude the archive layer. This mirrors `check:doc-sizes`'s Tier-1 surface list — reuse that manifest.

**F6 — `docs://` is a third address space the code-centric rubric ignores entirely.** Latent docs link three ways: filesystem-relative, root-relative, and **MCP Resource URI (`docs://`)**. 61 files use `docs://`. The rubric (inherited from code-architecture sources) only imagines filesystem paths. A doc-substrate audit must treat the MCP Resource catalog (`lib/mcp/docs.ts`) as a **first-class link target namespace** — and the richest available check is "does this `docs://` resolve to a *registered* Resource," which is a known recurring bug class (the MCP-bundle misses in CLAUDE.md's audit history). The skill should fold doc-link-checking and `check:mcp-bundle` thinking together.

**F7 — what was hard to *find*:** nothing about locating the links was hard (one grep-shaped script). What was hard was **deciding the resolution base** — I had to read CLAUDE.md's own link-href instruction to discover the repo *intends* root-relative, which silently invalidates the standard-markdown assumption the checker started with. **A doc audit must first locate the repo's declared link convention** (here: buried in CLAUDE.md's harness instructions, not in any doc-standards doc). That there's no single `docs/CONVENTIONS.md` stating "links are root-relative" is itself the Candidate-5 root cause. The skill's Step 1 should explicitly hunt for (or note the absence of) a stated linking convention before judging any link broken.

**F8 — the rubric's candidate-card format fit, but "Before/After seam diagram" was dead weight here.** Doc-link remediation has no interesting seam diagram. The card's `Before / After: <mermaid>` slot was N/A for all five candidates. For doc-substrate audits the card should swap that slot for **"resolution base + sample dead targets"** — the diagnostic that actually drives the fix.

### Open questions to resolve before any remediation
1. **Candidate 5 first:** root-relative or file-relative as the authoritative convention? (Recommend root-relative — matches CLAUDE.md + the agent.) Everything downstream gates on this.
2. Should `check:doc-links` gate on agent-correctness or GitHub-correctness? (Falls out of Q1.)
3. Skeleton exclusion mechanism: global allowlist (`docs/skills/ccil/**`) or per-file `<!-- skeleton -->` marker? (Recommend marker — local + self-documenting + survives the skeleton being filled.)
4. Is GitHub-web 404 a real cost for Latent, or does Chris exclusively navigate via Claude Code + claude.ai? (If the latter, Option A is free.)
5. Does the architecture-review skill *own* the doc-link check, or does it delegate to the spun-out `check:doc-links` gate and only interpret its output? (Recommend: gate produces the list, skill does the live-vs-archive + stale-vs-dead judgment the gate can't.)

### Stop condition met
No code edited. Top 3: **Candidate 1 (CONTEXT-* `../../`)**, **Candidate 2 (redirect-stub anchors + CI-gate spin-out)**, **Candidate 3 (page-ia.md stale components)**. Recommended first action: **the Candidate-5 convention decision** (one operator call), then Candidate 1 as the first mechanical fix. This handoff is the deliverable — carry back to the originating thread.
