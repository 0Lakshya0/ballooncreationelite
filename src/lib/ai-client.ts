// Public endpoint only. Provider credentials stay in Cloudflare Secrets.
export const AI_ENDPOINT = "https://ballooncreation-assistant.lakshyac909.workers.dev/chat";
export const AI_QUESTION_LIMIT = 1500;
const ID_KEY = "bce-ai-visitor-id";
let sessionId: string | undefined;

export type AIAnswer = { answer: string; provider: string; remaining?: number };
export class AIRequestError extends Error {
  constructor(
    message: string,
    public retryAfter = 0,
  ) {
    super(message);
    this.name = "AIRequestError";
  }
}
export function aiVisitorId() {
  try {
    const saved = localStorage.getItem(ID_KEY);
    if (saved && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(saved))
      return saved;
  } catch {
    /* Use one in-memory identity if storage is blocked. */
  }
  if (!sessionId) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6]! & 15) | 64;
    bytes[8] = (bytes[8]! & 63) | 128;
    const hex = Array.from(bytes, (n) => n.toString(16).padStart(2, "0")).join("");
    sessionId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  try {
    localStorage.setItem(ID_KEY, sessionId);
  } catch {
    /* Private browsing. */
  }
  return sessionId;
}

export async function requestAI(question: string, signal: AbortSignal): Promise<AIAnswer> {
  const text = question.trim();
  if (text.length < 2 || text.length > AI_QUESTION_LIMIT)
    throw new AIRequestError("Please use 2–1,500 characters.");
  const response = await fetch(AI_ENDPOINT, {
    method: "POST",
    credentials: "omit",
    redirect: "error",
    signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: text, visitorId: aiVisitorId() }),
  });
  const retryAfter = Math.max(0, Number(response.headers.get("Retry-After")) || 0);
  let data;
  try {
    data = await response.json();
  } catch {
    throw new AIRequestError(
      "AI could not return a readable reply. Please try later or contact our team.",
    );
  }
  if (!response.ok) {
    const message =
      data.error === "daily_limit" || data.error === "site_limit" || data.error === "ip_limit"
        ? "The free AI allowance is used for now. Our team can still help on WhatsApp."
        : data.error === "slow_down"
          ? "Please leave a moment between questions."
          : "AI is temporarily unavailable. Please try later or speak to our team.";
    throw new AIRequestError(message, retryAfter);
  }
  if (typeof data.answer !== "string" || !data.answer.trim())
    throw new AIRequestError("No AI answer was received. Please try later.");
  return {
    answer: data.answer.slice(0, 6000),
    provider: ["gemini", "groq", "openrouter"].includes(data.provider) ? data.provider : "ai",
    ...(typeof data.remaining === "number" ? { remaining: data.remaining } : {}),
  };
}

/** Keep confirmed business details out of the AI's guesses and free allowance. */
export function localBusinessAnswer(question: string): string | null {
  const business =
    /\b(decor(?:ation)?s?|set[ -]?up|balloons?|our team|your team)\b|सजावट|डेकोरेशन/i.test(
      question,
    );
  const shortIntent =
    /^(?:(?:what(?:'s| is)|tell me|your|the)\s+)*(?:(?:the|your)\s+)*(?:price|cost|rate|time|duration|contact|phone|whatsapp|call)(?:\s+(?:number|details|please))?[?!. ]*$/i.test(
      question.trim(),
    );
  const hindiIntent =
    /^(?:कीमत|कितने पैसे|कितना समय|संपर्क|फ़ोन|फोन|kitna time|kitna samay|kitne paise|kitna kharcha)[?!. ]*$/i.test(
      question.trim(),
    );
  if (!business && !shortIntent && !hindiIntent) return null;

  if (/\b(prices?|costs?|rates?)\b|कीमत|कितने पैसे|\b(kitne paise|kitna kharcha)\b/i.test(question))
    return "💰 Estimates start ₹1,999. Click for Custom Quote.";
  if (/\b(times?|duration)\b|कितना समय|\b(kitna time|kitna samay)\b/i.test(question))
    return "⏱️ Setup takes 2-3 hours only.";
  if (/\b(contact|phone|whatsapp|call)\b|संपर्क|फ़ोन|फोन/i.test(question))
    return "📞 Click here to Call or WhatsApp us directly.";
  return null;
}
