'use client';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type CodeBlockProps = {
  code: string;
  lang?: string;
  filename?: string;
  className?: string;
};

/**
 * A shadcn-style code panel: filename header + copy button + shiki syntax
 * highlighting. Falls back to a plain <pre> until the highlighted HTML is
 * ready, so the block never flashes empty.
 */
export function CodeBlock({ code, lang = 'tsx', filename, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const trimmed = code.replace(/\n$/, '');

  useEffect(() => {
    let cancelled = false;

    import('shiki').then(({ codeToHtml }) =>
      codeToHtml(trimmed, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark-default' },
      }),
    ).then((result) => {
      if (!cancelled) {
        setHtml(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [trimmed, lang]);

  async function handleCopy() {
    await navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        'not-prose overflow-hidden rounded-lg border border-border/70 bg-muted/70',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {filename ?? lang}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {copied ? (
            <>
              <CheckIcon className="size-3.5" />
              Copied
            </>
          ) : (
            <>
              <CopyIcon className="size-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {html ? (
        <div
          className="max-h-[560px] overflow-auto p-4 text-sm leading-[1.6] [&>pre]:bg-transparent! [&_code]:bg-transparent!"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="max-h-[560px] overflow-auto p-4 text-sm leading-[1.6]">
          <code>{trimmed}</code>
        </pre>
      )}
    </div>
  );
}