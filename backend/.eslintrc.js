module.exports = {
  env: {
    node: true,
    es2021: true,
    mocha: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'arrow-spacing': 'error',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': ['error', 'always'],
  },
};
