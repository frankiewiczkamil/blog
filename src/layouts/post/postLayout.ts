import type { CollectionEntry } from 'astro:content';

export type PostData = Post['data'];
export type Post = CollectionEntry<'blog' | 'blog_pl'>;

export function selectPostDate({ publishedAt, editedAt }: PostData, locale?: Intl.LocalesArgument) {
  const publishedText = publishedAt?.toLocaleDateString(locale) || '';
  const separator = publishedAt ? ', ' : '';
  const editedText = editedAt ? `edited ${editedAt.toLocaleDateString(locale)}` : '';
  return publishedText + separator + editedText;
}

export const selectPublishedAtTimestamp = (post: Post) => new Date(post.data.publishedAt).getTime();

export const isNotDraft = (post: Post) => !post.data.draft;

export const sortByPublishedAtDesc = (p1: Post, p2: Post) => selectPublishedAtTimestamp(p2) - selectPublishedAtTimestamp(p1);
