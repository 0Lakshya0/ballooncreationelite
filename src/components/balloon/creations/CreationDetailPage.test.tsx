import { act } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { afterEach, expect, it, vi } from "vitest";
import { CreationDetailPage } from "./CreationDetailPage";
import { serviceDetails, getService } from "@/lib/service-details";
import { celebrations } from "@/lib/celebrations";
vi.mock("../decor/liquid-renderer", () => ({ mountLiquidSurfaces: vi.fn(() => vi.fn()) }));
vi.mock("@/lib/concierge.functions", () => ({ submitInquiry: vi.fn() }));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
it("maps every existing home card to one unique detailed creation; rejects unknown slugs", () => {
  expect(celebrations.map((x) => x.slug)).toEqual(serviceDetails.map((x) => x.slug));
  expect(new Set(serviceDetails.map((x) => x.slug)).size).toBe(5);
  expect(getService("not-a-service")).toBeUndefined();
  expect(getService("__proto__")).toBeUndefined();
});
it.each(serviceDetails)(
  "renders $slug with packages, gallery, FAQ, prefilled consultation and no footer/prices/fabricated review panel",
  async (service) => {
    const root = createRootRoute({ component: Outlet });
    const home = createRoute({
      getParentRoute: () => root,
      path: "/",
      component: () => <main>Home</main>,
    });
    const detail = createRoute({
      getParentRoute: () => root,
      path: "/creations/$slug",
      component: () => <CreationDetailPage service={service} />,
    });
    const router = createRouter({
      routeTree: root.addChildren([home, detail]),
      history: createMemoryHistory({ initialEntries: [`/creations/${service.slug}`] }),
    });
    await act(async () => {
      await router.load();
      render(<RouterProvider router={router} />);
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(service.hook);
    expect(document.querySelectorAll(".service-shot")).toHaveLength(service.gallery.length);
    expect(document.querySelectorAll(".service-package")).toHaveLength(3);
    expect(document.querySelectorAll(".faq-item")).toHaveLength(service.faqs.length);
    expect(document.querySelector<HTMLSelectElement>('select[name="occasion"]')?.value).toBe(
      service.name,
    );
    expect(document.querySelector<HTMLInputElement>('input[name="event_date"]')?.min).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    );
    expect(document.querySelectorAll(".site-liquid-backdrop")).toHaveLength(1);
    expect(document.querySelectorAll(".service-other")).toHaveLength(4);
    expect(document.querySelector("footer,.service-proof")).toBeNull();
    expect(document.body.textContent).not.toMatch(/₹|mockup|placeholder content/);
  },
);
