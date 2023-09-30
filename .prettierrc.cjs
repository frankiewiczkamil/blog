module.exports = {
    printWidth: 160,
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
