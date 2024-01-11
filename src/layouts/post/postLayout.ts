import type { CollectionEntry } from 'astro:content';

type PostData = Post['data'];
type Post = CollectionEntry<'blog' | 'blog_pl'>;
const selectJoiner = ({ publishedAt }: PostData): string => (publishedAt ? ', ' : '');

const selectEditedAtText = (frontmatter: PostData): string =>
  frontmatter.editedAt ? `${selectJoiner(frontmatter)}edited ${frontmatter.editedAt.toLocaleDateString()}` : '';

const selectPublishedAtText = ({ publishedAt }: PostData): string => publishedAt?.toLocaleDateString() || '';

export const selectPostDate = (frontmatter: PostData): string => selectPublishedAtText(frontmatter) + selectEditedAtText(frontmatter);

export const selectPublishedAtTimestamp = (post: Post) => new Date(post.data.publishedAt).getTime();

export const isNotDraft = (post: Post) => !post.data.draft;

export const sortByPublishedAtDesc = (p1: Post, p2: Post) => selectPublishedAtTimestamp(p2) - selectPublishedAtTimestamp(p1);
