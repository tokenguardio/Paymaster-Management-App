/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-prisma'],
  proseWrap: 'always',
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      options: {
        proseWrap: 'preserve',
      },
    },
  ],
};
