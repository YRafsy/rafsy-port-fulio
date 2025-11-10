
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { CodeBlock } from '@/components/shared/CodeBlock';
import TiltCard from './TiltCard';
import { type LucideIcon, Sparkles, Code2, ImageIcon, PlayCircle, ZoomIn, FileText, Send } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { MediaItem } from '@/lib/media';
import type { PostMeta } from '@/lib/blog';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface MediaCardProps {
  item: MediaItem | ({ type: 'report' } & PostMeta);
  onUsePrompt?: (prompt: string) => void;
}

const imageVariants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { zIndex: 1, opacity: 1, scale: 1 },
  exit: { zIndex: 0, opacity: 0, scale: 1.05 },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    exit: {
        y: -20,
        opacity: 0,
        transition: { duration: 0.2 },
    },
};

const iconMap: { [key: string]: LucideIcon } = {
  bot: Sparkles,
  code2: Code2,
  image: ImageIcon,
  playCircle: PlayCircle,
  report: FileText,
  photo: Sparkles,
  code: Code2,
  video: PlayCircle,
};

const ImageRotator = React.memo(function ImageRotator({ sources, title, dataAiHint }: { sources: string[], title: string, dataAiHint?: string }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovering) {
        intervalRef.current = setInterval(() => {
            setIndex(prev => (prev + 1) % sources.length);
        }, 1500); // Slower, more controlled rotation
    } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setIndex(0); // Reset to first image on mouse leave
    }
    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, sources.length]);


  return (
      <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ opacity: { duration: 0.5 } }} // Gentle cross-fade
              className="absolute inset-0"
            >
              <Image
                src={sources[index]}
                alt={`${title} - image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={dataAiHint}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>
      </div>
  );
});
ImageRotator.displayName = 'ImageRotator';

const MediaCardComponent = ({ item, onUsePrompt }: MediaCardProps) => {
    const getIcon = React.useCallback(() => {
        const iconKey = 'icon' in item ? item.icon : item.type;
        return iconMap[iconKey as string] || ImageIcon;
    }, [item]);
    const Icon = getIcon();

    const handleUsePrompt = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if(onUsePrompt && 'prompt' in item && item.prompt) {
            onUsePrompt(item.prompt);
        }
    }
    
    const CardInnerContent = React.memo(() => {
        const defaultClass = "object-cover transition-transform duration-500 group-hover:scale-105";
        const defaultSizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw";

        if (item.type === 'code') {
          return (
             <motion.div variants={itemVariants} className="h-full">
                <Card className="h-full overflow-hidden bg-card/80 backdrop-blur-sm group flex flex-col hover:border-primary/50 transition-colors duration-300">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                            <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                        </div>
                        <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <div className="flex-1">
                            <CodeBlock code={item.code} className="h-full text-xs" />
                        </div>
                        <div className="h-48 border rounded-lg overflow-hidden">
                            <iframe src={item.mockupUrl} title={`${item.title} Mockup`} className="w-full h-full" frameBorder="0" loading="lazy" />
                        </div>
                    </CardContent>
                </Card>
             </motion.div>
          )
        }

        const imageUrl = ('image' in item && item.image) ? item.image : ('source' in item && item.source) ? (Array.isArray(item.source) ? item.source[0] : item.source) : '';

        const mediaContent = (
            <div className="relative aspect-square">
                {item.type === 'photo' && Array.isArray(item.source) ? (
                    <ImageRotator sources={item.source} title={item.title} data-ai-hint={item.dataAiHint} />
                ) : (
                    imageUrl && <Image src={imageUrl} alt={item.title} fill className={defaultClass} data-ai-hint={item.dataAiHint} sizes={defaultSizes} />
                )}
                 {(item.type === 'video' || item.type === 'report') && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {item.type === 'video' ? <PlayCircle className="h-16 w-16 text-white" /> : <FileText className="h-12 w-12 text-white" />}
                    </div>
                )}
                {item.type === 'photo' && item.isZoomable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                       <ZoomIn className="h-12 w-12 text-white/80" />
                    </div>
                )}
            </div>
        )
        
        const mediaZoomableContent = (item.type === 'photo' && item.isZoomable) ? (
            <Dialog>
                <DialogTrigger asChild><div className="h-full w-full cursor-zoom-in">{mediaContent}</div></DialogTrigger>
                <DialogContent className="max-w-5xl w-full bg-transparent border-0 p-0 shadow-2xl flex items-center justify-center flex-col">
                    <Carousel className="w-full">
                        <CarouselContent>
                            {(Array.isArray(item.source) ? item.source : [item.source]).map((src, index) => (
                                <CarouselItem key={index}>
                                    <div className="aspect-square relative">
                                        <Image src={src as string} alt={`${item.title} - view ${index + 1}`} fill className="object-contain" sizes="90vw" />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-2 text-white bg-black/20 hover:bg-black/40 hover:text-white" />
                        <CarouselNext className="absolute right-2 text-white bg-black/20 hover:bg-black/40 hover:text-white" />
                    </Carousel>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" className="mt-4">
                        Close
                      </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        ) : mediaContent;
        
        return (
            <motion.div variants={itemVariants} className="h-full">
                <Card className="h-full overflow-hidden bg-card/80 backdrop-blur-sm group flex flex-col hover:border-primary/50 transition-colors duration-300">
                    {mediaZoomableContent}
                    <div className="flex flex-col flex-grow p-6">
                        <CardHeader className="p-0 mb-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                            </div>
                            {'description' in item && <CardDescription>{item.description}</CardDescription>}
                        </CardHeader>
                        <CardContent className="p-0 mt-auto">
                            {'prompt' in item && item.prompt && (
                                <div className="space-y-3">
                                    <p className="text-xs text-muted-foreground font-mono uppercase">Prompt</p>
                                    <p className="text-sm font-mono bg-muted/50 p-3 rounded-md">"{item.prompt}"</p>
                                    {onUsePrompt && (
                                        <Button variant="outline" size="sm" className="w-full" onClick={handleUsePrompt}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Use this prompt
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </div>
                </Card>
            </motion.div>
        );
    });
    CardInnerContent.displayName = 'CardInnerContent';

    const CardWrapper = React.memo(() => {
        if (item.type === 'report' && 'slug' in item) {
            return <Link href={`/blog/${item.slug}`} className="block group h-full"><CardInnerContent /></Link>
        }
        if (item.type === 'video' && 'embedUrl' in item) {
            return (
                <Dialog>
                    <DialogTrigger asChild><div className="h-full cursor-pointer"><CardInnerContent /></div></DialogTrigger>
                    <DialogContent className="max-w-3xl p-0">
                        <div className="aspect-video">
                            <iframe src={item.embedUrl} title={item.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                        </div>
                    </DialogContent>
                </Dialog>
            );
        }
        return <div className="h-full"><CardInnerContent /></div>
    });
    CardWrapper.displayName = 'CardWrapper';

    return (
        <TiltCard className="h-full">
           <CardWrapper />
        </TiltCard>
    );
};

export const MediaCard = React.memo(MediaCardComponent);
MediaCard.displayName = 'MediaCard';
