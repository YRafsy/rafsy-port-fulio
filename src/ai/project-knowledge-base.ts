
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// This function is now responsible for fetching the project data
// and formatting it as a string for the AI knowledge base.
export function getProjectsKnowledgeBase(): string {
    const projectsDirectory = path.join(process.cwd(), 'projects');
    try {
        const fileNames = fs.readdirSync(projectsDirectory);
        let allContent = '\n\n# PROJECTS KNOWLEDGE BASE\nThis section contains detailed information about projects completed by Yasar Tanjim Haque Rafsy. You should use this information to provide deep, evidence-based answers about his practical experience.\n';
        
        for (const fileName of fileNames) {
            if (fileName.endsWith('.md')) {
                const fullPath = path.join(projectsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                 if (fileContents.trim() === '') {
                    console.warn(`[Warning] Project file is empty: ${fileName}`);
                    continue;
                }
                const { data, content } = matter(fileContents);
                
                allContent += `
---
## PROJECT: "${data.title}"

**Description:** ${data.description}
**Status:** ${data.status}
**My Role (Rafsy's Role):** ${data.role}
**Technology Stack:** ${(data.techStack || []).join(', ')}
**Key Challenges Faced:**
${(data.challenges || []).map((c: string) => `- ${c}`).join('\n')}
**Core Learnings & Takeaways:**
${(data.learnings || []).map((l: string) => `- ${l}`).join('\n')}
**Full Project Details:**
${content}
---
`;
            }
        }
        return allContent;
    } catch (error) {
        console.error("Error generating projects knowledge base:", error);
        return ""; // Return empty string if there's an error
    }
}
