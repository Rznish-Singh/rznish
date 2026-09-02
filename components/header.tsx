import { GithubIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { AskAiPanel } from '@/components/ask-ai-panel';
import { AskAiTrigger } from '@/components/ask-ai-trigger';
import { MobileNav } from '@/components/mobile-nav';
import { SearchBarTrigger, SearchIconButton, SearchPanel } from '@/components/search-dialog';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { docsHomeHref } from '@/lib/nav';
import { TextFlip } from '@/components/text-flip';

const flipWords = ['chatbot', 'RAG model', 'UI dictionary', 'AI assistant'];


export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-2 px-4 md:px-8">
        <div className="flex min-w-0 items-center gap-1.5">
          <MobileNav />
           {/* Mobile / small screens: just "rznish" */}
            <Link href="/" className="flex shrink-0 items-center sm:hidden">
              <span className="truncate text-sm font-bold">rznish</span>
            </Link>
            {/* Medium / large screens: "rznish chatbot / Docs" */}   
            
            <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
              <Link href="/" className="flex shrink-0 items-center">
                <Image
                  src="/logo.svg"
                  alt="rznish chatbot logo"
                  width={24}
                  height={24}
                  className="h-6 dark:hidden md:h-7"
                />
                <Image
                  src="/logo-dark.svg"
                  alt="rznish chatbot logo"
                  width={24}
                  height={24}
                  className="hidden h-6 dark:block md:h-7"
                />
                <span className="ml-2 self-center truncate text-sm font-bold md:ml-3 md:text-base">
                  rznish 
                </span>
              </Link>
              <span className="shrink-0 text-muted-foreground/50">/</span>
               <TextFlip className="col-start-1 font-semibold row-start-1">
              {flipWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </TextFlip>
             
              <span className="shrink-0 text-muted-foreground/50">/</span>
              <Link
                href={docsHomeHref}
                className="shrink-0 truncate text-sm font-medium text-muted-foreground hover:text-foreground md:text-base"
              >
                Docs
              </Link>
              
               
             {/* <span className="invisible col-start-1 row-start-1" aria-hidden>
              {flipWords.reduce((a, b) => (a.length >= b.length ? a : b))}
            </span>  */}
             
            
            </div>
        </div>

        <div className="flex flex-1 justify-end gap-2">
          <div className="hidden sm:flex">
             <SearchBarTrigger />
          </div>
           <div className="flex sm:hidden">
            <SearchIconButton />
         </div>
          <AskAiTrigger />
          <div className="hidden sm:flex">
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/rznish-singh" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-[18px]" />
              </a>
            </Button>
          </div>
        </div>
      </div>
 <SearchPanel />
      <AskAiPanel />
    </header>
  );
}
