import { createFileRoute } from "@tanstack/react-router";
import { CreationGalleryPage } from "@/components/balloon/gallery/CreationGalleryPage";
export const Route = createFileRoute("/our-creations")({
  head: () => ({
    meta: [
      { title: "Our Creations — Celebration Gallery | Balloon Creation" },
      {
        name: "description",
        content:
          "Explore flower and balloon celebration photos, save your favourite looks and share a shortlist with Balloon Creation, Indore. Find a setting that feels like you.",
      },
    ],
  }),
  component: CreationGalleryPage,
});
