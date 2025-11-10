
'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface BlogPostHeaderProps {
  title: string;
  date: string;
  tags: string[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
};

export function BlogPostHeader({ title, date, tags }: BlogPostHeaderProps) {
  return (
    <motion.header 
        className="mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.h1 
        className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
        variants={itemVariants}
      >
        {title}
      </motion.h1>
      <motion.div 
        className="text-muted-foreground mb-4"
        variants={itemVariants}
      >
        <time dateTime={date}>
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </motion.div>
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={itemVariants}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </motion.div>
    </motion.header>
  );
}
