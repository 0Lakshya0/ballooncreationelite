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
  for (const question of ["", "a", "x".repeat(1501), null, 123])
    assert.equal((await ask({ data: { question } })).status, 400);
  assert.equal((await ask({ data: { visitorId: "<not-a-uuid>" } })).status, 400);
  const oversized = makeRequest({ data: { question: "x".repeat(13000) } });
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
  assert.equal(data.remaining, 49);
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
test("server-side visitor cap is 50 attempts per UTC day and resets the next day", async () => {
  for (let i = 0; i < 50; i++) {
    assert.equal((await ask()).status, 200);
    tick();
  }
  const denied = await ask();
  assert.equal(denied.status, 429);
  assert.equal((await denied.json()).error, "daily_limit");
  assert.equal(network.mock.calls.length, 50);
  tick(86_400_000);
  assert.equal((await ask()).status, 200);
});
test("2-second gap is enforced in SQLite, not in browser state", async () => {
  assert.equal((await ask()).status, 200);
  const response = await ask();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "2");
  assert.equal((await response.json()).error, "slow_down");
  tick(2_000);
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 2);
});
test("fresh visitor IDs cannot bypass the per-IP daily cap", async () => {
  for (let i = 0; i < 200; i++) {
    assert.equal((await ask({ data: { visitorId: crypto.randomUUID() } })).status, 200);
    tick();
  }
  assert.equal((await ask({ data: { visitorId: crypto.randomUUID() } })).status, 429);
  assert.equal(network.mock.calls.length, 200);
});
test("aggregate site budget caps all provider attempts at 500 AI questions per day", async () => {
  for (let i = 0; i < 500; i++) {
    assert.equal(
      (
        await ask({
          data: { visitorId: crypto.randomUUID() },
          headers: { "CF-Connecting-IP": `2001:db8::${(i + 1).toString(16)}` },
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
  assert.equal(network.mock.calls.length, 500);
});
test("atomic quota INSERT rejects competing reservations for the same visitor", async () => {
  await ask();
  tick();
  const prepared = [];
  for (let i = 0; i < 50; i++) {
    const current = env.AI_DB.db.prepare("SELECT day, visitor, ip FROM ai_requests LIMIT 1").get();
    prepared.push(
      env.AI_DB.prepare(
        `INSERT INTO ai_requests(id,day,visitor,ip,created_at)
      SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM ai_requests WHERE day=? AND visitor=?)<50`,
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
    49,
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

test("legacy cooldown is observable without clearing it, spending quota or calling a provider", async () => {
  env.AI_DB.db.exec(
    "CREATE TABLE ai_provider_state(provider TEXT PRIMARY KEY, available_at INTEGER NOT NULL)",
  );
  env.AI_DB.db.prepare("INSERT INTO ai_provider_state VALUES (?, ?)").run("gemini", clock + 60_000);
  const response = await worker.fetch(new Request("https://assistant.example/health"), env);
  const data = await response.json();
  assert.equal(data.revision, "workers-ai-pool-1");
  assert.equal(data.diagnostics.providers[0].retryAfterSeconds, 60);
  assert.equal(data.diagnostics.providers[0].lastResult, "not_recorded_by_previous_version");
  assert.equal(network.mock.calls.length, 0);
  assert.equal(
    env.AI_DB.db.prepare("SELECT available_at FROM ai_provider_state").get().available_at,
    clock + 60_000,
  );
});
test("invalid-key failures expose only safe categories, not raw provider messages or key values", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      {
        error: {
          message: `API key not valid: ${env.GEMINI_API_KEY}; private customer text`,
          details: [{ reason: "API_KEY_INVALID" }],
        },
      },
      { status: 400 },
    ),
  );
  const response = await ask();
  const data = await response.json();
  assert.equal(response.status, 503);
  assert.equal(data.diagnostics.providers[0].lastResult, "api_key_invalid");
  assert.equal(data.diagnostics.providers[0].upstreamHttpStatus, 400);
  assert.equal(response.headers.get("Access-Control-Expose-Headers"), "Retry-After");
  const health = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.equal(health.diagnostics.providers[0].lastResult, "api_key_invalid");
  for (const result of [
    data,
    health,
    env.AI_DB.db.prepare("SELECT * FROM ai_provider_diagnostics").all(),
  ]) {
    assert(!JSON.stringify(result).includes(env.GEMINI_API_KEY));
    assert(!JSON.stringify(result).includes("private customer text"));
  }
});
test("rate limits retain actual Retry-After and are not diagnosed as a bad user question", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      { error: { message: "quota exceeded" } },
      { status: 429, headers: { "Retry-After": "120" } },
    ),
  );
  const first = await ask();
  const details = (await first.json()).diagnostics.providers[0];
  assert.equal(details.lastResult, "rate_or_quota_limit");
  assert.equal(details.upstreamHttpStatus, 429);
  assert.equal(first.headers.get("Retry-After"), "120");
  const blocked = await ask();
  assert.equal((await blocked.json()).error, "providers_cooling_down");
  assert.equal(network.mock.calls.length, 1);
});
test("malformed upstream rate-limit bodies still preserve Retry-After", async () => {
  network.mock.mockImplementation(
    async () => new Response("rate limit", { status: 429, headers: { "Retry-After": "90" } }),
  );
  const response = await ask();
  const data = await response.json();
  assert.equal(data.diagnostics.providers[0].retryAfterSeconds, 90);
  assert.equal(data.diagnostics.providers[0].lastResult, "rate_or_quota_limit");
});
test("unsupported provider location is distinguished from an expired free quota", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      { error: { message: "User location is not supported for the API use." } },
      { status: 400 },
    ),
  );
  const data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "provider_location_unsupported");
});
test("timeouts, missing models and empty token-limited outputs get separate safe diagnostics", async () => {
  network.mock.mockImplementation(async () => {
    throw Object.assign(new Error("private endpoint"), { name: "TimeoutError" });
  });
  let data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "provider_timeout");
  tick(31_000);
  network.mock.mockImplementation(async () =>
    Response.json({ error: { message: "not found" } }, { status: 404 }),
  );
  data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "model_or_endpoint_not_found");
  tick(3_601_000);
  network.mock.mockImplementation(async () =>
    Response.json({
      candidates: [
        {
          finishReason: "MAX_TOKENS",
          content: { parts: [{ text: "internal thought", thought: true }] },
        },
      ],
    }),
  );
  data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "output_budget_exhausted");
});
test("successful responses record a safe OK diagnostic after a prior transient failure", async () => {
  network.mock.mockImplementation(async () => {
    throw new Error("network");
  });
  await ask();
  tick(31_000);
  network.mock.mockImplementation(async () => providerReply());
  assert.equal((await ask()).status, 200);
  const data = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "ok");
  assert.equal(data.diagnostics.providers[0].upstreamHttpStatus, 200);
});
test("the owner custom trending-decoration question is a valid request, not an input error", async () => {
  const response = await ask({
    data: { question: "abhi trending balloon decoration ki list bana" },
  });
  assert.equal(response.status, 200);
  const body = JSON.parse(network.mock.calls[0].arguments[1].body);
  assert.equal(body.contents[0].parts[0].text, "abhi trending balloon decoration ki list bana");
});

