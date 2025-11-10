
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Video } from 'lucide-react';
import { generateVideoAction } from '@/ai/actions';
import { useToast } from '@/hooks/use-toast';
import { handleAction } from '@/lib/actions';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setVideoUrl('');

    const result = await handleAction(() => generateVideoAction(prompt), {
        toast,
        successMessage: "Your video has been successfully created.",
        errorMessage: "Video generation is experimental and may fail. Please try a different prompt or try again later.",
    });

    if (result?.videoUrl) {
        setVideoUrl(result.videoUrl);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create with AI</CardTitle>
          <CardDescription>
            Describe a video scene, and our AI will generate a short clip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., A cinematic shot of an old car driving down a deserted road at sunset."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
          <Button onClick={handleGenerateVideo} disabled={isLoading || !prompt}>
            {isLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<Video className="mr-2 h-4 w-4" />)}
            Generate Video
          </Button>
        </CardContent>
      </Card>
      <Card className="aspect-video bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p>Generating video... This may take up to a minute.</p>
          </div>
        ) : videoUrl ? (
            <div className="w-full h-full">
                <video key={videoUrl} src={videoUrl} controls autoPlay className="w-full h-full object-contain rounded-lg" />
            </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
            <Sparkles className="h-16 w-16" />
            <p>Your generated video will appear here.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
