module.exports = {
  printWidth: 120,
  singleQuote: true,
  arrowParens: 'avoid',
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
