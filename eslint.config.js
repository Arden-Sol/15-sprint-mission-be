import js from '@eslint/js';

export default [
  js.config.reccomended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      global: {
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
