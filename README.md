# Latent Coffee Research

Personal coffee research journal that compounds brewing and roasting knowledge over time. Single-user, single-tenant. claude.ai writing via MCP is the canonical input path.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Database:** Supabase (Postgres + Auth + Row Level Security)
- **AI Synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk` (per-terroir / per-cultivar / per-process / per-roaster syntheses)
- **MCP Server:** Live since Sprint 2.3 (2026-04-28). 32 Tools cover the full brewing + roasting + Roest API write surface; OAuth 2.1 + PKCE for claude.ai web access; bearer-token for desktop. Source of truth for brews-from-claude.ai.
- **Roest API:** Two-way integration. Pull (roast logs + inventory) and push (profile design + inventory updates) — see [docs/features/roest-write-integration.md](docs/features/roest-write-integration.md).
- **Hosting:** Vercel (auto-deploy on push to main)
- **Domain:** latentcoffee.com

## Documentation

Foundational living docs (kept at root for visibility):
- [PRODUCT.md](PRODUCT.md) — Product vision, data model, taste profile, full roadmap, scaling watch-items
- [CLAUDE.md](CLAUDE.md) — Project instructions for Claude Code (sprint cadence, conventions, design system enforcement)
- [BREWING.md](BREWING.md) — Brewing master reference: 6 strategies + 3 modifiers, Two-Axis Framework, equipment, archive patterns
- [ROASTING.md](ROASTING.md) — Roasting master reference: counterflow methodology on Roest L200 Ultra, lot knowledge, archive

Architecture & operating playbooks:
- [SYNC_V2.md](SYNC_V2.md) — MCP-based sync architecture (claude.ai ↔ app, bidirectional)
- [ARBITER.md](ARBITER.md) — Doc-proposal + canonical-queue arbiter playbook (`process pending arbitration`)

Domain references in `docs/`:
- [docs/taxonomies/](docs/taxonomies/) — 10 canonical taxonomies (cultivars, terroirs, processes, roasters, producers, brewers, filters, flavors, grinders, roast-levels). Each .md is the authored source; `lib/<axis>-registry.ts` is the validation mirror.
- [docs/brewing/](docs/brewing/) — Roaster reference cards, WBC reference (5-axis foundational map + 8 strategy families), 102-recipe WBC corpus
- [docs/roasting/archive.md](docs/roasting/archive.md) — Closed-lot archive (per-lot Key Learnings)
- [docs/prompts/](docs/prompts/) — 7 operational prompts for claude.ai sessions (start-brew / log-brew / propose-doc-changes-from-brew / bundled-brewing-completion / new-bean-intake / in-process-bean-incremental-sync / closed-bean-full-fill)
- [docs/features/](docs/features/) — Per-sprint scoping/brainstorm docs (archive — Chris's thinking at the time of each taxonomy + feature design)
- [docs/sprints/shipped.md](docs/sprints/shipped.md) — Sprint-by-sprint shipped log

Per-sprint retrospectives live in `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_*.md`.

## Getting Started

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor**
3. Apply migrations in order from `supabase/migrations/` (45+ migrations as of May 2026; each filename + header documents what changed)
4. Go to **Settings > API** and copy your project URL and anon key

### 2. Set Up Environment

```bash
# Clone and install
cd latent-coffee
npm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your Supabase + Anthropic credentials
```

Required env vars:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for MCP server's auth resolution)
- `ANTHROPIC_API_KEY` (for AI synthesis routes)
- `ROEST_CLIENT_ID` + `ROEST_CLIENT_SECRET` (for Roest API integration)
- `MCP_OAUTH_CLIENT_ID` + `MCP_OAUTH_CLIENT_SECRET` (for claude.ai web MCP OAuth)

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy. Vercel auto-deploys on every push to main; auto-deploys propagate doc edits to MCP-served files in 30-60s.

### 5. Connect Domain

In Vercel:
1. Go to **Settings > Domains**
2. Add `latentcoffee.com`
3. Update DNS records as instructed
4. Verify HTTPS redirect on the apex domain (known bug: apex over HTTP currently — see PRODUCT.md § Bugs and Issues)

## Project Structure

```
latent-coffee/
├── app/
│   ├── (app)/                       # Authenticated routes
│   │   ├── brews/                   # Brew list & detail (5-dim filter bar, edit form)
│   │   ├── green/                   # Green bean list & detail
│   │   ├── terroirs/                # Terroir aggregation (macro-level + synthesis)
│   │   ├── cultivars/               # Cultivar aggregation (lineage-level + synthesis)
│   │   ├── processes/               # Process family aggregation
│   │   ├── roasters/                # Roaster aggregation (BMR house-style + synthesis)
│   │   ├── add/                     # Add brew (purchased + self-roasted flows)
│   │   └── layout.tsx               # Shared layout with header
│   ├── api/
│   │   ├── mcp/                     # MCP server endpoints (32 Tools live)
│   │   ├── brews/                   # PATCH route + parse route
│   │   ├── terroirs/synthesize/     # AI synthesis routes (per axis)
│   │   ├── cultivars/synthesize/
│   │   ├── processes/synthesize/
│   │   └── roasters/synthesize/
│   ├── auth/                        # Auth callback
│   ├── login/                       # Login page
│   ├── signup/                      # Signup page (single-tenant; admin-only in practice)
│   ├── globals.css                  # Tokens (chrome utilities, .label, .btn, etc.)
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page (login redirect)
├── components/                      # Header, SectionCard, Tag, TagLinkList,
│                                    # CanonicalTextInput, SaveGateWarning,
│                                    # FlavorComposer, StructureTagsPicker,
│                                    # ProcessPicker, ModifierComposer,
│                                    # ModifierBadges, GrindSettingInput, etc.
├── lib/
│   ├── types.ts                     # Shared TypeScript types
│   ├── brew-import.ts               # persistBrew + findOrCreate* helpers
│   ├── canonical-registry.ts        # makeCanonicalLookup factory + isOverridableValid
│   ├── extraction-modifiers.ts      # Axis 2 modifier types + composeModifierLabel
│   ├── extraction-strategy.ts       # Pill colors, canonical 6-strategy list
│   ├── flavor-registry.ts           # 3-axis flavor system (181 bases + 43 modifiers + 29 structure)
│   ├── cultivar-registry.ts         # 63 canonical cultivars + 48 aliases
│   ├── terroir-registry.ts          # 121 canonical macros across 38 countries + 12 aliases
│   ├── process-registry.ts          # Composable: 4 bases + 7 honey + 13/5/7/4 modifiers + decaf + signature
│   ├── roaster-registry.ts          # 70 canonicals across 6 families + 24 aliases
│   ├── producer-registry.ts         # 120 canonicals + 64 aliases
│   ├── brewer-registry.ts           # 46 canonicals (12 owned) + 24 aliases
│   ├── filter-registry.ts           # 64 canonicals (22 owned) + 34 aliases
│   ├── grinder-registry.ts          # EG-1 with 51 enumerated settings
│   ├── roast-level-registry.ts      # 8 Agtron-anchored buckets + 22 aliases
│   ├── brew-colors.ts               # Book-cover color helper (single source per signal)
│   ├── country-colors.ts            # 12 earth-tone country swatches
│   ├── cultivar-family-colors.ts    # Per genetic-family swatches
│   ├── roest-client.ts              # Roest API client (OAuth Toolkit /o/token/)
│   ├── taxonomy-queue.ts            # fireQueueInserts for taxonomy_overrides_queue
│   ├── mcp/                         # MCP server implementation
│   │   ├── docs.ts                  # listDocs() + readDoc + readDocSection
│   │   ├── canonicals.ts            # canonicals:// resource dispatch
│   │   ├── brews.ts                 # brews://recent + brews://by-id (now also Tools)
│   │   ├── auth.ts                  # Bearer token resolution
│   │   ├── propose-doc-changes.ts   # The polymorphic prose proposal Tool
│   │   ├── push-*.ts                # Per-entity push Tools
│   │   ├── patch-*.ts               # Per-entity patch Tools
│   │   ├── pull-roest-log.ts        # Roest pull
│   │   └── ...                      # 32 Tools total
│   └── supabase/
│       ├── client.ts                # Browser client
│       ├── server.ts                # Server client (cookie-based auth)
│       └── service.ts               # Service-role client (RLS bypass for MCP auth resolution)
├── supabase/
│   └── migrations/                  # 45+ SQL migrations (each header documents what changed)
└── middleware.ts                    # Auth middleware
```

## Database Schema

### Core entity tables
- **profiles** — User profiles (auto-created on signup)
- **terroirs** — Geographic origins with cup profile info (Country → Admin Region → Macro Terroir)
- **cultivars** — Coffee varieties with genetic taxonomy (Species → Genetic Family → Lineage → Cultivar)
- **green_beans** — Green coffee lots with sourcing details (self-roasted only). Roest cross-ref via `roest_inventory_id`.
- **roasts** — Individual roast batches with Roest profile parameters + V4-doc control signals (FC temp/time, drop temp/time, dev time, charge temp, hopper load, fan curve, inlet curve, end condition, total cracks)
- **experiments** — Structured A/B/C/D roast experiments (hypothesis → outcome → insight)
- **cuppings** — Cupping evaluations per roast (Day 7 pourover gate)
- **roast_learnings** — Per-bean synthesis at lot close-out
- **brews** — The main archive (purchased + self-roasted). FKs to terroir / cultivar / green_bean / roast.

### Cache + queue tables
- **process_syntheses** — AI synthesis cached per (user_id, process)
- **roaster_syntheses** — AI synthesis cached per (user_id, roaster)
- **doc_proposals** — Pending prose-doc-change proposals (Sprint 2.4, walked by arbiter)
- **taxonomy_overrides_queue** — Pending canonical-promotion entries across 7 axes (Phase 3, walked by arbiter)

### Auth tables
- **api_keys** — MCP bearer-token auth (Sprint 2.3)
- **oauth_authorization_codes** — OAuth 2.1 + PKCE codes for claude.ai web MCP (Sprint 3.0, transient)

### Row Level Security

All tables have RLS enabled. Users can only access their own data. The MCP server uses `SUPABASE_SERVICE_ROLE_KEY` to resolve API keys to `user_id`, then scopes all queries to that user.

## License

Private — personal use only.
