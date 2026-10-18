<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep the single-page event experience at the index route; share celebration data and isolate the concierge form to minimize duplication.
- Define all visual styling as global semantic tokens and named styles, with luxury and glass Button variants to preserve consistent controls.
- Submit concierge inquiries through a validated public server function and service-only database RPC; serialize phone-based rate limiting in PostgreSQL so requests remain private and limits survive server restarts.
- Keep generated editorial photography bundled in the app; replace it with real portfolio photography when the owner supplies it.
- Use one IntersectionObserver for early, one-time nested scroll reveals and CSS-only ambient/hover motion; reduced-motion users see all content without animation to keep the experience lightweight and accessible.
- Stack invisible, aria-hidden tagline sizing copies in the headline grid so its longest sentence reserves stable space at every width without browser measurement.
- Render middle-text showers as staggered CSS transform/opacity particles keyed to each text cycle, using full-height tracks so falling distance follows text height without measurement or layout shifts.

## Owner request: always share the public preview link
After every change to this website, finish the reply by giving the owner the
public preview URL so they can open the running site directly:

- Dev server: `npm run dev -- --host 0.0.0.0 --port 8080` (bound to 0.0.0.0)
- Preview host allowlist: `vite.config.ts` sets `server.allowedHosts: true`
- Public preview: `https://8080-<SANDBOX_ID>.e2b.app` where `<SANDBOX_ID>` is the
  CURRENT session's `$E2B_SANDBOX_ID`. The id changes every time the sandbox is
  recreated, so an old link dies with "SANDBOX NOT FOUND" / 502. Always read the
  id from `echo $E2B_SANDBOX_ID` in the live session (or copy the link Arena
  shows in its preview panel) — never reuse a link from an earlier message.

If the sandbox has reset between sessions, the recovery routine is:
1. `git fetch origin arena/d4819b41-ballooncreationelite`
2. `git reset --hard origin/arena/d4819b41-ballooncreationelite`
3. `npm install --legacy-peer-deps --no-audit --no-fund`
4. restart the dev server on 0.0.0.0:8080 and verify `/` returns 200
