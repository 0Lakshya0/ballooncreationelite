# Balloon Creation — external AI backend

**Current (2026-10-18): Gemini, Groq and Cloudflare real completed answers are independently recorded; do not repeat Cloudflare setup or testing.** Pre-review read-only health reported revision `zai-free-flash-pool-1`, pinned Z.ai model `glm-4.7-flash`, concurrency 1 and a 60s lease. The enabled providers remain exactly `gemini,groq,cloudflare`. Z.ai is not yet counted as working. The owner supplied that deployed source for review. Reviewed release `zai-free-flash-pool-2` fixes error-envelope and uncertain-request lease handling. After the owner confirmed deploying it, fresh read-only health `zai-pool2-owner-done-confirm-20261018-v2` independently verified **pool-2 is deployed**, with the existing three enabled providers and unchanged limits. No further unchanged source deployment is needed. The owner confirms Secret `ZAI_API_KEY` is already present; do not recreate or request its value. Activation and a completed real Z.ai answer remain pending. Preserve all existing bindings, Secrets, origins, salt and enabled settings. Main website: https://clck.ru/3WYaYD. Older progress sections below are historical.

**Built with Llama.** The proposed Cloudflare fallback uses Meta Llama 3.2 via Cloudflare Workers AI. [Model and license](https://developers.cloudflare.com/workers-ai/models/llama-3.2-3b-instruct/).

`worker.js` is a single ES-module Cloudflare Worker ready to paste into the dashboard editor. It contains no real API keys or frontend changes. The existing native website, search design/typewriter, local salesman logic and public phone snapshot are unchanged.

## Current deployment step

For this changed-code update, paste **only the complete contents of `worker.js`** over the existing Worker source and deploy, when guided. The existing production source is already deployed; do not repeat an unchanged old deployment. Preserve the existing production Secret `GEMINI_API_KEY`; never put its value into the code, repository, chat, screenshots or a `VITE_` variable.

If the dashboard says only the latest version can be edited, select the latest deployment/version before pasting. A padlock/read-only editor is not a successful code edit.

`GET /` and `GET /health` then return JSON with `service: "Balloon Creation AI"` and initially `status: "setup_required"`. That is expected, not an AI answer or proof that a provider key works. These status routes never contact an AI provider. If the page still says Hello World, the new code was not deployed.

## Deliberate activation gates — follow one user setup step at a time

The AI endpoint remains **disabled** until ALL of these are configured:

| Setting             | Kind                | Meaning                                                                                                                                                                                                                              |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AI_DB`             | D1 database binding | Persistent, server-side quotas and provider cooldowns. Bind an empty D1 database; schema is created automatically. No client-side quota counters or isolate-local quota maps.                                                        |
| `ALLOWED_ORIGINS`   | Text variable       | Comma-separated exact browser origins, no trailing slash/wildcard. For the current public phone host: `https://htmlpreview.github.io`. Add an actual Arena main-preview origin separately if needed; do not allow all sandbox hosts. |
| `ENABLED_PROVIDERS` | Text variable       | Explicit order-independent enable list, e.g. `gemini`. Start with Gemini ONLY after free-tier/model checks. Code priority is Gemini -> Groq -> Cloudflare -> OpenRouter (enabled/configured providers only).                         |
| `GEMINI_API_KEY`    | Secret              | Already entered by the owner; its actual value has never been shared with the agent.                                                                                                                                                 |
| `GEMINI_MODEL`      | Text variable       | Exact currently available model whose free-tier access has been verified. No default is guessed or auto-selected.                                                                                                                    |

Optional adapters (not active merely because code exists):

- Groq: `GROQ_API_KEY` Secret, `GROQ_MODEL` text, and add `groq` to `ENABLED_PROVIDERS` only after verifying the account/model free access.
- OpenRouter: `OPENROUTER_API_KEY` Secret, `OPENROUTER_MODEL` text, and add `openrouter` after verifying free access. Only model IDs ending in `:free` or the `openrouter/free` router are accepted. An additional zero price ceiling is sent to OpenRouter. No paid model fallback.
- Workers AI: existing `AI` binding, add `cloudflare` to `ENABLED_PROVIDERS` only after the new code is verified. No API key or model variable: the model is pinned to `@cf/meta/llama-3.2-3b-instruct`.
- `RATE_LIMIT_SALT`: optional long random Secret. Otherwise use the first present secret in a stable Gemini/Groq/OpenRouter order, independent of provider selection/enablement. Existing live Gemini-salted usage is preserved. A Cloudflare-only installation with no other secrets requires a private `RATE_LIMIT_SALT`; missing salt fails closed. Do not rotate/remove secrets or introduce a new salt on the live account as part of this update; that changes historical identity hashes.

**Free-only is an account/configuration condition, not something an API key proves.** The owner has shown Gemini projects labelled Free tier. Do not enable billing, prepaid credits, paid plans, Google Search grounding, paid plugins or unverified providers/models. Free-tier availability and limits can change. The code cannot automatically verify whether an operator later upgraded a provider account. Separate keys belonging to the same provider/project do not create new independent quotas; never use account/key rotation to evade provider limits.

## Limits and privacy

- 50 AI **attempts** per anonymous visitor per UTC day.
- 200 AI attempts per IP per UTC day, so changing visitor IDs does not remove the IP cap. Shared Wi-Fi users share this allowance.
- 500 AI attempts for the whole website per UTC day (an application safety ceiling, NOT a claim about available Gemini free quota).
- 2-second interval per visitor OR IP.
- 2–1,500 character question, 12 KiB JSON body maximum (including full-length Hindi/Unicode), short 512-token replies, up to 20 seconds for a single eligible provider and a shared 32-second upstream budget, at most three actual provider attempts per question even if the configured pool grows. Untested candidates remain available for a subsequent request after failed providers enter cooldown; this is not a promise to query every provider in one question.
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

Cloudflare supplies `CF-Connecting-IP`; missing identity fails closed. The browser must not attempt to supply that header. The connected frontend already sends a persistent visitor ID and uses this endpoint.

Success returns `{ answer, provider, remaining, sources: [], grounded: false }`. This implementation does **not** pretend to run live web search. Quota errors use HTTP 429/Retry-After. Setup/storage/provider failures use HTTP 503 and a WhatsApp-friendly fallback message. No raw provider errors or API key values are returned. Do not render answers as unsafe HTML.

## Validation

Requires Node 22.13+ for its built-in SQLite test adapter:

```sh
node --check workers/assistant/worker.js
node --test workers/assistant/worker.test.mjs workers/assistant/zai.test.mjs workers/assistant/connection-check.test.mjs
```

The tests use the worker's real SQLite SQL with in-memory `node:sqlite` and mocked provider HTTP responses, never real keys. They cover fail-closed setup, secret-safe status/errors, CORS, validation/body caps, visitor/IP/site/time quotas, conditional atomic reservations, reset, fallback order, Retry-After cooldown/recovery, free-only OpenRouter configuration, safety refusal handling and storage/network failures. They are not a live Cloudflare deployment, actual-provider availability, free-plan CPU benchmark or end-to-end real-answer verification.

The user controls Cloudflare deployment; the agent cannot claim the dashboard contains this code until the owner deploys and confirms it. Actual D1 binding, free model verification and real-provider answer tests remain pending. The public main website is still https://clck.ru/3WXBhx and is **not yet connected** to this backend.

An additional local workerd/Miniflare + D1 smoke test passed (compatibility date 2026-08-01): module startup/status, automatic schema creation, Gemini -> Groq fallback, persisted cooldown, server-side interval/quota and denied-origin handling, with intercepted/mock upstream HTTP only. This found and fixed an edge-runtime difference: upstream requests use `redirect: "manual"` (never forward provider credentials to a redirect target), rather than the unsupported Workers `redirect: "error"`. No actual Gemini/Groq/OpenRouter response or owner deployment was tested.

## Owner setup progress: initial Gemini connection check

The public Worker health route now reports `databaseBound: true`, `enabledProviders: ["gemini"]`, `allowedOriginsSet: true`, and `status: "configured"` (checked with a fresh health URL). This confirms configuration presence only, not API key validity or an actual provider answer. The owner was guided to `GEMINI_MODEL=gemini-3.1-flash-lite`, whose Standard free-tier input/output are listed free in Google's pricing documentation at this step. Other providers remain disabled.

Public one-question check: **https://clck.ru/3WXoZr** -> immutable source `865f93aba75b1d6ab8f5a5f12a59f6eb495ba2f5/drafts/ai-connection-check.html` via HTMLPreview. The short link was followed and the correct initial page content returned. It makes no automatic health/AI calls and has no key input. The owner must click Test AI once and share answer/error; a real answer is **not yet confirmed**. The page sends an absolute `/chat` URL, persistent anonymous UUID, no cookies/credentials and no API key. Successful answers are rendered as plain text; errors/quotas/timeouts are displayed honestly without automatic retries. Eight mocked browser-controller tests plus 20 worker/SQLite tests pass. Main website, typewriter/local search and phone link remain unchanged and not AI-connected.

## Cooling-down error investigation (real answer still not confirmed)

The owner's manual test returned `HTTP 503 / providers_cooling_down` after a custom, valid question about trending balloon decorations. This means an earlier upstream attempt failed and the only enabled provider (Gemini) was placed on cooldown. It does **not** prove quota exhaustion or an invalid user question. The initial implementation discarded the safe upstream failure category; its old cooldown records cannot retrospectively reveal that cause.

Revision `safe-diagnostics-1` adds read-only health diagnostics and a separate `ai_provider_diagnostics` table that stores only allowlisted categories, numeric upstream HTTP status and timestamps. It never stores/returns raw upstream messages, keys, customer questions, raw IPs or visitor IDs. New failures distinguish invalid/restricted keys, disabled API, unsupported location, rate/quota limits, invalid model/request, server/network/timeout, bad JSON and empty/token-budget output. Existing legacy records explicitly say `not_recorded_by_previous_version`, not a guessed cause. Existing cooldowns, provider Retry-After and usage limits are preserved; no automatic quota reset/key rotation/probe/AI call has been added to health. Failed bodies preserve Retry-After even if not JSON. Browser CORS can read Retry-After. The test page renders safe diagnostics as text and never substitutes a fake success.

Current verification: 28 worker/SQLite tests + 9 mocked test-page controller tests (37 total) pass, including the owner's exact custom question, secret redaction, legacy read-only cooldown, persistent failure diagnostics, Retry-After and test-page visibility. Existing local workerd/Miniflare+D1 smoke also passes using intercepted provider HTTP. Actual upstream failure cause and a real answer remain unconfirmed until the owner deploys this update and we inspect its health/next eligible test. Main website and its public snapshot are unchanged. Do not ask the owner to repeatedly click Test AI, change API keys or delete cooldown records blindly.

## Timeout adjustment after the owner's second-question test

The owner reports that the first real answer arrived, but a subsequent question failed. The screenshot and a fresh live health check independently identify the latest failure as `provider_timeout`, not a user-question error or proven quota exhaustion. The original per-provider 8-second deadline was too aggressive for that observed request.

Revision `safe-diagnostics-2` grants a single eligible provider up to 20 seconds. Multiple eligible providers share a 24-second total upstream budget, with a maximum 20 seconds each, so slower-provider allowance does not multiply into unbounded fallback latency. Quick failures release time for the next provider. Untried providers are not incorrectly put into cooldown when the overall budget is spent. The separate test page allows 40 seconds to cover upstream work plus storage/network overhead. No automatic request retries, quota/cooldown clearing, key rotation, output-token increase or paid feature has been added. Response-body timeouts are now correctly labelled timeout rather than invalid JSON.

42 tests pass (33 worker/SQLite plus 9 page-controller tests), including deadline allocation, first-provider slow success, bounded fallback, quick-failure budget recovery, exhausted budget and response-body timeout classification. These are mocked timing/upstream tests, not proof that every live Gemini request will complete within 20 seconds. The owner still needs to deploy this revision; occasional upstream slowness remains possible. Main site and the old public main snapshot remain unchanged and not yet AI-connected.

## Owner-approved relaxed limits (pending deployment)

Revision `relaxed-limits-1` raises the anonymous visitor allowance to **50 attempts/day**, the shared-IP allowance to **200/day**, and the aggregate site safety ceiling to **500/day**. The minimum visitor/IP interval is now **2 seconds**, not 10. Questions can contain **1,500 characters**; the JSON-body bound rises to 12 KiB so valid full-length Hindi and escaped-Unicode input are not accidentally rejected. The test page uses the same 1,500-character validation. Existing D1 usage and provider cooldowns are retained, and the 20s single-provider / 24s shared upstream budget is included in the same Worker. Health now reports the active limits for deployment verification. Main website is not changed or connected by this update.

**Capacity is not guaranteed by these app settings.** Currently only Gemini is enabled. Google's official rate-limits documentation says RPM/TPM/RPD apply per project, vary by model/account, and the actual active values are shown in AI Studio: https://ai.google.dev/gemini-api/docs/rate-limits and https://aistudio.google.com/rate-limit?timeRange=last-28-days . We have not inspected the owner's active RPD/RPM/TPM values. Do not invent a Gemini questions-per-day estimate or present 500 app slots as 500 guaranteed free answers. One question can fail or consume provider allowance without yielding an answer; future multi-provider fallback can make an attempt against each independently configured provider. No paid billing, automatic retries or same-provider key pooling was introduced.

Validation: **46 tests pass** (36 real-SQLite worker tests and 10 mocked page-controller tests), including exact 50/200/500 boundaries, the 2-second interval, English/Hindi/escaped Unicode at the 1,500-character limit, reporting active limits, and retaining previous usage/cooldowns. No real Gemini requests were made for these tests.

## Latest live status and frontend connection

The owner completed the relaxed-limit deployment and enabled `gemini,groq`; Groq secret is stored only in Cloudflare and `GROQ_MODEL=openai/gpt-oss-20b`. Groq organization screenshots show 30 RPM / 1,000 RPD / 8,000 TPM / 200,000 TPD, with no custom project override; these are combined organization allowances, not guaranteed answers. No billing/card/paid upgrade was requested. The owner reports multiple successful Groq answers on updated standalone test **https://clck.ru/3WXrj6** (source ac4a95c). A fresh read-only live health check independently confirms Groq `lastResult:ok` / HTTP 200 and Gemini's previous server-error / HTTP 503; do not describe Gemini as permanently broken or infer quota exhaustion from 503.

The main frontend is now connected via a shared draggable-orb/search chat and published at **https://clck.ru/3WY8xZ**. Only explicit Send/custom-search Enter/Ask AI invokes the Worker. Keys remain server-side, and the existing visitor UUID is reused. The main public-page real answer awaits an owner interaction; browser/unit UI tests mocked provider responses and did not spend owner allowance. See `PHONE-VIEW.md` and `DECOR-INTEGRATION.md`. Native Arena preview origins are not allowlisted; use the HTMLPreview public main link for real AI, or separately approve exact preview origins.

## Workers AI expansion — ready code, deployment / real answer still pending

Revision **`workers-ai-pool-1`** supports the owner-added `AI` binding. Before this update, a fresh read-only production health check (`pre-workers-ai-adapter-20261017-v6`) still returned `relaxed-limits-1`, Gemini/Groq enabled, D1 readable, and their older real successful records. No new inference was performed. Adding the binding did not install this adapter or prove a Cloudflare answer.

### Verified model and free-plan safeguards

- Exact pinned model: `@cf/meta/llama-3.2-3b-instruct`. Its active [official model page](https://developers.cloudflare.com/workers-ai/models/llama-3.2-3b-instruct/) describes multilingual dialogue, the non-streaming `{response}` output, messages in the binding example, and `max_tokens`. Actual owner's account availability and Hindi/Hinglish quality still require one completed answer.
- Do **not** substitute the old `llama-3.1-8b-instruct-fp8-fast` or default `llama-3.1-8b-instruct`: their official model pages redirected to `models/?unavailable=...` during verification, despite stale pricing/example references. The currently listed `llama-3.1-8b-instruct-fp8` is a different model.
- [Official pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/) checked 2026-10-17: Workers **Free** has an ongoing 10,000 Neurons/day allocation, reset 00:00 UTC; requests beyond it fail unless the operator upgrades. No paid plan, card, gateway credits or gateway billing should be enabled. The code neither enrolls in billing nor verifies the account's plan; keep the account Free. Other apps on the account share the upstream allocation.
- Additional app-local guard: atomically reserve at most **8,000 Neurons/day** in D1 for this Cloudflare adapter. It uses the current 4,625 input / 30,475 output Neurons per million tokens, UTF-8 input byte count plus a 512-token template margin, and the full 512 output tokens. Reservation is deliberately conservative and never refunded on errors/timeouts; a timeout may still consume upstream compute. This estimate is not a billing guarantee or an account-wide usage meter, and must be reviewed if model/pricing/token handling changes. The upstream Free-plan hard stop remains essential.
- Daily reservations are atomic conditional upserts; exhausted budget skips inference and persists cooldown until the next UTC day. Budget storage failure fails closed. An exhausted local budget does not prevent other configured free backups.
- Binding calls use `returnRawResponse: true` and an `AbortSignal`; actual HTTP/Retry-After and bounded body parsing share the existing safe diagnostics. This third argument is verified in the [official workerd SDK source](https://github.com/cloudflare/workerd/blob/9022f4dc45485e2b2fc619171674ae7065b6213c/src/cloudflare/internal/ai-api.ts), not assumed from the short binding example. Abort requests cancellation; it cannot guarantee already-performed inference is uncharged.

### Bounded pool and isolated manual verification

The pool can grow without calling every provider per question: at most 3 real attempts, maximum 20 seconds each, sharing 32 seconds; the existing browser deadline is 40 seconds. Allocate across at most the remaining attempt slots, not the entire ever-growing pool. Preserve cooldowns, Retry-After, the daily application caps (50 visitor / 200 IP / 500 site attempts), 2-second interval, 1,500-character limit and honest WhatsApp fallback. Real completion within the browser deadline is not guaranteed under platform/storage/network slowness.

`POST /chat` additionally accepts optional `provider: "cloudflare" | "gemini" | "groq" | "openrouter"` for an explicit manual test. Selection must already be enabled/configured and obeys the same visitor/IP/site quotas, cooldowns, safety checks and Cloudflare reservation. It is a **public selector, not authenticated administration**, cannot enable providers or change settings, and makes no automatic calls. Normal website requests omit it and retain automatic fallback.

The updated `drafts/ai-connection-check.html` adds a provider selector. This allows a Cloudflare-only answer test **without disabling the working Gemini/Groq pool**. Its old immutable short link still points to the old page. New isolated-provider test page: **https://clck.ru/3WYVcN**, immutable source `b30444d96f7349fc5feda68b7cb29eddf88ee1a0/drafts/ai-connection-check.html` via HTMLPreview; short-link redirect and provider-selector page content verified. Opening it makes no inference call. Use it only after deployment and explicit provider enablement. No main frontend/design/phone artifact changes are required for response compatibility; the currently published main can display a Cloudflare response under its generic AI badge. Provider-specific branding on main can be updated with the next approved phone publication.

Owner workflow is **one UI step at a time**, not an instruction to perform all actions at once:

1. Open Edit code; then replace only the changed Worker source and deploy when guided. Preserve both bindings and all existing variables/secrets.
2. Read-only health must show `workers-ai-pool-1`, `setup.workersAiBound: true`, existing D1 and Gemini/Groq still enabled. Health makes no AI call and cannot prove inference eligibility.
3. Only then set `ENABLED_PROVIDERS=gemini,groq,cloudflare`. OpenRouter stays disabled after the previously observed timeout and fixed-model 429.
4. On the new test page choose Cloudflare Workers AI only, submit one owner-chosen English/Hindi/Hinglish question, and wait for the complete answer. Verify returned provider plus persisted `ok` diagnostic before counting Cloudflare as working. No automated production inference/probes were run here.

Validation: **63 backend/page tests pass** (51 Worker/SQLite + 12 page-controller), plus **57 existing frontend tests**, TypeScript and targeted changed-file ESLint/Prettier checks. A fresh local workerd/Miniflare + real D1 + the real built-in `cloudflare:ai` SDK smoke passed: SDK raw-response / signal / pinned-model contract, no-schema-mutating health, manual Cloudflare answer, persistent compute reservation, interval quota, denied origin and disabled-provider guard. All inference was mocked; this is not an owner deployment, production CPU benchmark or real Cloudflare answer. Full-repository lint is not clean: unrelated existing mockup/source formatting plus disposable research files are reported; no unrelated bulk formatting was applied.

The larger legitimate ongoing-₹0 provider pool is **still unfinished**. Working Gemini/Groq, disabled/unverified OpenRouter, and this not-yet-live Cloudflare adapter are not four verified working providers. Do not pad the count with models, shared keys, expiring trials or card-required services.

### Owner deployment verified (2026-10-17)

After the owner confirmed deployment, read-only production health `workers-ai-owner-deployed-20261017-v7` independently returned revision `workers-ai-pool-1`, `workersAiBound: true`, `databaseBound: true`, `rateLimitSaltConfigured: true`, and enabled providers exactly `gemini,groq`. New 32s shared / 20s individual / 3-attempt timing and unchanged 50/200/500 daily limits are live. This supersedes earlier deployment-pending statements. No AI inference was made; Cloudflare is still disabled. Next owner setting: preserve Gemini/Groq and change `ENABLED_PROVIDERS` to `gemini,groq,cloudflare`, then separately verify one completed Cloudflare-only answer on https://clck.ru/3WYVcN. Do not count binding/health presence as a working answer.

### Cloudflare enablement independently verified

The owner corrected that enablement was already completed. Fresh read-only health `owner-cloudflare-enabled-confirm-20261017-v8` confirms enabled providers `gemini,groq,cloudflare`, revision `workers-ai-pool-1`, both bindings and readable D1. Cloudflare has no recorded answer/failure yet (`observedAt: null`, HTTP status null, legacy/default diagnostic label); do not mistake this label for evidence of an earlier Cloudflare request. Do not ask the owner to repeat deployment or the enable setting. Next is one owner-controlled Cloudflare-only question on https://clck.ru/3WYVcN, preserving Gemini/Groq, then verify the completed answer/provider and diagnostic. No AI inference was made by the health check.

## Z.ai source handoff review — 2026-10-18

The supplied `zai-free-flash-pool-1` code was adopted, rather than overwriting production with the older Workers AI-only adapter. No production code/settings or inference was changed by this review. Read-only health `zai-preparation-20261018` independently records Gemini OK/200 at `2026-10-17T16:15:53.984Z`, Groq OK/200 at `15:54:00.320Z`, and Cloudflare OK/200 at `15:51:35.740Z`.

### Reviewed release `zai-free-flash-pool-2`

- Preserve the exact free model and Standard endpoint: `glm-4.7-flash`, `https://api.z.ai/api/paas/v4/chat/completions`. Worker variables cannot override either. No tools, paid-model substitution, extra automatic requests or higher token allowance.
- Fix: an HTTP-200 API-error envelope must not become an answer (even with a `choices` field), or turn insufficient balance into a short empty-answer cooldown. HTTP 402, including non-JSON responses, is also a zero-cost-access block. Explicit balance/resource/spend codes pause until the next UTC day and instruct against card/top-up/subscription/limit evasion. HTTP-200 auth, rate and model error codes retain their semantic cooldowns.
- Fix: timeout/disconnect does not prove upstream generation stopped. Keep the original bounded 60s lease after uncertain completion; do not release it immediately. This is a conservative local gate, not a promise about the provider's internal processing duration. Expired leases can be atomically replaced; old tokens cannot delete new owners. Completed responses release normally. Cleanup failure leaves the bounded lock intact without discarding a completed answer or preventing a separate eligible fallback.
- Busy contenders do not consume provider attempts or overwrite the last actual upstream diagnostic. All app caps, identities, cooldowns, CORS and 20s/32s/3-attempt budgets are preserved.
- Add explicit Z.ai selection to the manual connection-check page. Opening that page makes zero AI requests; selecting a provider does not alter the production pool. The old published test snapshot does not have this new option.

Validation: **89 tests pass** (existing worker regressions, dedicated Z.ai SQLite/mocked HTTP tests, and manual-page controller tests), plus `node --check`. These are not live Cloudflare/real-provider validation. No live AI request, Secret access, enablement or deployment was performed.

### Eligibility and remaining gates

Official pricing rechecked on 2026-10-18 lists GLM-4.7-Flash Free for input/cached input/storage/output: https://docs.z.ai/guides/overview/pricing.md . The active GLM-4.7 series documentation calls this exact model completely free: https://docs.z.ai/guides/llm/glm-4.7.md . This is **not** GLM-4.7-FlashX or GLM-5.3-Flash, which are paid. Standard API keys are separate from Coding Plan keys: https://docs.z.ai/guides/overview/quick-start.md . Additional API Terms §1(a) allow integration for end users, subject to the terms and developer obligations: [1](https://docs.z.ai/legal-agreement/terms-of-use#additional-terms-for-api-services).

The owner has a Standard API key named `balloon creation` and showed account concurrency **1** for GLM-4.7-Flash. Do not recreate it, ask for it in chat, or add a payment method/top-up. These observations do not yet prove zero-balance runtime access or a completed answer. Never count configuration or mocked success as real provider success. Pricing/access can change; there is no permanent/unlimited availability guarantee.

Deployment is complete: pool-2 was independently verified after owner confirmation; do not repeat it. Next, check whether Secret `ZAI_API_KEY` is already present before adding anything. If missing, the owner adds their existing full Standard API key directly as that Cloudflare Secret; no key value belongs in chat or code. Keep `ENABLED_PROVIDERS` unchanged at this step. Before production Z.ai activation, preserve/display its provider identity in the real frontend (the old client normalizes unknown provider IDs to `ai`), update the portable publication as needed, and publish the new manual test snapshot. Then enable `zai` without disabling existing providers and obtain one owner-authorized Z.ai-only completed answer. No automatic inference. The broader independent ongoing-₹0 provider pool remains unfinished even if this fourth provider succeeds.

### Frontend identity readiness — 2026-10-18

The real React API client now preserves `cloudflare` and `zai` IDs instead of normalizing them to generic `ai`. The existing answer caption truthfully displays `Cloudflare · Meta Llama 3.2` or `Z.ai · GLM-4.7-Flash` only when returned by the backend after explicit Send. Unknown IDs remain generic; no provider name is guessed from answer text. The same chat/search, styling, motion, local business answers and request behavior are retained. The portable builder also rejects `ZAI_API_KEY` identifiers from public output. **70 frontend tests / 8 files**, TypeScript, targeted ESLint and native production build pass; **89 mocked backend/page tests** pass. All AI responses in tests are mocks; no inference was called.

The owner confirmed the Z.ai Secret already exists. Do not add/replace it again. Publish the updated portable main and new Z.ai-capable test snapshot, then guide only `ENABLED_PROVIDERS=gemini,groq,cloudflare,zai`, preserving the other settings. Verify read-only health after that owner setting; ask for one explicit Z.ai-only answer test separately. Do not count Z.ai as working before a real completed response.
