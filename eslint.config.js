import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';

export default tseslint.config(
  {
    ignores: [
      '**/dear_petition/',
      '**/node_modules/',
      '**/build/',
      '**/vite.config.js',
      '**/tailwind.config.js',
      '**/staticfiles/',
      '**/htmlcov/',
      '**/index.html',
      '**/dist/',
    ],
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.eslintRecommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettier,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

    // eslint-plugin-react
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      // Disabled default rules
      'no-plusplus': 'off',
      'no-continue': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/destructuring-assignment': 'off',
      'react/prop-types': 'off',

      // customized rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.ts'] }],
      'import/no-unresolved': [
        'error',
        {
          ignore: ['typescript-eslint'],
        },
      ],

      // custom rules to remove
      'react/no-unknown-property': ['error', { ignore: ['initial', 'animate', 'exit'] }], // TODO: Replace framer-motion with css animate
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }], // not sure about this one
      'no-use-before-define': [
        'error',
        {
          functions: false,
          variables: false,
        },
      ],
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['state'],
        },
      ], // might be needed
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],

    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
  },
);
