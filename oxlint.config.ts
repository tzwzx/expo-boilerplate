import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react],
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "eslint/no-use-before-define": [
          "error",
          {
            functions: false,
            variables: false,
          },
        ],
        "react_perf/jsx-no-new-function-as-prop": "off",
      },
    },
  ],
  rules: {
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
  },
});
