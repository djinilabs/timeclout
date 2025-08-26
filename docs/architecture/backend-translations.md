# Backend Translation System

This library provides translation support for backend error messages using Lingui.

## Overview

The backend translation system allows you to:

- Translate error messages based on the `accept-language` header
- Extract translatable messages using `pnpm i18n:extract`
- Compile translations using `pnpm i18n:compile`
- Support multiple locales (currently English and Portuguese)

## Usage

### 1. Import the translation function

```typescript
import { i18n } from "@/locales";
```

### 2. Use translation in error messages

```typescript
// Simple messages
throw notFound(i18n._("User not found"));
throw forbidden(i18n._("You are not allowed to access this resource"));

// Messages with variables (using named arguments)
throw notFound(i18n._("User with id {userId} not found", { userId }));
throw forbidden(
  i18n._(
    "User does not have permission of level {permissionLevel} to access this resource",
    { permissionLevel }
  )
);
```

### 3. Language Detection

The system automatically detects the language from the `accept-language` header:

- `en-US,en;q=0.9,pt;q=0.8` → English
- `pt-BR,pt;q=0.9,en;q=0.8` → Portuguese
- No header or other languages → English (fallback)

## Workflow

### 1. Add translatable messages

Add `i18n._()` calls to your error messages in:

- `libs/graphql/src` - GraphQL resolvers
- `libs/business-logic/src` - Business logic functions
- `apps/backend/src` - Backend-specific code

### 2. Extract messages

```bash
pnpm i18n:extract
```

This will scan all specified directories and generate `.po` files in `libs/locales/src/messages/{locale}/messages.po`.

### 3. Translate messages

Edit the generated `.po` files to add translations:

**English (`libs/locales/src/messages/en/messages.po`):**

```po
msgid "User not found"
msgstr "User not found"
```

**Portuguese (`libs/locales/src/messages/pt/messages.po`):**

```po
msgid "User not found"
msgstr "Usuário não encontrado"
```

### 4. Compile translations

```bash
pnpm i18n:compile
```

This compiles the `.po` files into `.mjs` files that can be loaded by the application.

## Configuration

The system is configured in `lingui.config.js`:

```javascript
{
  path: 'libs/locales/src/messages/{locale}/messages',
  include: [
    'libs/graphql/src',
    'libs/business-logic/src',
    'apps/backend/src',
    'libs/locales/src'
  ],
}
```

## Integration

The GraphQL handler automatically:

1. Extracts the `accept-language` header from requests
2. Determines the preferred locale
3. Initializes the translation system for that locale
4. Passes the locale to the GraphQL context

## Example

```typescript
// Before
throw notFound("User not found");

// After
import { i18n } from "@/locales";
throw notFound(i18n._("User not found"));
```

## Testing

You can test the translation system by running:

```bash
cd libs/locales/src
node test-translation.ts
```

This will show how messages are translated in different locales.
