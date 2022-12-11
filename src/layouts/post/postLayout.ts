type DateInfo = { editedAt?: string, publishedAt?: string }

const selectJoiner = ({ publishedAt }: DateInfo): string => publishedAt ? ', ' : '';

const selectEditedAtText = (frontmatter: DateInfo): string =>
    frontmatter.editedAt ?
        `${selectJoiner(frontmatter)}edited ${frontmatter.editedAt.slice(0, 10)}`
        : '';

const selectPublishedAtText = ({ publishedAt }: DateInfo): string => publishedAt?.slice(0, 10) || '';

export const selectPostDate = (frontmatter: DateInfo): string =>
    selectPublishedAtText(frontmatter) + selectEditedAtText(frontmatter);