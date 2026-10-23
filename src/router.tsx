import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Opening a destination must not animate the old scroll position up to the top.
    scrollRestorationBehavior: "instant",
    defaultHashScrollIntoView: { behavior: "instant" },
    defaultPreloadStaleTime: 0,
  });

  return router;
};
