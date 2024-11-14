module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "react-app",
    "react-app/jest",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".js", ".json"],
      },
    },
    react: {
      version: "detect",
    },
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "no-restricted-exports": "off",
    "react/jsx-props-no-spreading": "off",
    "react/require-default-props": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "testing-library/no-container": "off",
    "testing-library/no-node-access": "off",
  },
};
