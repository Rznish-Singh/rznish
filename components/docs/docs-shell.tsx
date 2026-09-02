import type { ReactNode } from 'react';
import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { Toc } from '@/components/docs/toc';

export function DocsShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const contentId = 'docs-content';

  return (
    <div className="mx-auto flex max-w-screen-2xl gap-8 px-4 md:px-8">
      <DocsSidebar />
      <main className="min-w-0 flex-1 py-8">
        <div id={contentId} className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="mb-2">{title}</h1>
          {description && (
            <p className="lead text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      </main>
      <Toc containerId={contentId} />
    </div>
  );
}
