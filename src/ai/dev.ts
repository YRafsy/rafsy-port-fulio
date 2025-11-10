
'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/generate-puzzle';
import '@/ai/flows/validate-puzzle-answer';
import '@/ai/flows/answer-user-question';
import '@/ai/flows/contact-flow';
import '@/ai/flows/generate-image';
import '@/ai/flows/text-to-speech';
import '@/ai/flows/generate-video';
import '@/ai/flows/answer-project-question';
import '@/ai/flows/analyze-job-fit';
