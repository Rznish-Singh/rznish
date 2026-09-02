'use client';

import { MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAskAi } from '@/components/ask-ai-context';

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
      <span className="inline">Ask AI</span>
    </Button>
  );
}
