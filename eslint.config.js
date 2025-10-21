import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import playwright from 'eslint-plugin-playwright'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

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
      import: importPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
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
  },
  // Configuration for backend and e2e tests - disable React rules
  {
    files: ['apps/backend/**/*.{ts,tsx}', 'tests/e2e/**/*.{ts,tsx}'],
    rules: {
      // Disable all React-related rules for backend and e2e tests
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react/jsx-no-undef': 'off',
      'react/jsx-no-unused-vars': 'off',
      'react/jsx-key': 'off',
      'react/jsx-no-duplicate-props': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-no-comment-textnodes': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-literals': 'off',
      'react/jsx-pascal-case': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-wrap-multilines': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'react/jsx-closing-tag-location': 'off',
      'react/jsx-curly-spacing': 'off',
      'react/jsx-equals-spacing': 'off',
      'react/jsx-first-prop-new-line': 'off',
      'react/jsx-indent': 'off',
      'react/jsx-indent-props': 'off',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-no-multi-spaces': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-multi-spaces': 'off',
      'react/jsx-sort-default-props': 'off',
      'react/jsx-tag-spacing': 'off',
      'react/jsx-boolean-value': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react/jsx-fragments': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      'react/jsx-no-script-url': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/jsx-pascal-case': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react/no-array-index-key': 'off',
      'react/no-children-prop': 'off',
      'react/no-danger': 'off',
      'react/no-danger-with-children': 'off',
      'react/no-deprecated': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/no-find-dom-node': 'off',
      'react/no-is-mounted': 'off',
      'react/no-render-return-value': 'off',
      'react/no-string-refs': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
      'react/no-unsafe': 'off',
      'react/prefer-es6-class': 'off',
      'react/prefer-stateless-function': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'off',
      'react/self-closing-comp': 'off',
      'react/sort-comp': 'off',
      'react/sort-prop-types': 'off',
      'react/style-prop-object': 'off',
      'react/void-dom-elements-no-children': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-leaked-render': 'off',
      'react/jsx-no-new-object-as-prop': 'off',
      'react/jsx-no-script-url': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-no-undef': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/jsx-pascal-case': 'off',
      'react/jsx-props-no-multi-spaces': 'off',
      'react/jsx-sort-default-props': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-tag-spacing': 'off',
      'react/jsx-wrap-multilines': 'off',
      // Disable React Hooks rules
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      // Disable React Refresh rules
      'react-refresh/only-export-components': 'off'
    }
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'playwright/no-standalone-expect': 'off'
    }
  }
)
