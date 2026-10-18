import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import worker from "./worker.js";

// Real SQLite, mocked HTTP only. No live provider request or actual key.
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
const origin = "https://htmlpreview.github.io";
const key = "test-only-zai-secret";
const good = () =>
  Response.json({ choices: [{ message: { content: "Ivory and gold balloons." } }] });
let env, clock, network;
const health = async () => (await worker.fetch(new Request("https://example/health"), env)).json();
const ask = (provider = "zai") =>
  worker.fetch(
    new Request("https://example/chat", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "CF-Connecting-IP": crypto.randomUUID(),
      },
      body: JSON.stringify({
        question: "Birthday decoration ideas?",
        visitorId: crypto.randomUUID(),
        ...(provider ? { provider } : {}),
      }),
    }),
    env,
  );
const diagnostic = () =>
  env.AI_DB.db.prepare("SELECT * FROM ai_provider_diagnostics WHERE provider='zai'").get();
const lease = () =>
  env.AI_DB.db.prepare("SELECT * FROM ai_provider_leases WHERE provider='zai'").get();
beforeEach(() => {
  clock = Date.UTC(2026, 9, 18, 10);
  mock.method(Date, "now", () => clock);
  env = { AI_DB: new D1(), ALLOWED_ORIGINS: origin, ENABLED_PROVIDERS: "zai", ZAI_API_KEY: key };
  network = mock.method(globalThis, "fetch", async () => good());
});
afterEach(() => {
  env.AI_DB.db.close();
  mock.restoreAll();
});

