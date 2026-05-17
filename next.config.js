/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Include CONTEXT.md + BREWING.md + ROASTING.md + the per-domain markdown
    // docs in the /api/mcp serverless bundle so the docs:// Resources can
    // readFile() them at runtime. Without this Vercel's static-trace misses
    // repo files the route reads via string paths. Globs are resolved at
    // build time. (Sprint 2.4 added taxonomy + docs/brewing globs alongside
    // the section-anchor parser; Sprint 2.5 added ROASTING.md alongside
    // push_roast Tools; CONTEXT.md + docs/roasting/*.md added 2026-05-17
    // when the brewing-cross-party grilling session surfaced both as
    // unreachable from claude.ai via read_doc.)
    outputFileTracingIncludes: {
      '/api/mcp/**': [
        './CONTEXT.md',
        './BREWING.md',
        './ROASTING.md',
        './docs/brewing/*.md',
        './docs/roasting/*.md',
        './docs/taxonomies/*.md',
        './docs/prompts/*.md',
      ],
      // The 4 synthesize routes load lib/synthesis/humanizer-skill.md at
      // runtime via fs.readFileSync. Without this, Vercel's static-trace
      // misses the file and the polish call ENOENTs in production.
      '/api/terroirs/synthesize': ['./lib/synthesis/humanizer-skill.md'],
      '/api/cultivars/synthesize': ['./lib/synthesis/humanizer-skill.md'],
      '/api/processes/synthesize': ['./lib/synthesis/humanizer-skill.md'],
      '/api/roasters/synthesize': ['./lib/synthesis/humanizer-skill.md'],
    },
  },
  // Sprint 3.0: OAuth discovery requires /.well-known/* URLs. Next.js app router
  // ignores dot-prefixed folders, so the route handlers live under app/oauth/
  // and we rewrite the public URLs to them.
  async rewrites() {
    return [
      {
        source: '/.well-known/oauth-protected-resource',
        destination: '/oauth/well-known/oauth-protected-resource',
      },
      {
        source: '/.well-known/oauth-authorization-server',
        destination: '/oauth/well-known/oauth-authorization-server',
      },
    ]
  },
}

module.exports = nextConfig
