
'use client';
import Link from 'next/link';
import { type PostMeta } from '@/lib/blog';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TiltCard from '@/components/shared/TiltCard';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useMemo, memo } from 'react';
import { Button } from '@/components/ui/button';

interface BlogClientPageProps {
  posts: PostMeta[];
  allTags: string[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.2 } },
};

const TagList = memo(function TagList({ tags, selectedTag, onSelectTag }: { tags: string[], selectedTag: string, onSelectTag: (tag: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      <Button
        variant={selectedTag === 'All' ? 'default' : 'outline'}
        onClick={() => onSelectTag('All')}
      >
        All
      </Button>
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          onClick={() => onSelectTag(tag)}
        >
          {tag}
        </Button>
      ))}
    </div>
  );
});

export default function BlogClientPage({ posts, allTags }: BlogClientPageProps) {
  const [selectedTag, setSelectedTag] = useState('All');

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') {
      return posts;
    }
    return posts.filter(post => post.tags && post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  return (
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl">Blog & Reports</h1>
            <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl/relaxed">
              Thoughts, tutorials, and interactive technical deep-dives.
            </p>
          </motion.div>
          
          <TagList tags={allTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

          <motion.div
            layout
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  layout
                  key={post.slug}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full group">
                    <TiltCard className="h-full">
                      <Card className="h-full overflow-hidden bg-card/80 backdrop-blur-sm group-hover:border-primary/50 transition-colors duration-300 flex flex-col">
                        <div className="aspect-video relative overflow-hidden">
                          <Image 
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            data-ai-hint="blog abstract"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                           {post.isHtml && (
                                <Badge variant="default" className="absolute top-2 right-2 animate-pulse-glow">Interactive</Badge>
                            )}
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl font-bold font-headline">{post.title}</CardTitle>
                          {post.date && <CardDescription>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>}
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                          <p className="text-muted-foreground mb-4 flex-grow">{post.description}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant={selectedTag === tag ? 'default' : 'secondary'}>{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
  );
}
