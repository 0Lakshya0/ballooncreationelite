import { createFileRoute } from "@tanstack/react-router";
import AboutUsPage from "@/components/balloon/about/AboutUsPage";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Balloon Creation, Indore" },
      {
        name: "description",
        content:
          "Meet Balloon Creation: sculptural balloon artistry, considered florals and celebrations staged with care across Indore. We decorate your happiness.",
      },
    ],
  }),
  component: AboutUsPage,
});
