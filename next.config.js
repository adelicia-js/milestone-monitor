/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    // Only run ESLint during development
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
