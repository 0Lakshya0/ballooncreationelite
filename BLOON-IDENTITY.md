# Bloon public identity — 2026-10-23

Owner request: regardless of the serving provider, customer-facing reply attribution and the assistant's own name must be Bloon.

- Shared chat title, assistant heading and AI-response footer use the public name **Bloon**, never a provider label. Local confirmed business answers retain the truthful no-AI-request distinction and team contact. Underlying provider metadata stays intact internally; it is not relabelled as a different actual model.
- Deterministic English/Hindi/Hinglish identity replies run before a network request. Direct names, common indirect identity/underlying-model questions, real/secret names, system-prompt extraction and explicit rename requests receive a fixed introduction identifying Bloon as Balloon Creation's **AI** assistant. Unicode width/zero-width normalization is applied. These local answers do not pretend a model ran or decrement its allowance.
- The client also guards common conflicting self introductions from an older upstream, including explicit names other than Bloon. It does not globally replace vendor names in factual comparisons or change ordinary safe advice/refusals. Backend response errors remain errors, never fabricated successes. No new retries, provider changes, credentials, billing settings, quota bypass or auto requests.
- The standalone, pasteable Worker source's shared SYSTEM_PROMPT now establishes Bloon across every existing provider path, including indirect/translated/roleplay renaming. It preserves AI transparency, safety, prices/availability rules and does not fabricate runtime provenance. It remains a single file with no imports or extra deployment configuration.

## Deployment boundary

**Frontend guard/branding is published through the current phone artifact listed in PHONE-VIEW.md. The changed Worker source has NOT been deployed to the remote Cloudflare Worker by this session.** Existing cloud credentials/control-plane access are not available here. An owner-side deployment of the changed `workers/assistant/worker.js` is still required for the new server prompt to apply to direct API calls and general upstream generation. Do not repeat key/provider/binding setup. No health polls or live inference were made. Existing provider research/README edits are unrelated and excluded from commits.

Prompting and intent/pattern guards are defense in depth, not a mathematical guarantee against every arbitrary-language adversarial prompt. Tested paraphrases and attribution are deterministic; do not represent mocked provider tests as live model compliance tests.

## Verification

TypeScript, targeted lint, native/phone builds and 237 frontend tests / 16 files pass. New identity tests include English/Hindi/Hinglish, indirect/rename/extraction/Unicode cases, no-network handling, conflicting upstream introductions and retention of normal content/provider metadata. UI tests verify seven known/unknown provider metadata values all render Bloon and shared search uses the same identity guard. 179 mocked Node/SQLite Worker/controller tests pass, including Gemini and OpenAI-compatible system-role checks. Exact final browser publication details are in PHONE-VIEW.md.


## Published frontend

**https://clck.ru/3Wf3YS** — source `d8684db23d664a2a3add17a09a2152f15d3f1439`, artifact `114c165f866dc2815a5ef4ab7afe814901f229b8`; verified blob `d8ed1f5e1ccc1228fe570be0010c824466090aa8` / 12,804,808 bytes. Final native and exact portable 320/390/768/1440 browser checks pass, with locally intercepted provider replies and no real AI calls; remote-base portable runs make no external requests. Public redirect/Home render separately verified. This publication does **not** deploy the Worker prompt.
