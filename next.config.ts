/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 'example.com',
      },
    ],
    // Uncomment below ONLY if you want to allow SVG avatars (use with caution!)
    // dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
