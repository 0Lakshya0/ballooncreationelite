import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(
  new URL("../../drafts/ai-connection-check.html", import.meta.url),
  "utf8",
);
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
function fixture(
  reply = () => Response.json({ answer: "Three safe ideas.", provider: "gemini", remaining: 49 }),
) {
  const nodes = Object.fromEntries(
    ["test-form", "question", "provider", "test-button", "status", "details", "answer"].map(
      (id) => [
        id,
        {
          value: "",
          textContent: "",
          hidden: false,
          dataset: {},
          style: {},
          disabled: false,
          addEventListener(name, callback) {
            this[name] = callback;
          },
          setAttribute(name, value) {
            this[name] = value;
          },
        },
      ],
    ),
  );
  const storage = new Map(),
    calls = [];
  let timer;
  vm.runInNewContext(script, {
    document: { getElementById: (id) => nodes[id] },
    localStorage: {
      getItem: (key) => storage.get(key),
      setItem: (key, value) => storage.set(key, value),
    },
    crypto,
    AbortController,
    setTimeout: (callback) => {
      timer = callback;
      return 1;
    },
    clearTimeout: () => {},
    fetch: async (...args) => {
      calls.push(args);
      return reply(...args);
    },
  });
  nodes.question.value = "Birthday ideas?";
  return {
    nodes,
    calls,
    storage,
    timeout: () => timer(),
    submit: () => nodes["test-form"].submit({ preventDefault() {} }),
  };
}
test("test page makes zero AI requests automatically and contains no API-key form", () => {
  const f = fixture();
  assert.equal(f.calls.length, 0);
  assert(!html.includes("GEMINI_API_KEY"));
  assert(!html.includes("Authorization"));
});
test("successful manual test posts the exact contract with no credentials and reuses the visitor identity", async () => {
  const f = fixture();
  await f.submit();
  assert.equal(f.calls.length, 1);
  const [url, options] = f.calls[0];
  assert.equal(url, "https://ballooncreation-assistant.lakshyac909.workers.dev/chat");
  assert.equal(options.credentials, "omit");
  const body = JSON.parse(options.body);
  assert.equal(body.question, "Birthday ideas?");
  assert.match(body.visitorId, /^[a-f0-9-]{36}$/);
  assert.equal(f.nodes.answer.textContent, "Three safe ideas.");
  assert.equal(f.nodes.answer.hidden, false);
  assert.equal(f.nodes.status.dataset.kind, "success");
  await f.submit();
  assert.equal(JSON.parse(f.calls[1][1].body).visitorId, body.visitorId);
});
test("invalid input never reaches the backend", async () => {
  for (const value of ["", "a", "x".repeat(1501)]) {
    const f = fixture();
    f.nodes.question.value = value;
    await f.submit();
    assert.equal(f.calls.length, 0);
    assert.equal(f.nodes.status.dataset.kind, "error");
  }
});
test("quota and provider failures show actual backend error, not a fake answer or an automatic retry", async () => {
  for (const status of [429, 503]) {
    const f = fixture(() =>
      Response.json({ error: "providers_unavailable", message: "Try WhatsApp." }, { status }),
    );
    await f.submit();
    assert.equal(f.calls.length, 1);
    assert.match(f.nodes.status.textContent, new RegExp(`HTTP ${status}`));
    assert.equal(f.nodes.details.textContent, "Try WhatsApp.");
    assert.equal(f.nodes.answer.hidden, true);
    assert.equal(f.nodes["test-button"].disabled, false);
  }
});
test("HTTP 200 without an answer and malformed JSON are not reported as success", async () => {
  for (const reply of [
    () => Response.json({ status: "configured" }),
    () => new Response("not JSON"),
  ]) {
    const f = fixture(reply);
    await f.submit();
    assert.equal(f.nodes.status.dataset.kind, "error");
    assert.equal(f.nodes.answer.hidden, true);
    assert.equal(f.calls.length, 1);
  }
});
test("double submit is blocked and no provider output is inserted as executable HTML", async () => {
  let done;
  const f = fixture(
    () =>
      new Promise((resolve) => {
        done = resolve;
      }),
  );
  const pending = f.submit();
  await f.submit();
  assert.equal(f.calls.length, 1);
  done(Response.json({ answer: "<img onerror=alert(1)>", provider: "gemini", remaining: 49 }));
  await pending;
  assert.equal(f.nodes.answer.textContent, "<img onerror=alert(1)>");
  assert.equal(f.nodes.answer.innerHTML, undefined);
});
test("timeouts report uncertainty without retrying or claiming success", async () => {
  const f = fixture(
    (url, options) =>
      new Promise((resolve, reject) => {
        options.signal.addEventListener("abort", () =>
          reject(Object.assign(new Error("timeout"), { name: "AbortError" })),
        );
      }),
  );
  const pending = f.submit();
  f.timeout();
  await pending;
  assert.equal(f.calls.length, 1);
  assert.match(f.nodes.status.textContent, /attempt count ho sakta hai/);
  assert.equal(f.nodes.answer.hidden, true);
  assert.equal(f.nodes["test-button"].disabled, false);
});
test("network failure shows the actual error and releases the button", async () => {
  const f = fixture(() => {
    throw new Error("Failed to fetch");
  });
  await f.submit();
  assert.equal(f.nodes.details.textContent, "Failed to fetch");
  assert.equal(f.nodes.answer.hidden, true);
  assert.equal(f.nodes["test-button"].disabled, false);
});
test("safe upstream diagnostics are visible as plain text on the test page", async () => {
  const f = fixture(() =>
    Response.json(
      {
        error: "providers_unavailable",
        message: "Provider failed.",
        diagnostics: {
          providers: [
            {
              provider: "gemini",
              lastResult: "api_key_invalid",
              upstreamHttpStatus: 400,
              retryAfterSeconds: 3600,
            },
          ],
        },
      },
      { status: 503 },
    ),
  );
  await f.submit();
  assert.match(f.nodes.details.textContent, /gemini: api_key_invalid/);
  assert.match(f.nodes.details.textContent, /upstream HTTP 400/);
  assert.equal(f.nodes.answer.hidden, true);
});

