
import { MotionBackground } from '@/components/three/MotionBackground';
import ProjectsClientPage from './ProjectsClientPage';
import { getProjects } from '@/lib/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Projects | Rafsy's Portfolio",
  description: "A curated collection of projects by Yasar T. H. Rafsy, showcasing expertise in AI, Full-Stack Development, and IoT.",
};

export default async function ProjectsPage() {
  const { projects, allTags } = await getProjects();

  return (
    <>
      <MotionBackground />
      <div className="relative z-10">
        <ProjectsClientPage projects={projects} allTags={allTags} />
      </div>
    </>
  );
}
