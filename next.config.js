/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // to avoid bug where using styled-components with server-side rendering (font.sansSerif was throwing Warning)
    styledComponents: true
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    AUTH0_BASE_URL: process.env.VERCEL_URL || process.env.AUTH0_BASE_URL,
    AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
    AUTH0_SECRET: process.env.AUTH0_SECRET,
  },
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/products',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
