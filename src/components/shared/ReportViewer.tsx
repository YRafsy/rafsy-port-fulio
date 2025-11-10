
'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReportViewerProps {
  file: string;
  title: string;
}

export default function ReportViewer({ file, title }: ReportViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // The 'file' prop is just the filename, e.g., "my-report.html".
  // This now correctly points to the /reports/ subfolder in public.
  const reportUrl = `/reports/${file}`;

  return (
    <div className="w-full flex-grow relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <iframe
        src={reportUrl}
        title={title}
        className={cn(
            "w-full h-full border-0",
            isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'
        )}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
