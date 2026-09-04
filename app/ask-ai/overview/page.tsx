import Link from 'next/link';
import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Ask AI Overview — rznish chatbot docs',
  description: 'A built-in AI assistant that answers questions about these docs.',
};

export default function AskAiOverviewPage() {
  return (
    <DocsShell
      title="Overview"
      description="A built-in AI assistant that answers questions about these docs."
    >
      <h2 id="what-is-ask-ai">What is Ask AI?</h2>
      <p>
        <strong>Ask AI</strong> is a small chat assistant built into this documentation site. Click
        the <strong>Ask AI</strong> button in the header (or press <kbd>⌘</kbd> <kbd>I</kbd>) to open
        it from anywhere on the site.
      </p>

      <div className="not-prose grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-5">
          <div className="mb-1 font-semibold">Fast answers</div>
          <p className="text-sm text-muted-foreground">
            Ask a question in plain English and get a direct answer, without leaving the page
            you&apos;re on.
          </p>
        </div>
        <div className="rounded-xl border p-5">
          <div className="mb-1 font-semibold">Keyboard shortcut</div>
          <p className="text-sm text-muted-foreground">
            Toggle the panel open or closed anytime with <strong>⌘ I</strong> (or{' '}
            <strong>Ctrl I</strong> on Windows/Linux).
          </p>
        </div>
      </div>

      <h2 id="how-it-works">How it works</h2>
      <ol>
        <li>You type a question into the panel.</li>
        <li>
          The request goes to an API route (<code>/api/ask</code>) in this docs site.
        </li>
        <li>
          That route calls <strong>Google Gemini</strong> and returns a plain-text answer.
        </li>
      </ol>

      <blockquote>
        Ask AI runs on the same Gemini API key as the main chat app (
        <code>GOOGLE_GENERATIVE_AI_API_KEY</code>), just configured separately for this docs site.
        See <Link href="/ask-ai/configuration">Configuring Ask AI</Link>.
      </blockquote>

      <h2 id="suggested-questions">Suggested questions</h2>
      <p>
        The panel ships with a few starter prompts, defined in{' '}
        <code>lib/ask-ai.config.ts</code>:
      </p>
      <ul>
        <li>What is rznish chatbot?</li>
        <li>How does rznish chatbot work?</li>
        <li>How can I customize rznish chatbot?</li>
        <li>How do I deploy rznish chatbot?</li>
      </ul>
      <p>Click any of them to send it immediately, or type your own question.</p>

      <h2 id="its-a-template">It&apos;s a drop-in template</h2>
      <p>
        Ask AI isn&apos;t specific to this site — it&apos;s built as a small, self-contained
        feature (6 files, one config object, one env var) meant to be copied into any Next.js
        project. Every piece of branding, copy, and color lives in a single file,{' '}
        <code>lib/ask-ai.config.ts</code>, so reusing it elsewhere is usually just:
      </p>
      <ol>
        <li>Copy the files over.</li>
        <li>Edit the config object.</li>
        <li>Set your own Gemini API key.</li>
      </ol>
      <p>
        See <Link href="/ask-ai/configuration">Configuration</Link> for the full file list, the
        complete copyable source, and exactly which file to edit for any given change — content or
        UI.
      </p>
    </DocsShell>
  );
}