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
        'libs/scheduler/src',
        'apps/backend/src',
      ],
    },
  ],
  format: 'po',
} 