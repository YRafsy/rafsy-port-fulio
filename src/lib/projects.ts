
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface Project {
    slug: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    liveUrl: string;
    videoUrl?: string;
    dataAiHint: string;
    status: 'featured' | 'completed' | 'in-progress';
    details: {
        role: string;
        techStack: string[];
        challenges: string[];
        learnings: string[];
    };
    content: string; // The markdown body
}

export interface ProjectsData {
  projects: Project[];
  allTags: string[];
}

const projectsDirectory = path.join(process.cwd(), 'projects');

export const getProjects = cache(async (): Promise<ProjectsData> => {
  const fileNames = fs.readdirSync(projectsDirectory);
  const allTagsSet = new Set<string>();

  const allProjectsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // Only process markdown files
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      
      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // If the file is empty, gray-matter can throw an error or return weird data
        if (fileContents.trim() === '') {
            console.warn(`[Warning] Project file is empty: ${fileName}`);
            return null;
        }

        const matterResult = matter(fileContents);
        const projectData = matterResult.data;

        if (Array.isArray(projectData.tags)) {
            projectData.tags.forEach((tag: string) => allTagsSet.add(tag));
        }

        return {
          slug,
          title: projectData.title,
          description: projectData.description,
          image: projectData.image,
          tags: projectData.tags,
          liveUrl: projectData.liveUrl,
          videoUrl: projectData.videoUrl,
          dataAiHint: projectData.dataAiHint,
          status: projectData.status,
          details: {
            role: projectData.role,
            techStack: projectData.techStack,
            challenges: projectData.challenges,
            learnings: projectData.learnings,
          },
          content: matterResult.content,
        } as Project;

      } catch (error) {
          console.error(`[Error] Failed to read or parse project file: ${fileName}`, error);
          return null; // Skip this file if it fails to parse
      }
    })
    .filter((project): project is Project => project !== null); // Filter out any nulls from failed parses

  // Sort projects: featured first, then by title
  const sortedProjects = allProjectsData.sort((a, b) => {
    if (a.status === 'featured' && b.status !== 'featured') return -1;
    if (a.status !== 'featured' && b.status === 'featured') return 1;
    return a.title.localeCompare(b.title);
  });
  
  const allTags = Array.from(allTagsSet).sort();

  return {
    projects: sortedProjects,
    allTags,
  };
});
