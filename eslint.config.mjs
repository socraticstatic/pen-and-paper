import nextCwv from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  // Next.js core-web-vitals: includes next, next/typescript, core-web-vitals rules,
  // and the jsx-a11y plugin registration.
  ...nextCwv,

  // eslint-config-next sets its Babel parser globally on **/*.{js,jsx,mjs,...}.
  // That parser's scope manager predates ESLint 10 and lacks addGlobals(), which
  // ESLint 10 calls in source-code.js — crashing on any .mjs/.js file outside src/.
  // Override to @typescript-eslint/parser for root tooling files; it handles plain
  // JS/MJS and returns a fully ESLint-10-compatible scope manager.
  {
    files: ['*.mjs', '*.cjs', '*.js', '*.d.ts'],
    languageOptions: {
      parser: tsParser,
    },
  },

  // Spread the full jsx-a11y/recommended rule set without re-registering the plugin
  // (nextCwv already registers jsx-a11y; nextCwv only enables 6 rules, not the full set).
  {
    rules: jsxA11y.flatConfigs.recommended.rules,
  },

  // Prettier disables conflicting style rules — must be last before overrides.
  prettier,

  // Project-specific overrides — TypeScript rules (TS files only)
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // Project-specific overrides — JSX a11y (TSX/JSX only)
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      'jsx-a11y/label-has-associated-control': 'error',
    },
  },

  // eslint-plugin-react@7.x uses context.getFilename() which was removed in ESLint 10.
  // All rules that call testReactVersion() or use Components() crash at runtime.
  // Disabled until eslint-plugin-react@8 ships ESLint 10 support.
  // TODO(eslint-10): re-enable when eslint-plugin-react@8 ships ESLint 10 support.
  // Three of these (display-name, no-deprecated, no-unsafe) apply to functional
  // components too — we'll miss some coverage until re-enabled. The others are
  // class-component-only and irrelevant to App Router.
  {
    rules: {
      'react/display-name': 'off',
      'react/no-deprecated': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/no-render-return-value': 'off',
      'react/no-string-refs': 'off',
      'react/no-unsafe': 'off',
      'react/require-render-return': 'off',
    },
  },

  // Global ignores
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'src/payload-types.ts',
    ],
  },
];

export default config;
