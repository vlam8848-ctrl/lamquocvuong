import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/lamquocvuong' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/lamquocvuong/' : undefined,
};

export default nextConfig;
