import { DocsShell } from '@/components/docs/docs-shell';

export const metadata = {
  title: 'Ask AI Configuration — rznish chatbot docs',
  description: 'Environment variables and options for the Ask AI panel.',
};

export default function AskAiConfigurationPage() {
  return (
    <DocsShell
      title="Configuration"
      description="Environment variables and options for the Ask AI panel."
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
            <td>
              <code>app/api/ask/route.ts</code>
            </td>
            <td>API route that calls Gemini</td>
          </tr>
          <tr>
            <td>
              <code>components/ask-ai-panel.tsx</code>
            </td>
            <td>The slide-in chat panel UI</td>
          </tr>
          <tr>
            <td>
              <code>components/ask-ai-trigger.tsx</code>
            </td>
            <td>The header &quot;Ask AI&quot; button</td>
          </tr>
          <tr>
            <td>
              <code>components/ask-ai-context.tsx</code>
            </td>
            <td>Shared open/close state + keyboard shortcut</td>
          </tr>
        </tbody>
      </table>

      <h2 id="customizing-suggested-questions">Customizing suggested questions</h2>
      <p>
        Edit the <code>suggestedQuestions</code> array in <code>components/ask-ai-panel.tsx</code> to
        change the starter prompts shown in the empty state.
      </p>

      <h2 id="changing-the-model">Changing the model</h2>
      <p>
        <code>app/api/ask/route.ts</code> calls the <code>gemini-3.1-flash-lite</code> model by
        default. Swap the model ID in that file to use a different Gemini model.
      </p>
    </DocsShell>
  );
}
