
import { getProjects } from '@/lib/projects';
import ProjectCard from '@/components/shared/ProjectCard';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      }
    },
};

export default async function FeaturedProjects() {
    const { projects } = await getProjects();
    const featuredProjects = projects.filter(p => p.status === 'featured');

    if (featuredProjects.length === 0) {
        return null;
    }

    return (
        <section id="featured-projects" className="w-full py-20 md:py-32 bg-card/50">
            <div className="container mx-auto px-4 md:px-6">
                <div 
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">Featured Projects</h2>
                    <p className="max-w-[700px] mx-auto text-foreground/80 md:text-lg/relaxed">
                        A glimpse into some of the key projects I've worked on.
                    </p>
                </div>

                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featuredProjects.map((project) => (
                        <div key={project.slug}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>

                <div 
                  className="text-center mt-12"
                >
                  <Button asChild variant="default" size="lg">
                    <Link href="/projects">
                      View All Projects
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
            </div>
        </section>
    )
}
