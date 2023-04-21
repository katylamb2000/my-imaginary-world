/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'static.tryleap.ai'
    ]
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY_TEST
  },
  experimental: {
    appDir: true
  }
}


