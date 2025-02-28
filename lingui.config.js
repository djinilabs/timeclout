module.exports = {
  locales: ['en', 'pt'],  // only English and Portuguese
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'apps/frontend/src/locales/{locale}/messages',
      include: ['apps/frontend/src'],
    },
  ],
  format: 'po',
} 