import { test, beforeEach, afterEach, mock } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import worker from "./worker.js";

// Real SQLite with D1-style serialized batches; HTTP is always mocked. No actual keys.
class D1 {
  constructor() {
    this.db = new DatabaseSync(":memory:");
    this.pending = Promise.resolve();
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
  batch(statements) {
    const work = this.pending.then(async () => {
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
    });
    this.pending = work.catch(() => {});
    return work;
  }
}
const origin = "https://htmlpreview.github.io";
const key = "test-only-mistral-key";
const model = "mistral-small-latest";
const snapshot = "mistral-small-2603";
const good = () =>
  Response.json({
    object: "conversation.response",
    conversation_id: "private-conversation-id",
    outputs: [
      {
        type: "message.output",
        role: "assistant",
        model: snapshot,
        content: "Try an ivory and gold balloon backdrop.",
      },
    ],
    usage: { prompt_tokens: 100, completion_tokens: 30 },
  });
let env, clock, network;
const health = async () => (await worker.fetch(new Request("https://example/health"), env)).json();
const ask = (provider = "mistral", overrides = {}) =>
  worker.fetch(
    new Request("https://example/chat", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "CF-Connecting-IP": crypto.randomUUID(),
        ...overrides.headers,
      },
      body: JSON.stringify({
        question: "Birthday decoration ideas?",
        visitorId: crypto.randomUUID(),
        ...(provider ? { provider } : {}),
        ...overrides.data,
      }),
    }),
    env,
  );
const budget = () =>
  env.AI_DB.db.prepare("SELECT * FROM ai_mistral_monthly_budget ORDER BY period").all();
const diagnostic = () =>
  env.AI_DB.db.prepare("SELECT * FROM ai_provider_diagnostics WHERE provider='mistral'").get();
const lease = () =>
  env.AI_DB.db.prepare("SELECT * FROM ai_provider_leases WHERE provider='mistral'").get();
beforeEach(() => {
  clock = Date.UTC(2026, 9, 19, 10);
  mock.method(Date, "now", () => clock);
  env = {
    AI_DB: new D1(),
    ALLOWED_ORIGINS: origin,
    ENABLED_PROVIDERS: "",
    MISTRAL_API_KEY: key,
    MISTRAL_FREE_EVALUATION: "true",
    RATE_LIMIT_SALT: "stable-test-salt",
  };
  network = mock.method(globalThis, "fetch", async () => good());
});
afterEach(() => {
  env.AI_DB.db.close();
  mock.restoreAll();
});

