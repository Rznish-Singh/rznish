import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Deployment — rznish chatbot docs',
  description: 'Deploying rznish chatbot to production.',
};

export default function DeploymentPage() {
  return (
    <DocsShell title="Deployment" description="Deploying rznish chatbot to production.">
      <h2 id="deploying-the-chat-app">Deploying the chat app</h2>
      <p>
        rznish chatbot is a standard Next.js app, so it deploys to any Next.js-compatible host
        (Vercel, a Node server, Docker, etc). The steps below assume Vercel, since it needs the
        least configuration.
      </p>
      <ol>
        <li>Push your repository to GitHub.</li>
        <li>
          Import it into{' '}
          <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">
            Vercel
          </a>
          .
        </li>
        <li>
          Add the environment variables from{' '}
          <code>.env.example</code> in the project settings.
        </li>
        <li>Deploy. Vercel runs the build and gives you a production URL.</li>
      </ol>

      <h2 id="database">Database</h2>
      <p>
        Provision a Postgres database (e.g.{' '}
        <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
          Neon
        </a>
        ) and set <code>POSTGRES_URL</code>. Run <code>pnpm db:migrate</code> once against the
        production database before your first deploy goes live.
      </p>

      <h2 id="deploying-this-docs-site">Deploying this docs site</h2>
      <p>
        This docs site is a separate Next.js project. Deploy it the same way — push to GitHub,
        import into Vercel, and set <code>GOOGLE_GENERATIVE_AI_API_KEY</code> for the Ask AI
        feature. See <a href="/ask-ai/configuration">Ask AI Configuration</a>.
      </p>
    </DocsShell>
  );
}
