import type { MarkdownInstance } from "astro";

type DateInfo = { editedAt?: string, publishedAt?: string }
type Post = MarkdownInstance<Record<string, any>>;

const selectJoiner = ({ publishedAt }: DateInfo): string => publishedAt ? ', ' : '';

const selectEditedAtText = (frontmatter: DateInfo): string =>
    frontmatter.editedAt ?
        `${selectJoiner(frontmatter)}edited ${frontmatter.editedAt.slice(0, 10)}`
        : '';

const selectPublishedAtText = ({ publishedAt }: DateInfo): string => publishedAt?.slice(0, 10) || '';

export const selectPostDate = (frontmatter: DateInfo): string =>
    selectPublishedAtText(frontmatter) + selectEditedAtText(frontmatter);

export const selectPublishedAtTimestamp = (post: Post) => new Date(post.frontmatter.publishedAt).getTime();

export const isNotDraft = (post: Post) => !post.frontmatter.draft;

export const sortByPublishedAtDesc = (p1: Post, p2: Post) => selectPublishedAtTimestamp(p2) - selectPublishedAtTimestamp(p1);  