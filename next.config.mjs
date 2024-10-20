/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}

export default nextConfig;