import { GithubIcon, GlobeIcon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:justify-between md:px-8">
        <p>Built by rznish · © 2026</p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/rznish"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
            aria-label="GitHub"
          >
            <GithubIcon className="size-[18px]" />
          </a>
          <a
            href="https://rznish.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
            aria-label="rznish.dev"
          >
            <GlobeIcon className="size-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
