
'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAudio } from '@/context/AudioContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { PlaylistTrack } from '@/lib/playlist';

const PlayingIndicator = () => (
    <div className="flex items-center gap-0.5">
        <span className="h-2 w-1 bg-primary animate-[wave] [animation-delay:-0.4s]"></span>
        <span className="h-3 w-1 bg-primary animate-[wave] [animation-delay:-0.2s]"></span>
        <span className="h-4 w-1 bg-primary animate-[wave]"></span>
    </div>
);

export default function MusicPlayer() {
  const [isMounted, setIsMounted] = useState(false);
  const { 
    isPlaying, 
    togglePlayPause, 
    playNext, 
    playPrev, 
    playTrack,
    tracklist,
    currentTrackIndex,
  } = useAudio();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" className="relative" disabled>
          <Music className="h-5 w-5" />
      </Button>
    );
  }

  const currentTrack = tracklist[currentTrackIndex];
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Music className="h-5 w-5" />
          {isPlaying && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary animate-ping"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <div className="text-center w-full">
            <p className="font-semibold truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" onClick={playPrev}>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" onClick={togglePlayPause} className="h-12 w-12">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-40 w-full rounded-md border p-2">
            <div className="flex flex-col gap-1">
                {tracklist.map((track, index) => (
                    <Button 
                        key={index} 
                        variant="ghost" 
                        className={cn(
                            "w-full justify-start h-auto py-2",
                            index === currentTrackIndex && "bg-accent"
                        )}
                        onClick={() => playTrack(index)}
                    >
                        <div className="flex items-center gap-3">
                           {isPlaying && index === currentTrackIndex ? <PlayingIndicator /> : <Music className="h-4 w-4 text-muted-foreground" /> }
                           <div>
                            <p className="text-sm text-left truncate">{track.title}</p>
                            <p className="text-xs text-left text-muted-foreground">{track.artist}</p>
                           </div>
                        </div>
                    </Button>
                ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
