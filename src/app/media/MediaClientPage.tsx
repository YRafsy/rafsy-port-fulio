
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Image as ImageIcon, Video, FileText, Code2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PostMeta } from '@/lib/blog';
import type { MediaItem } from '@/lib/media';
import { MediaCard } from '@/components/shared/MediaCard';
import ImageGenerator from '@/components/sections/ImageGenerator';
import VideoGenerator from '@/components/sections/VideoGenerator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MediaClientPageProps {
  media: MediaItem[];
  reports: PostMeta[];
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

const filterCategories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'photo', label: 'AI Art & Photos', icon: Bot },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'report', label: 'Reports', icon: FileText },
];

export default function MediaClientPage({ media, reports }: MediaClientPageProps) {

  const [activeTab, setActiveTab] = useState('gallery');
  const [activeFilter, setActiveFilter] = useState('all');
  const [imageGeneratorPrompt, setImageGeneratorPrompt] = useState('');

  const handleUsePrompt = (prompt: string) => {
    setImageGeneratorPrompt(prompt);
    setActiveTab('ai-generator');
  };
  
  const allMediaItems = useMemo(() => [
      ...media, 
      ...reports.map(r => ({ type: 'report' as const, ...r }))
  ], [media, reports]);

  const filteredMedia = useMemo(() => {
    if (activeFilter === 'all') return allMediaItems;
    return allMediaItems.filter(item => item.type === activeFilter);
  }, [allMediaItems, activeFilter]);

  return (
    <section id="media-gallery" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
           <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl">Creative Nexus</h1>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
            A collection of creative work, interactive reports, and AI generation tools.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-10">
            <TabsTrigger value="gallery"><ImageIcon className="mr-2 h-4 w-4" />Gallery</TabsTrigger>
            <TabsTrigger value="ai-generator">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generator
            </TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="gallery">
                 <div className="flex justify-center flex-wrap gap-2 mb-10">
                    {filterCategories.map(({ id, label, icon: Icon }) => (
                        <Button key={id} variant={activeFilter === id ? 'default' : 'outline'} onClick={() => setActiveFilter(id)}>
                            <Icon className="mr-2 h-4 w-4" />
                            {label}
                        </Button>
                    ))}
                </div>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredMedia.map((item) => (
                    <motion.div key={item.slug || item.title} variants={itemVariants}>
                      <MediaCard item={item} onUsePrompt={handleUsePrompt}/>
                    </motion.div>
                  ))}
                </motion.div>
                 {filteredMedia.length === 0 && (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No items found for this category.</p>
                    </div>
                )}
              </TabsContent>

               <TabsContent value="ai-generator" forceMount={activeTab === 'ai-generator'}>
                <Tabs defaultValue="image-gen" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-10">
                        <TabsTrigger value="image-gen"><ImageIcon className="mr-2 h-4 w-4" />Image Generator</TabsTrigger>
                        <TabsTrigger value="video-gen"><Video className="mr-2 h-4 w-4" />Video Generator</TabsTrigger>
                    </TabsList>
                    <TabsContent value="image-gen">
                        <ImageGenerator initialPrompt={imageGeneratorPrompt} />
                    </TabsContent>
                    <TabsContent value="video-gen">
                        <VideoGenerator />
                    </TabsContent>
                </Tabs>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </section>
  );
}
