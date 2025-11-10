
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AudioProvider } from '@/context/AudioContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const fontSourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
        <head>
          {/* This head is now for fallbacks and icons, metadata is handled in pages */}
          <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        </head>
       <body className={cn(
        "font-body antialiased",
        fontInter.variable,
        fontSpaceGrotesk.variable,
        fontSourceCodePro.variable
      )}>
        <AudioProvider>
            <div className="relative flex flex-col min-h-screen z-10">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
        </AudioProvider>
      </body>
    </html>
  );
}
