# Ongoing-₹0 AI providers: research and next-step recommendation

**Checked: 18 October 2026. Scope: Balloon Creation's current Cloudflare-backed, customer-facing website in India.**

## Latest observed outcome — 19 October 2026

The corrected Conversations API path now has a real Worker **OK/200** diagnostic (`2026-10-19T14:09:07.379Z`); the owner personally saw at least three benchmark answers. The full ten-request result is **unknown**, because the older helper's in-memory report was lost on navigation/reopen. Do not presume 10/10 or call it production-qualified. Future helper progress is now saved/restored locally without auto network/resume; it cannot recover the old count. Normal customer pool remains Gemini/Groq/Cloudflare and Mistral remains evaluation-only. No new real test was requested or performed for the report fix. Earlier research-stage statements below are historical.

## Latest evaluation finding — 19 October 2026

The deployed Chat Completions Small snapshot evaluation failed at its first upstream request (429). The owner's official Studio returned a reply and exports **`/v1/conversations` with `mistral-small-latest`**, a different endpoint/model-alias context. A revised manual-only Conversations adapter is prepared with stateless storage, no tools and all existing quotas/ledger/cooldown preserved; **166 mocked tests pass**, but the revised public API path is not deployed/real-tested yet. The alias is not a frozen snapshot; response metadata must distinguish reported snapshot/alias from requested-only identity. This difference is not proof of the failure's cause, actual capacity or production entitlement. Conversations remains a preview API and customer activation is not approved. See the current Worker README before any action.

## Account-specific update — 19 October 2026

The owner's Mistral screenshots now confirm **Free plan**, **$10/month API/Studio allowance ($0 used)** and **PAYG currently off**, plus `mistral-small-2603` at **20k TPM / 1 RPS**. The separate Vibe Code allowance is not additional API credit. This clears the previously unknown numerical account-budget gate for evaluation; it does not establish real availability, sufficient daily throughput, or resolve the no-card commercial-terms ambiguity. The owner now confirms privately creating the key. A bounded manual-only evaluation adapter and tests are prepared; no real inference or production activation has occurred. Earlier findings below describe the pre-account research stage.

## Seedha nateeja

**Fastest sensible next evaluation: Mistral AI Free mode, with Mistral Small 4 as the model to investigate. This is a candidate recommendation, NOT production approval or a reliability claim.** First inspect the actual free account's per-model rate/monthly allowance and resolve the commercial no-card terms ambiguity described below. Do not create a key, change Cloudflare, or activate another provider before that gate.

**Most clearly documented additional direct-provider allowance found: Aion Labs — 15 RPM and 20,000 tokens/day, no card, commercial use allowed.** However, this is a small allowance, its models specialize in roleplay/storytelling, and general/Hinglish quality, safety and actual availability remain untested. It is a possible small secondary provider, not the main answer to higher-volume dependable service.

**Netlify AI Gateway has an attractive recurring Free budget, but is NOT an approved standalone external bridge for the present architecture.** The full terms review changed its ranking: Netlify's Self-Serve Subscription Agreement §2.7 requires Functions to be primarily called by a Netlify-hosted website. Do not deploy a dummy Netlify site, export managed credentials, or assume a Cloudflare-only proxy is permitted. A genuine Netlify-hosted application/component or explicit written permission would be a separate architectural decision requiring owner approval.

No newly researched provider has been deployed or called for real. No failure probability can honestly be attached to any new candidate. The larger provider-pool task remains unfinished.

## Requirements applied

- No card, recharge, paid plan, expiring trial dependency, referral farming, extra accounts/keys to bypass quotas, or hidden paid fallback.
- Recurring daily/monthly included allowances can qualify; a model's normal paid price is not itself proof the customer must pay if a genuinely free plan covers it. Conversely, a free account or free API-key creation is not proof inference is free.
- Customer-facing commercial use must be permitted by the API/service terms. An Apache/MIT model-weight license does not override hosted API restrictions.
- Need meaningful, documented capacity before promising usability, then actual controlled real-answer qualification with the owner's consent.
- Preserve Gemini, Groq, Cloudflare, the approved frontend and all existing account settings. Z.ai and OpenRouter remain disabled; do not repeat their setup/tests.

## Ranked comparison

