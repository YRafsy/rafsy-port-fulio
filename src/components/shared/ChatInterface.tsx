
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Loader2, Send, User, Volume2, CircleStop, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { textToSpeechAction } from '@/ai/actions';
import { MarkdownRenderer } from './MarkdownRenderer';
import { handleAction } from '@/lib/actions';


export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatInterfaceProps {
  initialMessages: ChatMessage[];
  messageHandler: (input: { question: string; history: ChatMessage[] }) => Promise<{ answer: string } | null>;
  quickQuestions?: string[];
  placeholder?: string;
}

const MemoizedMessage = React.memo(({ message, onAudio, isPlaying, isGenerating, messageId }: { message: ChatMessage, onAudio: (text: string, id: string) => void, isPlaying: boolean, isGenerating: boolean, messageId: string }) => (
  <div className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
    {message.role === 'model' && (
      <Avatar className="h-8 w-8 border-2 border-primary"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>
    )}
    <div className="max-w-[85%] group relative">
      <div className={cn('rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
        <MarkdownRenderer content={message.content} />
      </div>
      {message.role === 'model' && message.content && (
        <Button size="icon" variant="ghost" className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm" onClick={() => onAudio(message.content, messageId)} disabled={isGenerating}>
          {isGenerating ? (<Loader2 className="h-4 w-4 animate-spin text-primary" />) : isPlaying ? (<CircleStop className="h-4 w-4 text-destructive" />) : (<Volume2 className="h-4 w-4 text-primary" />)}
        </Button>
      )}
    </div>
    {message.role === 'user' && (
      <Avatar className="h-8 w-8"><AvatarFallback><User className="h-5 w-5" /></AvatarFallback></Avatar>
    )}
  </div>
));
MemoizedMessage.displayName = 'MemoizedMessage';

const StreamingMessage = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
  
    useEffect(() => {
      setDisplayedText('');
      if (text) {
        let i = 0;
        const intervalId = setInterval(() => {
          setDisplayedText(text.slice(0, i));
          i++;
          if (i > text.length) {
            clearInterval(intervalId);
          }
        }, 20); // Adjust typing speed here
        return () => clearInterval(intervalId);
      }
    }, [text]);
  
    return <MarkdownRenderer content={displayedText} />;
};


export default function ChatInterface({
  initialMessages,
  messageHandler,
  quickQuestions = [],
  placeholder = "Ask a question..."
}: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState<string | null>(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);
  
  const handleSend = useCallback(async (questionText?: string) => {
    const currentQuestion = questionText || input;

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: currentQuestion };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const history = [...messages]; 
    const result = await handleAction(() => messageHandler({ question: currentQuestion, history }), {
        toast,
        errorMessage: "Sorry, I'm having trouble connecting. Please try again later."
    });

    if (result?.answer) {
        const aiMessage: ChatMessage = { role: 'model', content: result.answer };
        setMessages((prev) => [...prev, aiMessage]);
    }
    
    setIsLoading(false);
  }, [input, messages, messageHandler, toast]);
  
 const handleAudio = useCallback(async (text: string, messageId: string) => {
    if (currentlyPlayingId === messageId && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setCurrentlyPlayingId(null);
      return;
    }

    if (audioRef.current) {
        audioRef.current.pause();
    }

    setIsGeneratingSpeech(messageId);
    setCurrentlyPlayingId(null);

    const result = await handleAction(() => textToSpeechAction(text), {
        toast,
        errorMessage: "Could not generate the audio for this message.",
    });

    setIsGeneratingSpeech(null);

    if (result?.media) {
      try {
        const audio = new Audio(result.media);
        audioRef.current = audio;
        setCurrentlyPlayingId(messageId);
        
        await audio.play();
        
        audio.onended = () => {
            setCurrentlyPlayingId(null);
            audioRef.current = null;
        };
      } catch (error) {
          console.error("Audio playback error:", error);
          toast({
              variant: "destructive",
              title: "Audio Playback Failed",
              description: "Could not play the generated audio. Please try again."
          });
          setCurrentlyPlayingId(null);
          audioRef.current = null;
      }
    }
  }, [currentlyPlayingId, toast]);


  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    handleSend();
  }, [handleSend, input]);

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message, index) => {
            const messageId = `tts-${index}`;
            const isLastMessage = index === messages.length - 1;
            
            if (isLastMessage && isLoading && message.role === 'model') {
                return (
                    <div key={index} className='flex items-start gap-3 justify-start'>
                        <Avatar className="h-8 w-8 border-2 border-primary"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>
                        <div className="max-w-[85%]">
                            <div className='rounded-lg p-3 text-sm bg-muted'>
                                <StreamingMessage text={message.content} />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
              <MemoizedMessage
                key={index}
                message={message}
                messageId={messageId}
                onAudio={handleAudio}
                isPlaying={currentlyPlayingId === messageId}
                isGenerating={isGeneratingSpeech === messageId}
              />
            )
          })}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <Avatar className="h-8 w-8 border-2 border-primary"><AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback></Avatar>
              <div className="bg-muted rounded-lg p-3"><Loader2 className="h-5 w-5 animate-spin" /></div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        {quickQuestions.length > 0 && !isLoading && messages.length <= 1 && (
            <div className="flex gap-2 mb-2 flex-wrap">
                {quickQuestions.map(q => (
                    <Button key={q} variant="outline" size="sm" onClick={() => handleSend(q)} disabled={isLoading}>
                        <Sparkles className="mr-2 h-3 w-3" />
                        {q}
                    </Button>
                ))}
            </div>
        )}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} className="flex-1" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={isLoading || input.trim() === ''}><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
}
