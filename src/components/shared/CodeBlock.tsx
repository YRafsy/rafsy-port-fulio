'use client'

import { useState } from 'react';
import { Check, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  return (
    <div className={cn("relative font-code text-sm", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-7 w-7 text-foreground/60 hover:text-foreground"
        onClick={copyToClipboard}
      >
        {hasCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="p-4 rounded-lg bg-card border overflow-x-auto">
        <code className='whitespace-pre-wrap'>{code.trim()}</code>
      </pre>
    </div>
  );
}
