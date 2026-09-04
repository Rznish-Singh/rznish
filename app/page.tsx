import {
  GithubIcon,
  LockIcon,
  MessageCircleIcon,
  SearchIcon,
  SmartphoneIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { GlowCardGrid, GlowFeatureCard } from '@/components/glow-card-grid';
import { TextFlip } from '@/components/text-flip';
import Timesline from '@/components/timeline';
import { TreeDecoration } from '@/components/tree-decoration';

const flipWords = ['chatbot', 'RAG model', 'UI dictionary', 'AI assistant'];

const features: {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  external?: boolean;
}[] = [
  {
    title: 'Gemini-Powered',
    description:
      'Chats run on Google Gemini 2.5, with GPT-4o Mini available as a second provider.',
    icon: <SparklesIcon className="size-5" />,
    href: '/getting-started/introduction',
  },
  {
    title: 'Auth book',
    description:
      ' It is a collection of guides, recommendations, and examples for implementing auth in web applications.',
    icon: <LockIcon className="size-5" />,
    href: 'https://auth.pilcrowonpaper.com/',
    external: true,
  },
  {
    title: 'Ask AI',
    description: 'A built-in assistant answers questions about these docs right from the page.',
    icon: <MessageCircleIcon className="size-5" />,
    href: '/ask-ai/overview',
  },
  {
    title: 'Mobile Ready',
    description:
      'A fully responsive layout — chat, docs, and search all work the same on phones and desktops.',
    icon: <SmartphoneIcon className="size-5" />,
  },
  {
    title: 'Indexed Search',
    description: 'Jump to any doc instantly with search powered by ⌘K.',
    icon: <SearchIcon className="size-5" />,
  },
  {
    title: 'Open Source',
    description: 'Built with shadcn/ui, Next.js, and the Vercel AI SDK.',
    icon: <GithubIcon className="size-5" />,
    href: 'https://github.com/rznish',
    external: true,
  },
];

export default function HomePage() {
  return (
    // <div className="mx-auto max-w-screen-lg px-4 pb-24 md:px-8">
    //   <section className="flex flex-col items-center gap-6 pt-20 pb-16 text-center md:pt-28">
         
 <div className="relative">
      <TreeDecoration side="left" />
      <TreeDecoration side="right" />

      <div className="mx-auto max-w-screen-lg px-4 pb-24 md:px-8">
    <section className="flex flex-col items-center gap-6 pt-20 pb-16 text-center md:pt-28">
        <h1 className="flex flex-wrap items-center justify-center gap-x-3 text-balance text-4xl font-bold tracking-tighter md:text-6xl lg:leading-[1.1]">
          <span>rznish  </span>
          <span className="inline-grid">
            {/* Placeholder sized to the widest word, so layout doesn't jump */}
            {/* <span className="invisible col-start-1 row-start-1" aria-hidden>
              {flipWords.reduce((a, b) => (a.length >= b.length ? a : b))}
            </span> */}
            {/* <TextFlip className="col-start-1 row-start-1">
              {flipWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </TextFlip> */}
          </span>
        </h1>

        <p className="max-w-xl text-balance text-lg text-muted-foreground">
          A personal AI chatbot built with Next.js and the AI SDK.
          <br className="hidden md:block" />
          Talks directly to Google Gemini — no gateway in between.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/getting-started/introduction">
              Get Started
              <span aria-hidden>→</span>
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-6">
            <a href="https://chat.rznish.dev" target="_blank" rel="noopener noreferrer">
              <MessageCircleIcon className="size-4" />
              Try It Out
              <span aria-hidden>→</span>
            </a>
          </Button>
        </div>
      </section>

      <section className="border-t pt-12">
  <GlowCardGrid
    glowColor="#6fe615"
    glowOpacity={0.45}
    glowBlur={45}
    glowSize={140}
  >
    {features.map((feature) => (
      <GlowFeatureCard
        key={feature.title}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
        href={feature.href}
        external={feature.external}
      />
    ))}
  </GlowCardGrid>
</section>
      <section className="border-t pt-12">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Timeline of rznish 
        </h2>
        <p className="mt-2 text-balance text-lg text-muted-foreground">
          A timeline of the development and evolution of rznish  ...
        </p>
      </section>
      <section className="border-t pt-12">
        <Timesline />
      </section>
      </div>
    </div>
  );
}
       
      
 