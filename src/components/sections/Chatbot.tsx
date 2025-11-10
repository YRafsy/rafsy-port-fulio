
'use client';

import { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { answerUserQuestionAction } from '@/ai/actions';
import ChatInterface from '../shared/ChatInterface';
import { ChatbotTrigger } from './ChatbotTrigger';

const QUICK_QUESTIONS = [
  "What are your key skills?",
  "Tell me about your most challenging project.",
  "What are you passionate about?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const initialMessages = [{ role: 'model', content: "Hello! I'm Rafsy's AI assistant. Ask me anything about his portfolio, skills, or experience." }];

  return (
    <>
      <ChatbotTrigger onClick={() => setIsOpen(true)} />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full max-w-md flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2 font-headline">
              <Bot className="text-primary" />
              AI Assistant
            </SheetTitle>
            <Button variant="ghost" size="icon" className="absolute top-3 right-3" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          
          <ChatInterface 
            initialMessages={initialMessages}
            messageHandler={answerUserQuestionAction}
            quickQuestions={QUICK_QUESTIONS}
            placeholder="Ask about my projects, skills, etc..."
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