test("one eligible provider gets a 20-second deadline rather than the old 8 seconds", async () => {
  const deadlines = [];
  mock.method(AbortSignal, "timeout", (ms) => {
    deadlines.push(ms);
    return new AbortController().signal;
  });
  network.mock.mockImplementation(async () => {
    tick(12_000);
    return providerReply();
  });
  const response = await ask();
  assert.equal(response.status, 200);
  assert.deepEqual(deadlines, [20_000]);
  const health = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.equal(health.revision, "workers-ai-pool-1");
  assert.equal(health.timing.providerMaxSeconds, 20);
  assert.equal(health.timing.upstreamBudgetSeconds, 32);
});
test("fallback shares the 32-second budget and does not start an extra provider after its deadline", async () => {
  enableAll();
  const deadlines = [];
  mock.method(AbortSignal, "timeout", (ms) => {
    deadlines.push(ms);
    return new AbortController().signal;
  });
  network.mock.mockImplementation(async () => {
    tick(deadlines.at(-1));
    throw Object.assign(new Error("timeout"), { name: "TimeoutError" });
  });
  const response = await ask();
  assert.equal(response.status, 503);
  assert.equal(network.mock.calls.length, 3);
  assert.deepEqual(deadlines, [10666, 10667, 10667]);
});
test("a fast failure releases budget for the next eligible provider", async () => {
  enableAll();
  delete env.OPENROUTER_API_KEY;
  const deadlines = [];
  mock.method(AbortSignal, "timeout", (ms) => {
    deadlines.push(ms);
    return new AbortController().signal;
  });
  network.mock.mockImplementation(async (url) => {
    if (url.includes("googleapis.com")) {
      tick(1000);
      return Response.json({ error: { message: "quota" } }, { status: 429 });
    }
    tick(15_000);
    return openAIReply();
  });
  const response = await ask();
  assert.equal(response.status, 200);
  assert.equal((await response.json()).provider, "groq");
  assert.deepEqual(deadlines, [16000, 20000]);
});
test("an exhausted request budget leaves untried providers available for future requests", async () => {
  enableAll();
  network.mock.mockImplementation(async () => {
    tick(33000);
    throw new Error("slow I/O");
  });
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 1);
  const rows = env.AI_DB.db.prepare("SELECT provider FROM ai_provider_state").all();
  assert.deepEqual(
    rows.map((row) => row.provider),
    ["gemini"],
  );
});
test("a timed-out upstream response body is not mislabeled invalid JSON", async () => {
  network.mock.mockImplementation(
    async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.error(Object.assign(new Error("timeout"), { name: "TimeoutError" }));
          },
        }),
      ),
  );
  const data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "provider_timeout");
});

