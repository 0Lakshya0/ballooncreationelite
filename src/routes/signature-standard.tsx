import { createFileRoute } from "@tanstack/react-router";
import { SignaturePage } from "@/components/balloon/guides/SignaturePage";
export const Route = createFileRoute("/signature-standard")({
  head: () => ({
    meta: [
      { title: "The Signature Standard — Balloon Creation" },
      {
        name: "description",
        content:
          "Discover our considered approach to personal designs, materials, clear quotes and practical event planning.",
      },
    ],
  }),
  component: SignaturePage,
});
