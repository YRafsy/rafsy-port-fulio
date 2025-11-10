
'use client';

import { motion } from 'framer-motion';
import { Briefcase, Award, BookOpen, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const timelineItems = [
  {
    icon: Briefcase,
    date: 'Jan 2024 – July 2024',
    title: 'Strategic Manager',
    subtitle: 'FishYou (Tech Startup)',
    description: 'Led strategies boosting user engagement by 25%. Conducted behavior-based analytics to optimize conversion funnels. Supervised backend development.',
  },
  {
    icon: Briefcase,
    date: 'April 2023 – Oct 2023',
    title: 'Sub-Executive',
    subtitle: 'IEEE ULAB Student Chapter',
    description: 'Organized hackathons, robotics competitions, and AI/IoT workshops. Mentored students in embedded systems, control technologies, and programming.',
  },
   {
    icon: Award,
    date: '2024',
    title: 'Best Capstone & Project Award',
    subtitle: 'EEE Department, ULAB',
    description: 'Received both the Best Capstone Project Award and the Best Project Award at the EEE Project Showcase for innovative and high-quality work.',
  },
  {
    icon: BookOpen,
    date: 'Published & Submitted',
    title: 'Research Publications',
    subtitle: 'IEEE & Academic Journal',
    description: 'Authored an IEEE publication on PID-controller design and submitted a journal article on low-cost weather forecasting with TinyML.',
  },
  {
    icon: GraduationCap,
    date: '2019 - 2024',
    title: 'BSc in Electrical & Electronics Engineering',
    subtitle: 'University of Liberal Arts Bangladesh (ULAB)',
    description: 'Graduated with a major in Electronics and a minor in Computer Science, achieving a CGPA of 3.03.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = (isLeft: boolean) => ({
    hidden: { x: isLeft ? -100 : 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
      },
    },
});

export default function Experience() {
  return (
    <section id="experience" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">Journey & Milestones</h2>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
            A timeline of my professional and academic path.
          </p>
        </motion.div>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 w-0.5 h-full bg-border -translate-x-1/2"></div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-12"
          >
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
              <motion.div
                key={index}
                variants={itemVariants(isLeft)}
                className="relative flex items-center justify-center"
              >
                <div className={`w-1/2 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                   <Card className="bg-card/80 backdrop-blur-sm shadow-lg inline-block text-left">
                    <CardHeader>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                      <CardTitle className="text-xl font-headline">{item.title}</CardTitle>
                      <CardDescription>{item.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                 </motion.div>
                </div>
                
                <div className="absolute left-1/2 -translate-x-1/2 bg-background border-2 border-primary rounded-full p-2 z-10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>

                <div className="w-1/2"></div>
                
              </motion.div>
            )}
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
