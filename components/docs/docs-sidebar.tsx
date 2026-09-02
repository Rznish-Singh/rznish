'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsNav } from '@/lib/nav';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-4 lg:block">
      <nav className="flex flex-col gap-6">
        {docsNav.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <div className="text-sm font-semibold">{section.title}</div>
            <div className="flex flex-col gap-2 border-l pl-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm text-muted-foreground transition-colors hover:text-foreground',
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
    </aside>
  );
}
