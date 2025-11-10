
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Code, Zap, BookCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerProjectQuestionAction } from '@/ai/actions';
import type { Project } from '@/lib/projects';
import { Badge } from '../ui/badge';
import ChatInterface from './ChatInterface';
import type { ChatMessage } from './ChatInterface';

interface ProjectChatModalProps {
    project: Project;
}

const QUICK_QUESTIONS = [
    "What was the biggest challenge?",
    "What did you learn from this?",
    "Explain the tech stack.",
];

export default function ProjectChatModal({ project }: ProjectChatModalProps) {
  const initialMessages: ChatMessage[] = [
    { role: 'model', content: `Hi! I'm the AI project manager for "${project.title}". Feel free to ask me any technical or strategic questions about it!` },
  ];

  const handleMessage = async (input: { question: string, history: ChatMessage[]}) => {
    // Pass the full project object along with the question and history
    return answerProjectQuestionAction({
        project,
        question: input.question,
        history: input.history,
    });
  };

  return (
    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2 font-headline">{project.title}</DialogTitle>
            <DialogDescription>AI-Assisted Project Deep Dive</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 min-h-0">
            <div className="col-span-1 md:col-span-2 flex flex-col h-full">
                <ChatInterface 
                    initialMessages={initialMessages}
                    messageHandler={handleMessage}
                    quickQuestions={QUICK_QUESTIONS}
                    placeholder="Ask a technical question..."
                />
            </div>

            <div className="col-span-1 border-l bg-muted/50 hidden md:block">
                <ScrollArea className="h-full">
                    <div className="p-6 space-y-6">
                        <div>
                            <h3 className="font-headline font-semibold flex items-center gap-2"><User className="h-5 w-5 text-primary" /> My Role</h3>
                            <p className="text-sm text-muted-foreground mt-2">{project.details.role}</p>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold flex items-center gap-2"><Code className="h-5 w-5 text-primary" /> Tech Stack</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {project.details.techStack.map(tech => <Badge key={tech} variant="secondary">{tech}</Badge>)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-headline font-semibold flex items-center gap-2"><Zap className="h-5 w-5 text-primary" /> Key Challenges</h3>
                            <ul className="mt-2 space-y-2 list-disc pl-4 text-sm text-muted-foreground">
                                {project.details.challenges.map((challenge, i) => <li key={i}>{challenge}</li>)}
                            </ul>
                        </div>
                         <div>
                            <h3 className="font-headline font-semibold flex items-center gap-2"><BookCheck className="h-5 w-5 text-primary" /> Core Learnings</h3>
                            <ul className="mt-2 space-y-2 list-disc pl-4 text-sm text-muted-foreground">
                                {project.details.learnings.map((learning, i) => <li key={i}>{learning}</li>)}
                            </ul>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    </DialogContent>
  );
}
