
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateImageAction } from '@/ai/actions';
import { MediaCard } from '@/components/shared/MediaCard';
import { handleAction } from '@/lib/actions';

interface ImageGeneratorProps {
  initialPrompt?: string;
}

export default function ImageGenerator({ initialPrompt = '' }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setGeneratedImageUrl('');
    }
  }, [initialPrompt]);

  const handleGenerateImage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedImageUrl('');

    const result = await handleAction(() => generateImageAction(prompt), {
        toast,
        successMessage: "Your creative vision has come to life.",
    });

    if (result?.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
    }
    
    setIsLoading(false);
  };

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Create with AI</CardTitle>
          <CardDescription>
            Describe any image you can imagine, and let our AI bring it to life.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            key={initialPrompt} // Force re-render of textarea if initialPrompt changes
            placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
          <div className="grid grid-cols-1">
            <Button onClick={handleGenerateImage} disabled={isLoading || !prompt}>
              {isLoading ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : (<ImageIcon className="mr-2 h-4 w-4" />)}
              Generate Image
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="aspect-video bg-card/80 backdrop-blur-sm flex items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p>Generating your masterpiece...</p>
          </div>
        ) : generatedImageUrl ? (
            <MediaCard item={{ type: 'photo', title: prompt, source: generatedImageUrl, isZoomable: true }} />
        ) : (
          <div className="flex flex-col items-center gap-4 text-muted-foreground text-center">
            <Sparkles className="h-16 w-16" />
            <p>Your generated content will appear here.</p>
          </div>
        )}
      </Card>
    </div>
  )
}
