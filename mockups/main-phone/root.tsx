import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => {
    const { queryClient } = Route.useRouteContext();
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="top-center" />
      </QueryClientProvider>
    );
  },
});
