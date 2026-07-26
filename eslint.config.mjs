import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

/**
 * ESLint 9 flat config for Next 15.
 *
 * `next/core-web-vitals` carries the React Hooks and Next-specific rules;
 * `next/typescript` layers on the TS plugin. Both ship with eslint-config-next
 * and are bridged through FlatCompat because they are still eslintrc-shaped.
 */
const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'next-env.d.ts', 'public/**'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The seed stores and JSONB attribute editors legitimately carry loosely
      // typed payloads; flag them as warnings so they surface without failing
      // the build on pre-existing code.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
];

export default eslintConfig;
