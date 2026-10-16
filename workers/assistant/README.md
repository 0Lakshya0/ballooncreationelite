# Balloon Creation — external AI backend (setup in progress)

`worker.js` is a single ES-module Cloudflare Worker ready to paste into the dashboard editor. It contains no real API keys or frontend changes. The existing native website, search design/typewriter, local salesman logic and public phone snapshot are unchanged.

## Current deployment step

Paste **only the complete contents of `worker.js`** over the Hello World source and deploy. Preserve the existing production Secret `GEMINI_API_KEY`; never put its value into the code, repository, chat, screenshots or a `VITE_` variable.

If the dashboard says only the latest version can be edited, select the latest deployment/version before pasting. A padlock/read-only editor is not a successful code edit.

`GET /` and `GET /health` then return JSON with `service: "Balloon Creation AI"` and initially `status: "setup_required"`. That is expected, not an AI answer or proof that a provider key works. These status routes never contact an AI provider. If the page still says Hello World, the new code was not deployed.

## Deliberate activation gates — follow one user setup step at a time

The AI endpoint remains **disabled** until ALL of these are configured:

| Setting             | Kind                | Meaning                                                                                                                                                                                                                              |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AI_DB`             | D1 database binding | Persistent, server-side quotas and provider cooldowns. Bind an empty D1 database; schema is created automatically. No client-side quota counters or isolate-local quota maps.                                                        |
| `ALLOWED_ORIGINS`   | Text variable       | Comma-separated exact browser origins, no trailing slash/wildcard. For the current public phone host: `https://htmlpreview.github.io`. Add an actual Arena main-preview origin separately if needed; do not allow all sandbox hosts. |
| `ENABLED_PROVIDERS` | Text variable       | Explicit order-independent enable list, e.g. `gemini`. Start with Gemini ONLY after free-tier/model checks. Code priority is Gemini -> Groq -> OpenRouter.                                                                           |
| `GEMINI_API_KEY`    | Secret              | Already entered by the owner; its actual value has never been shared with the agent.                                                                                                                                                 |
| `GEMINI_MODEL`      | Text variable       | Exact currently available model whose free-tier access has been verified. No default is guessed or auto-selected.                                                                                                                    |

Optional adapters (not active merely because code exists):

- Groq: `GROQ_API_KEY` Secret, `GROQ_MODEL` text, and add `groq` to `ENABLED_PROVIDERS` only after verifying the account/model free access.
- OpenRouter: `OPENROUTER_API_KEY` Secret, `OPENROUTER_MODEL` text, and add `openrouter` after verifying free access. Only model IDs ending in `:free` or the `openrouter/free` router are accepted. An additional zero price ceiling is sent to OpenRouter. No paid model fallback.
- `RATE_LIMIT_SALT`: optional long random Secret. Otherwise the first configured provider key is used solely as the private salt for daily-rotating one-way visitor/IP hashes. A stable dedicated salt is preferable before changing provider order/keys.

**Free-only is an account/configuration condition, not something an API key proves.** The owner has shown Gemini projects labelled Free tier. Do not enable billing, prepaid credits, paid plans, Google Search grounding, paid plugins or unverified providers/models. Free-tier availability and limits can change. The code cannot automatically verify whether an operator later upgraded a provider account. Separate keys belonging to the same provider/project do not create new independent quotas; never use account/key rotation to evade provider limits.

## Limits and privacy

- 5 AI **attempts** per anonymous visitor per UTC day.
- 20 AI attempts per IP per UTC day, so changing visitor IDs does not remove the IP cap. Shared Wi-Fi users share this allowance.
- 100 AI attempts for the whole website per UTC day (conservative initial cap).
- 10-second interval per visitor OR IP.
- 2–500 character question, 4 KiB JSON body maximum, short 512-token replies, 8-second deadline per provider, at most one attempt to each of three providers per question.
- A request must reserve quota with an atomic conditional SQLite INSERT BEFORE contacting providers. Failed upstream attempts consume their reserved slot; a fully cooling-down provider pool is rejected without reserving a slot.
- HTTP 429/Retry-After and configuration/temporary failures store cooldowns in D1. Eligible providers are retried after cooldown; no permanently stalled rotation index. A model safety refusal is returned safely rather than bypassed via another provider.
- Provider quota resets are provider-controlled. Cooldowns use Retry-After when available; they are not a guarantee of actual upstream quota reset.
- No questions, answers, raw visitor IDs, raw IPs or secrets are stored or logged by this worker. D1 stores daily-rotating identity hashes, timestamps and provider availability times; request records older than two days are pruned on valid chat requests. Review/configure Cloudflare's own platform log retention separately.
- Anonymous identity/IP limits are not perfect human identification. CORS is a browser access restriction, **not authentication**. Attackers can forge Origin from non-browser clients and can exhaust a free site's global allowance. Limits cap upstream usage; add Turnstile/user authentication if abuse becomes a problem. No secret is embedded in the browser as a substitute for authentication.

