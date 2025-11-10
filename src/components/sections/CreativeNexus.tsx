
'use client';

import { motion } from 'framer-motion';
import { MediaCard } from '@/components/shared/MediaCard';
import { getMedia } from '@/lib/media';
import { useEffect, useState } from 'react';
import type { MediaItem } from '@/lib/media';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      }
    },
};

export default function CreativeNexus() {
    const [showcaseItems, setShowcaseItems] = useState<MediaItem[]>([]);

    useEffect(() => {
        const fetchMedia = async () => {
            const allMedia = await getMedia();
            // Select items that have an icon defined for a curated showcase
            const selectedItems = allMedia.filter(m => m.icon).slice(0, 3);
            setShowcaseItems(selectedItems);
        };

        fetchMedia();
    }, []);


  return (
    <section id="showcase" className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">Creative Nexus</h2>
                <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
                    A preview of my creative work, from AI art to interactive code.
                </p>
            </motion.div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {showcaseItems.map((item) => (
                    <motion.div key={item.slug || item.title} variants={itemVariants}>
                        <MediaCard item={item} />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild variant="outline" size="lg">
                <Link href="/media">
                  Explore Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
        </div>
    </section>
  );
}
