'use client';

 import { ArrowUpIcon, CopyIcon, Trash2Icon, XIcon } from 'lucide-react';
 import { useEffect, useRef, useState } from 'react';
import { useAskAi } from '@/components/ask-ai-context';
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

const MAX_LENGTH = 1000;

const suggestedQuestions = [
  'What is rznish chatbot?',
  'How does rznish chatbot work?',
  'How can I customize rznish chatbot?',
  'How do I deploy rznish chatbot?',
];

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
         ); }
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
      .map((m) => `${m.role === 'user' ? 'You' : 'Ask AI'}: ${m.content}`)
      .join('\n\n');
    await navigator.clipboard.writeText(text);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && close()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md" showCloseButton={false}>
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b px-4 py-3">
          <SheetTitle className="text-base font-semibold">Chat</SheetTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={messages.length === 0}
              onClick={copyTranscript}
            >
              <CopyIcon className="size-[15px]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={messages.length === 0}
              onClick={clearChat}
            >
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
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {m.role === 'user' ? 'You' : 'Ask AI'}
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-sm text-muted-foreground">Thinking...</div>
              )}
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
                  className="text-left text-sm text-blue-600 hover:underline dark:text-blue-400"
                  onClick={() => submit(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {errorMessage && (
            <div className="mb-3 text-sm text-destructive">{errorMessage}</div>
          )}

          <p className="mb-2 text-xs text-muted-foreground">
            Tip: You can open and close chat with{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">⌘</kbd>{' '}
            <kbd className="rounded border bg-muted px-1 py-0.5 text-[10px]">I</kbd>
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
              <Button
                size="icon"
                className="size-8 rounded-full"
                disabled={!input.trim() || isLoading}
                onClick={() => submit()}
              >
                <ArrowUpIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
