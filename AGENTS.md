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
- Customer pages must use suitable owner-supplied photography, resolved through `src/lib/supplied-site-photos.ts` or the supplied gallery/occasion manifests. Never restore generated mockup photos, including via build/sync scripts. For missing equipment/style shots, use a neutral non-photo mark and request the specific original; never substitute an unrelated photo or assert supplied references are verified client work.
- Use one IntersectionObserver for early, one-time nested scroll reveals and CSS-only ambient/hover motion; reduced-motion users see all content without animation to keep the experience lightweight and accessible.
- Stack invisible, aria-hidden tagline sizing copies in the headline grid so its longest sentence reserves stable space at every width without browser measurement.
- Render middle-text showers as staggered CSS transform/opacity particles keyed to each text cycle, using full-height tracks so falling distance follows text height without measurement or layout shifts.
