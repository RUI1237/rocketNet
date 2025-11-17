import globals from "globals";
import { defineConfig } from "eslint/config";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
export default defineConfig([
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: typescriptParser,
    },
  },
]);
