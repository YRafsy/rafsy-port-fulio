
'use server';

import {
  generatePuzzle,
  type GeneratePuzzleInput,
} from '@/ai/flows/generate-puzzle';
import {
  validatePuzzleAnswer,
  type ValidatePuzzleAnswerInput,
} from '@/ai/flows/validate-puzzle-answer';
import {
  answerUserQuestion,
  type AnswerUserQuestionInput,
} from '@/ai/flows/answer-user-question';
import { submitContact, type ContactFormInput } from '@/ai/flows/contact-flow';
import { generateImage } from '@/ai/flows/generate-image';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import {
  answerProjectQuestion,
  type AnswerProjectQuestionInput,
} from '@/ai/flows/answer-project-question';
import {
  analyzeJobFit,
  type AnalyzeJobFitInput,
} from '@/ai/flows/analyze-job-fit';
import { generateVideo } from '@/ai/flows/generate-video';
import { KNOWLEDGE_BASE } from '@/ai/knowledge-base';

// This file is the single, centralized entry point for all AI actions.
// Client components will import functions from this file only.
// This file, in turn, is the only place that imports the underlying Genkit flows,
// creating a clean separation and preventing bundling issues.

export async function generatePuzzleAction(input: GeneratePuzzleInput) {
  return await generatePuzzle(input);
}

export async function validatePuzzleAnswerAction(
  input: ValidatePuzzleAnswerInput
) {
  return await validatePuzzleAnswer(input);
}

export async function answerUserQuestionAction(
  input: Omit<AnswerUserQuestionInput, 'knowledgeBase'>
) {
    // Inject the knowledge base here, keeping the flow pure.
    const isFirstTurn = !input.history || input.history.length === 0;
    return await answerUserQuestion({
        ...input,
        ...(isFirstTurn && { knowledgeBase: KNOWLEDGE_BASE }),
    });
}

export async function submitContactAction(input: ContactFormInput) {
  return await submitContact(input);
}

export async function generateImageAction(prompt: string) {
  return await generateImage(prompt);
}

export async function textToSpeechAction(text: string) {
    return await textToSpeech(text);
}

export async function answerProjectQuestionAction(
  input: AnswerProjectQuestionInput
) {
  return await answerProjectQuestion(input);
}

export async function analyzeJobFitAction(input: Omit<AnalyzeJobFitInput, 'knowledgeBase'>) {
    // Inject the knowledge base here.
    return await analyzeJobFit({
        ...input,
        knowledgeBase: KNOWLEDGE_BASE,
    });
}

export async function generateVideoAction(prompt: string) {
    return await generateVideo(prompt);
}