test("Z.ai is opt-in; a disabled/missing key cannot satisfy setup or spend quota", async () => {
  env.ENABLED_PROVIDERS = "";
  assert.deepEqual((await health()).setup.enabledProviders, []);
  assert.equal((await health()).setup.rateLimitSaltConfigured, false);
  assert.equal((await ask()).status, 503);
  env.ENABLED_PROVIDERS = "zai";
  delete env.ZAI_API_KEY;
  assert.equal((await health()).status, "setup_required");
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
});
test("Z.ai pins free model, Standard endpoint and bounded non-thinking text regardless of overrides", async () => {
  env.ZAI_MODEL = "glm-4.7-flashx";
  env.ZAI_ENDPOINT = "https://untrusted.invalid/";
  env.ZAI_BASE_URL = "https://untrusted.invalid/";
  assert.equal((await ask()).status, 200);
  const [url, options] = network.mock.calls[0].arguments;
  const body = JSON.parse(options.body);
  assert.equal(url, "https://api.z.ai/api/paas/v4/chat/completions");
  assert.equal(body.model, "glm-4.7-flash");
  assert.equal(body.max_tokens, 512);
  assert.equal(body.stream, false);
  assert.deepEqual(body.thinking, { type: "disabled" });
  assert.equal(body.tools, undefined);
  assert.equal(options.redirect, "manual");
  assert.equal(options.headers.Authorization, `Bearer ${key}`);
  assert.equal(lease(), undefined);
  const h = await health();
  assert.deepEqual(h.zai, { model: "glm-4.7-flash", concurrencyLimit: 1, leaseSeconds: 60 });
  assert(!JSON.stringify(h).includes(key));
});
test("one Z.ai request in flight excludes another across shared D1 without global cooldown", async () => {
  const started = Promise.withResolvers(),
    finish = Promise.withResolvers();
  network.mock.mockImplementation(async () => {
    started.resolve();
    return finish.promise;
  });
  const first = ask();
  await started.promise;
  try {
    assert(lease());
    const second = await ask();
    assert.equal(second.status, 503);
    const data = await second.json();
    assert.equal(data.diagnostics.providers[0].lastResult, "concurrency_busy");
    assert.equal(network.mock.calls.length, 1);
    assert.equal(env.AI_DB.db.prepare("SELECT COUNT(*) AS n FROM ai_provider_state").get().n, 0);
    assert.equal((await health()).diagnostics.providers[0].retryAfterSeconds, 60);
  } finally {
    finish.resolve(good());
    await first;
  }
  assert.equal(lease(), undefined);
  network.mock.mockImplementation(good);
  assert.equal((await ask()).status, 200);
});
test("a stale response cannot delete a replacement lease with a different owner token", async () => {
  network.mock.mockImplementation(async () => {
    env.AI_DB.db
      .prepare("UPDATE ai_provider_leases SET token='replacement', leased_until=?")
      .run(clock + 60000);
    return good();
  });
  assert.equal((await ask()).status, 200);
  assert.equal(lease().token, "replacement");
});
test("lease acquisition failure is closed before Z.ai inference", async () => {
  const original = env.AI_DB.prepare.bind(env.AI_DB);
  mock.method(env.AI_DB, "prepare", (sql) => {
    if (sql.startsWith("INSERT INTO ai_provider_leases")) throw new Error("private DB detail");
    return original(sql);
  });
  const r = await ask();
  assert.equal(r.status, 503);
  const data = await r.json();
  assert.equal(data.diagnostics.providers[0].lastResult, "concurrency_guard_unavailable");
  assert(!JSON.stringify(data).includes("private DB detail"));
  assert.equal(network.mock.calls.length, 0);
});
for (const kind of ["TimeoutError", "TypeError"]) {
  test(`${kind}: uncertain upstream completion retains the lease until its 60-second expiry`, async () => {
    network.mock.mockImplementation(async () => {
      throw Object.assign(new Error("private detail"), { name: kind });
    });
    assert.equal((await ask()).status, 503);
    assert.equal(
      diagnostic().code,
      kind === "TimeoutError" ? "provider_timeout" : "provider_network_error",
    );
    assert(lease(), "must not release an uncertain upstream request immediately");
    clock += 31000;
    assert.equal((await ask()).status, 503);
    assert.equal(network.mock.calls.length, 1);
    assert.equal(
      diagnostic().code,
      kind === "TimeoutError" ? "provider_timeout" : "provider_network_error",
    );
    network.mock.mockImplementation(good);
    clock += 30000;
    assert.equal((await ask()).status, 200);
    assert.equal(network.mock.calls.length, 2);
    assert.equal(lease(), undefined);
  });
}
for (const [status, code] of [
  [400, "1113"],
  [200, "1113"],
  [402, null],
  [429, "1321"],
]) {
  test(`Z.ai HTTP ${status}/code ${code}: refuse paid access and pause to next UTC day`, async () => {
    network.mock.mockImplementation(async () =>
      Response.json(
        { error: { code, message: `private ${key}` } },
        { status, headers: { "Retry-After": "1" } },
      ),
    );
    const r = await ask();
    assert.equal(r.status, 503);
    const data = await r.json();
    assert.equal(diagnostic().code, "free_access_unavailable");
    assert.match(data.message, /Do not add a card/);
    assert(!JSON.stringify(data).includes(key));
    assert.equal(Number(r.headers.get("Retry-After")), 14 * 3600);
    assert.equal(lease(), undefined);
    clock += 31000;
    await ask();
    assert.equal(network.mock.calls.length, 1);
  });
}
test("an HTTP-200 error envelope cannot masquerade as a completed model answer", async () => {
  network.mock.mockImplementation(async () =>
    Response.json({
      error: { code: "unknown", message: key },
      choices: [{ message: { content: "must not be accepted" } }],
    }),
  );
  assert.equal((await ask()).status, 503);
  assert.notEqual(diagnostic().code, "ok");
});
test("Z.ai 429 honors Retry-After without paid-model fallback or automatic retries", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      { error: { code: "1302", message: key } },
      { status: 429, headers: { "Retry-After": "180" } },
    ),
  );
  const r = await ask();
  assert.equal(r.status, 503);
  assert.equal(r.headers.get("Retry-After"), "180");
  assert.equal(diagnostic().code, "rate_or_quota_limit");
  assert.equal(network.mock.calls.length, 1);
  assert.equal(lease(), undefined);
});
test("failed Z.ai does not prevent a separate explicitly configured free backup", async () => {
  env.ENABLED_PROVIDERS = "zai,openrouter";
  env.OPENROUTER_API_KEY = "test-router";
  env.OPENROUTER_MODEL = "test/model:free";
  network.mock.mockImplementation(async (url) =>
    url.includes("api.z.ai") ? Response.json({ error: { code: "1113" } }, { status: 400 }) : good(),
  );
  const r = await ask(null);
  const data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.provider, "openrouter");
  assert.equal(network.mock.calls.length, 2);
  assert.equal(diagnostic().code, "free_access_unavailable");
});
test("busy Z.ai does not consume a provider attempt or call its endpoint", async () => {
  env.ENABLED_PROVIDERS = "zai,openrouter";
  env.OPENROUTER_API_KEY = "test-router";
  env.OPENROUTER_MODEL = "test/model:free";
  await ask();
  env.AI_DB.db
    .prepare("INSERT INTO ai_provider_leases VALUES ('zai','other',?)")
    .run(clock + 60000);
  const r = await ask(null);
  assert.equal((await r.json()).provider, "openrouter");
  assert.equal(network.mock.calls.length, 2);
  assert(network.mock.calls[1].arguments[0].includes("openrouter.ai"));
});
test("Z.ai key addition leaves existing Gemini-salted request identities unchanged", async () => {
  const visitorId = crypto.randomUUID();
  const req = () =>
    new Request("https://example/chat", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.5",
      },
      body: JSON.stringify({ question: "Safe ideas?", visitorId }),
    });
  env.GEMINI_API_KEY = "stable-gemini";
  env.GEMINI_MODEL = "test-free";
  env.ENABLED_PROVIDERS = "gemini";
  network.mock.mockImplementation(async () =>
    Response.json({ candidates: [{ content: { parts: [{ text: "Safe ideas." }] } }] }),
  );
  await worker.fetch(req(), env);
  const before = env.AI_DB.db.prepare("SELECT visitor,ip FROM ai_requests").get();
  env.ENABLED_PROVIDERS = "zai";
  clock += 2001;
  network.mock.mockImplementation(good);
  const r = await worker.fetch(req(), env);
  assert.equal((await r.json()).remaining, 48);
  assert.deepEqual(env.AI_DB.db.prepare("SELECT DISTINCT visitor,ip FROM ai_requests").all(), [
    before,
  ]);
});
test("health neither creates schema nor calls AI, reserves quota, or exposes lease tokens", async () => {
  await ask();
  env.AI_DB.db
    .prepare("INSERT INTO ai_provider_leases VALUES ('zai','private-token',?)")
    .run(clock + 60000);
  const dump = () => env.AI_DB.db.prepare("SELECT * FROM ai_provider_leases").all();
  const before = dump();
  network.mock.resetCalls();
  const h = await health();
  assert.equal(network.mock.calls.length, 0);
  assert.deepEqual(dump(), before);
  assert(!JSON.stringify(h).includes("private-token"));
});
test("Z.ai malformed answers and redirects are not accepted as completed answers", async () => {
  for (const reply of [
    () => Response.json({ choices: [{ message: { content: { text: "not a string" } } }] }),
    () => Response.json({ choices: [{ message: { content: "" }, finish_reason: "length" }] }),
    () => Response.json(null),
    () =>
      new Response("redirect", { status: 302, headers: { Location: "https://untrusted.invalid" } }),
  ]) {
    network.mock.mockImplementation(reply);
    assert.equal((await ask()).status, 503);
    assert.notEqual(diagnostic().code, "ok");
    env.AI_DB.db.prepare("DELETE FROM ai_provider_state").run();
  }
});

