import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Setup — rznish chatbot docs',
  description: 'Environment variables and local setup for rznish chatbot.',
};

export default function SetupPage() {
  return (
    <DocsShell title="Setup" description="Environment variables and local setup for rznish chatbot.">
      <h2 id="environment-variables">Environment Variables</h2>
      <p>Create a <code>.env.local</code> file in the chat app with:</p>
      <pre>
        <code>{`AUTH_SECRET=****
GOOGLE_GENERATIVE_AI_API_KEY=****
OPENAI_API_KEY=****
POSTGRES_URL=****
BLOB_READ_WRITE_TOKEN=****
REDIS_URL=****`}</code>
      </pre>
      <ul>
        <li>
          <code>AUTH_SECRET</code> — generate with <code>openssl rand -base64 32</code>.
        </li>
        <li>
          <code>GOOGLE_GENERATIVE_AI_API_KEY</code> — from{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer">
            aistudio.google.com/apikey
          </a>
          .
        </li>
        <li>
          <code>OPENAI_API_KEY</code> — from{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
            platform.openai.com/api-keys
          </a>
          .
        </li>
        <li>
          <code>POSTGRES_URL</code> — a Postgres connection string (e.g.{' '}
          <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
            Neon
          </a>
          ).
        </li>
      </ul>

      <h2 id="install-run">Install &amp; Run</h2>
      <ol>
        <li>
          Install dependencies
          <pre>
            <code>pnpm install</code>
          </pre>
        </li>
        <li>
          Run database migrations
          <pre>
            <code>pnpm db:migrate</code>
          </pre>
        </li>
        <li>
          Start the dev server
          <pre>
            <code>pnpm dev</code>
          </pre>
        </li>
      </ol>
      <p>
        The app runs on{' '}
        <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
          localhost:3000
        </a>
        .
      </p>

      <blockquote>
        If sign-in fails with a database error, it usually means migrations haven&apos;t been run yet
        against your <code>POSTGRES_URL</code> — re-run <code>pnpm db:migrate</code>.
      </blockquote>
    </DocsShell>
  );
}
