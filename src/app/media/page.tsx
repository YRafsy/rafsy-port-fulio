
import { MotionBackground } from '@/components/three/MotionBackground';
import MediaClientPage from './MediaClientPage';
import { getMedia } from '@/lib/media';
import { getPostsMeta } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Creative Nexus | Rafsy's Portfolio",
  description: "A creative gallery showcasing AI-generated art, videos, interactive reports, and AI generation tools by Yasar T. H. Rafsy.",
};

export default async function MediaPage() {
  const media = await getMedia();
  const { posts } = await getPostsMeta();
  const reports = posts.filter(post => post.isHtml);

  return (
    <>
      <MotionBackground />
      <div className="relative z-10">
        <MediaClientPage media={media} reports={reports} />
      </div>
    </>
  );
}
