import { CodeBlock } from '@/components/docs/code-block';
import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Ask AI Configuration — rznish chatbot docs',
  description: 'Environment variables, source code, and how to reuse Ask AI on another site.',
};

const CONFIG_CODE = `/**
 * Ask AI — single point of customization.
 *
 * To reuse this feature on another site:
 *   1. Copy this file + the 4 files listed in "Where the code lives" below
 *      into your project.
 *   2. Edit everything in this object (branding, prompt, questions, theme).
 *   3. Set GOOGLE_GENERATIVE_AI_API_KEY in your .env.
 * You should not need to touch any component code for a standard integration.
 */
export const askAiConfig = {
  /** Site name used in the system prompt and default panel copy. */
  siteName: 'rznish chatbot',

  /** Text on the header trigger button. */
  triggerLabel: 'Ask AI',

  /** Title shown at the top of the slide-in panel. */
  panelTitle: 'Chat',

  /** Keyboard shortcut to toggle the panel (⌘/Ctrl + key). */
  shortcutKey: 'i',

  /** Max characters allowed in a single message. */
  maxLength: 1000,

  /** Starter prompts shown in the empty state — click to send immediately. */
  suggestedQuestions: [
    'What is rznish chatbot?',
    'How does rznish chatbot work?',
    'How can I customize rznish chatbot?',
    'How do I deploy rznish chatbot?',
  ],

  /**
   * The system prompt sent to the model on every request. Describes what
   * the assistant should know about and how it should behave. Rewrite this
   * entirely for your own product/docs.
   */
  systemPrompt: \`You are "Ask AI", the built-in documentation assistant for rznish chatbot's docs site.
rznish chatbot is a personal AI chat app built with Next.js and the Vercel AI SDK. It talks directly to
Google Gemini (and OpenAI as a secondary provider) with no gateway in between. It uses Auth.js for
authentication (email/password + guest sessions) and Postgres for storage. This docs site itself is
built with Next.js and shadcn/ui.
Answer questions about rznish chatbot clearly and concisely, in plain text (no markdown headers).
If a question is unrelated to rznish chatbot or these docs, answer briefly and helpfully anyway,
but keep your default focus on rznish chatbot.\`,

  /** Gemini model ID used by the API route. */
  model: 'gemini-3.1-flash-lite',

  /**
   * Tailwind classes for message bubbles — the only UI customization most
   * people need. Swap colors here instead of editing ask-ai-panel.tsx.
   */
  theme: {
    userBubble: 'ml-6 bg-blue-50 dark:bg-blue-950/40',
    userLabel: 'text-blue-600 dark:text-blue-400',
    assistantBubble: 'mr-6 bg-muted',
    assistantLabel: 'text-muted-foreground',
    suggestedQuestion: 'text-blue-600 hover:underline dark:text-blue-400',
  },
} as const;
`;

const CONTEXT_CODE = `'use client';

import { askAiConfig } from '@/lib/ask-ai.config';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AskAiContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

export function AskAiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === askAiConfig.shortcutKey) {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  }, [toggle]);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return <AskAiContext.Provider value={value}>{children}</AskAiContext.Provider>;
}

export function useAskAi() {
  const ctx = useContext(AskAiContext);
  if (!ctx) {
    throw new Error('useAskAi must be used within AskAiProvider');
  }
  return ctx;
}
`;

const TRIGGER_CODE = `'use client';

import { MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAskAi } from '@/components/ask-ai-context';
import { askAiConfig } from '@/lib/ask-ai.config';

export function AskAiTrigger() {
  const { toggle } = useAskAi();

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1.5 font-semibold"
      onClick={toggle}
    >
      <MessageCircleIcon className="size-4" />
      <span className="inline">{askAiConfig.triggerLabel}</span>
    </Button>
  );
}
`;

