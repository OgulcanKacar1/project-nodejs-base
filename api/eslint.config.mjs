import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node  // browser yerine node globals
      }
    },
    rules: {
      "no-shadow": "error",
      "no-unused-vars": "off",
      "no-empty": "warn"
    }
  }
];