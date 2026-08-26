import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The home directory is the git root; pin Turbopack to this project.
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
