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
- Reserve rotating headline height with an aria-hidden CSS grid of all taglines and allow the hero to grow naturally; this prevents clipping and layout shifts without resize listeners.
