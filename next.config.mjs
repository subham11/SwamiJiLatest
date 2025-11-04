/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