test("accepts 1500-character English and Hindi questions without a hidden 4KB body barrier", async () => {
  for (const question of ["a".repeat(1500), "क".repeat(1500)]) {
    const response = await ask({ data: { question } });
    assert.equal(response.status, 200);
    const sent = JSON.parse(network.mock.calls.at(-1).arguments[1].body);
    assert.equal(sent.contents[0].parts[0].text, question);
    tick();
  }
  const question = "क".repeat(1500);
  const request = makeRequest();
  const escapedBody = JSON.stringify({ question, visitorId: visitor }).replace(/क/g, "\\u0915");
  const escapedRequest = new Request(request.url, {
    method: "POST",
    headers: request.headers,
    body: escapedBody,
  });
  assert.equal((await worker.fetch(escapedRequest, env)).status, 200);
});
test("health reports the relaxed limits without issuing a provider request", async () => {
  const health = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.deepEqual(health.limits, {
    perVisitorPerDay: 50,
    perIpPerDay: 200,
    sitePerDay: 500,
    minimumGapSeconds: 2,
    maxQuestionCharacters: 1500,
  });
  assert.equal(network.mock.calls.length, 0);
});
test("upgrading limits retains existing daily usage and does not reset provider cooldowns", async () => {
  assert.equal((await ask()).status, 200);
  const current = env.AI_DB.db.prepare("SELECT * FROM ai_requests LIMIT 1").get();
  const insert = env.AI_DB.db.prepare(
    "INSERT INTO ai_requests(id,day,visitor,ip,created_at) VALUES(?,?,?,?,?)",
  );
  for (let i = 0; i < 4; i++)
    insert.run(crypto.randomUUID(), current.day, current.visitor, current.ip, clock);
  tick(2000);
  assert.equal((await (await ask()).json()).remaining, 44);
  env.AI_DB.db
    .prepare("INSERT OR REPLACE INTO ai_provider_state(provider,available_at) VALUES(?,?)")
    .run("gemini", clock + 120000);
  tick(2000);
  const response = await ask();
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "providers_cooling_down");
  assert.equal(network.mock.calls.length, 2);
});

