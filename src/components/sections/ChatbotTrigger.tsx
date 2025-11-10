
'use client';

import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatbotTriggerProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export function ChatbotTrigger({ onClick, isLoading = false }: ChatbotTriggerProps) {
  return (
    <Button
      type="button"
      className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg animate-pulse-glow"
      onClick={onClick}
      aria-label="Open AI Chatbot"
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Bot className="h-8 w-8" />}
    </Button>
  );
}
