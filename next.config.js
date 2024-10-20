module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/components',
        permanent: true,
      },
    ]
  },
}