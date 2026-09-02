import Link from 'next/link';
import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Introduction — rznish chatbot docs',
  description: 'rznish chatbot is a personal AI chatbot built with Next.js, the AI SDK, and Google Gemini.',
};

export default function IntroductionPage() {
  return (
    <DocsShell
      title="Introduction"
      description="rznish chatbot is a personal AI chatbot built with Next.js, the AI SDK, and Google Gemini."
    >
      <h2 id="what-is-rznish-chatbot">What is rznish chatbot?</h2>
      <p>
        <strong>rznish chatbot</strong> is a self-hosted AI chat app. It&apos;s built on Next.js and the
        Vercel AI SDK, but talks <strong>directly</strong> to model providers — Google Gemini and
        OpenAI — instead of going through a third-party gateway.
      </p>

      <h2 id="features">Features</h2>
      <ul>
        <li>
          <strong>Gemini-powered</strong> — Gemini 2.5 Pro, Flash, and Flash Lite, plus GPT-4o Mini as a
          second provider.
        </li>
        <li>
          <strong>Real auth</strong> — email/password and guest sessions via Auth.js, backed by Postgres.
        </li>
        <li>
          <strong>Persistent chat history</strong> — every conversation is saved and searchable.
        </li>
        <li>
          <strong>Artifacts</strong> — the assistant can create and edit documents, code, and sheets
          alongside the chat.
        </li>
        <li>
          <strong>Ask AI</strong> — this documentation site has a built-in assistant that can answer
          questions about the docs. See{' '}
          <Link href="/ask-ai/overview">Ask AI</Link>.
        </li>
        <li>
          <strong>Mobile friendly</strong> — the chat app and this docs site are both fully responsive.
        </li>
      </ul>

      <h2 id="tech-stack">Tech Stack</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Choice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Framework</td>
            <td>Next.js (App Router)</td>
          </tr>
          <tr>
            <td>AI</td>
            <td>
              Vercel AI SDK + <code>@ai-sdk/google</code> + <code>@ai-sdk/openai</code>
            </td>
          </tr>
          <tr>
            <td>Auth</td>
            <td>Auth.js (Credentials + guest)</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>Postgres (Drizzle ORM)</td>
          </tr>
          <tr>
            <td>UI</td>
            <td>shadcn/ui + Tailwind CSS</td>
          </tr>
          <tr>
            <td>Docs (this site)</td>
            <td>Next.js + shadcn/ui</td>
          </tr>
        </tbody>
      </table>

      <h2 id="credits">Credits</h2>
      <ul>
        <li>
          <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
            shadcn/ui
          </a>{' '}
          for the component system this docs site is built on.
        </li>
        <li>
          <a href="https://ai-sdk.dev" target="_blank" rel="noopener noreferrer">
            Vercel AI SDK
          </a>{' '}
          for the chat/streaming primitives.
        </li>
      </ul>

      <h2 id="license">License</h2>
      <p>MIT</p>
    </DocsShell>
  );
}
