
'use client';

import { useState, useMemo } from 'react';
import ProjectCard from '@/components/shared/ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '@/lib/projects';
import { Button } from '@/components/ui/button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Featured', value: 'featured' },
  { label: 'Completed', value: 'completed' },
  { label: 'In Progress', value: 'in-progress' },
];


interface ProjectsClientPageProps {
  projects: Project[];
  allTags: string[];
}

export default function ProjectsClientPage({ projects, allTags }: ProjectsClientPageProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const allFilters = useMemo(() => {
    const tagFilters = allTags.map(tag => ({ 
      label: tag.charAt(0).toUpperCase() + tag.slice(1), 
      value: tag 
    }));
    return [...STATUS_FILTERS, ...tagFilters];
  }, [allTags]);


  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') {
      return projects;
    }
     if (['featured', 'completed', 'in-progress'].includes(activeFilter)) {
      return projects.filter(p => p.status === activeFilter);
    }
    // Handle tag filtering
    return projects.filter(p => p.tags.includes(activeFilter));
  }, [projects, activeFilter]);

  return (
    <section id="projects" className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-6xl">My Projects</h1>
          <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl/relaxed">
            A selection of my work. Click a project to start an interactive AI-guided tour.
          </p>
        </motion.div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {allFilters.map(filter => (
             <Button
                key={filter.value}
                variant={activeFilter === filter.value ? 'default' : 'outline'}
                onClick={() => setActiveFilter(filter.value)}
                size="sm"
              >
                {filter.label}
            </Button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.slug}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-muted-foreground mt-16"
            >
              <p>No projects found for the selected filter.</p>
            </motion.div>
        )}
      </div>
    </section>
  );
}
