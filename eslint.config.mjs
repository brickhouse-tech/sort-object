import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "comma-dangle": ["error", "always-multiline"],
    },
  },
  {
    ignores: [
      "node_modules/**",
      "lib/**",
      "dist/**",
      "tmp/**",
      "*.js",
      "*.cjs",
      "*.mjs",
    ],
  },
);
