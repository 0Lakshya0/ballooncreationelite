import { act } from "react";
import { cleanup, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { afterEach, expect, it, vi } from "vitest";
import { CreationGalleryPage, GalleryMediaView } from "./CreationGalleryPage";
import {
  galleryMedia,
  galleryMessage,
  readGalleryShortlist,
  SHORTLIST_KEY,
  type GalleryMedia,
} from "@/lib/creation-gallery";
import { galleryCollections, collectionViewerItems } from "@/lib/gallery-collections";
import { occasionPages } from "@/lib/occasion-catalogue";
import { suppliedOccasionPhotos } from "@/lib/supplied-occasion-photos";
vi.mock("../decor/liquid-renderer", () => ({ mountLiquidSurfaces: vi.fn(() => vi.fn()) }));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
async function mount() {
  const root = createRootRoute({ component: Outlet });
  const route = createRoute({
    getParentRoute: () => root,
    path: "/our-creations",
    component: CreationGalleryPage,
  });
  const router = createRouter({
    routeTree: root.addChildren([route]),
    history: createMemoryHistory({ initialEntries: ["/our-creations"] }),
  });
  await act(async () => {
    await router.load();
    render(<RouterProvider router={router} />);
  });
  return router;
}
it("curates38 unique supplied photos with stable references and replaces all19 occasion covers without inventing history", () => {
  expect(galleryMedia).toHaveLength(38);
  expect(new Set(galleryMedia.map((item) => item.id)).size).toBe(38);
  expect(new Set(galleryMedia.map((item) => item.reference)).size).toBe(38);
  for (const item of galleryMedia) {
    expect(item.image).toMatch(/\/(homepage-real|gallery-real|gallery-birthday-batch-[12])\//);
    expect(item.kind).toBe("image");
    expect(item.width).toBeGreaterThan(0);
    expect(item.height).toBeGreaterThan(0);
    expect(item.reference).toMatch(/^BC-\d\d$/);
  }
  for (const item of occasionPages) {
    expect(item.heroImage).toBe(suppliedOccasionPhotos[item.slug].image);
    expect(item.heroImage).not.toContain("/categories/");
  }
  expect(galleryMedia.find((item) => item.id === "wedding")?.reference).toBe("BC-01");
});
it("opens a real page, progressively shows photos, and filters without making network requests", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await mount();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Beautiful moments.");
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(20);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(29);
  const kids = within(
    document.querySelector('[data-gallery-style="kids-birthday"]') as HTMLElement,
  );
  expect(kids.getAllByRole("article")).toHaveLength(6);
  fireEvent.click(kids.getByRole("button", { name: "Explore more Kids Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(35);
  expect(document.querySelectorAll('[data-gallery-style="birthday"] .gc-card')).toHaveLength(4);
  fireEvent.click(screen.getByRole("button", { name: "Explore more Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(38);
  fireEvent.click(screen.getByRole("button", { name: /^Birthdays/ }));
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(2);
  expect(screen.getByRole("heading", { name: "Birthday" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Kids Birthday" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("19");
  expect(screen.queryByRole("group", { name: "Media format" })).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});
it("saves locally, creates a meaningful WhatsApp shortlist and resets a saved-only empty state", async () => {
  localStorage.setItem(SHORTLIST_KEY, JSON.stringify(["not-real", "wedding", "wedding"]));
  await mount();
  fireEvent.click(screen.getByRole("button", { name: /^Save A milestone/ }));
  await waitFor(() =>
    expect(JSON.parse(localStorage.getItem(SHORTLIST_KEY)!)).toEqual(["wedding", "birthday-50th"]),
  );
  const shortlist = within(screen.getByRole("complementary", { name: "Your saved looks" }));
  const message = new URL(shortlist.getByRole("link").getAttribute("href")!).searchParams.get(
    "text",
  )!;
  expect(message).toContain("BC-01 · Wedding");
  expect(message).toContain("BC-02 · Birthday");
  expect(message).toContain("Event date:");
  expect(message).not.toContain("undefined");
  fireEvent.click(screen.getByRole("button", { name: /Saved looks/ }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(2);
  fireEvent.click(shortlist.getByRole("button", { name: "Clear" }));
  expect(screen.getByRole("status")).toHaveTextContent("No saved looks");
  fireEvent.click(screen.getByRole("button", { name: "Browse all moments" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(29);
});
it("offers keyboard lightbox navigation, close/focus return and a real single-look enquiry", async () => {
  await mount();
  const opener = screen.getByRole("button", { name: /Open Birthday: A milestone/ });
  fireEvent.click(opener);
  const viewer = screen.getByRole("dialog");
  expect(within(viewer).getByRole("heading")).toHaveTextContent("A milestone");
  fireEvent.keyDown(viewer, { key: "ArrowRight" });
  expect(within(viewer).getByRole("heading")).toHaveTextContent("Floral elegance");
  const href = within(viewer)
    .getByRole("link", { name: "Ask about this look" })
    .getAttribute("href")!;
  expect(new URL(href).searchParams.get("text")).toContain("BC-21 · Birthday");
  fireEvent.click(within(viewer).getByRole("button", { name: "Save this look" }));
  expect(within(viewer).getByRole("button", { name: "Saved to your shortlist" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.keyDown(viewer, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(opener).toHaveFocus());
});
it("keeps browsing usable with blocked storage and ignores corrupt/stale shortlist IDs", async () => {
  expect(readGalleryShortlist("broken")).toEqual([]);
  expect(readGalleryShortlist('{"x":1}')).toEqual([]);
  expect(readGalleryShortlist('[null,42,"wedding","wedding","bad"]')).toEqual(["wedding"]);
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  await mount();
  fireEvent.click(screen.getByRole("button", { name: /^Save A setting/ }));
  expect(screen.getByRole("complementary", { name: "Your saved looks" })).toHaveTextContent(
    "1 saved look",
  );
  expect(galleryMessage([])).toContain("help choosing");
});
it("supports future films with posters/controls/captions, no autoplay/preloading and a useful error state", () => {
  const film: GalleryMedia = {
    ...galleryMedia[0]!,
    kind: "video",
    video: "/future-upload.mp4",
    captions: { src: "/future-upload.vtt", language: "en", label: "English" },
  };
  const { container } = render(<GalleryMediaView item={film} />);
  const video = container.querySelector("video")!;
  expect(video).toHaveAttribute("controls");
  expect(video).toHaveAttribute("playsinline");
  expect(video).toHaveAttribute("preload", "none");
  expect(video).not.toHaveAttribute("autoplay");
  expect(video).toHaveAttribute("poster", film.image);
  expect(video.querySelector("track")).toHaveAttribute("kind", "captions");
  fireEvent.error(video);
  expect(screen.getByRole("alert")).toHaveTextContent("couldn’t load");
});

it("keeps every exact style independent, gives Birthday/Kids different presentation and scopes viewer navigation", async () => {
  const sections = galleryCollections();
  const birthday = sections.find((item) => item.id === "birthday")!;
  const kids = sections.find((item) => item.id === "kids-birthday")!;
  expect(birthday.items).toHaveLength(7);
  expect(kids.items).toHaveLength(12);
  expect(birthday.layout).not.toBe(kids.layout);
  expect(birthday.radius).not.toBe(kids.radius);
  expect(new Set(sections.flatMap((section) => section.items.map((item) => item.id))).size).toBe(
    38,
  );
  for (const section of sections)
    expect(section.items.every((item) => item.occasion === section.name)).toBe(true);
  expect(
    collectionViewerItems("birthday-50th", galleryMedia).every(
      (item) => item.occasion === "Birthday",
    ),
  ).toBe(true);
  expect(collectionViewerItems(null, galleryMedia)).toEqual([]);
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "Kids Birthday" } });
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  expect(document.querySelector('[data-gallery-style="birthday"]')).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Explore more Kids Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(12);
  expect(document.querySelector('[data-gallery-id="kids-jungle-adventure"]')).toHaveClass(
    "gc-card-landscape",
  );
});
