import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'img.logo.dev',
            },
        ],
    },
};

export default nextConfig;
