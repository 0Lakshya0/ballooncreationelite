import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

// Free-tier Google Gemini. Get a free key (no credit card) at
// https://aistudio.google.com/app/apikey and set GEMINI_API_KEY on the server.
// Optional: GEMINI_MODEL. Google Search grounding is tried first; on the free
// tier it is often unavailable, so we fall back to free Wikipedia search context.
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

const SYSTEM_PROMPT = `You are the friendly assistant of "Balloon Creation", a premium event decoration studio in Indore, India.
- Answer the user's question clearly, accurately and concisely (max ~200 words). Use short bullet points when helpful.
- Reply in the same language/script the user wrote in (English, Hindi, or Hinglish).
- For decoration, design, colour, theme, budget or event-planning questions, give practical, expert ideas. You may mention Balloon Creation's services (balloon & flower decor for weddings, birthdays, anniversaries, baby showers, devotional events) and that they can request a consultation below.
- For general questions, answer helpfully using up-to-date web information when needed.
- Refuse to help with anything dangerous or illegal: weapons, explosives, drugs, hacking, violence, harming people or animals, or hazardous DIY (for example, making gas-filled balloons with unsafe gases or fire hazards). Briefly say you can't help with that and offer a safe alternative.
- If someone seems to be in crisis or talks about self-harm, respond with empathy and suggest talking to someone now: Tele-MANAS 14416 (India, free, 24x7).
- Never invent prices, phone numbers, or promises about the business. If unsure, suggest contacting the studio on WhatsApp.`;

const askSchema = z.object({
  question: z.string().trim().min(2, 'Please write a little more.').max(500, 'Please keep your question under 500 characters.'),
});

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    groundingMetadata?: { groundingChunks?: Array<{ web?: { uri?: string; title?: string } }> };
  }>;
  error?: { message?: string };
};

type Source = { url: string; title: string };

// Free, keyless web context from Wikipedia's public API.
async function wikipediaContext(question: string): Promise<{ context: string; sources: Source[] }> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=3&format=json&origin=*&srsearch=${encodeURIComponent(question)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'BalloonCreationWebsite/1.0 (contact via website)' } });
    if (!res.ok) return { context: '', sources: [] };
    const json = (await res.json()) as { query?: { search?: Array<{ title: string; snippet: string; pageid: number }> } };
    const hits = json.query?.search ?? [];
    const context = hits
      .map(h => `- ${h.title}: ${h.snippet.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&')}`)
      .join('\n');
    const sources = hits.map(h => ({ title: `${h.title} – Wikipedia`, url: `https://en.wikipedia.org/?curid=${h.pageid}` }));
    return { context, sources };
  } catch {
    return { context: '', sources: [] };
  }
}

async function callGemini(apiKey: string, model: string, question: string, withSearch: boolean, context = '') {
  const userText = context
    ? `${question}\n\nWeb search results (use them if relevant, and do not invent facts beyond them):\n${context}`
    : question;
  const body: Record<string, unknown> = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  };
  if (withSearch) body['tools'] = [{ google_search: {} }];

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as GeminiResponse;
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${json.error?.message ?? 'request failed'}`);

  const candidate = json.candidates?.[0];
  const answer = candidate?.content?.parts?.map(p => p.text ?? '').join('').trim();
  if (!answer) throw new Error('Empty response from model');

  const sources: Source[] = [];
  for (const chunk of candidate?.groundingMetadata?.groundingChunks ?? []) {
    const uri = chunk.web?.uri;
    if (!uri || sources.some(s => s.url === uri)) continue;
    sources.push({ url: uri, title: chunk.web?.title || uri });
    if (sources.length === 4) break;
  }

  return { answer, sources };
}

export const askAssistant = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => askSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env['GEMINI_API_KEY'];
    if (!apiKey) {
      console.error('[assistant] GEMINI_API_KEY is not set');
      throw new Error('The AI assistant is not configured yet. Please ask us directly on WhatsApp.');
    }
    const model = process.env['GEMINI_MODEL'] || DEFAULT_MODEL;

    try {
      // Try with live Google Search grounding first.
      return { ...(await callGemini(apiKey, model, data.question, true)), grounded: true };
    } catch (error) {
      console.warn('[assistant] grounded call failed, retrying without search:', error instanceof Error ? error.message : error);
    }
    try {
      const wiki = await wikipediaContext(data.question);
      const result = await callGemini(apiKey, model, data.question, false, wiki.context);
      return { ...result, sources: wiki.sources, grounded: false };
    } catch (error) {
      console.error('[assistant] failed:', error instanceof Error ? error.message : error);
      throw new Error('The assistant is busy right now. Please try again in a moment or ask us on WhatsApp.');
    }
  });
