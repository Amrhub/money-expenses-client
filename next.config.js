/** @type {import('next').NextConfig} */
const nextConfig = {
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