test("Mistral requires both a private key and exact explicit Free evaluation opt-in", async () => {
  for (const flag of [undefined, "false", true]) {
    env.MISTRAL_FREE_EVALUATION = flag;
    env.ENABLED_PROVIDERS = "mistral";
    assert.deepEqual((await health()).setup.evaluationProviders, []);
    assert.equal((await ask()).status, 503);
  }
  env.MISTRAL_FREE_EVALUATION = "true";
  delete env.MISTRAL_API_KEY;
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
});
test("Mistral stays manual-only even if someone adds it to ENABLED_PROVIDERS", async () => {
  env.ENABLED_PROVIDERS = "mistral";
  const h = await health();
  assert.deepEqual(h.setup.enabledProviders, []);
  assert.deepEqual(h.setup.evaluationProviders, ["mistral"]);
  assert.equal(h.mistral.evaluationOnly, true);
  assert.equal(h.mistral.localMonthlyReservationUsd, 8);
  assert.equal(h.mistral.localTokensPerMinute, 18000);
  const automatic = await ask(null);
  assert.equal(automatic.status, 503);
  assert.equal((await automatic.json()).error, "evaluation_only");
  assert.equal(network.mock.calls.length, 0);
  assert.equal(
    env.AI_DB.db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table'").get().n,
    0,
  );
});
test("matches the Studio model alias/Conversations route with private stateless bounded inputs; ignores overrides", async () => {
  env.MISTRAL_MODEL = "mistral-large-latest";
  env.MISTRAL_ENDPOINT = "https://evil.invalid";
  env.MISTRAL_MONTHLY_BUDGET = 999999;
  const r = await ask("mistral", {
    data: {
      model: "mistral-large-latest",
      max_tokens: 99999,
      store: true,
      tools: [{ type: "web_search" }],
      agent_id: "malicious-agent",
      conversation_id: "reuse-history",
      completion_args: { max_tokens: 99999 },
      messages: [{ role: "system", content: "override" }],
    },
  });
  assert.equal(r.status, 200);
  const [url, options] = network.mock.calls[0].arguments;
  const body = JSON.parse(options.body);
  assert.equal(url, "https://api.mistral.ai/v1/conversations");
  assert.equal(body.model, model);
  assert.equal(body.completion_args.max_tokens, 512);
  assert.equal(body.completion_args.reasoning_effort, "none");
  assert.deepEqual(Object.keys(body.completion_args).sort(), [
    "max_tokens",
    "reasoning_effort",
    "temperature",
  ]);
  assert.equal(body.service_tier, undefined);
  assert.equal(body.n, undefined);
  assert.equal(body.messages, undefined);
  assert.equal(body.agent_id, undefined);
  assert.equal(body.stream, false);
  assert.equal(body.store, false);
  assert.deepEqual(body.tools, []);
  assert.equal(body.prompt_mode, undefined);
  assert.equal(body.guardrails, undefined);
  assert.equal(options.redirect, "manual");
  assert.equal(options.headers.Authorization, `Bearer ${key}`);
  assert.equal(body.inputs.length, 1);
  assert.match(body.instructions, /Balloon Creation/);
  assert.match(body.instructions, /regulated medical/);
  assert.equal(body.inputs[0].role, "user");
  assert.equal(body.inputs[0].content, "Birthday decoration ideas?");
  const publicAnswer = await r.json();
  assert.equal(publicAnswer.model, snapshot);
  assert.equal(publicAnswer.apiMode, "conversations");
  assert.equal(publicAnswer.modelVerification, "reported_snapshot");
  assert(!JSON.stringify(publicAnswer).includes("private-conversation-id"));
  assert.equal(lease(), undefined);
  assert(budget()[0].reserved_micro_usd > 0);
  assert(!JSON.stringify(await health()).includes(key));
});
test("adding an evaluation key cannot change the default Gemini/Groq/Cloudflare pool or call Mistral", async () => {
  env.ENABLED_PROVIDERS = "gemini,groq,cloudflare,mistral";
  env.GEMINI_API_KEY = "test-gemini";
  env.GEMINI_MODEL = "test-free";
  env.GROQ_API_KEY = "test-groq";
  env.GROQ_MODEL = "test-free";
  env.AI = { run: async () => Response.json({ response: "Safe ideas." }) };
  network.mock.mockImplementation(async (url) =>
    url.includes("googleapis.com")
      ? Response.json({ error: {} }, { status: 503 })
      : Response.json({ choices: [{ message: { content: "A free backup answer." } }] }),
  );
  const r = await ask(null),
    data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.provider, "groq");
  assert.equal(network.mock.calls.length, 2);
  assert(!network.mock.calls.some((call) => call.arguments[0].includes("mistral.ai")));
  assert.deepEqual((await health()).setup.enabledProviders, ["gemini", "groq", "cloudflare"]);
  assert.equal(
    env.AI_DB.db
      .prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name LIKE 'ai_mistral_%'")
      .get().n,
    0,
  );
});
test("health is read-only, never validates a key or creates/reserves evaluation state", async () => {
  const h = await health();
  assert.equal(h.mistral.model, model);
  assert.equal(network.mock.calls.length, 0);
  assert.equal(
    env.AI_DB.db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE type='table'").get().n,
    0,
  );
  await ask();
  const before = budget();
  network.mock.resetCalls();
  await health();
  assert.deepEqual(budget(), before);
  assert.equal(network.mock.calls.length, 0);
});
test("successful Conversations text chunks are accepted without exposing analysis", async () => {
  network.mock.mockImplementation(async () =>
    Response.json({
      object: "conversation.response",
      conversation_id: "private-conversation-id",
      outputs: [
        {
          type: "message.output",
          role: "assistant",
          model: snapshot,
          content: [
            { type: "thinking", thinking: [{ type: "text", text: "private analysis" }] },
            { type: "text", text: "Soft ivory " },
            { type: "text", text: "balloons." },
          ],
        },
      ],
      usage: { connector_tokens: 0, connectors: {} },
    }),
  );
  const data = await (await ask()).json();
  assert.equal(data.answer, "Soft ivory balloons.");
  assert.equal(data.provider, "mistral");
  assert(!JSON.stringify(data).includes("private"));
});
test("one in-flight Mistral lease blocks a second request without reserving more monthly credit", async () => {
  const started = Promise.withResolvers(),
    finish = Promise.withResolvers();
  network.mock.mockImplementation(async () => {
    started.resolve();
    return finish.promise;
  });
  const first = ask();
  await started.promise;
  const before = budget()[0].reserved_micro_usd;
  try {
    const second = await ask();
    assert.equal(second.status, 503);
    assert.equal(network.mock.calls.length, 1);
    assert.equal(budget()[0].reserved_micro_usd, before);
    assert.equal((await health()).diagnostics.providers[0].lastResult, "concurrency_busy");
  } finally {
    finish.resolve(good());
    await first;
  }
  assert.equal(lease(), undefined);
});
test("fast sequential and simultaneous starts honor the observed one-request-per-second account limit", async () => {
  await ask();
  const before = budget()[0].reserved_micro_usd;
  const second = await ask();
  assert.equal(second.status, 503);
  assert.equal(diagnostic().code, "local_provider_rate_limit");
  assert.equal(network.mock.calls.length, 1);
  assert.equal(budget()[0].reserved_micro_usd, before);
  assert.equal(Number(second.headers.get("Retry-After")), 2);
  clock += 2001;
  const results = await Promise.all([ask(), ask()]);
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 503]);
  assert.equal(network.mock.calls.length, 2);
  assert.equal(budget()[0].reserved_micro_usd, before * 2);
});
test("rolling UTF-8 token reservations stop before upstream 20k TPM and recover without resetting quota", async () => {
  const question = "क".repeat(1500);
  assert.equal((await ask("mistral", { data: { question } })).status, 200);
  clock += 2000;
  assert.equal((await ask("mistral", { data: { question } })).status, 200);
  clock += 2000;
  const third = await ask("mistral", { data: { question } });
  assert.equal(third.status, 503);
  assert.equal(diagnostic().code, "local_provider_rate_limit");
  assert.equal(network.mock.calls.length, 2);
  assert(
    env.AI_DB.db.prepare("SELECT SUM(reserved_tokens) AS n FROM ai_mistral_dispatches").get().n <=
      18000,
  );
  clock += 60001;
  assert.equal((await ask("mistral", { data: { question } })).status, 200);
  assert.equal(network.mock.calls.length, 3);
});
test("fixed $8 local monthly reservation allows exact boundary then pauses to next UTC month", async () => {
  await ask();
  const units = budget()[0].reserved_micro_usd;
  env.AI_DB.db
    .prepare("UPDATE ai_mistral_monthly_budget SET reserved_micro_usd=?")
    .run(8000000 - units);
  clock += 2000;
  assert.equal((await ask()).status, 200);
  assert.equal(budget()[0].reserved_micro_usd, 8000000);
  clock += 2000;
  const third = await ask();
  assert.equal(third.status, 503);
  assert.equal(diagnostic().code, "local_provider_budget");
  assert.equal(network.mock.calls.length, 2);
  assert.equal(budget()[0].reserved_micro_usd, 8000000);
  clock = Date.UTC(2026, 10, 1);
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 3);
  assert.equal(budget().length, 2);
  assert.equal(budget()[0].reserved_micro_usd, 8000000);
  assert.equal(budget()[1].period, "2026-11");
});
test("Cloudflare daily cleanup cannot erase Mistral's monthly credit ledger", async () => {
  await ask();
  const before = budget();
  env.ENABLED_PROVIDERS = "cloudflare";
  env.AI = { run: async () => Response.json({ response: "Safe free answer." }) };
  clock += 86400000;
  assert.equal((await ask(null)).status, 200);
  assert.deepEqual(budget(), before);
  assert.equal(network.mock.calls.length, 1);
});
for (const kind of ["TimeoutError", "TypeError"]) {
  test(`${kind} keeps the conservative lease and never refunds monthly reservations`, async () => {
    network.mock.mockImplementation(async () => {
      throw Object.assign(new Error("private detail"), { name: kind });
    });
    assert.equal((await ask()).status, 503);
    const units = budget()[0].reserved_micro_usd;
    assert(units > 0);
    assert(lease());
    clock += 31000;
    assert.equal((await ask()).status, 503);
    assert.equal(network.mock.calls.length, 1);
    assert.equal(budget()[0].reserved_micro_usd, units);
    network.mock.mockImplementation(good);
    clock += 30000;
    assert.equal((await ask()).status, 200);
    assert.equal(budget()[0].reserved_micro_usd, units * 2);
  });
}
for (const json of [true, false]) {
  test(`HTTP 402 (${json ? "JSON" : "plain text"}) never suggests payment and pauses to next month`, async () => {
    network.mock.mockImplementation(async () =>
      json
        ? Response.json(
            { message: `private ${key}`, type: "insufficient_credits" },
            { status: 402, headers: { "Retry-After": "1" } },
          )
        : new Response("private payment details", { status: 402 }),
    );
    const r = await ask(),
      data = await r.json();
    assert.equal(r.status, 503);
    assert.equal(diagnostic().code, "free_access_unavailable");
    assert.match(data.message, /Keep PAYG off/);
    assert.match(data.message, /do not add a card/);
    assert.equal(Number(r.headers.get("Retry-After")), (Date.UTC(2026, 10, 1) - clock) / 1000);
    assert(!JSON.stringify(data).includes(key));
    assert.equal(lease(), undefined);
    clock += 31000;
    await ask();
    assert.equal(network.mock.calls.length, 1);
  });
}
test("429 respects Retry-After without interpreting it as a wrong question or making an automatic retry", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      { message: `private ${key}`, type: "rate_limited", code: "1300" },
      { status: 429, headers: { "Retry-After": "90" } },
    ),
  );
  const first = await ask();
  assert.equal(first.status, 503);
  assert.equal(first.headers.get("Retry-After"), "90");
  assert.equal(diagnostic().code, "rate_or_quota_limit");
  clock += 3000;
  const second = await ask();
  const data = await second.json();
  assert.equal(data.error, "providers_cooling_down");
  assert.match(data.message, /selected test provider/);
  assert.match(data.message, /Other providers/);
  assert.equal(network.mock.calls.length, 1);
  assert(!JSON.stringify(data).includes(key));
});
for (const response of [
  () =>
    Response.json({
      error: { message: "private error", type: "server_error" },
      outputs: [{ type: "message.output", content: "must not be accepted" }],
    }),
  () =>
    Response.json({
      type: "rate_limited",
      message: "private error",
      outputs: [{ type: "message.output", content: "must not be accepted" }],
    }),
  () =>
    Response.json({
      outputs: [
        {
          type: "message.output",
          role: "assistant",
          model: "mistral-large-latest",
          content: "wrong model",
        },
      ],
    }),
  () => Response.json({ choices: [{ message: { content: "wrong Chat Completions envelope" } }] }),
  () =>
    Response.json({
      outputs: [
        {
          type: "message.output",
          role: "assistant",
          model,
          content: [{ type: "thinking", text: "private thought" }],
        },
      ],
    }),
  () => Response.json(null),
]) {
  test("malformed/error/wrong-model replies cannot masquerade as a completed Mistral conversation answer", async () => {
    network.mock.mockImplementation(response);
    const r = await ask();
    assert.equal(r.status, 503);
    const data = await r.json();
    assert(!JSON.stringify(data).includes("private"));
    assert.notEqual(diagnostic().code, "ok");
  });
}
test("lease or monthly ledger failure is closed before upstream and does not affect an unrelated configured provider", async () => {
  const prepare = env.AI_DB.prepare.bind(env.AI_DB);
  mock.method(env.AI_DB, "prepare", (sql) => {
    if (sql.startsWith("INSERT INTO ai_mistral_monthly_budget")) throw Error("private db issue");
    return prepare(sql);
  });
  const r = await ask();
  assert.equal(r.status, 503);
  assert.equal(network.mock.calls.length, 0);
  assert(!(await r.text()).includes("private db issue"));
  env.ENABLED_PROVIDERS = "groq";
  env.GROQ_API_KEY = "test-groq";
  env.GROQ_MODEL = "test-free";
  network.mock.mockImplementation(async () =>
    Response.json({ choices: [{ message: { content: "Safe backup." } }] }),
  );
  assert.equal((await ask(null)).status, 200);
  assert.equal(network.mock.calls.length, 1);
});
test("evaluation keeps the same daily visitor identity and allowance as the existing website", async () => {
  const id = crypto.randomUUID();
  const overrides = { data: { visitorId: id }, headers: { "CF-Connecting-IP": "203.0.113.42" } };
  env.ENABLED_PROVIDERS = "groq";
  env.GROQ_API_KEY = "test-groq";
  env.GROQ_MODEL = "test-free";
  network.mock.mockImplementation(async () =>
    Response.json({ choices: [{ message: { content: "Safe palette." } }] }),
  );
  await ask(null, overrides);
  const before = env.AI_DB.db.prepare("SELECT visitor,ip FROM ai_requests").get();
  clock += 2000;
  network.mock.mockImplementation(good);
  const r = await ask("mistral", overrides);
  assert.equal((await r.json()).remaining, 48);
  assert.deepEqual(env.AI_DB.db.prepare("SELECT DISTINCT visitor,ip FROM ai_requests").all(), [
    before,
  ]);
});
test("an HTTP redirect never forwards credentials or creates another upstream call", async () => {
  network.mock.mockImplementation(
    async () => new Response("", { status: 302, headers: { Location: "https://evil.invalid" } }),
  );
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 1);
  assert.equal(diagnostic().code, "provider_redirect_rejected");
  assert(budget()[0].reserved_micro_usd > 0);
});

