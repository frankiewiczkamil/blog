import type { CollectionEntry } from 'astro:content';
import { isNotDraft, selectPublishedAtTimestamp } from './layouts/post/postLayout.ts';

export function toComponentFormat(posts: CollectionEntry<'blog' | 'blog_pl'>[]) {
  return posts.filter(isNotDraft).sort((p1, p2) => selectPublishedAtTimestamp(p2) - selectPublishedAtTimestamp(p1));
}
