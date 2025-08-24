import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import playwright from 'eslint-plugin-playwright'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unicorn from 'eslint-plugin-unicorn'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'apps/frontend/dist', 'apps/backend/dist', '**/*.generated.ts', 'apps/frontend/src/locales', '**/messages.mjs', '**/locales/*/messages.mjs'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      playwright,
      import: importPlugin,
      unicorn
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      ...playwright.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      ...unicorn.configs.recommended.rules,
      // Customize unicorn rules for React/TypeScript codebase
      'unicorn/filename-case': 'off', // Allow PascalCase for React components
      'unicorn/prefer-module': 'off', // Allow CommonJS in some contexts
      'unicorn/prefer-node-protocol': 'off', // Allow both node: and regular imports
      'unicorn/prevent-abbreviations': 'off', // Too strict for React component names
      'unicorn/no-array-reduce': 'off', // Array.reduce is often the best solution
      'unicorn/no-array-callback-reference': 'off', // Function references are fine
      'unicorn/prefer-array-some': 'off', // .find() vs .some() is often preference
      'unicorn/prefer-add-event-listener': 'off', // onerror/onmessage are fine for workers
      'unicorn/consistent-function-scoping': 'off', // Arrow functions in components are fine
      'unicorn/no-useless-switch-case': 'off', // Sometimes needed for clarity
      'unicorn/prefer-spread': 'off', // concat() vs spread is preference
      'unicorn/no-null': 'off', // null vs undefined is often preference in TypeScript
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error'
    }
  }
)
