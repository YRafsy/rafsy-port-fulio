
'use client';

import { motion } from 'framer-motion';
import { Briefcase, Zap, BookOpen, UserCheck, Code, Cpu } from 'lucide-react';
import TiltCard from '../shared/TiltCard';
import AboutImageRotator from './AboutImageRotator';


const stats = [
  {
    icon: Briefcase,
    value: '4+',
    label: 'Professional Roles',
  },
  {
    icon: Zap,
    value: '20+',
    label: 'Notable Projects',
  },
  {
    icon: BookOpen,
    value: '2',
    label: 'Publications',
  },
];

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        }
    },
};

export default function About() {
  const aboutMeTitle = "About Me";

  return (
    <section id="about" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4">
                <motion.h2 
                    className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl"
                    variants={itemVariants}
                >
                    {aboutMeTitle}
                </motion.h2>

                <motion.p variants={itemVariants} className="text-foreground/80 md:text-lg/relaxed">
                    I am a dedicated and ambitious professional with a BSc in Electrical & Electronics Engineering, bridging the gap between hardware and software. My passion lies in applying my skills to drive innovation and solve real-world problems.
                </motion.p>
            </div>

            <motion.div variants={itemVariants}>
                <ul className="space-y-4 text-foreground/80">
                    <li className="flex items-start gap-4">
                        <UserCheck className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <span>
                            <strong>Communicator & Quick Learner:</strong> I rapidly adapt to new challenges and excel in professional, collaborative environments.
                        </span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Code className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <span>
                            <strong>Full-Stack Developer:</strong> Proficient in a variety of languages and technologies to build complete web solutions.
                        </span>
                    </li>
                    <li className="flex items-start gap-4">
                        <Cpu className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <span>
                            <strong>AI & Embedded Systems:</strong> Hands-on experience in Deep Learning and hardware integration, bringing intelligence to devices.
                        </span>
                    </li>
                </ul>
            </motion.div>
           
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {stats.map((stat) => (
                    <motion.div variants={itemVariants} key={stat.label} className="flex flex-col items-center text-center p-4 rounded-lg bg-card/80 backdrop-blur-sm">
                        <stat.icon className="h-8 w-8 text-primary mb-2" />
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
          </motion.div>
          
          <TiltCard>
             <AboutImageRotator />
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
