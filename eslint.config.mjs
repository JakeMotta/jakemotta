import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";
import prettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [

  // Include recommended configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier,  // This disables ESLint rules that might conflict with Prettier

    // Base configuration
    {
      files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
      languageOptions: {
        globals: globals.browser
      },
      ignores: [
        "projects/",
        'node_modules/',
        '**/*.test.{ts,tsx}',
        '**/test/**',
      ],
      plugins: {
        prettier: pluginPrettier
      },
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        "no-unused-vars": "warn",
        "no-undef": "warn",
        "prettier/prettier": "error",  // Enforce prettier formatting
        "react/react-in-jsx-scope": "off",  // Disable requiring React import for JSX
      }
    },
];