/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'pbxt.replicate.delivery',
      'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
    ],
  },
  transpilePackages: ['react-katex'],
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom'];
    return config;
  },
};

module.exports = nextConfig;
