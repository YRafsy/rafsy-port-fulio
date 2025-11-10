
import React from 'react';
import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';
import DOMPurify from 'isomorphic-dompurify';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Memoizing the MarkdownRenderer because the content prop can be large,
// and we want to avoid re-processing it if the component re-renders for other reasons.
export const MarkdownRenderer = React.memo(function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const processMarkdown = React.useCallback((markdown: string): string => {
    // A very basic markdown processor. For a real app, use a library like 'marked' or 'react-markdown'.
    let html = markdown
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^\s*[-*+] (.*)/gim, '<li>$1</li>');

    // Wrap consecutive list items in <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>').replace(/<\/ul>\n<ul>/g, '');

    // Wrap remaining lines in <p> tags
    html = html.split('\n').filter(line => line.trim() !== '').map(line => {
      if (line.startsWith('<h') || line.startsWith('<ul') || line.startsWith('<li')) {
        return line;
      }
      return `<p>${line}</p>`;
    }).join('');
    
    return html;
  }, []);

  const renderContent = React.useMemo(() => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (!part || part.trim() === '') return null;

      if (part.startsWith('```')) {
        const code = part.replace(/```(.*?)\n?/, '').replace(/```$/, '').trim();
        return <CodeBlock key={index} code={code} className="my-6" />;
      }
      
      const rawHtml = processMarkdown(part);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      return <div key={index} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, processMarkdown]);

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
        {renderContent}
    </div>
  );
});
