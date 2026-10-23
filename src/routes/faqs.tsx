import { createFileRoute } from "@tanstack/react-router";
import { FaqPage } from "@/components/balloon/guides/FaqPage";
export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — Balloon Creation, Indore" },
      {
        name: "description",
        content:
          "Clear answers about celebration planning, decoration, venue access, quotes and booking with Balloon Creation in Indore.",
      },
    ],
  }),
  component: FaqPage,
});
