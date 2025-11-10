
'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generatePuzzleAction, validatePuzzleAnswerAction } from '@/ai/actions';
import type { GeneratePuzzleOutput } from '@/ai/flows/generate-puzzle';
import type { ValidatePuzzleAnswerOutput } from '@/ai/flows/validate-puzzle-answer';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { handleAction } from '@/lib/actions';

type PuzzleState = GeneratePuzzleOutput | null;
type ValidationResult = ValidatePuzzleAnswerOutput | null;

export default function Puzzle() {
  const [puzzle, setPuzzle] = useState<PuzzleState>(null);
  const [topic, setTopic] = useState('general knowledge');
  const [difficulty, setDifficulty] = useState('medium');
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<ValidationResult>(null);
  const { toast } = useToast();

  const handleGeneratePuzzle = async () => {
    if (!topic) return;
    setIsLoading(true);
    setPuzzle(null);
    setResult(null);
    setUserAnswer('');
    
    const newPuzzle = await handleAction(() => generatePuzzleAction({ topic, difficulty: difficulty as 'easy' | 'medium' | 'hard' }), { toast });

    if (newPuzzle) {
        setPuzzle(newPuzzle);
    }
    
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!puzzle || !userAnswer) return;

    setIsVerifying(true);
    setResult(null);

    const validationResult = await handleAction(() => validatePuzzleAnswerAction({
        puzzle: puzzle.puzzle,
        userAnswer: userAnswer,
        solution: puzzle.answer,
    }), { toast });

    if (validationResult) {
        setResult(validationResult);
    }

    setIsVerifying(false);
  };

  return (
    <section id="puzzle" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <Card className="max-w-2xl mx-auto bg-card/80 backdrop-blur-sm shadow-lg animate-pulse-glow">
          <CardHeader className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold font-headline mt-4">AI Puzzle Challenge</CardTitle>
            <CardDescription>Test your wits against our AI-powered puzzle generator. Pick a topic!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  placeholder="Enter a topic (e.g., Space)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                />
                <Select value={difficulty} onValueChange={setDifficulty} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGeneratePuzzle} disabled={isLoading || !topic} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate New Puzzle'
                )}
              </Button>
            </div>

            {puzzle && (
              <div className="space-y-4 pt-4 border-t">
                <p className="text-lg text-center font-semibold">{puzzle.puzzle}</p>
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Your answer"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isVerifying}
                    required
                  />
                  <Button type="submit" disabled={isVerifying || !userAnswer}>
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                </form>
              </div>
            )}
            
            {result && (
              <Alert variant={result.isCorrect ? 'default' : 'destructive'} className={result.isCorrect ? 'border-green-500/50' : ''}>
                {result.isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.isCorrect ? 'Correct!' : 'Not Quite'}</AlertTitle>
                <AlertDescription>{result.reasoning}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
      </div>
    </section>
  );
}