const PANEL_CODE = `'use client';

import { ArrowUpIcon, CopyIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAskAi } from '@/components/ask-ai-context';
import { askAiConfig } from '@/lib/ask-ai.config';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const MAX_LENGTH = askAiConfig.maxLength;
const suggestedQuestions = askAiConfig.suggestedQuestions;

export function AskAiPanel() {
  const { isOpen, close } = useAskAi();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading]);

  async function submit(question?: string) {
    const text = (question ?? input).trim();
    if (!text || isLoading) {
      return;
    }

    setErrorMessage('');
    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
        }),
      });

      if (!res.ok) {
        // The real reason is already logged server-side (terminal). Never
        // surface it to the user — show a generic message instead.
        const data = await res.json().catch(() => null);
        console.error('[ask-ai] request failed:', data);
        throw new Error('generic');
      }

      const data = await res.json();
      setMessages([...nextMessages, { role: 'assistant', content: data.answer }]);
    }
    catch {
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      setErrorMessage(
        isOffline
          ? 'No internet connection. Please check your connection and try again.'
          : 'Something went wrong. Please try again.',
      );
    }
    finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setErrorMessage('');
  }

  async function copyTranscript() {
    const text = messages
      .map((m) => \`\${m.role === 'user' ? 'You' : 'Ask AI'}: \${m.content}\`)
      .join('\\n\\n');
    await navigator.clipboard.writeText(text);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && close()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md" showCloseButton={false}>
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b px-4 py-3">
          <SheetTitle className="text-base font-semibold">{askAiConfig.panelTitle}</SheetTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7" disabled={messages.length === 0} onClick={copyTranscript}>
              <CopyIcon className="size-[15px]" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7" disabled={messages.length === 0} onClick={clearChat}>
              <Trash2Icon className="size-[15px]" />
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <XIcon className="size-[15px]" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0 px-4 py-4">
          {messages.length > 0 && (
            <div className="flex flex-col gap-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    'flex flex-col gap-1 rounded-lg px-3 py-2 ' +
                    (m.role === 'user' ? askAiConfig.theme.userBubble : askAiConfig.theme.assistantBubble)
                  }
                >
                  <div
                    className={
                      'text-xs font-medium ' +
                      (m.role === 'user' ? askAiConfig.theme.userLabel : askAiConfig.theme.assistantLabel)
                    }
                  >
                    {m.role === 'user' ? 'You' : 'Ask AI'}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>
                </div>
              ))}
              {isLoading && <div className="text-sm text-muted-foreground">Thinking...</div>}
              <div ref={scrollEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-4 py-3">
          {messages.length === 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={'text-left text-sm ' + askAiConfig.theme.suggestedQuestion}
                  onClick={() => submit(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {errorMessage && <div className="mb-3 text-sm text-destructive">{errorMessage}</div>}

          <p className="mb-2 text-xs text-muted-foreground">
            Tip: You can open and close chat with{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">⌘</kbd>{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">
              {askAiConfig.shortcutKey.toUpperCase()}
            </kbd>
          </p>
          <div className="rounded-lg border p-2">
            <textarea
              value={input}
              maxLength={MAX_LENGTH}
              rows={3}
              placeholder="What would you like to know?"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {input.length} / {MAX_LENGTH}
              </span>
              <Button size="icon" className="size-8 rounded-full" disabled={!input.trim() || isLoading} onClick={() => submit()}>
                <ArrowUpIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
`;

const ROUTE_CODE = `import { type NextRequest, NextResponse } from 'next/server';
import { askAiConfig } from '@/lib/ask-ai.config';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { message?: string; history?: ChatMessage[] }
    | null;

  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GOOGLE_GENERATIVE_AI_API_KEY is not configured on this server.' },
      { status: 500 },
    );
  }

  const history = (body?.history ?? []).slice(-8);

  const contents = [
    ...history.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  let response: Response;
  try {
    response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/\${askAiConfig.model}:generateContent?key=\${apiKey}\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: askAiConfig.systemPrompt }] },
          contents,
        }),
      },
    );
  }
  catch (error) {
    console.error('[ask-ai] Gemini request failed:', error);
    return NextResponse.json(
      { error: 'Could not reach the Gemini API. Check GOOGLE_GENERATIVE_AI_API_KEY and try again.' },
      { status: 502 },
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('[ask-ai] Gemini request failed:', data);
    const geminiMessage = data?.error?.message;
    return NextResponse.json(
      { error: geminiMessage ? \`Gemini error: \${geminiMessage}\` : 'The AI provider returned an error.' },
      { status: response.status },
    );
  }

  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!answer) {
    console.error('[ask-ai] Gemini returned no answer:', JSON.stringify(data));
    return NextResponse.json(
      { error: 'The AI provider did not return an answer.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ answer });
}
`;

