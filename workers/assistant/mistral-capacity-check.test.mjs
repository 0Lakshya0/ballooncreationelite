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
function fixture({
  health = goodHealth,
  reply = good,
  storageBlocked = false,
  savedStorage,
  copied = [],
} = {}) {
  let clock = 100000,
    seq = 0;
  const timers = new Map(),
    storage = savedStorage || new Map(),
    calls = [];
  const nodes = Object.fromEntries(
    ["start", "stop", "status", "result", "log", "copy", "save-status"].map((id) => [
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
  const events = {};
  vm.runInNewContext(script, {
    window: {
      addEventListener(name, fn) {
        events[name] = fn;
      },
    },
    navigator: { clipboard: { writeText: async (text) => copied.push(text) } },
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
    events,
    copied,
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

const REPORT_KEY = "bce-mistral-conversations-capacity-report-v1";
test("completed ten-answer report restores after reopening without any network or duplicate run", async () => {
  const first = fixture();
  const pending = first.start();
  for (let i = 0; i < 9; i++) await first.next();
  await pending;
  const saved = JSON.parse(first.storage.get(REPORT_KEY));
  assert.equal(saved.records.filter((r) => r.ok).length, 10);
  assert.equal(saved.phase, "finished");
  first.events.pagehide();
  const reopened = fixture({ savedStorage: first.storage });
  assert.equal(reopened.calls.length, 0);
  assert.match(reopened.nodes.result.textContent, /10\/10/);
  assert.match(reopened.nodes.status.textContent, /Saved browser report restored/);
  assert.match(reopened.nodes.result.textContent, /not an independent server audit/);
  assert.equal(reopened.nodes.stop.disabled, true);
  assert.match(reopened.nodes.start.textContent, /NEW check/);
});
test("three confirmed answers survive navigation; incomplete sample never becomes ten", async () => {
  const first = fixture();
  const pending = first.start();
  await first.next();
  await first.next();
  assert.equal(first.posts().length, 3);
  first.events.pagehide();
  await pending;
  const reopened = fixture({ savedStorage: first.storage });
  assert.match(reopened.nodes.result.textContent, /3\/10/);
  assert.match(reopened.nodes.result.textContent, /incomplete/);
  assert.equal(reopened.calls.length, 0);
});
test("an in-flight checkpoint restores as uncertain, not as a completed answer or auto retry", async () => {
  const first = fixture({
    reply: (_u, o) =>
      new Promise((_resolve, reject) =>
        o.signal.addEventListener("abort", () => reject(Error("left"))),
      ),
  });
  const pending = first.start();
  await first.flush();
  const checkpoint = new Map(first.storage);
  const report = JSON.parse(checkpoint.get(REPORT_KEY));
  assert.equal(report.phase, "request");
  assert.equal(report.pendingQuestion, true);
  assert.equal(report.attemptsSent, 1);
  first.events.pagehide();
  await pending;
  const reopened = fixture({ savedStorage: checkpoint });
  assert.match(reopened.nodes.result.textContent, /0\/10/);
  assert.match(reopened.nodes.result.textContent, /completion is unknown/);
  assert.equal(reopened.calls.length, 0);
});
test("pagehide on a restored report cannot overwrite it with an empty new run", async () => {
  const first = fixture();
  const pending = first.start();
  await first.flush();
  first.stop();
  await pending;
  const before = first.storage.get(REPORT_KEY);
  const reopened = fixture({ savedStorage: first.storage });
  reopened.events.pagehide();
  assert.equal(first.storage.get(REPORT_KEY), before);
  assert.equal(reopened.calls.length, 0);
});
test("copying a restored report spends no allowance and does not expose visitor identity", async () => {
  const first = fixture();
  const pending = first.start();
  await first.flush();
  first.stop();
  await pending;
  const copied = [];
  const reopened = fixture({ savedStorage: first.storage, copied });
  await reopened.nodes.copy.click();
  assert.equal(copied.length, 1);
  assert.match(copied[0], /1\/10/);
  assert.equal(reopened.calls.length, 0);
  assert(!copied[0].includes(first.storage.get("bce-ai-visitor-id")));
});
test("new explicit run backs up the old report and preserves the same visitor quota identity", async () => {
  const first = fixture();
  const pending = first.start();
  await first.flush();
  first.stop();
  await pending;
  const before = first.storage.get(REPORT_KEY),
    id = first.storage.get("bce-ai-visitor-id");
  const reopened = fixture({ savedStorage: first.storage });
  assert.equal(reopened.calls.length, 0);
  const nextRun = reopened.start();
  await reopened.flush();
  reopened.stop();
  await nextRun;
  assert.equal(reopened.storage.get(REPORT_KEY + ":previous"), before);
  assert.equal(JSON.parse(reopened.posts()[0].options.body).visitorId, id);
});
test("storage failure is visible and never falsely claims progress was saved", async () => {
  const f = fixture({ storageBlocked: true });
  const pending = f.start();
  await f.flush();
  f.stop();
  await pending;
  assert.match(f.nodes["save-status"].textContent, /NOT saved/);
  assert.equal(f.posts().length, 1);
});
test("tampered/out-of-range/oversize saved reports are ignored without inference or identity reset", () => {
  const bad = [
    "not json",
    "x".repeat(20001),
    JSON.stringify({
      version: 1,
      provider: "mistral",
      apiMode: "conversations",
      requestedModel: "mistral-small-latest",
      phase: "finished",
      pendingQuestion: false,
      startedAt: 1,
      updatedAt: 2,
      attemptsSent: 11,
      records: Array.from({ length: 11 }, () => ({ ok: true, detail: "invented" })),
      finalMessage: "passed",
    }),
  ];
  for (const value of bad) {
    const map = new Map([
      [REPORT_KEY, value],
      ["bce-ai-visitor-id", "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"],
    ]);
    const f = fixture({ savedStorage: map });
    assert.equal(f.calls.length, 0);
    assert.match(f.nodes["save-status"].textContent, /not accepted as proof/);
    assert.equal(map.get("bce-ai-visitor-id"), "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    assert(!f.nodes.result.textContent.includes("10/10"));
  }
});
test("saved snippets are restored as plaintext and cannot create executable markup", async () => {
  const first = fixture({
    reply: () =>
      Response.json({
        answer: "<img onerror=alert(1)> Safe balloons.",
        provider: "mistral",
        model: "mistral-small-latest",
        apiMode: "conversations",
        modelVerification: "reported_alias",
        remaining: 40,
      }),
  });
  const pending = first.start();
  await first.flush();
  first.stop();
  await pending;
  const reopened = fixture({ savedStorage: first.storage });
  assert.match(reopened.nodes.log.textContent, /<img onerror/);
  assert.equal(reopened.nodes.log.innerHTML, undefined);
  assert.equal(reopened.calls.length, 0);
});
test("an older helper with no persisted report cannot have its past count invented", () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  assert(!f.nodes.result.textContent.includes("10/10"));
  assert.equal(f.storage.has(REPORT_KEY), false);
});

test("a stale page finishing after a new explicit run cannot overwrite the newer saved report", async () => {
  const old = fixture();
  const oldPending = old.start();
  await old.flush();
  const newer = fixture({ savedStorage: old.storage });
  const newPending = newer.start();
  await newer.flush();
  const newerId = JSON.parse(newer.storage.get(REPORT_KEY)).reportId;
  old.events.pagehide();
  await oldPending;
  assert.equal(JSON.parse(newer.storage.get(REPORT_KEY)).reportId, newerId);
  newer.stop();
  await newPending;
});
