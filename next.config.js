/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Include BREWING.md / ROASTING.md + the taxonomy/brewing markdown docs in
    // the /api/mcp serverless bundle so the docs:// Resources can readFile()
    // them at runtime. Without this Vercel's static-trace misses repo files
    // the route reads via string paths. Globs are resolved at build time.
    // (Sprint 2.4 added taxonomy + docs/brewing globs; ROASTING.md added when
    // the arbiter applied the first roasting.md proposal alongside the file's
    // creation.)
    outputFileTracingIncludes: {
      '/api/mcp/**': [
        './BREWING.md',
        './ROASTING.md',
        './docs/brewing/*.md',
        './docs/taxonomies/*.md',
      ],
    },
  },
}

module.exports = nextConfig
