import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const html = readFileSync(
  new URL("../../drafts/ai-mistral-capacity-check.html", import.meta.url),
  "utf8",
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const goodHealth = () =>
  Response.json({
    status: "configured",
    setup: { evaluationProviders: ["gemini", "groq", "cloudflare", "mistral"] },
    mistral: { model: "mistral-small-latest", apiMode: "conversations", evaluationOnly: true },
    diagnostics: {
      storageReadable: true,
      providers: [{ provider: "mistral", retryAfterSeconds: 0 }],
    },
  });
const good = () =>
  Response.json({
    answer: "Ivory and gold balloons.",
    provider: "mistral",
    model: "mistral-small-2603",
    modelVerification: "reported_snapshot",
    apiMode: "conversations",
    remaining: 40,
  });
function fixture({ health = goodHealth, reply = good, storageBlocked = false } = {}) {
  let clock = 100000,
    seq = 0;
  const timers = new Map(),
    storage = new Map(),
    calls = [];
  const nodes = Object.fromEntries(
    ["start", "stop", "status", "result", "log"].map((id) => [
      id,
      {
        textContent: "",
        disabled: id === "stop",
        addEventListener(name, fn) {
          this[name] = fn;
        },
      },
    ]),
  );
  class Clock extends Date {
    static now() {
      return clock;
    }
  }
  vm.runInNewContext(script, {
    document: { getElementById: (id) => nodes[id] },
    Date: Clock,
    crypto,
    AbortController,
    localStorage: {
      getItem(k) {
        if (storageBlocked) throw Error("blocked");
        return storage.get(k);
      },
      setItem(k, v) {
        if (storageBlocked) throw Error("blocked");
        storage.set(k, v);
      },
    },
    setTimeout(fn, ms) {
      timers.set(++seq, { fn, ms });
      return seq;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    async fetch(url, options) {
      calls.push({ url, options, at: clock });
      return url.endsWith("/health")
        ? health()
        : reply(url, options, calls.filter((c) => c.url.endsWith("/chat")).length);
    },
  });
  async function flush() {
    for (let i = 0; i < 40; i++) await Promise.resolve();
  }
  async function next() {
    await flush();
    assert.equal(timers.size, 1);
    const [id, t] = [...timers][0];
    timers.delete(id);
    clock += t.ms;
    t.fn();
    await flush();
  }
  return {
    nodes,
    calls,
    timers,
    storage,
    flush,
    next,
    start: () => nodes.start.click(),
    stop: () => nodes.stop.click(),
    posts: () => calls.filter((c) => c.url.endsWith("/chat")),
  };
}
test("capacity page is zero-network on load, has explicit maximum-attempt consent and no key input", () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  assert.match(html, /maximum <strong>10 real AI questions/);
  assert(!/API_KEY|Authorization|<input/i.test(html));
});
test("ten paced successes use only Mistral, at most once per minute, with one persistent identity and no credentials", async () => {
  const f = fixture();
  f.storage.set("bce-ai-visitor-id", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
  const pending = f.start();
  await f.flush();
  await f.start(); // double click cannot start another run
  assert.equal(f.posts().length, 1);
  for (let i = 0; i < 9; i++) await f.next();
  await pending;
  assert.equal(f.calls.length, 11);
  assert.equal(f.posts().length, 10);
  let previous;
  for (const call of f.posts()) {
    const data = JSON.parse(call.options.body);
    assert.equal(data.provider, "mistral");
    assert.equal(data.visitorId, "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    assert(data.question.length >= 2 && data.question.length <= 1500);
    assert.deepEqual(Object.keys(data).sort(), ["provider", "question", "visitorId"]);
    assert.equal(call.options.credentials, "omit");
    assert.equal(call.options.redirect, "error");
    if (previous !== undefined) assert(call.at - previous >= 60000);
    previous = call.at;
  }
  assert.match(f.nodes.result.textContent, /10\/10/);
  assert.match(f.nodes.result.textContent, /does NOT establish a daily quota/);
  assert.equal(f.nodes.start.disabled, true);
  assert.equal(f.nodes.stop.disabled, true);
  assert.equal(f.timers.size, 0);
});
test("rate limit after one success stops without retries or falling back to another provider", async () => {
  const f = fixture({
    reply: (_u, _o, n) =>
      n === 1
        ? good()
        : Response.json(
            {
              error: "providers_unavailable",
              diagnostics: {
                providers: [
                  {
                    provider: "mistral",
                    lastResult: "rate_or_quota_limit",
                    upstreamHttpStatus: 429,
                    retryAfterSeconds: 300,
                  },
                ],
              },
            },
            { status: 503, headers: { "Retry-After": "300" } },
          ),
  });
  const pending = f.start();
  await f.next();
  await pending;
  assert.equal(f.posts().length, 2);
  assert.match(f.nodes.result.textContent, /1\/10/);
  assert.match(f.nodes.result.textContent, /NOT qualified/);
  assert.match(f.nodes.log.textContent, /upstream 429/);
  assert.equal(f.timers.size, 0);
});
test("active cooldown blocks all inference without clearing or shortening the provider pause", async () => {
  const f = fixture({
    health: () =>
      Response.json({
        status: "configured",
        setup: { evaluationProviders: ["mistral"] },
        mistral: { model: "mistral-small-latest", apiMode: "conversations", evaluationOnly: true },
        diagnostics: {
          storageReadable: true,
          providers: [{ provider: "mistral", retryAfterSeconds: 283 }],
        },
      }),
  });
  await f.start();
  assert.equal(f.posts().length, 0);
  assert.match(f.nodes.result.textContent, /283s/);
  assert.match(f.nodes.result.textContent, /No AI request was sent/);
});
test("missing, changed or unreadable setup never spends AI allowance", async () => {
  for (const health of [
    () => Response.json(null),
    () => Response.json({ status: "setup_required" }),
    () =>
      Response.json({
        status: "configured",
        setup: { evaluationProviders: ["mistral"] },
        mistral: { model: "paid-model" },
      }),
    () =>
      Response.json({
        status: "configured",
        setup: { evaluationProviders: ["mistral"] },
        mistral: { model: "mistral-small-latest", apiMode: "conversations", evaluationOnly: true },
        diagnostics: { storageReadable: false },
      }),
  ]) {
    const f = fixture({ health });
    await f.start();
    assert.equal(f.posts().length, 0);
  }
});
test("wrong-provider success is never counted as a Mistral answer", async () => {
  const f = fixture({
    reply: () => Response.json({ answer: "From another model.", provider: "groq" }),
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /0\/10/);
  assert.match(f.nodes.result.textContent, /No other provider/);
});
test("app daily limit is inconclusive and does not trigger identity reset or paid fallback", async () => {
  const f = fixture({
    reply: () =>
      Response.json({ error: "daily_limit" }, { status: 429, headers: { "Retry-After": "5000" } }),
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /Sample incomplete: app quota/);
  assert(!f.nodes.result.textContent.includes("NOT qualified"));
});
test("remaining app allowance zero stops before another request", async () => {
  const f = fixture({
    reply: () =>
      Response.json({
        answer: "Safe ideas.",
        provider: "mistral",
        model: "mistral-small-latest",
        modelVerification: "reported_alias",
        apiMode: "conversations",
        remaining: 0,
      }),
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /visitor allowance reached/);
});
test("Stop during the waiting gap sends no further request", async () => {
  const f = fixture();
  const pending = f.start();
  await f.flush();
  f.stop();
  await pending;
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /Stopped/);
  assert.equal(f.timers.size, 0);
});
test("network interruption is uncertain, counts the sent attempt and never retries", async () => {
  const f = fixture({
    reply: () => {
      throw Error("network");
    },
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /Inconclusive transport/);
  assert.match(f.nodes.result.textContent, /attempts sent: 1/);
});
test("null JSON response is not a success and does not falsely claim nothing was sent", async () => {
  const f = fixture({ reply: () => Response.json(null) });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /attempts sent: 1/);
  assert.match(f.nodes.result.textContent, /Inconclusive response/);
});
test("blocked browser storage retains one identity for all ten questions", async () => {
  const f = fixture({ storageBlocked: true });
  const pending = f.start();
  for (let i = 0; i < 9; i++) await f.next();
  await pending;
  assert.equal(new Set(f.posts().map((c) => JSON.parse(c.options.body).visitorId)).size, 1);
});
test("error diagnostics render as plain text, never executable HTML", async () => {
  const f = fixture({
    reply: () => Response.json({ error: "<img onerror=alert(1)>" }, { status: 503 }),
  });
  await f.start();
  assert.equal(f.nodes.log.innerHTML, undefined);
  assert.match(f.nodes.log.textContent, /<img onerror/);
});
test("safety refusal on a benign prompt is not presented as a usable capacity success", async () => {
  const f = fixture({
    reply: () =>
      Response.json({
        provider: "mistral",
        model: "mistral-small-latest",
        modelVerification: "requested_only",
        apiMode: "conversations",
        answer:
          "I can help with safe decoration and event-planning ideas, but not instructions that could harm someone. Please contact our team for a safe alternative.",
      }),
  });
  await f.start();
  assert.match(f.nodes.result.textContent, /0\/10/);
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.log.textContent, /Safety refusal/);
});

test("Stop during inference aborts once and never sends a second question", async () => {
  const f = fixture({
    reply: (_u, o) =>
      new Promise((_resolve, reject) =>
        o.signal.addEventListener("abort", () => reject(Error("stopped"))),
      ),
  });
  const pending = f.start();
  await f.flush();
  f.stop();
  await pending;
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /attempts sent: 1/);
  assert.match(f.nodes.result.textContent, /Inconclusive transport/);
  assert.equal(f.timers.size, 0);
});
test("response deadline aborts once and stops instead of retrying an uncertain inference", async () => {
  const f = fixture({
    reply: (_u, o) =>
      new Promise((_resolve, reject) =>
        o.signal.addEventListener("abort", () => reject(Error("timeout"))),
      ),
  });
  const pending = f.start();
  await f.next();
  await pending;
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /completion uncertain|Inconclusive transport/);
  assert.equal(f.timers.size, 0);
});
test("malformed diagnostic lists stop safely without claiming a sent request never happened", async () => {
  const f = fixture({
    reply: () =>
      Response.json({ error: "bad_reply", diagnostics: { providers: {} } }, { status: 503 }),
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /attempts sent: 1/);
  assert(!f.nodes.result.textContent.includes("No AI request was sent"));
});

test("capacity questions include English, Hindi and Hinglish; real answer snippets remain plain text", async () => {
  assert.match(html, /Hinglish mein/);
  assert.match(html, /सुरक्षा सूची/);
  const f = fixture({
    reply: () =>
      Response.json({
        answer: "<img onerror=alert(1)> Safe ivory balloons.",
        provider: "mistral",
        model: "mistral-small-latest",
        modelVerification: "reported_alias",
        apiMode: "conversations",
        remaining: 40,
      }),
  });
  const pending = f.start();
  await f.flush();
  f.stop();
  await pending;
  assert.match(f.nodes.log.textContent, /<img onerror/);
  assert.equal(f.nodes.log.innerHTML, undefined);
});

test("old Chat Completions setup cannot be mistaken for the new Conversations test", async () => {
  const f = fixture({
    health: () =>
      Response.json({
        status: "configured",
        setup: { evaluationProviders: ["mistral"] },
        mistral: { model: "mistral-small-2603", evaluationOnly: true },
        diagnostics: {
          storageReadable: true,
          providers: [{ provider: "mistral", retryAfterSeconds: 0 }],
        },
      }),
  });
  await f.start();
  assert.equal(f.posts().length, 0);
});
test("response proof must come from Conversations and a known requested/reported Small model", async () => {
  for (const extra of [
    { apiMode: "chat" },
    { model: "mistral-large-latest" },
    { modelVerification: "guessed" },
  ]) {
    const f = fixture({
      reply: () =>
        Response.json({
          answer: "Not a verified route.",
          provider: "mistral",
          model: "mistral-small-latest",
          apiMode: "conversations",
          modelVerification: "reported_alias",
          ...extra,
        }),
    });
    await f.start();
    assert.match(f.nodes.result.textContent, /0\/10/);
    assert.equal(f.posts().length, 1);
  }
});
test("provider zero-quota header diagnosis stops the paced test after one attempt without retry", async () => {
  const f = fixture({
    reply: () =>
      Response.json(
        {
          error: "providers_unavailable",
          diagnostics: {
            providers: [
              {
                provider: "mistral",
                lastResult: "provider_model_zero_quota",
                upstreamHttpStatus: 429,
                retryAfterSeconds: 86400,
              },
            ],
          },
        },
        { status: 503 },
      ),
  });
  await f.start();
  assert.equal(f.posts().length, 1);
  assert.match(f.nodes.result.textContent, /NOT qualified/);
});
