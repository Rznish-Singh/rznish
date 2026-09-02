import type { Metadata } from 'next';
import { AskAiProvider } from '@/components/ask-ai-context';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { SearchProvider } from '@/components/search-context'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip"
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'rznish chatbot — Docs',
  description:
    'Docs for rznish chatbot — a personal AI chatbot built with Next.js, the AI SDK, and Google Gemini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AskAiProvider>
            <SearchProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
            </SearchProvider>
          </AskAiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
