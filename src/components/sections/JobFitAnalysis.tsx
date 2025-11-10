
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, ClipboardPaste } from 'lucide-react';
import { analyzeJobFitAction } from '@/ai/actions';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';
import { handleAction } from '@/lib/actions';

export default function JobFitAnalysis() {
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
    } catch (error) {
      console.error('Failed to read clipboard contents: ', error);
      toast({
        variant: 'destructive',
        title: 'Paste Failed',
        description: 'Could not read text from clipboard. Please paste manually.',
      });
    }
  };
  
  const handleAnalyze = async () => {
    if (!jobDescription) {
        toast({
            variant: 'destructive',
            title: 'No Job Description',
            description: 'Please paste a job description before analyzing.',
        });
        return;
    }
    setIsLoading(true);
    setAnalysisResult('');
    
    // The action now implicitly handles the knowledge base.
    const result = await handleAction(() => analyzeJobFitAction({ jobDescription }), {
        toast,
        successMessage: "Analysis complete! See my tailored qualifications below.",
    });

    if (result?.analysis) {
        setAnalysisResult(result.analysis);
    }

    setIsLoading(false);
  };

  return (
    <section id="job-fit" className="w-full py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          <div className="space-y-6">
            <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">The Right Fit for Your Team?</h2>
            <p className="text-foreground/80 md:text-xl/relaxed">
              Recruiters, this one's for you. Instead of just reading my CV, let's make it dynamic. Paste a job description below, and my AI assistant will analyze how my skills and experience align with your requirements in real-time.
            </p>
            <Card className="bg-card/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Job Fit Analyzer</CardTitle>
                    <CardDescription>Paste the full job description here to begin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Textarea
                            placeholder="e.g., Senior AI Engineer at Google..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="min-h-[200px] pr-12"
                            disabled={isLoading}
                        />
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handlePaste} disabled={isLoading}>
                            <ClipboardPaste className="h-5 w-5"/>
                            <span className="sr-only">Paste</span>
                        </Button>
                    </div>
                    <Button onClick={handleAnalyze} disabled={isLoading || !jobDescription} className="w-full">
                        {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Analyze Fit</>)}
                    </Button>
                </CardContent>
            </Card>
          </div>
          <Card className="bg-card/80 backdrop-blur-sm shadow-lg min-h-[400px]">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">AI-Generated Analysis</CardTitle>
                <CardDescription>My qualifications, tailored to your role.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <p className="mt-4 text-muted-foreground">Comparing qualifications against your requirements...</p>
                    </div>
                )}
                {analysisResult && !isLoading && (
                    <MarkdownRenderer content={analysisResult} />
                )}
                {!analysisResult && !isLoading && (
                     <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <Sparkles className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 text-muted-foreground">The analysis will appear here.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
