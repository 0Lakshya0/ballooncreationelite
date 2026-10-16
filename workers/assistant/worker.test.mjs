import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import worker from "./worker.js";

// Run the worker's real SQLite statements through Node's SQLite implementation.
// This is not a live Cloudflare/Gemini test and never uses a real API key.
class D1 {
  constructor() {
    this.db = new DatabaseSync(":memory:");
  }
  prepare(sql) {
    const db = this.db;
    const statement = (args = []) => ({
      bind: (...values) => statement(values),
      first: async () => db.prepare(sql).get(...args) || null,
      all: async () => ({ results: db.prepare(sql).all(...args) }),
      run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...args).changes) } }),
    });
    return statement();
  }
  async batch(statements) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.db.exec("COMMIT");
      return results;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
}
let env, clock, network;
const origin = "https://htmlpreview.github.io";
const visitor = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ip = "203.0.113.1";
const providerReply = () =>
  Response.json({
    candidates: [{ content: { parts: [{ text: "Try a soft ivory balloon arch." }] } }],
  });
const openAIReply = () =>
  Response.json({ choices: [{ message: { content: "A floral backdrop would look lovely." } }] });
const makeRequest = (overrides = {}) =>
  new Request("https://assistant.example/chat", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": ip,
      ...overrides.headers,
    },
    body: JSON.stringify({
      question: "Birthday decoration ideas?",
      visitorId: visitor,
      ...overrides.data,
    }),
  });
const ask = (overrides) => worker.fetch(makeRequest(overrides), env);
const tick = (ms = 10_001) => {
  clock += ms;
};
const enableAll = () =>
  Object.assign(env, {
    ENABLED_PROVIDERS: "gemini,groq,openrouter",
    GROQ_API_KEY: "test-groq-secret",
    GROQ_MODEL: "test-free-groq-model",
    OPENROUTER_API_KEY: "test-router-secret",
    OPENROUTER_MODEL: "test/model:free",
  });
beforeEach(() => {
  clock = Date.UTC(2026, 9, 16, 10);
  mock.method(Date, "now", () => clock);
  env = {
    AI_DB: new D1(),
    ALLOWED_ORIGINS: origin,
    ENABLED_PROVIDERS: "gemini",
    GEMINI_API_KEY: "test-gemini-secret",
    GEMINI_MODEL: "test-free-gemini-model",
  };
  network = mock.method(globalThis, "fetch", async () => providerReply());
});
afterEach(() => {
  env.AI_DB?.db.close();
  mock.restoreAll();
});

