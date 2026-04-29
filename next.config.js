/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Include BREWING.md + the taxonomy/brewing markdown docs in the /api/mcp
    // serverless bundle so the docs:// Resources can readFile() them at runtime.
    // Without this Vercel's static-trace misses repo files the route reads via
    // string paths. Globs are resolved at build time. (Sprint 2.4 added taxonomy
    // + docs/brewing globs alongside the section-anchor parser.)
    outputFileTracingIncludes: {
      '/api/mcp/**': [
        './BREWING.md',
        './docs/brewing/*.md',
        './docs/taxonomies/*.md',
      ],
    },
  },
}

module.exports = nextConfig
