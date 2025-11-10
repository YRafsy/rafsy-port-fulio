
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import MusicPlayer from '@/components/shared/MusicPlayer';

const navLinks = [
  { href: '/#about', label: 'About', aria: 'Scroll to About section' },
  { href: '/#skills', label: 'Skills', aria: 'Scroll to Skills section' },
  { href: '/projects', label: 'Projects', aria: 'View all projects' },
  { href: '/#experience', label: 'Experience', aria: 'Scroll to Experience section' },
  { href: '/media', label: 'Media', aria: 'View creative media gallery' },
  { href: '/blog', label: 'Blog', aria: 'Read blog posts and reports' },
  { href: '/#puzzle', label: 'AI Puzzle', aria: 'Scroll to AI Puzzle Challenge' },
  { href: '/#contact', label: 'Contact', aria: 'Scroll to Contact section' },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Back to homepage">
            <span className="font-bold sm:inline-block font-headline text-lg">
              YTHR
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary relative after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                aria-label={link.aria}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden md:flex">
             <MusicPlayer />
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background">
              <Link href="/" className="mr-6 flex items-center space-x-2" onClick={closeSheet} aria-label="Back to homepage">
                 <span className="font-bold font-headline text-lg">YTHR</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="transition-colors hover:text-primary"
                      onClick={closeSheet}
                      aria-label={link.aria}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                 <div className="mt-6">
                  <MusicPlayer />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            className="flex items-center space-x-2 md:hidden"
            aria-label="Back to homepage"
          >
            <span className="font-bold font-headline">YTHR</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
