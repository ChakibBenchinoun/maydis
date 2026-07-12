/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  // Order matters: Tailwind plugin must be last
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  // —— Import order ——
  // Path groups keep type + value imports from the same module family together.
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "5.0.0",
  // —— Tailwind v4 class order ——
  tailwindStylesheet: "./src/styles/tailwind.css",
  tailwindFunctions: ["cn", "clsx", "cva"],
};

export default config;
