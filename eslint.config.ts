import tseslint from "typescript-eslint";
import globals from "globals";
import path from "path";
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "eslint.config.ts",
      "vite.config.ts",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: path.resolve(__dirname),
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  }
);
