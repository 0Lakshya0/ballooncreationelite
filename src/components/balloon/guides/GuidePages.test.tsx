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
import { FaqPage } from "./FaqPage";
import { SignaturePage } from "./SignaturePage";
import { CelebratePage } from "./CelebratePage";
import { guideFaqs, celebrationPlanMessage } from "@/lib/celebration-guides";
import { submitInquiry } from "@/lib/concierge.functions";
import { STATIC_INQUIRY_MESSAGE } from "@/lib/concierge-messages";
vi.mock("../decor/liquid-renderer", () => ({ mountLiquidSurfaces: vi.fn(() => vi.fn()) }));
vi.mock("@/lib/concierge.functions", () => ({ submitInquiry: vi.fn() }));
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});
async function mount(component: () => React.ReactNode, path = "/") {
  const root = createRootRoute({ component: Outlet });
  const routes = ["/", "/faqs", "/signature-standard", "/lets-celebrate"].map((path) =>
    createRoute({ getParentRoute: () => root, path, component }),
  );
  const router = createRouter({
    routeTree: root.addChildren(routes),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await act(async () => {
    await router.load();
    render(<RouterProvider router={router} />);
  });
  return router;
}
it("links all three header choices to real routes, not Home anchors", async () => {
  await mount(() => <FaqPage />, "/faqs");
  const nav = within(screen.getByRole("navigation", { name: "Main navigation" }));
  for (const [name, path] of [
    ["FAQs", "/faqs"],
    ["The signature standard", "/signature-standard"],
    ["Let’s celebrate", "/lets-celebrate"],
  ] as const)
    expect(nav.getByRole("link", { name })).toHaveAttribute("href", path);
  expect(screen.getByRole("link", { name: "Request Consultation" })).toHaveAttribute(
    "href",
    "/lets-celebrate#callback",
  );
  expect(document.querySelector("footer")).toBeNull();
});
it("offers twelve local FAQ answers, topic filtering, search and an empty reset without network requests", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await mount(() => <FaqPage />, "/faqs");
  expect(document.querySelectorAll(".guide-questions details")).toHaveLength(12);
  fireEvent.click(screen.getByRole("button", { name: "Planning" }));
  expect(document.querySelectorAll(".guide-questions details")).toHaveLength(3);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "first conversation" } });
  expect(document.querySelectorAll(".guide-questions details")).toHaveLength(1);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "zzzzzz" } });
  expect(screen.getByRole("status")).toHaveTextContent("0 answers");
  fireEvent.click(screen.getByRole("button", { name: "Reset search & topics" }));
  expect(document.querySelectorAll(".guide-questions details")).toHaveLength(12);
  expect(fetch).not.toHaveBeenCalled();
  expect(submitInquiry).not.toHaveBeenCalled();
});
it("keeps new FAQs practical, unique, unpriced and explicit about booking confirmation", () => {
  expect(new Set(guideFaqs.map((item) => item.question)).size).toBe(12);
  expect(guideFaqs.some((item) => item.answer.includes("No. A message or callback"))).toBe(true);
  expect(guideFaqs.map((item) => item.answer).join(" ")).not.toMatch(
    /₹|guaranteed|within the hour/i,
  );
});
it("explains three principles, three planning steps and four confirmation checks without fake proof", async () => {
  await mount(() => <SignaturePage />, "/signature-standard");
  expect(document.querySelectorAll(".guide-principles article")).toHaveLength(3);
  expect(document.querySelectorAll(".guide-process li")).toHaveLength(3);
  expect(document.querySelectorAll(".guide-checklist li")).toHaveLength(4);
  expect(
    screen.getByRole("img", { name: "Floral wedding styling inspiration from Balloon Creation" }),
  ).toHaveAttribute("src", expect.stringContaining("wedding"));
  expect(screen.getByRole("link", { name: "Tell us your idea" })).toHaveAttribute(
    "href",
    "/lets-celebrate",
  );
  expect(document.querySelector(".guide-page")?.textContent).not.toMatch(
    /₹|five.star|reviews|guaranteed|within the hour/i,
  );
});
it("allows an unsure customer to open a draft without required planner fields or automatic submissions", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await mount(() => <CelebratePage />, "/lets-celebrate");
  const draft = new URL(
    screen.getByRole("link", { name: /Review in WhatsApp/ }).getAttribute("href")!,
  ).searchParams.get("text")!;
  expect(draft).toContain("Please help me choose");
  expect(draft).toContain("Not decided yet");
  expect(draft).toContain("not a confirmed booking");
  expect(document.querySelectorAll(".guide-plan-fields [required]")).toHaveLength(0);
  expect(document.querySelector(".guide-callback")).not.toHaveAttribute("open");
  expect(fetch).not.toHaveBeenCalled();
  expect(submitInquiry).not.toHaveBeenCalled();
});
it("includes the selected occasion and optional brief in an encoded WhatsApp draft, with callback prefill", async () => {
  await mount(() => <CelebratePage initialOccasion="Car Decoration" />, "/lets-celebrate");
  fireEvent.change(screen.getByLabelText(/Preferred date/), { target: { value: "2026-12-20" } });
  fireEvent.change(screen.getByLabelText(/Venue or area/), {
    target: { value: "Vijay Nagar & Palasia" },
  });
  fireEvent.change(screen.getByLabelText(/Your ideas/), {
    target: { value: "Cream flowers <script>alert(1)</script>" },
  });
  const draft = new URL(
    screen.getByRole("link", { name: /Review in WhatsApp/ }).getAttribute("href")!,
  ).searchParams.get("text")!;
  for (const detail of [
    "Car Decoration",
    "2026-12-20",
    "Vijay Nagar & Palasia",
    "Cream flowers <script>alert(1)</script>",
  ])
    expect(draft).toContain(detail);
  expect(document.querySelector(".guide-page script")).toBeNull();
  expect(document.querySelector<HTMLSelectElement>("select[name=occasion]")?.value).toBe(
    "Car Decoration",
  );
  expect(submitInquiry).not.toHaveBeenCalled();
});
it("opens the real consultation form at its own page hash and keeps static submissions honest", async () => {
  vi.mocked(submitInquiry).mockRejectedValueOnce(new Error(STATIC_INQUIRY_MESSAGE));
  await mount(() => <CelebratePage initialOccasion="Birthday" />, "/lets-celebrate#callback");
  expect(document.querySelector(".guide-callback")).toHaveAttribute("open");
  expect(document.querySelector(".guide-callback")?.textContent).not.toMatch(
    /date held|within the hour/i,
  );
  fireEvent.submit(document.querySelector(".guide-callback form")!);
  expect(await screen.findByRole("alert")).toHaveTextContent(STATIC_INQUIRY_MESSAGE);
  expect(document.querySelector(".inquiry-success")).toBeNull();
});
it("does not pretend an unknown occasion is a supported enquiry type", async () => {
  await mount(() => <CelebratePage initialOccasion="__proto__" />, "/lets-celebrate");
  expect(screen.getByLabelText("What are you celebrating?")).toHaveValue("");
  expect(celebrationPlanMessage({ occasion: "", date: "", venue: " ", vision: " " })).not.toContain(
    "My ideas:",
  );
});
