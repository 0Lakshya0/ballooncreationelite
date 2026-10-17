import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import "@/styles.css";
const router = createRouter({
  routeTree,
  context: { queryClient: new QueryClient() },
  history: createMemoryHistory({
    initialEntries: [
      window.location.hash === "#about"
        ? "/about"
        : window.location.hash === "#decor-collections"
          ? "/decor-collections"
          : "/",
    ],
  }),
  scrollRestoration: true,
});
router.subscribe("onResolved", () => {
  const { pathname, hash } = router.state.location;
  const fragment =
    pathname === "/about"
      ? "about"
      : pathname === "/decor-collections"
        ? "decor-collections"
        : hash;
  // Absolute same-origin URL: HTMLPreview's remote <base> would resolve a
  // relative history URL against raw.githubusercontent.com and reject it.
  const url = new URL(window.location.href);
  url.hash = fragment;
  window.history.replaceState(null, "", url.href);
});
window.addEventListener("phone:home", () => {
  void router.navigate({ to: "/" });
});
// htmlpreview sets a remote <base>; keep in-page actions local to this document.
document.addEventListener("click", (event) => {
  const anchor = (event.target as Element).closest?.("a");
  const href = anchor?.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (href === "#") window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  else
    document
      .getElementById(href.slice(1))
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
});
createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
