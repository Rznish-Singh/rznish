'use client';

import { FileTextIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useSearch } from '@/components/search-context';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { SearchIcon, type SearchIconHandle } from '@/components/ui/search-icon';
import { docsNav } from '@/lib/nav';

/** Full "Search..." bar — shown on sm+ screens. */
export function SearchBarTrigger() {
  const { open } = useSearch();
  const iconRef = useRef<SearchIconHandle>(null);

  return (
    <Button
      variant="outline"
      className="h-8 w-full justify-start self-center rounded-md px-3 font-normal text-muted-foreground hover:text-accent-foreground md:w-40 lg:w-60"
      onClick={open}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <SearchIcon ref={iconRef} size={16} isAnimated={false} className="mr-2" />
      <span className="mr-auto overflow-hidden">Search...</span>
      <kbd className="ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[11px] font-medium md:inline-flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}

/** Icon-only search trigger — shown below sm, next to Ask AI. */
export function SearchIconButton() {
  const { open } = useSearch();
  const iconRef = useRef<SearchIconHandle>(null);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Search"
      onClick={open}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <SearchIcon ref={iconRef} size={18} isAnimated={false} />
    </Button>
  );
}

/** The actual command palette — mount this once (in the header). */
export function SearchPanel() {
  const { isOpen, close } = useSearch();
  const router = useRouter();

  return (
    <CommandDialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <CommandInput placeholder="Search docs..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {docsNav.map((section) => (
          <CommandGroup key={section.title} heading={section.title}>
            {section.links.map((link) => (
              <CommandItem
                key={link.href}
                value={`${section.title} ${link.title} ${link.description}`}
                onSelect={() => {
                  close();
                  router.push(link.href);
                }}
              >
                <FileTextIcon className="mr-2 size-4" />
                {link.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}