test("optional lease cleanup failure preserves the completed answer and the bounded lock", async () => {
  const original = env.AI_DB.prepare.bind(env.AI_DB);
  mock.method(env.AI_DB, "prepare", (sql) => {
    if (sql.startsWith("DELETE FROM ai_provider_leases")) throw new Error("private cleanup detail");
    return original(sql);
  });
  const r = await ask();
  assert.equal(r.status, 200);
  assert.equal((await r.json()).provider, "zai");
  assert(lease());
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 1);
});
for (const [code, expected, retry] of [
  ["1001", "api_key_invalid", 86400],
  ["1302", "rate_or_quota_limit", 300],
  ["1211", "model_or_endpoint_not_found", 3600],
]) {
  test(`HTTP-200 Z.ai API code ${code} retains its semantic cooldown`, async () => {
    network.mock.mockImplementation(async () => Response.json({ error: { code, message: key } }));
    const r = await ask();
    assert.equal(r.status, 503);
    assert.equal(diagnostic().code, expected);
    assert.equal(Number(r.headers.get("Retry-After")), retry);
  });
}
test("Z.ai safety refusal does not trigger another provider or expose upstream text", async () => {
  env.ENABLED_PROVIDERS = "zai,openrouter";
  env.OPENROUTER_API_KEY = "test-router";
  env.OPENROUTER_MODEL = "test/model:free";
  network.mock.mockImplementation(async () =>
    Response.json({ error: { code: "1301", message: key } }, { status: 400 }),
  );
  const r = await ask(null),
    data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.provider, "zai");
  assert.match(data.answer, /safe alternative/);
  assert(!data.answer.includes(key));
  assert.equal(network.mock.calls.length, 1);
});

