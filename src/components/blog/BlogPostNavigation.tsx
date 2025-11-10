
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface NavPost {
  slug: string;
  title: string;
}

interface BlogPostNavigationProps {
  previousPost: NavPost | null;
  nextPost: NavPost | null;
}

const MemoizedCard = React.memo(({ post, isNext }: { post: NavPost, isNext: boolean }) => (
    <Link href={`/blog/${post.slug}`} className="group block">
        <Card className="h-full hover:border-primary/50 transition-colors">
            <CardContent className={`p-6 ${isNext ? 'text-right' : ''}`}>
                 <div className={`flex items-center gap-2 text-sm text-muted-foreground mb-2 ${isNext ? 'justify-end' : ''}`}>
                    {!isNext && <ArrowLeft className="h-4 w-4" />}
                    {isNext ? 'Next Post' : 'Previous Post'}
                    {isNext && <ArrowRight className="h-4 w-4" />}
                </div>
                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{post.title}</h4>
            </CardContent>
        </Card>
    </Link>
));
MemoizedCard.displayName = 'MemoizedCard';

export function BlogPostNavigation({ previousPost, nextPost }: BlogPostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previousPost ? <MemoizedCard post={previousPost} isNext={false} /> : <div />}
            {nextPost ? <MemoizedCard post={nextPost} isNext={true} /> : <div />}
        </div>
    </div>
  );
}
