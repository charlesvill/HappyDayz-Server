import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
]);