| Option                                | Verified positive evidence                                                                                                                                                                         | Remaining problem                                                                                                                                                                                                                                                                                  | Recommendation                                                                                                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Mistral Free mode**                 | Official quickstart: API enabled by default, no card. Subscription docs: included monthly usage; with PAYG disabled, access can stop rather than spend prepaid funds.                              | Exact free-model throughput/monthly quota is account-visible, not established here. Official support describes the lowest Free limits as evaluation/prototyping. Commercial Additional Terms §2 mention a valid payment method, creating an unresolved no-card commercial-use documentation issue. | **Next account/terms qualification candidate**, not yet a production-approved provider. Inspect limits before any API key/code/deploy. |
| **Aion Labs Free**                    | Default Free tier; 15 requests/minute, 20k tokens/minute and **20k tokens/day**. Pricing explicitly says daily allowance and no card. Terms §4 explicitly allow commercial apps serving end users. | Small daily allowance; models are roleplay/storytelling-oriented and some are multi-model/reasoning systems. Real performance, Hindi/Hinglish quality, safety and output-token accounting have not been tested.                                                                                    | Eligible to evaluate as a **small secondary direct provider**, not a high-volume/reliable primary.                                     |
| **Netlify AI Gateway + GPT-4.1-nano** | Free credit-based plan: 300 credits every month, hard limit, no auto recharge. AI Gateway available on Free; GPT-4.1-nano listed. Commercial Free hosting is explicitly supported.                 | **Architecture restriction:** Functions must primarily serve a Netlify-hosted website. Also shared monthly credit pool, production-deploy/compute/bandwidth charges, hard pause at exhaustion. Owner account activation/performance not verified.                                                  | **Conditional hosting-dependent alternative**, NOT a drop-in Cloudflare-only provider. No migration/account/bridge without approval.   |
| **Ollama Cloud Free**                 | Official pricing says Free included usage resets monthly, and Free allows one concurrent request with bounded queuing. API calls from apps are documented.                                         | Included free amount/starter-model access and useful account capacity are not established. A one-concurrent-request figure is not a daily allowance.                                                                                                                                               | Hold until account allowance and models are verified; no reliability claim.                                                            |
| **OVHcloud anonymous AI Endpoints**   | Official docs: anonymous access at 2 RPM per IP/model; 400 RPM is the authenticated tier.                                                                                                          | Anonymous shared-IP rate is small, production/ongoing-free entitlement needs clarification; paid authenticated limits are not free allowance.                                                                                                                                                      | Not a primary low-failure recommendation for this website. No IP/key rotation.                                                         |

## 1. Mistral: best next direct-provider evaluation, with explicit gates

Sources:

- https://docs.mistral.ai/getting-started/quickstarts/studio/activate-and-generate-api-key
- https://docs.mistral.ai/admin/billing-usage/subscriptions
- https://docs.mistral.ai/admin/billing-usage/usage-limits
- https://help.mistral.ai/en/articles/698531-why-am-i-hitting-api-rate-limits-and-how-do-i-increase-them
- https://legal.mistral.ai/terms/commercial-terms-of-service/
- https://legal.mistral.ai/terms/additional-terms/
- https://docs.mistral.ai/inference/pricing

What the sources establish:

1. Free mode API access is enabled by default without a credit card.
2. Included monthly usage is shared across Studio, the API and Vibe Code. It is not an unlimited API entitlement.
3. Without PAYG, usage can stop when the included allowance is exhausted. **Never enable PAYG, buy credits or upgrade.**
4. Per-model throughput is shown in the account's Limits page: https://admin.mistral.ai/plateforme/limits . Public documentation does not give us this owner's actual numbers.
5. Official support calls Free mode the lowest limits for evaluation/prototyping. We must not call this production-grade guaranteed capacity.
6. Commercial Additional Terms §2 say customer accounts require accurate billing information and a valid payment method. That needs clarification for a permanently no-card customer-facing deployment. The free API can be evaluated without asserting production approval.

**Do not repeat unofficial “1 billion tokens/month” or “$10/month free API credits” as confirmed account facts.** The current public pricing page fetched here does not substantiate those specific Free API quantities.

**Next action, if proceeding:** use an existing account if available; otherwise register in Free mode, without entering payment details. Inspect the actual model/rate/monthly limits before any key, adapter, real request or deployment. If a card is required or limits are trivial, stop; don't spend time on a full integration. Clarify the no-card production terms before customer activation.

Mistral Small 4 is an evaluation target because the official pricing page positions Small as a cost-sensitive option; its normal hosted token price is not zero. Free-plan eligibility/access and bounded non-thinking output must be checked rather than treating the model as a standalone permanently-free SKU.

## 2. Aion Labs: real documented free allowance, but modest and specialized

Sources:

- https://www.aionlabs.ai/pricing/
- https://www.aionlabs.ai/docs/rate-limits/
- https://www.aionlabs.ai/docs/models/
- https://www.aionlabs.ai/terms/ (version effective 17 October 2026)

