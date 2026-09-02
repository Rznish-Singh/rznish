'use client';

import { useEffect, useState } from 'react';

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function Toc({ containerId }: { containerId: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    const nodes = Array.from(container.querySelectorAll('h2, h3'));
    const items = nodes.map((node) => ({
      id: node.id,
      text: node.textContent ?? '',
      level: node.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px' },
    );

    for (const node of nodes) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [containerId]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pl-4 xl:block">
      <div className="mb-2 text-sm font-semibold">On this page</div>
      <nav className="flex flex-col gap-2 border-l pl-3">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={
              'text-sm transition-colors hover:text-foreground ' +
              (h.level === 3 ? 'pl-3 ' : '') +
              (activeId === h.id ? 'font-medium text-foreground' : 'text-muted-foreground')
            }
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
