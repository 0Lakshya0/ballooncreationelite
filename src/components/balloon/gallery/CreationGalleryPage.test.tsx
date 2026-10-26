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
it("curates157 unique supplied photos with stable references and replaces all19 occasion covers without inventing history", () => {
  expect(galleryMedia).toHaveLength(157);
  expect(new Set(galleryMedia.map((item) => item.id)).size).toBe(157);
  expect(new Set(galleryMedia.map((item) => item.reference)).size).toBe(157);
  for (const item of galleryMedia) {
    expect(item.image).toMatch(
      /\/(homepage-real|gallery-real|gallery-birthday-batch-[12]|gallery-baby-shower-batch-1|gallery-family-batch-2|gallery-anniversary-batch-[12]|gallery-first-night-batch-[12]|gallery-naming-batch-[12]|gallery-proposal-batch-1|gallery-wedding-batch-1)\//,
    );
    expect(item.kind).toBe("image");
    expect(item.width).toBeGreaterThan(0);
    expect(item.height).toBeGreaterThan(0);
    expect(item.reference).toMatch(/^BC-\d{2,}$/);
  }
  for (const item of occasionPages) {
    expect(item.heroImage).toBe(suppliedOccasionPhotos[item.slug].image);
    expect(item.heroImage).not.toContain("/categories/");
  }
  expect(galleryMedia.find((item) => item.id === "wedding")?.reference).toBe("BC-01");
});
it("opens a real page, progressively shows photos, and filters without making network requests", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  const expand = (id: string, label: string) =>
    fireEvent.click(
      within(document.querySelector(`[data-gallery-style="${id}"]`) as HTMLElement).getByRole(
        "button",
        { name: `Explore more ${label} looks` },
      ),
    );
  await mount();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Beautiful moments.");
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(20);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(40);
  const kids = within(
    document.querySelector('[data-gallery-style="kids-birthday"]') as HTMLElement,
  );
  expect(kids.getAllByRole("article")).toHaveLength(6);
  fireEvent.click(kids.getByRole("button", { name: "Explore more Kids Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(46);
  fireEvent.click(kids.getByRole("button", { name: "Explore more Kids Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(48);
  expect(document.querySelectorAll('[data-gallery-style="birthday"] .gc-card')).toHaveLength(4);
  expand("birthday", "Birthday");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(51);
  expand("baby-shower", "Baby Shower");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(57);
  expand("baby-shower", "Baby Shower");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(63);
  expand("baby-shower", "Baby Shower");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(66);
  expand("anniversary", "Anniversary");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(72);
  expand("anniversary", "Anniversary");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(78);
  expand("anniversary", "Anniversary");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(83);
  expand("first-night", "First Night");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(89);
  expand("first-night", "First Night");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(95);
  expand("first-night", "First Night");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(101);
  expand("first-night", "First Night");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(104);
  expand("naming-ceremony", "Naming Ceremony");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(110);
  expand("naming-ceremony", "Naming Ceremony");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(116);
  expand("naming-ceremony", "Naming Ceremony");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(121);
  expand("proposal", "Proposal");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(127);
  expand("proposal", "Proposal");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(133);
  expand("proposal", "Proposal");
  expect(document.querySelectorAll(".gc-card")).toHaveLength(139);
  fireEvent.click(screen.getByRole("button", { name: /^Birthdays/ }));
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(2);
  expect(screen.getByRole("heading", { name: "Birthday" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Kids Birthday" })).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent("21");
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
  expect(document.querySelectorAll(".gc-card")).toHaveLength(40);
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
  expect(kids.items).toHaveLength(14);
  expect(birthday.layout).not.toBe(kids.layout);
  expect(birthday.radius).not.toBe(kids.radius);
  expect(new Set(sections.flatMap((section) => section.items.map((item) => item.id))).size).toBe(
    157,
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
  fireEvent.click(screen.getByRole("button", { name: "Explore more Kids Birthday looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(14);
  expect(document.querySelector('[data-gallery-id="kids-jungle-adventure"]')).toHaveClass(
    "gc-card-landscape",
  );
});

it("pages Baby Shower3→9→15→18 independently, keeps small originals compact and wraps only its own photos", async () => {
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "Baby Shower" } });
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(3);
  expect(document.querySelector('[data-gallery-id="baby-shower-bloom"]')).toHaveClass(
    "gc-card-small",
  );
  fireEvent.click(screen.getByRole("button", { name: "Explore more Baby Shower looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(9);
  fireEvent.click(screen.getByRole("button", { name: "Explore more Baby Shower looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(15);
  fireEvent.click(screen.getByRole("button", { name: "Explore more Baby Shower looks" }));
  expect(document.querySelectorAll(".gc-card")).toHaveLength(18);
  expect(screen.queryByRole("button", { name: "Explore more Baby Shower looks" })).toBeNull();
  expect(document.querySelector('[data-gallery-id="baby-shower-krishna-stage"]')).toHaveClass(
    "gc-card-landscape",
  );
  fireEvent.click(
    screen.getByRole("button", {
      name: "Open Baby Shower: A little bloom, a lovely beginning",
    }),
  );
  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByRole("img")).toHaveStyle({ maxWidth: "236px" });
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(within(dialog).getByRole("heading")).toHaveTextContent("The sweetest new beginning");
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(within(dialog).getByRole("heading")).toHaveTextContent("A little peanut is on the way");
  expect(dialog).toHaveTextContent("18 / 18");
});
it("pages First Night3→9→15→21→24 separately and wraps its24-photo viewer without Anniversary or Room Surprise mixing", async () => {
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "First Night" } });
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  const section = document.querySelector('[data-gallery-style="first-night"]') as HTMLElement;
  expect(within(section).getAllByRole("article")).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "Explore more First Night looks" }));
  expect(within(section).getAllByRole("article")).toHaveLength(9);
  fireEvent.click(screen.getByRole("button", { name: "Explore more First Night looks" }));
  expect(within(section).getAllByRole("article")).toHaveLength(15);
  fireEvent.click(screen.getByRole("button", { name: "Explore more First Night looks" }));
  expect(within(section).getAllByRole("article")).toHaveLength(21);
  fireEvent.click(screen.getByRole("button", { name: "Explore more First Night looks" }));
  expect(within(section).getAllByRole("article")).toHaveLength(24);
  expect(screen.queryByRole("button", { name: "Explore more First Night looks" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open First Night: A room made for two" }));
  const dialog = within(screen.getByRole("dialog"));
  expect(dialog.getByText("1 / 24")).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowLeft" });
  expect(dialog.getByRole("heading")).toHaveTextContent("Soft drapes, a canopy of light");
  expect(dialog.getByText("24 / 24")).toBeInTheDocument();
  expect(
    new URL(
      dialog.getByRole("link", { name: "Ask about this look" }).getAttribute("href")!,
    ).searchParams.get("text"),
  ).toContain("BC-99 · First Night");
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "ArrowRight" });
  expect(dialog.getByText("1 / 24")).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("pages Naming Ceremony3→9→15→20 independently, keeps wide stages whole and wraps its20-photo viewer", async () => {
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), {
    target: { value: "Naming Ceremony" },
  });
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(3);
  for (const n of [9, 15, 20]) {
    fireEvent.click(screen.getByRole("button", { name: "Explore more Naming Ceremony looks" }));
    expect(document.querySelectorAll(".gc-card")).toHaveLength(n);
  }
  expect(screen.queryByRole("button", { name: "Explore more Naming Ceremony looks" })).toBeNull();
  expect(document.querySelectorAll(".gc-card-landscape")).toHaveLength(5);
  expect(document.querySelector('[data-gallery-id="naming-floral-stage"]')).toHaveClass(
    "gc-card-landscape",
  );
  expect(document.querySelectorAll('[data-gallery-id="floral-swing"]')).toHaveLength(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Open Naming Ceremony: A little name. A lot of love." }),
  );
  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveTextContent("1 / 20");
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(within(dialog).getByRole("heading")).toHaveTextContent(
    "Gold, silver and a little sparkle",
  );
  expect(dialog).toHaveTextContent("20 / 20");
  expect(
    new URL(
      within(dialog).getByRole("link", { name: "Ask about this look" }).getAttribute("href")!,
    ).searchParams.get("text"),
  ).toContain("BC-118 · Naming Ceremony");
  fireEvent.keyDown(dialog, { key: "ArrowRight" });
  expect(dialog).toHaveTextContent("1 / 20");
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("pages Proposal3→9→15→21 independently, keeps its moon scene whole and wraps only21 proposal images", async () => {
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "Proposal" } });
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(3);
  for (const n of [9, 15, 21]) {
    fireEvent.click(screen.getByRole("button", { name: "Explore more Proposal looks" }));
    expect(document.querySelectorAll(".gc-card")).toHaveLength(n);
  }
  expect(screen.queryByRole("button", { name: "Explore more Proposal looks" })).toBeNull();
  expect(document.querySelector('[data-gallery-id="proposal-moonlit-path"]')).toHaveClass(
    "gc-card-landscape",
  );
  expect(document.querySelectorAll('[data-gallery-id="proposal-garden"]')).toHaveLength(1);
  fireEvent.click(
    screen.getByRole("button", { name: "Open Proposal: One question. A beautiful moment." }),
  );
  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveTextContent("1 / 21");
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(within(dialog).getByRole("heading")).toHaveTextContent("A little question, framed in red");
  expect(dialog).toHaveTextContent("21 / 21");
  expect(
    new URL(
      within(dialog).getByRole("link", { name: "Ask about this look" }).getAttribute("href")!,
    ).searchParams.get("text"),
  ).toContain("BC-137 · Proposal");
  fireEvent.keyDown(dialog, { key: "ArrowRight" });
  expect(dialog).toHaveTextContent("1 / 21");
  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("opens one Wedding parent into automatically ordered chapters without requiring a subcategory filter", async () => {
  await mount();
  const parent = document.querySelector('[data-gallery-style="wedding"]') as HTMLElement;
  expect(within(parent).getAllByRole("article")).toHaveLength(3);
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(0);
  fireEvent.click(within(parent).getByRole("button", { name: "Explore Wedding collection" }));
  expect(screen.getByLabelText("Choose a style")).toHaveValue("Wedding");
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(4);
  expect(
    Array.from(document.querySelectorAll("[data-wedding-group]"), (p) =>
      p.getAttribute("data-wedding-group"),
    ),
  ).toEqual(["mehndi", "haldi", "stage", "entrance"]);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(21);
  expect(screen.getByRole("status")).toHaveTextContent("21 of 21");
  const nav = screen.getByRole("navigation", { name: "Wedding moments" });
  expect(within(nav).getAllByRole("button")).toHaveLength(4);
  expect(
    within(nav).getByRole("button", { name: "Jump to Stage Decoration" }).querySelector("img"),
  ).toBeTruthy();
  fireEvent.click(within(nav).getByRole("button", { name: "Jump to Haldi" }));
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(4);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(21);
  for (const [id, n] of [
    ["mehndi", 7],
    ["haldi", 6],
    ["stage", 6],
    ["entrance", 2],
  ] as const)
    expect(document.querySelectorAll(`[data-wedding-group="${id}"] .gc-card`)).toHaveLength(n);
  fireEvent.click(screen.getByRole("button", { name: /^All collections$/ }));
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(20);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(40);
});
it("direct Wedding selection and heading open show the same chapters, and its photo viewer never mixes Mehndi with Haldi", async () => {
  await mount();
  fireEvent.click(screen.getByRole("button", { name: "Open Wedding collection" }));
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(4);
  fireEvent.click(
    screen.getByRole("button", { name: "Open Wedding: A little green, a lovely Mehndi welcome" }),
  );
  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveTextContent("Wedding / Mehndi · BC-139");
  expect(dialog).toHaveTextContent("1 / 7");
  fireEvent.keyDown(dialog, { key: "ArrowLeft" });
  expect(dialog).toHaveTextContent("7 / 7");
  expect(within(dialog).getByRole("heading")).toHaveTextContent(
    "A little celebration in jewel tones",
  );
  expect(
    new URL(
      within(dialog).getByRole("link", { name: "Ask about this look" }).getAttribute("href")!,
    ).searchParams.get("text"),
  ).toContain("BC-156 · Wedding / Mehndi");
  fireEvent.keyDown(dialog, { key: "Escape" });
  fireEvent.click(
    screen.getByRole("button", { name: "Open Wedding: A little sunshine, all around" }),
  );
  expect(screen.getByRole("dialog")).toHaveTextContent("1 / 6");
  expect(screen.getByRole("dialog")).toHaveTextContent("Wedding / Haldi · BC-142");
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "all" } });
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "Wedding" } });
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(4);
});
it("keeps saved Wedding chapters separate, omits empty chapters and preserves full landscape scenes", async () => {
  localStorage.setItem(
    SHORTLIST_KEY,
    JSON.stringify([
      "wedding-mehndi-green-white",
      "wedding-haldi-yellow-canopy",
      "wedding-stage-hanging-rings",
    ]),
  );
  await mount();
  fireEvent.change(screen.getByLabelText("Choose a style"), { target: { value: "Wedding" } });
  fireEvent.click(screen.getByRole("button", { name: /^Saved looks/ }));
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(3);
  expect(document.querySelectorAll(".gc-card")).toHaveLength(3);
  expect(document.querySelector('[data-gallery-id="wedding-stage-hanging-rings"]')).toHaveClass(
    "gc-card-landscape",
  );
  expect(screen.getByRole("link", { name: "Discuss my shortlist" }).getAttribute("href")).toContain(
    "Wedding%20%2F%20Mehndi",
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Unsave A little green, a lovely Mehndi welcome" }),
  );
  expect(document.querySelectorAll("[data-wedding-group]")).toHaveLength(2);
  expect(screen.queryByRole("button", { name: "Jump to Mehndi" })).toBeNull();
  expect(document.querySelectorAll("[data-gallery-style]")).toHaveLength(1);
});
