import { act } from "react";
import { createRoot } from "react-dom/client";
import { indoreAreas as areas } from "@/lib/indore-areas";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmartSearch } from "./smart-search";
import { categories } from "./category-marquee";
import { contact } from "@/lib/celebrations";

const { toastSuccess, navigate } = vi.hoisted(() => ({ toastSuccess: vi.fn(), navigate: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({ useRouter: () => ({ navigate }) }));
vi.mock("sonner", () => ({ toast: { success: toastSuccess } }));
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
// Exercise the shared location catalogue after extraction from the homepage.
let root: ReturnType<typeof createRoot>;
let box: HTMLDivElement;
let input: HTMLInputElement;
let onLocation: ReturnType<typeof vi.fn<() => void>>;
const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));
function search(value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
const result = () => box.querySelector(".smart-results");
const link = (text: string) => [...box.querySelectorAll("a")].find((a) => a.textContent === text)!;
const escape = () =>
  act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));

beforeEach(() => {
  vi.useFakeTimers();
  onLocation = vi.fn();
  box = document.createElement("div");
  document.body.append(box);
  root = createRoot(box);
  act(() => root.render(<SmartSearch areas={areas} onLocation={onLocation} />));
  input = box.querySelector("input")!;
});
afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = "";
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("SmartSearch three-layer salesman logic", () => {
  it.each(["Price", "COST", "rate", "What is the price for a Wedding?", "rates"])(
    "intercepts %s instantly before service matching",
    (query) => {
      search(query);
      const quote = link("💰 Estimates start ₹1,999. Click for Custom Quote.");
      expect(quote).toBeDefined();
      expect(quote.href).toContain(contact.whatsapp);
      expect(result()).not.toHaveTextContent("🎈 Services");
      advance(3000);
      expect(input.value).toBe(query);
      expect(result()).toHaveTextContent("Estimates start ₹1,999");
    },
  );
  it.each(["Time", "duration", "How much TIME for Wedding?"])("answers %s immediately", (query) => {
    search(query);
    expect(result()).toHaveTextContent("⏱️ Setup takes 2-3 hours only.");
    expect(input.readOnly).toBe(false);
  });
  it.each(["Contact", "PHONE"])("offers both WhatsApp and telephone for %s", (query) => {
    search(query);
    expect(link("📞 Click here to Call or WhatsApp us directly.").href).toContain(contact.whatsapp);
    expect(link(`Call ${contact.label}`).getAttribute("href")).toBe(`tel:${contact.phone}`);
  });
  it("searches every real service and location, including Corporate without a false Rate interception", () => {
    expect(categories).toHaveLength(19);
    expect(areas.length).toBeGreaterThanOrEqual(80);
    for (const service of categories) {
      search(`  ${service.toUpperCase()}  `);
      expect(result()).toHaveTextContent("🎈 Services");
      expect(result()).toHaveTextContent(service);
      expect(result()).not.toHaveTextContent("Estimates start");
    }
    for (const place of areas) {
      search(place.toLowerCase());
      expect(result()).toHaveTextContent("📍 Locations");
      expect(result()).toHaveTextContent(place);
    }
    advance(3000);
    expect(input.readOnly).toBe(false);
  });
  it("groups simultaneous service and location results and preserves empty-query suggestions", () => {
    act(() => input.focus());
    expect(box.querySelectorAll(".smart-head")).toHaveLength(2);
    expect(box.querySelectorAll(".smart-results button, .smart-results a")).toHaveLength(10);
    search("a");
    expect(result()).toHaveTextContent("🎈 Services");
    expect(result()).toHaveTextContent("📍 Locations");
    expect(
      box.querySelectorAll(".smart-results button, .smart-results a").length,
    ).toBeLessThanOrEqual(16);
  });
  it.each([
    "birthday",
    "birtday",
    "brithday",
    "bday",
    "janamdin",
    "जन्मदिन",
    "birthday decoration",
  ])("immediately shows real Birthday links for %s without locking typing", (query) => {
    search(query);
    const anchor = result()!.querySelector<HTMLAnchorElement>('a[href="/creations/birthday"]');
    expect(anchor).not.toBeNull();
    expect(input.readOnly).toBe(false);
    expect(input.value).toBe(query);
    expect(result()).not.toHaveTextContent(/checking feasibility|verifying stock/i);
  });
  it("never leaves an unknown query empty or invents stock/feasibility", () => {
    search("zxqv998877");
    expect(result()).toHaveTextContent("No exact match");
    expect(result()).toHaveTextContent("Popular occasions");
    expect(result()!.querySelectorAll('a[href^="/creations/"]')).toHaveLength(5);
    expect(result()).not.toHaveTextContent(/Yes! We can create|Verifying stock/i);
    expect(new URL(link("Discuss your idea on WhatsApp").href).searchParams.get("text")).toBe(
      "Hi, can you help with zxqv998877?",
    );
  });
  it("dismisses Escape/outside click, clears results and never reopens stale content", () => {
    search("birthday");
    escape();
    advance(3000);
    expect(result()).toBeNull();
    search("wedding");
    act(() => document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    expect(result()).toBeNull();
    search("");
    expect(result()).toHaveTextContent("🎈 Services");
    expect(input.value).toBe("");
  });
  it("opens the selected real page and Enter opens the top exact match; locations still work", () => {
    search("Corporate");
    act(() =>
      result()!.querySelector<HTMLAnchorElement>('a[href="/creations/corporate-events"]')!.click(),
    );
    expect(navigate).toHaveBeenCalledWith({
      to: "/creations/$slug",
      params: { slug: "corporate-events" },
    });
    expect(input.value).toBe("");
    expect(result()).toBeNull();
    search("birthday");
    act(() => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    expect(navigate).toHaveBeenLastCalledWith({
      to: "/creations/$slug",
      params: { slug: "birthday" },
    });
    search("Vijay Nagar");
    act(() => result()!.querySelector("button")!.click());
    expect(onLocation).toHaveBeenCalledOnce();
    expect(toastSuccess).toHaveBeenCalledWith("Yes! We cover Vijay Nagar.");
  });
  it("renders arbitrary query content as text without executable markup", () => {
    search("<img src=x onerror=alert(1)>");
    expect(result()!.querySelector("img")).toBeNull();
  });
  it("preserves the existing placeholder typing, hold and deletion timings", () => {
    const line = "You have any question? Write here...";
    advance(599);
    expect(input.placeholder).toBe("Search services or Indore areas…");
    advance(1);
    expect(input.placeholder).toBe("Y");
    advance((line.length - 1) * 120);
    expect(input.placeholder).toBe(line);
    advance(2499);
    expect(input.placeholder).toBe(line);
    advance(1);
    expect(input.placeholder).toBe(line.slice(0, -1));
    advance(55);
    expect(input.placeholder).toBe(line.slice(0, -2));
  });
});
