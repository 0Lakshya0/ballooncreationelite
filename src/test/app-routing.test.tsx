import { occasionEntries } from "@/lib/occasion-entries";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it.each([
    ...occasionEntries.map((item) => `/creations/${item.slug}`),
    "/",
    "/decor-collections",
    "/about",
    "/faqs",
    "/signature-standard",
    "/lets-celebrate",
    "/creations/mega-birthdays",
    "/creations/grand-weddings-rings",
    "/creations/anniversaries-surprises",
    "/creations/baby-showers",
    "/creations/devotional-celebrations",
  ])("matches a page for %s instead of falling back to not found", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes(path);

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
