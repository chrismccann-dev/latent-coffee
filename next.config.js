/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Include BREWING.md + ROASTING.md + the taxonomy/brewing markdown docs in
    // the /api/mcp serverless bundle so the docs:// Resources can readFile()
    // them at runtime. Without this Vercel's static-trace misses repo files
    // the route reads via string paths. Globs are resolved at build time.
    // (Sprint 2.4 added taxonomy + docs/brewing globs alongside the section-
    // anchor parser; Sprint 2.5 added ROASTING.md alongside push_roast Tools.)
    outputFileTracingIncludes: {
      '/api/mcp/**': [
        './BREWING.md',
        './ROASTING.md',
        './docs/brewing/*.md',
        './docs/taxonomies/*.md',
      ],
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