The official Free tier is default on signup: **15 RPM, 20,000 TPM and 20,000 tokens/day**. Pricing explicitly describes a no-card daily allowance. Terms §4 explicitly allow lawful commercial use, products built on the API and serving end users. Do not resell raw API access or keys. Free use can be changed or withdrawn; there is no uninterrupted-service promise.

The current model list describes Aion 2.0 and later models as roleplay/storytelling-oriented. Many are reasoning/multi-model systems; the Llama 3.1 8B roleplay variant is non-reasoning in the listed metadata. **No model has yet been selected or tested for our assistant.** Never assume hidden reasoning is free or that disabling thinking is supported without checking its API.

Budget arithmetic, **not measured answer capacity**:

- 20,000 daily tokens / 700 total tokens per useful question ≈ 28 questions/day.
- 20,000 / 1,000 ≈ 20/day.
- 20,000 / 1,500 ≈ 13/day.

Thus **roughly 15–30 short answers/day** is only a planning range if input/output/reasoning accounting fits those assumptions. It can be lower. This is not enough to recommend it as the main high-volume service, but it is materially different from a one-time 1–2-question trial.

## 3. Netlify: promising allowance, final legal check blocks the simple bridge plan

Sources:

- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- https://docs.netlify.com/build/ai-gateway/overview/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/pricing-for-ai-features/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/
- https://www.netlify.com/pricing/
- https://www.netlify.com/guides/netlify-vs-vercel/
- https://www.netlify.com/blog/introducing-netlify-free-plan/
- https://www.netlify.com/pdf/self-serve-subscription-agreement.pdf — **§2.7**, §3.2 and §5.1

### What is attractive

- Free credit-based plan: **$0/month, 300 credits/month**, reset each billing cycle, hard limit and no auto recharge.
- Free commercial hosting is explicitly supported. The official Free plan introduction says no card is required; actual owner account eligibility is still untested. If a card/payment is requested, stop.
- Gateway is available on the Free credit-based plan. It supports direct OpenAI models, including `gpt-4.1-nano`, not necessarily an OpenRouter free route.
- Normal model rates are charged against the included credits. **GPT-4.1-nano is not itself a free API.** ₹0 cash use depends on staying on the genuine Free plan, within the allowance, without paid add-ons or upgrades.
- Gateway Free limit is **90 credits/minute**, NOT 90 requests/minute or a guaranteed completion rate.
- These are one shared Netlify credit pool, not separate free pools for every model/vendor.

### The architectural blocker discovered in the full terms

Self-Serve Subscription Agreement §2.7 says Netlify Functions are strictly for sites deployed on Netlify and must be called primarily by a Netlify-hosted website. Our proposed standalone function called by the existing Cloudflare/HTMLPreview application must **not** be assumed compliant.

Do not create a dummy site, copy Netlify-managed credentials outside their supported context, or use a technical workaround to evade this condition. A genuine Netlify-hosted application/component, moving a frontend, or written permission is a separate decision. **No hosting change is approved by this research.** No Netlify account or project has been requested/created.

### Credit-budget calculation — conditional, not a recommendation to migrate

Published rates for GPT-4.1-nano: **$0.10/M input, $0.40/M output**. Netlify conversion: **180 credits per $1 inference**. Other meters: **15 credits/production deploy**, **10 credits/GB-hour compute**, **2 credits/10k requests**, **20 credits/GB bandwidth**.

Assume 250 of the 300 monthly credits remain for AI/compute/requests, with 50 reserved for deployment/other usage; assume a 1 GB function and no cache discount:

| Per answer assumption                        | AI credits | Compute credits | Request credits | Approx. answers from 250 credits |
| -------------------------------------------- | ---------: | --------------: | --------------: | -------------------------------: |
| 1,000 input + 512 output tokens, 5s runtime  |   0.054864 |        0.013889 |          0.0002 |                            3,625 |
| 2,000 input + 512 output tokens, 10s runtime |   0.072864 |        0.027778 |          0.0002 |                            2,479 |
| 4,500 input + 512 output tokens, 20s runtime |   0.117864 |        0.055556 |          0.0002 |                            1,439 |

These are budget calculations only, excluding variable bandwidth and any other team/project use. They do not prove throughput, successful answers, provider availability or actual free-account access. More deployments, longer answers, idle/runtime overhead, other Netlify projects or large images reduce capacity. Unlimited Agent Runner use must not be assumed free.

