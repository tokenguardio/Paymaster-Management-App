/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/base.js'],

  // Override/add React-specific settings
  env: {
    browser: true, // Add browser globals
    es2020: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // Add React-specific plugins
  plugins: ['react-hooks', 'react-refresh'],

  // Add React-specific rules
  rules: {
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // React Refresh (for Vite HMR)
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    // Override base rule for React patterns
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(_|[A-Z_])', // Allow React component constants
      },
    ],

    '@typescript-eslint/explicit-function-return-type': 'off', // React components often infer return types
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Disable explicit return types for React components
  },

  // Frontend-specific ignore patterns
  ignorePatterns: ['*.js', 'dist/', 'coverage/', 'node_modules/', 'build/', '.next/', 'public/'],
};
