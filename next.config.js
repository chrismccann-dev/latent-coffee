/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    // Include BREWING.md in the /api/mcp serverless bundle so docs://brewing.md
    // can readFile() it at runtime. Without this Vercel's static-trace misses
    // root markdown that the route reads via a string path.
    outputFileTracingIncludes: {
      '/api/mcp/**': ['./BREWING.md'],
    },
  },
}

module.exports = nextConfig