function enableCloudflare(
  reply = () => Response.json({ response: "Try a champagne balloon arch." }),
) {
  env.ENABLED_PROVIDERS = "cloudflare";
  const run = mock.fn(reply);
  env.AI = { run };
  return run;
}
test("Workers AI is opt-in: a binding alone never makes an AI call or changes active providers", async () => {
  const run = mock.fn();
  env.AI = { run };
  const health = await (
    await worker.fetch(new Request("https://assistant.example/health"), env)
  ).json();
  assert.equal(health.setup.workersAiBound, true);
  assert.deepEqual(health.setup.enabledProviders, ["gemini"]);
  assert.equal(run.mock.calls.length, 0);
  await ask();
  assert.equal(run.mock.calls.length, 0);
});
test("Workers AI uses only the pinned model, bounded tokens, no gateway, and a cancellable raw response", async () => {
  const run = enableCloudflare();
  env.CLOUDFLARE_MODEL = "@cf/paid/arbitrary-model";
  const data = await (await ask()).json();
  assert.equal(data.provider, "cloudflare");
  assert.equal(data.answer, "Try a champagne balloon arch.");
  assert.equal(data.remaining, 49);
  assert.equal(data.grounded, false);
  assert.equal(network.mock.calls.length, 0);
  const [model, inputs, options] = run.mock.calls[0].arguments;
  assert.equal(model, "@cf/meta/llama-3.2-3b-instruct");
  assert.equal(inputs.max_tokens, 512);
  assert.equal(inputs.stream, false);
  assert.equal(inputs.messages[1].content, "Birthday decoration ideas?");
  assert.equal(options.returnRawResponse, true);
  assert(options.signal instanceof AbortSignal);
  assert.equal(options.gateway, undefined);
  assert.equal(inputs.tools, undefined);
  assert(
    env.AI_DB.db.prepare("SELECT reserved_units FROM ai_provider_budget").get().reserved_units > 0,
  );
});
test("Workers AI requires a real run binding and a private stable limiter salt", async () => {
  env.ENABLED_PROVIDERS = "cloudflare";
  assert.equal((await ask()).status, 503);
  const run = enableCloudflare();
  delete env.GEMINI_API_KEY;
  assert.equal((await ask()).status, 503);
  assert.equal(run.mock.calls.length, 0);
  env.RATE_LIMIT_SALT = "private-test-salt";
  assert.equal((await ask()).status, 200);
});
test("manual test targets an enabled provider without disabling normal Gemini/Groq routing", async () => {
  const run = enableCloudflare();
  env.ENABLED_PROVIDERS = "gemini,cloudflare";
  const selected = await (await ask({ data: { provider: "cloudflare" } })).json();
  assert.equal(selected.provider, "cloudflare");
  assert.equal(network.mock.calls.length, 0);
  tick();
  const normal = await (await ask()).json();
  assert.equal(normal.provider, "gemini");
  assert.equal(normal.remaining, 48);
  assert.equal(run.mock.calls.length, 1);
});
test("manual test cannot enable missing/disabled providers, bypass cooldowns, or reset visitor quota", async () => {
  for (const provider of ["cloudflare", "unknown", "", 12, { id: "gemini" }])
    assert.equal((await ask({ data: { provider } })).status, 400);
  const run = enableCloudflare();
  env.ENABLED_PROVIDERS = "gemini,cloudflare";
  await ask();
  tick();
  const selected = await (await ask({ data: { provider: "cloudflare" } })).json();
  assert.equal(selected.remaining, 48);
  env.AI_DB.db
    .prepare("INSERT INTO ai_provider_state(provider, available_at) VALUES(?,?)")
    .run("cloudflare", clock + 120000);
  tick();
  assert.equal((await ask({ data: { provider: "cloudflare" } })).status, 503);
  assert.equal(run.mock.calls.length, 1);
});
test("Gemini/Groq failures fall back to Workers AI without calling unneeded OpenRouter", async () => {
  enableAll();
  const run = mock.fn(() => Response.json({ response: "Use ivory balloons." }));
  env.AI = { run };
  env.ENABLED_PROVIDERS += ",cloudflare";
  network.mock.mockImplementation(async () =>
    Response.json({ error: { message: "busy" } }, { status: 503 }),
  );
  const data = await (await ask()).json();
  assert.equal(data.provider, "cloudflare");
  assert.equal(run.mock.calls.length, 1);
  assert.equal(network.mock.calls.length, 2);
});
test("a larger pool has at most 3 inference attempts and does not shrink timeouts below the 3-candidate allocation", async () => {
  enableAll();
  env.ENABLED_PROVIDERS += ",cloudflare";
  const deadlines = [];
  mock.method(AbortSignal, "timeout", (ms) => {
    deadlines.push(ms);
    return new AbortController().signal;
  });
  const run = mock.fn(() =>
    Response.json({ errors: [{ message: "unavailable" }] }, { status: 503 }),
  );
  env.AI = { run };
  network.mock.mockImplementation(async () => Response.json({ error: {} }, { status: 503 }));
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length + run.mock.calls.length, 3);
  assert(deadlines.every((ms) => ms >= 10666));
  assert.equal(
    env.AI_DB.db
      .prepare("SELECT provider FROM ai_provider_state WHERE provider='openrouter'")
      .get(),
    undefined,
  );
});
test("Workers AI's local daily compute reservation is persistent, atomic, and skips inference when spent", async () => {
  const run = enableCloudflare();
  await ask();
  tick();
  env.AI_DB.db.prepare("UPDATE ai_provider_budget SET reserved_units=8000000").run();
  const response = await ask();
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.diagnostics.providers[0].lastResult, "local_provider_budget");
  assert.equal(run.mock.calls.length, 1);
  assert.equal(
    env.AI_DB.db.prepare("SELECT reserved_units FROM ai_provider_budget").get().reserved_units,
    8000000,
  );
  tick(86_400_000);
  assert.equal((await ask()).status, 200);
  assert.equal(run.mock.calls.length, 2);
  const day = new Date(clock).toISOString().slice(0, 10);
  const units = env.AI_DB.db
    .prepare("SELECT reserved_units FROM ai_provider_budget WHERE day=?")
    .get(day).reserved_units;
  env.AI_DB.db
    .prepare("UPDATE ai_provider_budget SET reserved_units=? WHERE day=?")
    .run(8000000 - units, day);
  tick(2000);
  const contenders = await Promise.all(
    [1, 2].map((index) =>
      ask({
        data: { visitorId: crypto.randomUUID() },
        headers: { "CF-Connecting-IP": `203.0.113.${index + 10}` },
      }),
    ),
  );
  assert.deepEqual(contenders.map((r) => r.status).sort(), [200, 503]);
  assert.equal(
    env.AI_DB.db.prepare("SELECT reserved_units FROM ai_provider_budget WHERE day=?").get(day)
      .reserved_units,
    8000000,
  );
  assert.equal(run.mock.calls.length, 3);
});
test("a spent local Workers AI budget does not consume a provider attempt or block another configured backup", async () => {
  const run = enableCloudflare();
  await ask();
  tick();
  env.AI_DB.db.prepare("UPDATE ai_provider_budget SET reserved_units=8000000").run();
  env.OPENROUTER_API_KEY = "test-router";
  env.OPENROUTER_MODEL = "test/model:free";
  env.ENABLED_PROVIDERS = "cloudflare,openrouter";
  network.mock.mockImplementation(async () => openAIReply());
  const data = await (await ask()).json();
  assert.equal(data.provider, "openrouter");
  assert.equal(run.mock.calls.length, 1);
});
test("full-length Hindi fits the Workers AI reservation and failed inference reservations are not refunded", async () => {
  const run = enableCloudflare(() =>
    Response.json({ errors: [{ message: "busy" }] }, { status: 503 }),
  );
  assert.equal((await ask({ data: { question: "क".repeat(1500) } })).status, 503);
  const units = env.AI_DB.db
    .prepare("SELECT reserved_units FROM ai_provider_budget")
    .get().reserved_units;
  assert(units > 30000 && units < 100000);
  assert.equal(run.mock.calls.length, 1);
});
test("Workers AI 429 preserves Retry-After with only safe diagnostic categories", async () => {
  const run = enableCloudflare(() =>
    Response.json(
      { error: { message: "private payload / fake secret" } },
      { status: 429, headers: { "Retry-After": "300" } },
    ),
  );
  const response = await ask();
  assert.equal(response.headers.get("Retry-After"), "300");
  const data = await response.json();
  assert.equal(data.diagnostics.providers[0].lastResult, "rate_or_quota_limit");
  assert(!JSON.stringify(data).includes("private payload"));
  tick();
  assert.equal((await ask()).status, 503);
  assert.equal(run.mock.calls.length, 1);
});
test("Workers AI cannot turn empty, malformed, or unexpected binding results into a successful answer", async () => {
  const run = enableCloudflare();
  for (const reply of [
    () => Response.json(null),
    () => Response.json({ response: 123 }),
    () => Response.json({ success: false, response: "not a success" }),
    () => Response.json({ response: "" }),
    () => new Response("not json"),
    () => ({ response: "not a raw response" }),
  ]) {
    run.mock.mockImplementation(reply);
    const response = await ask();
    assert.equal(response.status, 503);
    env.AI_DB.db.prepare("DELETE FROM ai_provider_state WHERE provider='cloudflare'").run();
    tick();
  }
});
test("Workers AI deadlines cover a stalled body and preserve reserved compute", async () => {
  enableCloudflare(
    () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.error(Object.assign(new Error("timeout"), { name: "TimeoutError" }));
          },
        }),
      ),
  );
  const data = await (await ask()).json();
  assert.equal(data.diagnostics.providers[0].lastResult, "provider_timeout");
  assert(
    env.AI_DB.db.prepare("SELECT reserved_units FROM ai_provider_budget").get().reserved_units > 0,
  );
});
test("binding selection retains the existing Gemini-salted daily identity rather than resetting usage", async () => {
  await ask();
  tick();
  const before = env.AI_DB.db.prepare("SELECT visitor,ip FROM ai_requests").get();
  enableCloudflare();
  const data = await (await ask()).json();
  assert.equal(data.remaining, 48);
  const rows = env.AI_DB.db.prepare("SELECT DISTINCT visitor,ip FROM ai_requests").all();
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0], before);
});
test("Workers AI reservation storage failure is fail-closed before inference", async () => {
  const run = enableCloudflare();
  await ask();
  tick();
  const original = env.AI_DB.batch.bind(env.AI_DB);
  let batches = 0;
  mock.method(env.AI_DB, "batch", async (statements) => {
    batches++;
    if (batches === 3) throw new Error("private db error");
    return original(statements);
  });
  const response = await ask();
  assert.equal(response.status, 503);
  assert.equal(run.mock.calls.length, 1);
  assert(!(await response.text()).includes("private db error"));
});
