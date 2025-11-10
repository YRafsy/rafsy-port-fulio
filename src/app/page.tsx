
import { MotionBackground } from "@/components/three/MotionBackground";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import type { Metadata } from 'next';
import { ChatbotTrigger } from "@/components/sections/ChatbotTrigger";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import LatestPosts from "@/components/sections/LatestPosts";

export const metadata: Metadata = {
  title: "Rafsy's Portfolio | AI Engineer & Full-Stack Developer",
  description: "The official portfolio of Yasar T. H. Rafsy, an AI-Enabled Electrical Engineer and Full-Stack Developer specializing in building intelligent systems where hardware meets software.",
  keywords: "AI Engineer, Full-Stack Developer, Next.js, Python, Genkit, IoT, Electrical Engineering, Portfolio, Yasar, Rafsy",
  openGraph: {
      title: "Yasar T. H. Rafsy | AI Engineer & Full-Stack Developer",
      description: "Explore the projects, blog, and AI-driven interactive features of a professional bridging hardware and software.",
      type: "website",
      url: "https://www.y-h-rafsy.com", // Replace with your actual domain
      images: [
          {
              url: "/images/og-image.png", // Make sure this path is correct
              width: 1200,
              height: 630,
              alt: "Yasar T. H. Rafsy's Portfolio",
          },
      ],
  },
  twitter: {
      card: 'summary_large_image',
      title: "Yasar T. H. Rafsy | AI Engineer & Full-Stack Developer",
      description: "Explore the projects, blog, and AI-driven interactive features of a professional bridging hardware and software.",
      images: ["/images/og-image.png"], // Make sure this path is correct
  },
};


// Keep a simple skeleton for sections that are heavier and benefit from a clear loading state.
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
    <div className="flex justify-center">
      <Skeleton className="h-48 w-full max-w-4xl" />
    </div>
  </div>
);

// Statically import above-the-fold content for fast initial load.
// Dynamically import below-the-fold content.
const Skills = dynamic(() => import('@/components/sections/Skills'), { loading: () => <LoadingSkeleton /> });
const Experience = dynamic(() => import('@/components/sections/Experience'), { loading: () => <LoadingSkeleton /> });
const JobFitAnalysis = dynamic(() => import('@/components/sections/JobFitAnalysis'), { loading: () => <LoadingSkeleton /> });
const CreativeNexus = dynamic(() => import('@/components/sections/CreativeNexus'), { loading: () => <LoadingSkeleton /> });
const Puzzle = dynamic(() => import('@/components/sections/Puzzle'), { loading: () => <LoadingSkeleton /> });
const HireMe = dynamic(() => import('@/components/sections/HireMe'), { loading: () => <LoadingSkeleton /> });
const Contact = dynamic(() => import('@/components/sections/Contact'), { loading: () => <LoadingSkeleton /> });

// Dynamically import the Chatbot with SSR disabled.
// It will be replaced by the ChatbotTrigger component on the server.
const Chatbot = dynamic(() => import('@/components/sections/Chatbot'), { 
  ssr: false,
  loading: () => <ChatbotTrigger isLoading={true} /> 
});


export default function Home() {
  return (
    <>
      <MotionBackground />
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <JobFitAnalysis />
      <CreativeNexus />
      <LatestPosts />
      <Puzzle />
      <HireMe />
      <Contact />
      <Chatbot />
    </>
  );
}
