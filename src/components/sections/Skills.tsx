
'use client';

import { motion } from 'framer-motion';
import { Code, BrainCircuit, TerminalSquare, SlidersHorizontal, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const skillsData = {
  languages: {
    icon: Code,
    title: 'Languages',
    skills: ['Python', 'JavaScript', 'HTML5/CSS3', 'C/C++', 'Verilog', 'Java', 'PHP', 'MySQL'],
  },
  'ai-ml': {
    icon: BrainCircuit,
    title: 'AI & Machine Learning',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  'frontend-backend': {
    icon: TerminalSquare,
    title: 'Web Frameworks & Libraries',
    skills: ['Node.js', 'React', 'Next.js', 'Express.js', 'AJAX', 'RESTful APIs'],
  },
   'engineering-tools': {
    icon: Cpu,
    title: 'Engineering Software',
    skills: ['MATLAB', 'Simulink', 'AutoCAD', 'Proteus', 'TinkerCAD'],
  },
  'tools-platforms': {
    icon: SlidersHorizontal,
    title: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Firebase', 'Google Colab', 'Docker'],
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
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
    },
  },
};

export default function Skills() {
  return (
    <section id="skills" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">My Technical Arsenal</h2>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
            A snapshot of the core technologies I use to build modern, intelligent applications.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {Object.values(skillsData).map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="h-full bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <category.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
