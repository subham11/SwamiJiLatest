/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Output standalone for AWS Amplify SSR
  output: 'standalone',
  images: {
    // Unoptimized for static export compatibility
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,
  // Enable compression
  compress: true,
  // Optimize for AWS Amplify
  poweredByHeader: false,
  // Trailing slashes for consistent routing
  trailingSlash: false,
  // Generate ETags for caching
  generateEtags: true,
}

export default nextConfig
