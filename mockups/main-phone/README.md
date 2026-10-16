# Public phone view of the updated native website

Build from the repository root with `node scripts/build-main-phone.mjs`.

This packages the existing native React homepage and `/decor-collections` route into `drafts/main-website-phone.html`. It is a separate, public static view for phone review, not a production deployment. The source components, main website routes, service contacts, approved data and shader are not changed by this build.

All images, fonts, CSS and JavaScript are embedded, so an HTMLPreview/GitHub link needs no Arena login or sandbox uptime. A memory router preserves the entry button, collection page and back navigation without requiring a public server for deep routes. In-page anchors remain local even if the host injects a remote `<base>`.

The static view has no private database access. WhatsApp/call links work; consultation form submission explicitly reports that enquiries must be sent via WhatsApp/call. It must never display a fake received/success message. Private server code and secrets are excluded from the bundle; the builder rejects known server-only markers. Main production enquiry behavior is unchanged.

Build adapters also inline the category image glob (the bundler root differs), embed the main logo, and escape the telephone HTML pattern for modern Unicode-v browsers. These are phone-package-only transformations. If source resolvers change, guarded replacements fail rather than silently publishing missing images.

The output is about 10.4 MB, so allow a moment for its first load. Temporary bundles live in `.cache/main-phone`; do not commit those. Publish only the final HTML and the small reproducible build sources. Always pin a shared phone link to an immutable commit to avoid old branch caches.
