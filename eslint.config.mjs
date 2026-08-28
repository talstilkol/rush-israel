import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

/** Flat ESLint config for the TanStack Start app-builder template. */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".output/**",
      ".vercel/**",
      ".nitro/**",
      "node_modules/**",
      "src/routeTree.gen.ts",
      // Vendored Khronos/Emscripten output. It is covered by provenance and
      // integrity checks, not rewritten to satisfy application-source lint.
      "public/basis/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // Narrow pre-existing legacy exceptions. They remain visible in
    // LINT-BASELINE.md and are not global rule suppressions.
    files: ["src/game/roadShader.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
  {
    files: ["src/game/spline.ts"],
    rules: {
      "prefer-const": "off",
    },
  },
  {
    files: ["src/game/world.ts"],
    rules: {
      "no-var": "off",
    },
  },
  // Disable rules that conflict with Prettier formatting.
  prettier,
);
