
import { getPostBySlug, getPostsMeta } from '@/lib/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostNavigation } from '@/components/blog/BlogPostNavigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReportViewer from '@/components/shared/ReportViewer';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post not found',
    };
  }

  const pageTitle = post.isHtml ? `${post.title} | Interactive Report` : `${post.title} | Rafsy's Blog`;

  return {
    title: pageTitle,
    description: post.description,
    keywords: post.tags.join(', '),
    openGraph: {
        title: post.title,
        description: post.description,
        type: 'article',
        publishedTime: post.date,
        images: [
            {
                url: post.image,
                width: 1200,
                height: 630,
                alt: post.title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
        images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const { posts } = await getPostsMeta();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  if (post.isHtml) {
     return (
        <div className="h-[calc(100vh-theme(spacing.16))] w-full flex flex-col bg-background">
          <ReportViewer file={`${post.slug}.html`} title={post.title} />
        </div>
    )
  }

  // Otherwise, render as a standard markdown post
  return (
    <article className="container mx-auto px-4 md:px-6 max-w-3xl py-16 md:py-24">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Posts
        </Link>
      </Button>
      <BlogPostHeader title={post.title} date={post.date} tags={post.tags} />
      
      {post.image && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 border">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="blog post header"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}
      
      <div className="prose dark:prose-invert max-w-none">
        <MarkdownRenderer content={post.content} />
      </div>

      <BlogPostNavigation previousPost={post.previousPost} nextPost={post.nextPost} />
    </article>
  );
}
