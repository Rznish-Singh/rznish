'use client';

import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { docsNav } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Toggle navigation"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="size-5" />
      </Button>
      <SheetContent side="left" className="w-[85%] pr-0 sm:max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle>rznish chatbot</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-6 overflow-y-auto px-6 py-4">
          {docsNav.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <div className="text-sm font-semibold">{section.title}</div>
              <div className="flex flex-col gap-2 pl-2">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'text-sm text-muted-foreground hover:text-foreground',
                      pathname === link.href && 'font-medium text-foreground',
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
