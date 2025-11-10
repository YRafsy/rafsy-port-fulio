'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      }
    },
  };

  const name = "Yasar Tanjim Haque Rafsy";
  const nameWords = name.split(" ");

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      <motion.div 
        className="relative z-20 container px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-6">
           <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-foreground/90">Welcome to my digital portfolio.</p>
          </motion.div>
          <motion.h1 
            className="font-headline tracking-tighter text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary"
            variants={containerVariants}
          >
            {nameWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={itemVariants}
                className="inline-block"
              >
                {word}{' '}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p 
            className="max-w-[700px] mx-auto text-foreground/80 md:text-xl"
            variants={itemVariants}
          >
            I am an AI-Enabled Electrical Engineer and Full-Stack Developer, passionate about building intelligent systems where hardware meets software. This portfolio is a showcase of my journey, projects, and technical explorations in AI, web development, and IoT.
          </motion.p>
          <motion.div 
            className="flex justify-center mt-4"
            variants={itemVariants}
          >
             <Button asChild size="lg">
              <Link href="/projects">
                View My Work
                <ArrowDown className="ml-2 h-5 w-5" />
              </Link>
             </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
