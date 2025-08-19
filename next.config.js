/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Make Stripe publishable key available to the client
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  // Enable static exports for Vercel
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Configure image domains if you're using next/image
  images: {
    unoptimized: true, // Required for static exports
  },
  // Add any other configurations you need here
};

module.exports = nextConfig;
