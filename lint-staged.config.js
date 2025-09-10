module.exports = {
  '*.{js,jsx,md,html,css,json,yaml,yml}': 'prettier -w',
  '*.{ts,tsx}': ['prettier -w', 'eslint_d --fix'],
  'schema.prisma': 'prettier -w',
};
