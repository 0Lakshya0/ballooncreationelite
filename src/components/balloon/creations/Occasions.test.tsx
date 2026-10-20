import { act } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { afterEach, expect, it, vi } from "vitest";
import { occasionPages, occasionMessage } from "@/lib/occasion-catalogue";
import { occasionEntries } from "@/lib/occasion-entries";
import { isKnownOccasion } from "@/lib/occasion-choices";
import { getService, serviceDetails, serviceSlugs } from "@/lib/service-details";
import { categories, CategoryMarquee } from "../category-marquee";
import { OccasionDetailPage } from "./OccasionDetailPage";
import { OccasionGrid } from "./OccasionGrid";
vi.mock("../decor/liquid-renderer", () => ({ mountLiquidSurfaces: vi.fn(() => vi.fn()) }));
vi.mock("embla-carousel-react", () => ({
  default: () => [() => {}, { scrollPrev: () => {}, scrollNext: () => {} }],
}));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
async function mount(component: () => React.ReactNode, path = "/") {
  const root = createRootRoute({ component: Outlet });
  const home = createRoute({ getParentRoute: () => root, path: "/", component });
  const detail = createRoute({ getParentRoute: () => root, path: "/creations/$slug", component });
  const router = createRouter({
    routeTree: root.addChildren([home, detail]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await act(async () => {
    await router.load();
    render(<RouterProvider router={router} />);
  });
  return router;
}
it("gives every circle one unique matching card/page, correct image and allowed enquiry name", () => {
  expect(occasionEntries).toHaveLength(20);
  expect(categories).toEqual(occasionPages.map((x) => x.name));
  expect(new Set(serviceSlugs).size).toBe(25);
  for (const entry of occasionPages) {
    expect(getService(entry.slug)).toBe(entry);
    expect(entry.heroImage).toContain(`category-${String(entry.photo).padStart(2, "0")}.webp`);
    expect(entry.packages).toHaveLength(3);
    expect(entry.faqs).toHaveLength(4);
    expect(isKnownOccasion(entry.name)).toBe(true);
  }
  for (const legacy of serviceDetails) {
    expect(getService(legacy.slug)).toBe(legacy);
    expect(isKnownOccasion(legacy.name)).toBe(true);
  }
  expect(getService("__proto__")).toBeUndefined();
  expect(isKnownOccasion("not a supported occasion")).toBe(false);
});
it("shows all 20 cards and filters locally with a working empty-state reset", async () => {
  await mount(() => <OccasionGrid />);
  expect(document.querySelectorAll(".occasion-card")).toHaveLength(20);
  fireEvent.click(screen.getByRole("button", { name: "Work & events" }));
  expect(document.querySelectorAll(".occasion-card")).toHaveLength(6);
  fireEvent.change(screen.getByRole("searchbox", { name: "Find an occasion" }), {
    target: { value: "Exhibition" },
  });
  expect(document.querySelectorAll(".occasion-card")).toHaveLength(1);
  expect(screen.getByRole("link", { name: "Explore Exhibition Stall" })).toHaveAttribute(
    "href",
    "/creations/exhibition-stall",
  );
  fireEvent.change(screen.getByRole("searchbox", { name: "Find an occasion" }), {
    target: { value: "zzzzzz" },
  });
  expect(document.querySelectorAll(".occasion-card")).toHaveLength(0);
  fireEvent.click(screen.getByRole("button", { name: "Show all occasions" }));
  expect(document.querySelectorAll(".occasion-card")).toHaveLength(20);
});
it("makes each moving circle a real link, not just a label", async () => {
  await mount(() => <CategoryMarquee />);
  const links = document.querySelectorAll(".category-link");
  expect(links).toHaveLength(20);
  links.forEach((link, index) =>
    expect(link).toHaveAttribute("href", `/creations/${occasionEntries[index]!.slug}`),
  );
});
it.each(occasionPages)(
  "renders a simple $name journey with optional selection and contextual WhatsApp draft",
  async (occasion) => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await mount(() => <OccasionDetailPage occasion={occasion} />, `/creations/${occasion.slug}`);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(occasion.heading);
    expect(document.querySelectorAll(".occasion-idea")).toHaveLength(3);
    expect(document.querySelectorAll(".occasion-faq details")).toHaveLength(4);
    expect(document.querySelectorAll(".occasion-inclusions li")).toHaveLength(4);
    const first = within(document.querySelector(".occasion-idea")!).getByRole("button", {
      name: "Choose this idea",
    });
    fireEvent.click(first);
    expect(first).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(screen.getByLabelText("Preferred event date"), {
      target: { value: "2026-12-20" },
    });
    fireEvent.change(screen.getByLabelText(/Venue or area/), { target: { value: "Vijay Nagar" } });
    const link = screen.getByRole("link", { name: `Discuss ${occasion.name} on WhatsApp` });
    const message = new URL(link.getAttribute("href")!).searchParams.get("text")!;
    expect(message).toContain(occasion.name);
    expect(message).toContain(occasion.packages[0]!.name);
    expect(message).toContain("2026-12-20");
    expect(message).toContain("Vijay Nagar");
    fireEvent.click(screen.getByRole("button", { name: "Let us suggest an idea" }));
    expect(first).toHaveAttribute("aria-pressed", "false");
    expect(new URL(link.getAttribute("href")!).searchParams.get("text")).toContain("not sure");
    expect(document.querySelector("footer")).toBeNull();
    expect(document.querySelectorAll(".site-liquid-backdrop")).toHaveLength(1);
    expect(document.body.textContent).not.toMatch(/₹|MOST CHOSEN|booked out|placeholder|mockup/);
    expect(screen.getByRole("link", { name: "Request a callback" }).getAttribute("href")).toContain(
      "occasion=",
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  },
);
it("keeps the helpful unsure path available without a date, venue or chosen idea", () => {
  const text = occasionMessage("Birthday", "", "", "");
  expect(text).toContain("Please help");
  expect(text).not.toContain("Event date:");
  expect(text).not.toContain("Venue / area:");
});
