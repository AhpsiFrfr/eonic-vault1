/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com;
              img-src 'self' blob: data: https:;
              media-src 'self' blob: https:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' 
                https://*.solana.com 
                wss://*.livekit.cloud
                https://*.livekit.cloud
                https://*.helius.xyz
                wss://* 
                https://*.supabase.co
                https://fonts.googleapis.com
                https://fonts.gstatic.com;
              frame-src 'self' https://*.phantom.app;
              worker-src 'self' blob:;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;