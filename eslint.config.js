/* import globals from 'globals';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from "eslint-config-prettier"; */

//https://eslint.org/docs/latest/use/configure/configuration-files
//https://typescript-eslint.io/getting-started/typed-linting/
//https://github.com/prettier/eslint-config-prettier#installation

const prettierRules = {
  'arrow-body-style': 'off',
  'prefer-arrow-callback': 'off',
};
/*
 export default [
  { */
      //files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
/*     languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-console': 'warn',
      ...prettierRules,
    },
  },
  eslintConfigPrettier
]; */

// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigDirName: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,  
      },
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules, 
      ...tseslint.configs.recommended.rules, 
      ...reactPlugin.configs.recommended.rules, 
      'react/react-in-jsx-scope': 'off',  
      '@typescript-eslint/no-unused-vars': 'warn', 
      'prefer-const': 'error',  
      'no-console': 'warn', 
      'no-undef': 'off',
      ...prettierRules,  
    },
  },
  eslintConfigPrettier,
  {
    ...tseslint.configs.disableTypeChecked,
  },
);