/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'static.tryleap.ai',
      'cdn.discordapp.com',
      'media.discordapp.net'
      
    ]
  },
  env: {
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY_TEST,
    next_leg_api_token: process.env.NEXT_LEG_API_TOKEN2,
    eleven_labs_api_key: process.env.ELEVEN_LABS_API_KEY
  },
  experimental: {
    appDir: true
  }
}


