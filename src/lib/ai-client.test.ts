import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  AI_ENDPOINT,
  AIRequestError,
  aiProviderLabel,
  aiVisitorId,
  localBusinessAnswer,
  requestAI,
} from "./ai-client";
beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());
it("uses the persistent test-page visitor identity; never a new identity for each question", () => {
  const id = aiVisitorId();
  expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  expect(localStorage.getItem("bce-ai-visitor-id")).toBe(id);
  expect(aiVisitorId()).toBe(id);
});
it("keeps one session identity when storage is unavailable", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("private");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("private");
  });
  expect(aiVisitorId()).toBe(aiVisitorId());
});
it("makes exactly one explicit request, with no keys, cookies, tools or conversation history", async () => {
  const network = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(
      Response.json({ answer: "Try ivory and gold.", provider: "groq", remaining: 49 }),
    );
  const result = await requestAI("  Birthday ideas?  ", new AbortController().signal);
  expect(result.provider).toBe("groq");
  expect(network).toHaveBeenCalledTimes(1);
  const [url, options] = network.mock.calls[0]!;
  expect(url).toBe(AI_ENDPOINT);
  expect(options?.credentials).toBe("omit");
  const body = JSON.parse(options?.body as string);
  expect(Object.keys(body).sort()).toEqual(["question", "visitorId"]);
  expect(body.question).toBe("Birthday ideas?");
  expect(options?.headers).toEqual({ "Content-Type": "application/json" });
});
it.each(["", "a", "x".repeat(1501)])(
  "rejects invalid input before any network call",
  async (value) => {
    const network = vi.spyOn(globalThis, "fetch");
    await expect(requestAI(value, new AbortController().signal)).rejects.toBeInstanceOf(
      AIRequestError,
    );
    expect(network).not.toHaveBeenCalled();
  },
);
it("accepts full-length Hindi", async () => {
  const network = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json({ answer: "हाँ", provider: "groq" }));
  await requestAI("क".repeat(1500), new AbortController().signal);
  expect(network).toHaveBeenCalledTimes(1);
});
it("honours Retry-After without automatically retrying or exposing raw upstream text", async () => {
  const network = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(
      Response.json(
        { error: "providers_cooling_down", message: "private upstream text" },
        { status: 503, headers: { "Retry-After": "30" } },
      ),
    );
  const error = await requestAI("Birthday ideas?", new AbortController().signal).catch((e) => e);
  expect(error.retryAfter).toBe(30);
  expect(error.message).not.toContain("private upstream");
  expect(network).toHaveBeenCalledTimes(1);
});
it.each([Response.json({ status: "configured" }), new Response("bad json")])(
  "never presents a malformed reply as success",
  async (response) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(response);
    await expect(requestAI("Birthday ideas?", new AbortController().signal)).rejects.toBeInstanceOf(
      AIRequestError,
    );
  },
);
it("keeps price, time and contact answers local", () => {
  expect(localBusinessAnswer("decoration price")).toContain("₹1,999");
  expect(localBusinessAnswer("setup time")).toContain("2-3 hours");
  expect(localBusinessAnswer("phone")).toContain("WhatsApp");
  expect(localBusinessAnswer("Corporate")).toBeNull();
});

it("does not mistake general-world price/time questions for studio details", () => {
  expect(localBusinessAnswer("What is the price of gold?")).toBeNull();
  expect(localBusinessAnswer("What time is it in London?")).toBeNull();
});

it.each([
  ["cloudflare", "cloudflare", "Cloudflare · Meta Llama 3.2"],
  ["zai", "zai", "Z.ai · GLM-4.7-Flash"],
  ["unrecognised", "ai", "AI"],
  ["__proto__", "ai", "AI"],
])(
  "preserves honest backend identity for %s without guessing unknown providers",
  async (provider, expected, label) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ answer: "Safe decoration ideas.", provider }),
    );
    const result = await requestAI("A colour palette?", new AbortController().signal);
    expect(result.provider).toBe(expected);
    expect(aiProviderLabel(result.provider)).toBe(label);
    expect(aiProviderLabel(provider)).toBe(label);
  },
);
