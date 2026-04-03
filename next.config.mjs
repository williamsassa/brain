/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    CAUSAL_ENGINE_URL: process.env.CAUSAL_ENGINE_URL,
  },
};

export default nextConfig;
