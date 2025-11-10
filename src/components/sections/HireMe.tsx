
'use client';

import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HireMe() {
  const handleClick = () => {
    // This finds the chatbot trigger button and simulates a click to open the sheet
    const chatbotTrigger = document.querySelector('button[aria-label="Open AI Chatbot"]') as HTMLButtonElement | null;
    if (chatbotTrigger) {
      chatbotTrigger.click();
    }
  };

  return (
    <section id="hire-me" className="w-full py-20 md:py-32 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
        >
            <Bot className="mx-auto h-16 w-16 text-primary animate-pulse" />
            <h2 className="mt-6 text-3xl font-bold font-headline tracking-tighter sm:text-4xl md:text-5xl">
                Have a Project in Mind?
            </h2>
            <p className="mt-4 text-foreground/80 md:text-xl/relaxed">
                Let's build something amazing together. I'm currently available for freelance opportunities and full-time positions. You can ask my AI assistant any questions you have about my skills and experience.
            </p>
            <div className="mt-8">
                <Button size="lg" onClick={handleClick}>
                    <Send className="mr-2 h-5 w-5" />
                    Chat with My AI Assistant
                </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
