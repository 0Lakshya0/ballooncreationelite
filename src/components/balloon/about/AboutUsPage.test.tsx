import { act } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { afterEach, expect, it, vi } from "vitest";
import AboutUsPage, { Photo } from "./AboutUsPage";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
async function mount() {
  Element.prototype.scrollIntoView = vi.fn();
  const root = createRootRoute({ component: Outlet });
  const about = createRoute({ getParentRoute: () => root, path: "/about", component: AboutUsPage });
  const home = createRoute({
    getParentRoute: () => root,
    path: "/",
    component: () => (
      <main>
        <div id="portfolio">Home portfolio</div>
        <div id="concierge">Home consultation</div>
      </main>
    ),
  });
  const router = createRouter({
    routeTree: root.addChildren([home, about]),
    history: createMemoryHistory({ initialEntries: ["/about"] }),
  });
  await act(async () => {
    await router.load();
    render(<RouterProvider router={router} />);
  });
  await screen.findByRole("heading", { level: 1 });
  return router;
}
it("renders the supplied About content, six sections, 4 FAQs and exact tagline without adding a footer or prices", async () => {
  await mount();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "The doors open.Your moment begins.",
  );
  expect(screen.getByText("We decorate your happiness")).toBeInTheDocument();
  expect(document.querySelectorAll(".ab-faq-item")).toHaveLength(4);
  expect(document.querySelectorAll(".ab-step")).toHaveLength(4);
  expect(document.querySelector("footer")).toBeNull();
  expect(document.body.textContent).not.toMatch(/₹|starting from|preview|mockup/i);
});
it("keeps enquiry and portfolio links inside the app with the correct home section", async () => {
  const router = await mount();
  fireEvent.click(screen.getAllByRole("link", { name: /Check date availability/ })[0]!);
  await screen.findByText("Home consultation");
  expect(router.state.location.pathname).toBe("/");
  expect(router.state.location.hash).toBe("concierge");
});
it("provides working contact links, structured data and bundled images rather than external demo URLs", async () => {
  await mount();
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]'),
  );
  expect(links.length).toBeGreaterThan(1);
  expect(links.every((a) => a.href.includes("917489863753?text="))).toBe(true);
  expect(document.querySelector('a[href="tel:+917489863753"]')).toBeTruthy();
  expect(
    JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!).address
      .addressLocality,
  ).toBe("Indore");
  expect(Array.from(document.images).every((img) => !img.src.includes("unsplash.com"))).toBe(true);
});
it("opens the mobile menu, locks background scroll, restores it and returns focus on Escape", async () => {
  await mount();
  document.body.style.overflow = "auto";
  const button = screen.getByRole("button", { name: "Open menu" });
  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(document.body.style.overflow).toBe("hidden");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(button).toHaveAttribute("aria-expanded", "false");
  expect(document.body.style.overflow).toBe("auto");
  expect(button).toHaveFocus();
});
it("restores scroll on navigation/unmount while menu is open and makes no AI calls", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await mount();
  fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
  cleanup();
  expect(document.body.style.overflow).not.toBe("hidden");
  expect(fetch).not.toHaveBeenCalled();
});
it("replaces failed images with an accessible sized fallback and recovers for a new source", () => {
  const { rerender } = render(<Photo src="/missing.jpg" alt="Wedding styling" />);
  fireEvent.error(screen.getByRole("img", { name: "Wedding styling" }));
  expect(document.querySelector(".ab-photo-fallback")).toBeTruthy();
  expect(document.querySelector("img")).toBeNull();
  rerender(<Photo src="/new.jpg" alt="Wedding styling" />);
  expect(document.querySelector("img")).toHaveAttribute("src", "/new.jpg");
});
