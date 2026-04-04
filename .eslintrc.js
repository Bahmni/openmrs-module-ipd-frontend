/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) 2026 CURE International.
 */


module.exports = {
  root: true,
  ignorePatterns: [
    "node_modules/*",
    "dist/*",
    ".storybook/*",
    "__mocks__/*",
    "*.config.js",
    ".*",
    "**/__mocks__/*",
    "src/setupTests.js",
  ],
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {},
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.spec.js", "*.spec.jsx"],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended"],
      rules: {},
    },
  ],
};
