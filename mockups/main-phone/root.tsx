import { AIConciergeProvider } from "@/components/balloon/ai-concierge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: PhoneRoot,
});
function PhoneRoot() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AIConciergeProvider>
        <Outlet />
      </AIConciergeProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
