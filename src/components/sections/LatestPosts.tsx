
import { getPostsMeta } from '@/lib/blog';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import TiltCard from '../shared/TiltCard';

export default async function LatestPosts() {
  const { posts } = await getPostsMeta();
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">Latest Posts & Reports</h2>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
            My recent thoughts on AI, web development, and interactive technical deep-dives.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <TiltCard>
                <Card className="h-full overflow-hidden bg-card/80 backdrop-blur-sm group-hover:border-primary/50 transition-colors duration-300 flex flex-col">
                  <div className="aspect-video relative overflow-hidden">
                    <Image 
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {post.isHtml && (
                        <Badge variant="default" className="absolute top-2 right-2 animate-pulse-glow">Interactive</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold font-headline">{post.title}</CardTitle>
                    <CardDescription>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <p className="text-muted-foreground mb-4 flex-grow">{post.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant='secondary'>{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
                <Link href="/blog">
                    Read All Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