The current portable website is about 10.99 MB uncompressed. As an illustrative upper-bound transfer calculation, 50 fresh full downloads/day × 30 days ≈ 16.5 GB and ≈330 bandwidth credits, before AI. Compression, caching and asset splitting affect real wire usage, but a blind whole-site move could spend the allowance on the site itself. Don't promise “thousands of free answers” without evaluating the actual hosting footprint.

Exhausting Free credits pauses all projects on the team until reset; an architecture that makes the main website depend on this pool can therefore reduce reliability. Merely giving each model a different label does not create independent quotas.

## Options not recommended under the current constraints

| Option                             | Reason / evidence                                                                                                                                                                              |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Z.ai                               | Already failed this owner's capacity qualification: first paced request got 429. Disabled and not to be retested.                                                                              |
| OpenRouter Free                    | Existing owner key, previous timeout/429 failures; disabled. Do not ask for a new key or paid top-up.                                                                                          |
| NVIDIA API Catalog trial           | Trial Terms §1.2/§1.4 prohibit production without a separate subscription. Model-weight licenses do not override API trial terms.                                                              |
| Vercel AI Gateway                  | Current official getting-started requires a valid payment method for free credits; Hobby also has non-commercial restrictions. $5/month doesn't satisfy no-card eligibility.                   |
| Modal                              | $30 recurring compute credits are real, but official billing/intro requires a payment method, including GPU access.                                                                            |
| GitHub Models                      | Current canonical documentation says fully retired 30 July 2026. Older free-limit pages are stale. Copilot is not a replacement website inference API.                                         |
| SiliconFlow international Qwen3-8B | Current official model page lists $0.06/M input and output, not zero. Starter credit/old Chinese-site free-model lists do not prove ongoing free access for this user.                         |
| Novita                             | Official sources conflict, and live catalog/examples explicitly label some zero-price models **TIME LIMITED FREE**. Do not count a launch promo or referral credits as ongoing free allowance. |
| inference.sh                       | Official Starter pricing has $0 included credits/month; free access to the platform is not free model compute. Promotional credits expire.                                                     |
| Arli AI                            | Official text-generation docs say free accounts get **5 requests per model every 2 days for testing**. Not a useful sustained provider for this requirement.                                   |
| Pollinations                       | Free/Quest Pollen terms don't guarantee fixed future grants/amounts/timing. Not qualified as predictable business capacity.                                                                    |
| Cohere                             | Free trial API usage is non-commercial/evaluation, not this public business website.                                                                                                           |
| HF / SambaNova / Cerebras          | Earlier official billing checks already failed the ongoing-no-card/no-payment requirements; don't repeat outdated roundup claims.                                                              |
| Eden AI                            | No newly verified ongoing-free production allowance here. Free sandbox testing or BYOK is not an extra independent funded model quota.                                                         |

Additional official references:

- https://vercel.com/docs/ai-gateway/getting-started
- https://modal.com/docs/guide/billing
- https://docs.github.com/en/github-models
- https://www.siliconflow.com/models/qwen3-8b
- https://novita.ai/models
- https://blogs.novita.ai/ling-3-0-flash-on-novita-ai/
- https://inference.sh/pricing
- https://inference.sh/terms
- https://www.arliai.com/docs/textgen
- https://enter.pollinations.ai/terms
- https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf
- https://docs.ollama.com/cloud
- https://ollama.com/pricing
- https://help.ovhcloud.com/csm/en-public-cloud-ai-endpoints-getting-started?id=kb_article_view&sysparm_article=KB0065403

## Next action and honest acceptance rule

1. **Do not change the working three-provider pool.** No new source deploy, key replacement, signup spree or paid upgrade.
2. The next low-effort direct-provider gate is Mistral's actual Free account limits/eligibility. This is evaluation, not approval to serve customers. If monthly capacity or no-card commercial eligibility is unsuitable/unresolved, don't integrate it.
3. Aion is a smaller alternative only if its 20k-token/day budget is worthwhile; don't advertise it as the main high-volume solution.
4. Netlify needs a compliant hosting/architecture decision before integration; don't proceed with the initially proposed Cloudflare-only bridge.
5. Only after eligibility/capacity gates: implement disabled-by-default adapter, mocked safety/quota/privacy tests, then one explicit owner-controlled paced real test. Stop on failure; no quota reset, key rotation or paid fallback. A 10-answer sample does not prove a whole day's performance.

**Current app caps are 50 AI attempts per visitor/day, 200 per IP/day, 500 total site attempts/day, 1,500-character questions.** These are request/attempt limits, not a 50-visitor traffic limit and not promised completed answers. New-provider actual capacity remains unverified. No new real AI inference, deployment, account or billing action was performed for this report.
