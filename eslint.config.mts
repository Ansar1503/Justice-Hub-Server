import { FlatCompat } from "@eslint/eslintrc";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
    ...compat.extends("plugin:@typescript-eslint/recommended"),

    {
        files: ["**/*.ts", "**/*.mts", "**/*.cts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
        },
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 4],
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
]);
