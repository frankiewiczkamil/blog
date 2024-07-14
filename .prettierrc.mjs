/** @type {import("prettier").Config} */
export default {
    printWidth: 160,
    singleQuote: true,
    arrowParens: 'avoid',
    plugins: ['prettier-plugin-astro'],
    overrides: [
        {
            files: '*.astro',
            options: {
                parser: 'astro',
            },
        },
    ],
};