## Endpoint contract

```text
POST /chat
Origin: an explicitly allowed browser origin
Content-Type: application/json

{"question":"Birthday decoration ideas?","visitorId":"a persistent crypto.randomUUID() value"}
```

Cloudflare supplies `CF-Connecting-IP`; missing identity fails closed. The browser must not attempt to supply that header. The frontend will need a persistent visitor ID and actual endpoint configuration in a later, separately tested integration step.

Success returns `{ answer, provider, remaining, sources: [], grounded: false }`. This implementation does **not** pretend to run live web search. Quota errors use HTTP 429/Retry-After. Setup/storage/provider failures use HTTP 503 and a WhatsApp-friendly fallback message. No raw provider errors or API key values are returned. Do not render answers as unsafe HTML.

## Validation

Requires Node 22.13+ for its built-in SQLite test adapter:

```sh
node --check workers/assistant/worker.js
node --test workers/assistant/worker.test.mjs
```

The tests use the worker's real SQLite SQL with in-memory `node:sqlite` and mocked provider HTTP responses, never real keys. They cover fail-closed setup, secret-safe status/errors, CORS, validation/body caps, visitor/IP/site/time quotas, conditional atomic reservations, reset, fallback order, Retry-After cooldown/recovery, free-only OpenRouter configuration, safety refusal handling and storage/network failures. They are not a live Cloudflare deployment, actual-provider availability, free-plan CPU benchmark or end-to-end real-answer verification.

The user controls Cloudflare deployment; the agent cannot claim the dashboard contains this code until the owner deploys and confirms it. Actual D1 binding, free model verification and real-provider answer tests remain pending. The public main website is still https://clck.ru/3WXBhx and is **not yet connected** to this backend.

An additional local workerd/Miniflare + D1 smoke test passed (compatibility date 2026-08-01): module startup/status, automatic schema creation, Gemini -> Groq fallback, persisted cooldown, server-side interval/quota and denied-origin handling, with intercepted/mock upstream HTTP only. This found and fixed an edge-runtime difference: upstream requests use `redirect: "manual"` (never forward provider credentials to a redirect target), rather than the unsupported Workers `redirect: "error"`. No actual Gemini/Groq/OpenRouter response or owner deployment was tested.

## Owner setup progress: initial Gemini connection check

The public Worker health route now reports `databaseBound: true`, `enabledProviders: ["gemini"]`, `allowedOriginsSet: true`, and `status: "configured"` (checked with a fresh health URL). This confirms configuration presence only, not API key validity or an actual provider answer. The owner was guided to `GEMINI_MODEL=gemini-3.1-flash-lite`, whose Standard free-tier input/output are listed free in Google's pricing documentation at this step. Other providers remain disabled.

Public one-question check: **https://clck.ru/3WXoZr** -> immutable source `865f93aba75b1d6ab8f5a5f12a59f6eb495ba2f5/drafts/ai-connection-check.html` via HTMLPreview. The short link was followed and the correct initial page content returned. It makes no automatic health/AI calls and has no key input. The owner must click Test AI once and share answer/error; a real answer is **not yet confirmed**. The page sends an absolute `/chat` URL, persistent anonymous UUID, no cookies/credentials and no API key. Successful answers are rendered as plain text; errors/quotas/timeouts are displayed honestly without automatic retries. Eight mocked browser-controller tests plus 20 worker/SQLite tests pass. Main website, typewriter/local search and phone link remain unchanged and not AI-connected.