test("Conversations allows optional model metadata but labels it requested-only, never a verified snapshot", async () => {
  network.mock.mockImplementation(async () =>
    Response.json({
      object: "conversation.response",
      conversation_id: "private-id",
      outputs: [{ type: "message.output", role: "assistant", content: "A soft gold palette." }],
      usage: {},
    }),
  );
  const r = await ask(),
    data = await r.json();
  assert.equal(r.status, 200);
  assert.equal(data.answer, "A soft gold palette.");
  assert.equal(data.model, "mistral-small-latest");
  assert.equal(data.modelVerification, "requested_only");
  assert(!JSON.stringify(data).includes("private-id"));
});
test("a reported Small alias is not falsely promoted to a dated snapshot", async () => {
  network.mock.mockImplementation(async () =>
    Response.json({
      object: "conversation.response",
      outputs: [{ type: "message.output", model, content: "Ivory balloons." }],
      usage: {},
    }),
  );
  const data = await (await ask()).json();
  assert.equal(data.model, model);
  assert.equal(data.modelVerification, "reported_alias");
});
for (const output of [
  { type: "function.call", name: "web_search", content: "not an answer" },
  { type: "tool.execution", content: "not an answer" },
  { type: "agent.handoff", content: "not an answer" },
  { type: "message.output", role: "user", model, content: "echoed input" },
  {
    type: "message.output",
    role: "assistant",
    model: "mistral-large-latest",
    content: "wrong model",
  },
]) {
  test(`unexpected ${output.type}/${output.role || output.model || "tool"} never produces a successful text answer or a continuation request`, async () => {
    network.mock.mockImplementation(async () =>
      Response.json({ object: "conversation.response", outputs: [output], usage: {} }),
    );
    assert.equal((await ask()).status, 503);
    assert.equal(network.mock.calls.length, 1);
  });
}
test("unexpected billed connector usage is rejected without making tool/continuation/cleanup calls", async () => {
  network.mock.mockImplementation(async () =>
    Response.json({
      outputs: [{ type: "message.output", model, content: "not accepted" }],
      usage: { connector_tokens: 10, connectors: { web_search: 1 } },
    }),
  );
  assert.equal((await ask()).status, 503);
  assert.equal(diagnostic().code, "unexpected_conversation_output");
  assert.equal(network.mock.calls.length, 1);
});
for (const header of ["x-ratelimit-limit-req-minute", "x-ratelimit-limit-tokens-minute"]) {
  test(`429 with explicit zero ${header} gets safe zero-quota diagnosis, not a fabricated balance explanation`, async () => {
    network.mock.mockImplementation(async () =>
      Response.json(
        { message: `private ${key}`, type: "rate_limited", code: "1300" },
        { status: 429, headers: { [header]: "0", "Retry-After": "1", "x-private": key } },
      ),
    );
    const r = await ask(),
      data = await r.json();
    assert.equal(diagnostic().code, "provider_model_zero_quota");
    assert.equal(r.headers.get("Retry-After"), "86400");
    assert.match(data.message, /zero request\/token rate limit/);
    assert(!JSON.stringify(data).includes(key));
  });
}
test("a zero monthly-token remainder is distinct from the visible dollar budget and honors the month boundary", async () => {
  network.mock.mockImplementation(async () =>
    Response.json(
      { type: "rate_limited" },
      { status: 429, headers: { "x-ratelimit-remaining-tokens-month": "0" } },
    ),
  );
  const r = await ask(),
    data = await r.json();
  assert.equal(diagnostic().code, "provider_monthly_limit");
  assert.match(data.message, /separate from the included dollar allowance/);
  assert.equal(Number(r.headers.get("Retry-After")), (Date.UTC(2026, 10, 1) - clock) / 1000);
});
test("route revision preserves an existing Mistral cooldown and monthly ledger instead of resetting either", async () => {
  env.AI_DB.db.exec(
    "CREATE TABLE ai_mistral_monthly_budget (period TEXT PRIMARY KEY, reserved_micro_usd INTEGER NOT NULL); INSERT INTO ai_mistral_monthly_budget VALUES ('2026-10',1000000); CREATE TABLE ai_provider_state(provider TEXT PRIMARY KEY,available_at INTEGER NOT NULL)",
  );
  env.AI_DB.db.prepare("INSERT INTO ai_provider_state VALUES ('mistral',?)").run(clock + 300000);
  assert.equal((await ask()).status, 503);
  assert.equal(network.mock.calls.length, 0);
  assert.equal(budget()[0].reserved_micro_usd, 1000000);
  clock += 300001;
  assert.equal((await ask()).status, 200);
  assert.equal(network.mock.calls.length, 1);
  assert(budget()[0].reserved_micro_usd > 1000000);
});
