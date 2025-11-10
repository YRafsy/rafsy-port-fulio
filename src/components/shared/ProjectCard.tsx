
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TiltCard from '@/components/shared/TiltCard';
import { Bot, ArrowUpRight } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/projects';
import ProjectChatModal from './ProjectChatModal';
import Link from 'next/link';

type ProjectCardProps = {
  project: Project;
};

// This wrapper component centralizes the decision of whether the card is a link
// or a dialog trigger.
const CardWrapper = React.memo(({ project }: { project: Project }) => {
    const isWorkInProgress = project.status === 'in-progress';
    const hasLiveUrl = project.liveUrl && project.liveUrl !== '#';
    
    // Apply hover scale effect to all cards for visual consistency
    const cardContent = (
      <Card className={cn(
          "h-full overflow-hidden bg-card/80 backdrop-blur-sm group flex flex-col transition-colors duration-300",
          !isWorkInProgress && "hover:border-primary/50",
          isWorkInProgress && "cursor-not-allowed"
      )}>
          <div className="aspect-video relative overflow-hidden">
              <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className={cn(
                      "object-cover transition-transform duration-500",
                      !isWorkInProgress && "group-hover:scale-105",
                      isWorkInProgress && "grayscale"
                  )}
                  data-ai-hint={project.dataAiHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {project.status === 'in-progress' && (
                  <Badge variant="secondary" className="absolute top-2 right-2">Coming Soon</Badge>
              )}
              {project.status === 'featured' && (
                  <Badge variant="default" className="absolute top-2 left-2 animate-pulse-glow">Featured</Badge>
              )}
              {!isWorkInProgress && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      {hasLiveUrl ? (
                          <ArrowUpRight className="h-12 w-12 text-white" />
                      ) : (
                          <Bot className="h-12 w-12 text-white" />
                      )}
                  </div>
              )}
          </div>
          <div className="flex flex-col flex-grow">
              <CardHeader>
                  <CardTitle className={cn(
                      "text-xl font-bold font-headline transition-colors",
                      !isWorkInProgress && "group-hover:text-primary"
                  )}>
                      {project.title}
                  </CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4">
                  <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                  </div>
              </CardContent>
          </div>
      </Card>
    );

    if (isWorkInProgress) {
        return <div className="h-full group">{cardContent}</div>;
    }

    if (hasLiveUrl) {
      const isInternalLink = project.liveUrl.startsWith('/');
      if (isInternalLink) {
          return (
              <Link href={project.liveUrl} className="h-full block group">
                  {cardContent}
              </Link>
          );
      }
      return (
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="h-full block group">
            {cardContent}
        </a>
      );
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="h-full cursor-pointer group">
                    {cardContent}
                </div>
            </DialogTrigger>
            <ProjectChatModal project={project} />
        </Dialog>
    );
});
CardWrapper.displayName = 'CardWrapper';

// The main component is now much simpler.
const ProjectCard = React.memo(function ProjectCard({ project }: ProjectCardProps) {
  return (
    <TiltCard className="h-full">
       <CardWrapper project={project} />
    </TiltCard>
  );
});
ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