test("test page permits full-length 1500-character Hindi input and declares the same HTML limit", async () => {
  assert.match(html, /maxlength="1500"/);
  const f = fixture();
  f.nodes.question.value = "क".repeat(1500);
  await f.submit();
  assert.equal(f.calls.length, 1);
  assert.equal(JSON.parse(f.calls[0][1].body).question.length, 1500);
  assert.equal(f.nodes.status.dataset.kind, "success");
});

test("a selected provider is sent only by explicit manual submission, never by opening the page", async () => {
  const f = fixture(() =>
    Response.json({ answer: "Ivory and gold.", provider: "cloudflare", remaining: 49 }),
  );
  f.nodes.provider.value = "cloudflare";
  assert.equal(f.calls.length, 0);
  await f.submit();
  assert.equal(JSON.parse(f.calls[0][1].body).provider, "cloudflare");
  assert.match(f.nodes.details.textContent, /cloudflare/i);
});
test("automatic test keeps the original public request contract", async () => {
  const f = fixture();
  f.nodes.provider.value = "auto";
  await f.submit();
  assert.deepEqual(Object.keys(JSON.parse(f.calls[0][1].body)).sort(), ["question", "visitorId"]);
});

test("Z.ai-only test is explicit, keeps visitor identity and never changes active providers", async () => {
  assert.match(html, /<option value="zai">Z.ai GLM-4.7-Flash only<\/option>/);
  const f = fixture(() =>
    Response.json({ answer: "Gold balloons.", provider: "zai", remaining: 49 }),
  );
  f.nodes.provider.value = "zai";
  assert.equal(f.calls.length, 0);
  await f.submit();
  const body = JSON.parse(f.calls[0][1].body);
  assert.equal(body.provider, "zai");
  assert.equal(typeof body.visitorId, "string");
  assert.equal(f.nodes.status.dataset.kind, "success");
  assert.match(f.nodes.details.textContent, /zai/i);
});

test("Mistral evaluation selector sends only an explicit Mistral request, never automatic fallback", async () => {
  assert.match(html, /<option value="mistral">Mistral Small Conversations only/);
  const f = fixture(() =>
    Response.json({ answer: "Safe ivory palette.", provider: "mistral", remaining: 49 }),
  );
  f.nodes.provider.value = "mistral";
  assert.equal(f.calls.length, 0);
  await f.submit();
  assert.equal(JSON.parse(f.calls[0][1].body).provider, "mistral");
  assert.equal(f.nodes.status.dataset.kind, "success");
  assert.match(f.nodes.details.textContent, /mistral/i);
});
