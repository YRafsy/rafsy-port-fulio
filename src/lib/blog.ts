
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import placeholderImageData from '@/app/lib/placeholder-images.json';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image: string; 
  isHtml: boolean;
}

export interface PostData extends PostMeta {
  content: string;
  previousPost: { slug: string; title: string } | null;
  nextPost: { slug: string; title: string } | null;
}

// Add a new type for the return value of getPostsMeta
export interface PostsMetaAndTags {
  posts: PostMeta[];
  allTags: string[];
}

const postsDirectory = path.join(process.cwd(), 'posts');

// Helper function to get image path for a given slug
const getPostImagePath = (slug: string): string => {
    const extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    for (const ext of extensions) {
        const imagePath = path.join(process.cwd(), 'public', 'images', 'posts', `${slug}${ext}`);
        if (fs.existsSync(imagePath)) {
            return `/images/posts/${slug}${ext}`;
        }
    }
    // Fallback to placeholder JSON
    const placeholderKey = slug.replace(/-report$/, '');
    const placeholder = (placeholderImageData as Record<string, {url: string}>)[placeholderKey];
    if (placeholder) {
        return placeholder.url;
    }
    
    // Final fallback
    const seed = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `https://picsum.photos/seed/${seed}/1200/630`;
}


export const getPostsMeta = cache(async (): Promise<PostsMetaAndTags> => {
  let allPostsData: PostMeta[] = [];
  const allTagsSet = new Set<string>();
  
  if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);

      const processedPosts = fileNames.map((fileName) => {
          const isHtml = fileName.endsWith('.html');
          const isMd = fileName.endsWith('.md');

          if (!isHtml && !isMd) return null;

          const slug = fileName.replace(/\.(md|html)$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          
          let title, description, tags, date, image;

          if(isMd) {
            try {
                const matterResult = matter(fileContents);
                const metadata = matterResult.data;
                title = metadata.title || slug.replace(/-/g, ' ');
                date = metadata.date || new Date().toISOString();
                description = metadata.description || 'A post from the blog.';
                tags = metadata.tags || [];
                image = metadata.image || getPostImagePath(slug);
            } catch(e) {
                console.error(`Error parsing frontmatter for ${fileName}`, e);
                return null;
            }
          } else { // isHtml
            const titleMatch = fileContents.match(/<title>(.*?)<\/title>/);
            title = titleMatch && titleMatch[1] ? titleMatch[1] : slug.replace(/-/g, ' ');
            date = new Date().toISOString();
            description = 'An interactive HTML report.';
            tags = ['Interactive', 'Report'];
            image = getPostImagePath(slug);
          }


          if (Array.isArray(tags)) {
            tags.forEach((tag: string) => allTagsSet.add(tag));
          }
          
          return {
            slug,
            title,
            date,
            description,
            tags,
            image,
            isHtml,
          };
      }).filter(Boolean) as PostMeta[];

      allPostsData = allPostsData.concat(processedPosts);
  }
    
  // Sort all content by date in descending order
  const sortedPosts = allPostsData.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime();
    const dateB = new Date(b.date || 0).getTime();
    return dateB - dateA;
  });

  return {
    posts: sortedPosts,
    allTags: Array.from(allTagsSet).sort(),
  };
});

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const { posts } = await getPostsMeta();
  const currentPostIndex = posts.findIndex(p => p.slug === slug);

  if (currentPostIndex === -1) {
    return null;
  }
  
  const meta = posts[currentPostIndex];
  
  const fullPath = path.join(postsDirectory, `${slug}.${meta.isHtml ? 'html' : 'md'}`);
  if (!fs.existsSync(fullPath)) {
      return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // HTML reports don't have navigation and we can return early
  if (meta.isHtml) {
      return {
          ...meta,
          content: fileContents,
          previousPost: null,
          nextPost: null,
      };
  }
  
  // For markdown posts, filter to only include other markdown posts for navigation
  const markdownPosts = posts.filter(p => !p.isHtml);
  const currentMdIndex = markdownPosts.findIndex(p => p.slug === slug);

  const previousPost = currentMdIndex > 0 
    ? { slug: markdownPosts[currentMdIndex - 1].slug, title: markdownPosts[currentMdIndex - 1].title } 
    : null;
    
  const nextPost = currentMdIndex < markdownPosts.length - 1 
    ? { slug: markdownPosts[currentMdIndex + 1].slug, title: markdownPosts[currentMdIndex + 1].title }
    : null;

  const matterResult = matter(fileContents);
  
  return { 
      ...meta, 
      content: matterResult.content,
      previousPost,
      nextPost,
  };
}