test("empty setup deploys a safe status page with no AI calls or secret values", async () => {
  const response = await worker.fetch(new Request("https://assistant.example/"), {
    GEMINI_API_KEY: "a-secret-value",
  });
  assert.equal(response.status, 200);
  const text = await response.text();
  assert.equal(JSON.parse(text).status, "setup_required");
  assert(!text.includes("a-secret-value"));
  assert.equal(network.mock.calls.length, 0);
});
test("health says configured, never falsely says the API key or real answers were tested", async () => {
  const result = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.equal(result.status, "configured");
  assert.match(result.message, /does not call AI or validate API keys/);
  assert.equal(network.mock.calls.length, 0);
});
test("missing D1 fails closed before any external AI request", async () => {
  const database = env.AI_DB;
  env.AI_DB = null;
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
  env.AI_DB = database;
});
test("provider must be explicitly enabled with a configured model", async () => {
  delete env.ENABLED_PROVIDERS;
  assert.equal((await ask()).status, 503);
  env.ENABLED_PROVIDERS = "gemini";
  delete env.GEMINI_MODEL;
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
});
test("only exact allowed origins receive CORS; no wildcards or credentials", async () => {
  for (const bad of ["https://untrusted.example", `${origin}.untrusted.example`, "null", ""]) {
    const response = await ask({ headers: { Origin: bad } });
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("Access-Control-Allow-Origin"), null);
  }
  const response = await worker.fetch(
    new Request("https://assistant.example/chat", {
      method: "OPTIONS",
      headers: { Origin: origin },
    }),
    env,
  );
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
  assert.equal(response.headers.get("Access-Control-Allow-Credentials"), null);
  assert.equal(network.mock.calls.length, 0);
});
test("enforces POST/JSON and rejects malformed, oversized and invalid questions", async () => {
  assert.equal(
    (
      await worker.fetch(
        new Request("https://assistant.example/chat", { headers: { Origin: origin } }),
        env,
      )
    ).status,
    405,
  );
  assert.equal((await ask({ headers: { "Content-Type": "text/plain" } })).status, 415);
  for (const question of ["", "a", "x".repeat(501), null, 123])
    assert.equal((await ask({ data: { question } })).status, 400);
  assert.equal((await ask({ data: { visitorId: "<not-a-uuid>" } })).status, 400);
  const oversized = makeRequest({ data: { question: "x".repeat(5000) } });
  assert.equal((await worker.fetch(oversized, env)).status, 413);
  const invalid = new Request("https://assistant.example/chat", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal((await worker.fetch(invalid, env)).status, 400);
  assert.equal(network.mock.calls.length, 0);
});
test("requires trusted Cloudflare client IP, never accepts an IP supplied in the JSON body", async () => {
  const request = makeRequest({ data: { ip: "fake" } });
  request.headers.delete("CF-Connecting-IP");
  assert.equal((await worker.fetch(request, env)).status, 503);
  assert.equal(network.mock.calls.length, 0);
});
test("returns a real provider reply with remaining quota; never claims live grounding", async () => {
  const response = await ask();
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.provider, "gemini");
  assert.equal(data.remaining, 4);
  assert.equal(data.answer, "Try a soft ivory balloon arch.");
  assert.equal(data.grounded, false);
  assert.deepEqual(data.sources, []);
  const [url, init] = network.mock.calls[0].arguments;
  assert(url.startsWith("https://generativelanguage.googleapis.com/"));
  assert(!url.includes(env.GEMINI_API_KEY));
  assert.equal(init.headers["x-goog-api-key"], env.GEMINI_API_KEY);
  assert.equal(init.redirect, "manual");
  const sent = JSON.parse(init.body);
  assert.equal(sent.tools, undefined);
  assert.equal(sent.generationConfig.maxOutputTokens, 512);
  assert(!JSON.stringify(data).includes(env.GEMINI_API_KEY));
  const stored = env.AI_DB.db.prepare("SELECT * FROM ai_requests").get();
  assert(!JSON.stringify(stored).includes(ip));
  assert(!JSON.stringify(stored).includes(visitor));
  assert(!JSON.stringify(stored).includes("Birthday"));
});
test("server-side visitor cap is five attempts per UTC day and resets the next day", async () => {
  for (let i = 0; i < 5; i++) {
    assert.equal((await ask()).status, 200);
    tick();
  }
  const denied = await ask();
  assert.equal(denied.status, 429);
  assert.equal((await denied.json()).error, "daily_limit");
  assert.equal(network.mock.calls.length, 5);
  tick(86_400_000);
  assert.equal((await ask()).status, 200);
});
test("10-second gap is enforced in SQLite, not in browser state", async () => {
  assert.equal((await ask()).status, 200);
  const response = await ask();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "10");
  assert.equal((await response.json()).error, "slow_down");
  tick(10_000);
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 2);
});
test("fresh visitor IDs cannot bypass the per-IP daily cap", async () => {
  for (let i = 0; i < 20; i++) {
    assert.equal((await ask({ data: { visitorId: crypto.randomUUID() } })).status, 200);
    tick();
  }
  assert.equal((await ask({ data: { visitorId: crypto.randomUUID() } })).status, 429);
  assert.equal(network.mock.calls.length, 20);
});
test("aggregate site budget caps all provider attempts at 100 AI questions per day", async () => {
  for (let i = 0; i < 100; i++) {
    assert.equal(
      (
        await ask({
          data: { visitorId: crypto.randomUUID() },
          headers: { "CF-Connecting-IP": `203.0.113.${i + 1}` },
        })
      ).status,
      200,
    );
    tick();
  }
  assert.equal(
    (
      await ask({
        data: { visitorId: crypto.randomUUID() },
        headers: { "CF-Connecting-IP": "192.0.2.200" },
      })
    ).status,
    429,
  );
  assert.equal(network.mock.calls.length, 100);
});
test("atomic quota INSERT rejects competing reservations for the same visitor", async () => {
  await ask();
  tick();
  const prepared = [];
  for (let i = 0; i < 5; i++) {
    const current = env.AI_DB.db.prepare("SELECT day, visitor, ip FROM ai_requests LIMIT 1").get();
    prepared.push(
      env.AI_DB.prepare(
        `INSERT INTO ai_requests(id,day,visitor,ip,created_at)
      SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM ai_requests WHERE day=? AND visitor=?)<5`,
      ).bind(
        crypto.randomUUID(),
        current.day,
        current.visitor,
        current.ip,
        clock,
        current.day,
        current.visitor,
      ),
    );
  }
  const results = await env.AI_DB.batch(prepared);
  assert.equal(
    results.reduce((sum, result) => sum + result.meta.changes, 0),
    4,
  );
});
test("429 falls through Gemini -> Groq -> OpenRouter and persists Retry-After cooldowns", async () => {
  enableAll();
  network.mock.mockImplementation(async (url) =>
    url.includes("openrouter.ai")
      ? openAIReply()
      : Response.json(
          { error: { message: "quota" } },
          { status: 429, headers: { "Retry-After": "120" } },
        ),
  );
  const response = await ask();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).provider, "openrouter");
  assert.equal(network.mock.calls.length, 3);
  const router = JSON.parse(network.mock.calls[2].arguments[1].body);
  assert.equal(router.model, "test/model:free");
  assert.deepEqual(router.provider.max_price, { prompt: 0, completion: 0 });
  tick();
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 4); // Gemini/Groq are skipped during cooldown.
  tick(120_000);
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 7); // Reset providers are tried again.
});
test("paid OpenRouter model names are never called", async () => {
  enableAll();
  env.ENABLED_PROVIDERS = "openrouter";
  env.OPENROUTER_MODEL = "paid/model";
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
});
test("a network failure can fall through, and unconfigured providers are skipped", async () => {
  enableAll();
  delete env.OPENROUTER_API_KEY;
  network.mock.mockImplementation(async (url) => {
    if (url.includes("googleapis.com")) throw new Error("network");
    return openAIReply();
  });
  assert.equal((await (await ask()).json()).provider, "groq");
  assert.equal(network.mock.calls.length, 2);
});
test("all providers unavailable gives an honest WhatsApp fallback and no extra calls during cooldown", async () => {
  enableAll();
  network.mock.mockImplementation(async () =>
    Response.json({ error: { message: "private raw error: test-gemini-secret" } }, { status: 429 }),
  );
  const response = await ask();
  assert.equal(response.status, 503);
  assert(!JSON.stringify(await response.json()).includes("test-gemini-secret"));
  assert.equal(network.mock.calls.length, 3);
  tick();
  const waiting = await ask();
  assert.equal((await waiting.json()).error, "providers_cooling_down");
  assert.equal(network.mock.calls.length, 3);
  assert.equal(env.AI_DB.db.prepare("SELECT COUNT(*) AS n FROM ai_requests").get().n, 1);
});
test("safety refusals do not trigger fallback to bypass a provider safety decision", async () => {
  enableAll();
  network.mock.mockImplementation(async () =>
    Response.json({ promptFeedback: { blockReason: "SAFETY" } }),
  );
  const data = await (await ask()).json();
  assert.match(data.answer, /safe decoration/);
  assert.equal(network.mock.calls.length, 1);
});
test("malformed upstream JSON can fall through without returning provider errors", async () => {
  enableAll();
  network.mock.mockImplementation(async (url) =>
    url.includes("googleapis.com") ? new Response("not json") : openAIReply(),
  );
  assert.equal((await (await ask()).json()).provider, "groq");
});
test("storage failures fail closed without touching providers", async () => {
  env.AI_DB.batch = async () => {
    throw new Error("storage failed");
  };
  const response = await ask();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "temporarily_unavailable");
  assert.equal(network.mock.calls.length, 0);
});
