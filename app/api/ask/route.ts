import { type NextRequest, NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const SYSTEM_CONTEXT = `You are "Ask AI", the built-in documentation assistant for rznish chatbot's docs site.
rznish chatbot is a personal AI chat app built with Next.js and the Vercel AI SDK. It talks directly to
Google Gemini (and OpenAI as a secondary provider) with no gateway in between. It uses Auth.js for
authentication (email/password + guest sessions) and Postgres for storage. This docs site itself is
built with Next.js and shadcn/ui.
Answer questions about rznish chatbot clearly and concisely, in plain text (no markdown headers).
If a question is unrelated to rznish chatbot or these docs, answer briefly and helpfully anyway,
but keep your default focus on rznish chatbot.`;

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
