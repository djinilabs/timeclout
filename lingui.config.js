module.exports = {
  locales: ['en', 'pt'],  // only English and Portuguese
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'apps/frontend/src/locales/{locale}/messages',
      include: ['apps/frontend/src'],
    },
    {
      path: 'libs/locales/src/messages/{locale}/messages',
      include: [
        'libs/graphql/src',
        'libs/business-logic/src',
        'apps/backend/src',
        'libs/locales/src'
      ],
    },
  ],
  format: 'po',
} 