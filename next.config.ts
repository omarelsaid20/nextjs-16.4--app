import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep `next dev` from re-creating AGENTS.md (removed on purpose).
  agentRules: false,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
