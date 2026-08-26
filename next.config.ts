import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Fully static site: export to out/ for Cloudflare Pages (all images are already `unoptimized`).
  output: 'export',
  images: { unoptimized: true },
  // The home directory is the git root; pin Turbopack to this project.
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
