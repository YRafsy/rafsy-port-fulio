
import { getPostsMeta } from '@/lib/blog';
import BlogClientPage from './BlogClientPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog & Reports | Rafsy's Portfolio",
  description: "A collection of technical articles, in-depth reports, and thoughts on AI, web development, and engineering by Yasar T. H. Rafsy.",
};

export default async function BlogPage() {
  const { posts, allTags } = await getPostsMeta();

  return <BlogClientPage posts={posts} allTags={allTags} />;
}
