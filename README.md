# Latent Coffee Research

Personal coffee research journal for tracking green beans, roasts, experiments, and brews.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Database:** Supabase (Postgres + Auth + Row Level Security)
- **Hosting:** Vercel
- **Domain:** latentcoffee.com

## Getting Started

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it
4. Go to **Settings > API** and copy your project URL and anon key

### 2. Set Up Environment

```bash
# Clone and install
cd latent-coffee
npm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### 5. Connect Domain

In Vercel:
1. Go to **Settings > Domains**
2. Add `latentcoffee.com`
3. Update DNS records as instructed

## Project Structure

```
latent-coffee/
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── brews/          # Brew list & detail
│   │   ├── green/          # Green beans list & detail
│   │   ├── terroirs/       # Terroir list & detail
│   │   ├── cultivars/      # Cultivar list & detail
│   │   ├── add/            # Add workflow
│   │   └── layout.tsx      # Shared layout with header
│   ├── auth/               # Auth callback
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   └── Header.tsx          # Navigation header
├── lib/
│   ├── types.ts            # TypeScript types
│   └── supabase/
│       ├── client.ts       # Browser client
│       └── server.ts       # Server client
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
└── middleware.ts           # Auth middleware
```

## Database Schema

### Tables

- **profiles** - User profiles (auto-created on signup)
- **terroirs** - Geographic origins with cup profile info
- **cultivars** - Coffee varieties with genetic/flavor info
- **green_beans** - Green coffee lots with sourcing details
- **roasts** - Individual roast batches with parameters
- **experiments** - A/B roast experiments
- **cuppings** - Cupping evaluations per roast
- **roast_learnings** - Synthesized learnings per green bean
- **brews** - The main document tying everything together

### Row Level Security

All tables have RLS enabled. Users can only access their own data.

## Phase 2: MCP Server

The architecture is designed to support an MCP server that would allow Claude to:

- Add roasts from Roest screenshots
- Log cupping notes
- Compile brew documents automatically
- Query your coffee data

See `mcp-server/` (coming soon) for implementation.

## License

Private - Personal use only