test("non-JSON HTTP 402 is still a zero-cost access block, not a short-retry parser error", async () => {
  network.mock.mockImplementation(
    async () => new Response("private payment detail", { status: 402 }),
  );
  const r = await ask();
  assert.equal(r.status, 503);
  assert.equal(diagnostic().code, "free_access_unavailable");
  assert.equal(Number(r.headers.get("Retry-After")), 14 * 3600);
  assert.equal(lease(), undefined);
  assert(!(await r.text()).includes("private payment detail"));
});
test("a stalled Z.ai response body retains its bounded lease after timeout", async () => {
  network.mock.mockImplementation(
    async () =>
      new Response(
        new ReadableStream({
          start(controller) {
            controller.error(
              Object.assign(new Error("private stalled response"), { name: "TimeoutError" }),
            );
          },
        }),
      ),
  );
  assert.equal((await ask()).status, 503);
  assert.equal(diagnostic().code, "provider_timeout");
  assert.equal(lease().leased_until, clock + 60000);
});

test("first Z.ai success then 429 pauses only the selected test; automatic fallback remains available", async () => {
  env.ENABLED_PROVIDERS = "gemini,groq,cloudflare,zai";
  env.GEMINI_API_KEY = "test-gemini";
  env.GEMINI_MODEL = "test-free-model";
  env.GROQ_API_KEY = "test-groq";
  env.GROQ_MODEL = "test-free-model";
  env.AI = { run: async () => Response.json({ response: "Safe decoration ideas." }) };
  const first = await ask();
  assert.equal(first.status, 200);
  assert.equal((await first.json()).provider, "zai");
  network.mock.mockImplementation(async () =>
    Response.json({ error: { code: "1302" } }, { status: 429 }),
  );
  const second = await ask();
  assert.equal(second.status, 503);
  assert.equal(diagnostic().code, "rate_or_quota_limit");
  assert.equal(network.mock.calls.length, 2);
  const third = await ask();
  const thirdData = await third.json();
  assert.equal(third.status, 503);
  assert.equal(thirdData.error, "providers_cooling_down");
  assert.equal(thirdData.diagnostics.providers[0].upstreamHttpStatus, 429);
  assert.equal(network.mock.calls.length, 2, "cooldown must not send another upstream request");
  const h = await health();
  assert.deepEqual(h.setup.enabledProviders, ["gemini", "groq", "cloudflare", "zai"]);
  assert.deepEqual(
    h.diagnostics.providers.filter((p) => p.provider !== "zai").map((p) => p.retryAfterSeconds),
    [0, 0, 0],
  );
  network.mock.mockImplementation(async () =>
    Response.json({
      candidates: [{ content: { parts: [{ text: "Safe alternative colours." }] } }],
    }),
  );
  const fallback = await ask(null);
  assert.equal(fallback.status, 200);
  assert.equal((await fallback.json()).provider, "gemini");
  assert.equal(network.mock.calls.length, 3);
  assert(network.mock.calls[2].arguments[0].includes("generativelanguage.googleapis.com"));
});