export default function AskAiConfigurationPage() {
  return (
    <DocsShell
      title="Configuration"
      description="Environment variables, source code, and how to reuse Ask AI on another site."
    >
      <h2 id="environment-variable">Environment Variable</h2>
      <p>
        Ask AI needs its own Gemini key set in the <strong>docs site&apos;s</strong>{' '}
        <code>.env</code> (this is a separate Next.js project from the chat app, so it needs its own
        copy):
      </p>
      <pre>
        <code>GOOGLE_GENERATIVE_AI_API_KEY=****</code>
      </pre>
      <p>
        Get a key at{' '}
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
          aistudio.google.com/apikey
        </a>
        .
      </p>

      <h2 id="where-the-code-lives">Where the code lives</h2>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>lib/ask-ai.config.ts</code></td>
            <td>
              <strong>The only file most people need to edit</strong> — branding, prompt,
              suggested questions, model, colors
            </td>
          </tr>
          <tr>
            <td><code>app/api/ask/route.ts</code></td>
            <td>API route that calls Gemini</td>
          </tr>
          <tr>
            <td><code>components/ask-ai-panel.tsx</code></td>
            <td>The slide-in chat panel UI</td>
          </tr>
          <tr>
            <td><code>components/ask-ai-trigger.tsx</code></td>
            <td>The header &quot;Ask AI&quot; button</td>
          </tr>
          <tr>
            <td><code>components/ask-ai-context.tsx</code></td>
            <td>Shared open/close state + keyboard shortcut</td>
          </tr>
        </tbody>
      </table>

      <h2 id="where-to-change-what">Where to change what</h2>
      <p>Before editing any component, check this table — almost every change is a config edit, not a UI edit:</p>
      <table>
        <thead>
          <tr>
            <th>You want to change...</th>
            <th>Edit this</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>What the assistant knows / how it answers</td>
            <td><code>systemPrompt</code> in the config</td>
          </tr>
          <tr>
            <td>Starter/suggested questions</td>
            <td><code>suggestedQuestions</code> in the config</td>
          </tr>
          <tr>
            <td>Header button text, panel title, keyboard shortcut, char limit</td>
            <td><code>triggerLabel</code>, <code>panelTitle</code>, <code>shortcutKey</code>, <code>maxLength</code> in the config</td>
          </tr>
          <tr>
            <td>Message bubble colors</td>
            <td><code>theme</code> in the config</td>
          </tr>
          <tr>
            <td>Which Gemini model is called</td>
            <td><code>model</code> in the config</td>
          </tr>
          <tr>
            <td>Bubble shape, spacing, layout of the chat log</td>
            <td>the <code>messages.map(...)</code> block in <code>ask-ai-panel.tsx</code></td>
          </tr>
          <tr>
            <td>Icons (send, copy, trash, close, trigger)</td>
            <td>the <code>lucide-react</code> imports at the top of <code>ask-ai-panel.tsx</code> / <code>ask-ai-trigger.tsx</code></td>
          </tr>
          <tr>
            <td>Panel width or which edge it slides in from</td>
            <td><code>SheetContent</code> className (width) and <code>Sheet</code>/<code>SheetContent</code>&apos;s <code>side</code> prop in <code>ask-ai-panel.tsx</code></td>
          </tr>
          <tr>
            <td>Trigger button style (outline vs. solid, size)</td>
            <td>the <code>Button</code> props in <code>ask-ai-trigger.tsx</code></td>
          </tr>
          <tr>
            <td>How errors are shown to the user</td>
            <td>the <code>catch</code> block in <code>submit()</code>, inside <code>ask-ai-panel.tsx</code></td>
          </tr>
        </tbody>
      </table>
      <p>
        In short: <strong>content and colors → config file</strong>,{' '}
        <strong>layout and structure → component files</strong>.
      </p>

      <h2 id="full-source">Full source — copy directly into your project</h2>
      <p>Copy each block below into the matching path in your own Next.js (App Router) project.</p>

      <h3 id="source-config"><code>lib/ask-ai.config.ts</code></h3>
      <CodeBlock code={CONFIG_CODE} lang="tsx" filename="lib/ask-ai.config.ts" />

      <h3 id="source-context"><code>components/ask-ai-context.tsx</code></h3>
      <CodeBlock code={CONTEXT_CODE} lang="tsx" filename="components/ask-ai-context.tsx" />

      <h3 id="source-trigger"><code>components/ask-ai-trigger.tsx</code></h3>
      <CodeBlock code={TRIGGER_CODE} lang="tsx" filename="components/ask-ai-trigger.tsx" />

      <h3 id="source-panel"><code>components/ask-ai-panel.tsx</code></h3>
      <CodeBlock code={PANEL_CODE} lang="tsx" filename="components/ask-ai-panel.tsx" />

      <h3 id="source-route"><code>app/api/ask/route.ts</code></h3>
      <CodeBlock code={ROUTE_CODE} lang="tsx" filename="app/api/ask/route.ts" />

      <h2 id="wiring-it-up">Wiring it up in a new project</h2>
      <p>After copying the five files above, plus the shadcn/ui <code>button</code>, <code>sheet</code>, and <code>scroll-area</code> primitives:</p>
      <CodeBlock
        lang="bash"
        filename="terminal"
        code={`npm install lucide-react
npx shadcn@latest add button sheet scroll-area`}
      />
      <p>Wrap your root layout in the provider and mount the panel once:</p>
      <CodeBlock
        lang="tsx"
        filename="app/layout.tsx"
        code={`import { AskAiProvider } from '@/components/ask-ai-context';
import { AskAiPanel } from '@/components/ask-ai-panel';

export default function RootLayout({ children }) {
  return (
    <AskAiProvider>
      {children}
      <AskAiPanel />
    </AskAiProvider>
  );
}`}
      />
      <p>Then drop the trigger button wherever you want it — usually your header:</p>
      <CodeBlock
        lang="tsx"
        filename="components/header.tsx"
        code={`import { AskAiTrigger } from '@/components/ask-ai-trigger';

<AskAiTrigger />`}
      />
      <p>Finally, edit <code>lib/ask-ai.config.ts</code> for your own branding and prompt, and set your API key.</p>

      <h2 id="changing-the-model">Changing the model</h2>
      <p>
        The API route reads the model ID from <code>askAiConfig.model</code>, currently{' '}
        <code>gemini-3.1-flash-lite</code>. Change it in the config — no need to touch{' '}
        <code>route.ts</code> itself.
      </p>
    </DocsShell>
  );
}