import { createFileRoute } from "@tanstack/react-router";
import { CelebratePage } from "@/components/balloon/guides/CelebratePage";
import { isKnownOccasion } from "@/lib/occasion-choices";
export const Route = createFileRoute("/lets-celebrate")({
  validateSearch: (search: Record<string, unknown>): { occasion?: string } =>
    typeof search["occasion"] === "string" && isKnownOccasion(search["occasion"])
      ? { occasion: search["occasion"] }
      : {},
  head: () => ({
    meta: [
      { title: "Let’s Celebrate — Plan with Balloon Creation" },
      {
        name: "description",
        content:
          "Start a celebration enquiry at your own pace. Build an optional event brief, review a WhatsApp draft or request a consultation.",
      },
    ],
  }),
  component: CelebrationRoute,
});
function CelebrationRoute() {
  const { occasion } = Route.useSearch();
  return <CelebratePage initialOccasion={occasion ?? ""} />;
}
