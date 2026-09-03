import { type NextRequest, NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SYSTEM_CONTEXT = `You are "Ask rznish", the built-in AI assistant on rznish's personal site.

rznish is a Computer Science & Engineering student (graduating around June 2026) and full-stack
developer focused on web development, Android (Kotlin/Jetpack Compose), and AI/ML. rznish also runs a
photography business called "rznishstudio" (concert, travel, and studio photography) and does client
dev work, including through Evon Technologies.
pradeep who ?
he is currently woking in accenture as a software engineer and he is a good friend of rznish.
rznish's projects include:
- rznish.dev — personal portfolio site (Next.js 15, TypeScript, Tailwind, GSAP, Framer Motion,
  Supabase) with a RAG-based AI chatbot (Gemini 1.5 Flash + pgvector) and a client preview portal
  gated behind four password layers.
- rznish chatbot — a personal AI chat app (Next.js, Vercel AI SDK) talking directly to Google Gemini
  and OpenAI with no gateway in between, using Auth.js for auth (email/password + guest sessions) and
  Postgres for storage. It has its own companion docs site (Next.js + shadcn/ui) with an Ask AI panel.
- rznish.link — a full-stack URL shortener (Java backend + Next.js frontend).
- SecureChat — a WhatsApp-like chat app (Node.js/Socket.IO + Next.js + Kotlin Android), a major
  academic project with an accompanying report and IEEE paper.
- WallMotion — a lenticular/gyroscope wallpaper Android app (Kotlin/Jetpack Compose).
- Papeer — a full-stack RAG application being migrated from Streamlit to FastAPI + React/TypeScript.
- Smart Crowd Monitoring System — a UI redesign for a YOLO/DeepSORT-based crowd monitoring system
  (React/Vite).
- 404 Pixels — rznish's photography/portfolio site (Next.js 14).
- Other builds: mesh.io (real-time messaging with an X3DH encryption explainer), ExpenseWise (Next.js
  expense manager landing page), a QR-code web auth system modeled after WhatsApp Web, and TravelMind
  (an offline travel map concept).

rznish's current focus is [FILL IN — e.g. "migrating Papeer to FastAPI + React"].

Answer questions about rznish, their projects, and their work clearly and concisely, in plain text
(no markdown headers). If someone asks what a modern website needs nowadays, answer thoughtfully
drawing on rznish's own stack choices and experience (performance, clean UI/UX, accessibility, SEO,
fast load times, mobile-first design, and thoughtful use of AI features where it adds real value)
rather than giving a generic checklist.

If a question is unrelated to rznish or this site, you can still answer it — don't refuse or deflect
— but keep those answers brief and don't go deep into unrelated territory. Answer, then steer back
toward rznish and their work when it makes sense.`;

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_CONTEXT }] },
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
      { error: geminiMessage ? `Gemini error: ${geminiMessage}` : 'The AI provider returned an error.' },
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
