import { act } from "react";
import { createRoot } from "react-dom/client";
import { indoreAreas as areas } from "@/lib/indore-areas";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SmartSearch } from "./smart-search";
import { categories } from "./category-marquee";
import { contact } from "@/lib/celebrations";

const { toastSuccess } = vi.hoisted(() => ({ toastSuccess: vi.fn() }));
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
    expect(categories).toHaveLength(20);
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
    expect(box.querySelectorAll(".smart-results button")).toHaveLength(10);
    search("a");
    expect(result()).toHaveTextContent("🎈 Services");
    expect(result()).toHaveTextContent("📍 Locations");
    expect(box.querySelectorAll("button").length).toBe(
      categories.filter((s) => s.toLowerCase().includes("a")).length +
        areas.filter((a) => a.toLowerCase().includes("a")).length,
    );
  });
  it("shows two 750ms simulation phases then the exact success card and encoded original query", () => {
    const query = 'Underwater & "ocean" theme 🐠?';
    search(`  ${query}  `);
    expect(result()).toBeNull();
    advance(499);
    expect(input.value).toBe(`  ${query}  `);
    advance(1);
    expect(input.value).toBe("🔄 Checking feasibility...");
    expect(input.readOnly).toBe(true);
    advance(749);
    expect(input.value).toBe("🔄 Checking feasibility...");
    advance(1);
    expect(input.value).toBe("✨ Verifying stock...");
    advance(749);
    expect(result()).not.toHaveTextContent("✅ Yes!");
    advance(1);
    expect(input.value).toBe(`  ${query}  `);
    expect(input.readOnly).toBe(false);
    expect(result()).toHaveTextContent(`✅ Yes! We can create '${query}'.`);
    expect(result()).toHaveTextContent("This is a unique request. Let's discuss details.");
    const url = new URL(link("Chat on WhatsApp").href);
    expect(url.searchParams.get("text")).toBe(`Hi, can you do ${query}?`);
    expect(result()).not.toHaveTextContent(/No Result|Not found/i);
  });
  it("debounces typing and cancels obsolete checks when a newer match or keyword arrives", () => {
    search("Underwater");
    advance(400);
    search("Underwater theme");
    advance(400);
    expect(input.value).toBe("Underwater theme");
    search("Vijay Nagar");
    advance(3000);
    expect(result()).toHaveTextContent("📍 Vijay Nagar");
    expect(input.value).toBe("Vijay Nagar");
    search("Moon castle");
    advance(500);
    search("price");
    advance(3000);
    expect(result()).toHaveTextContent("Estimates start ₹1,999");
    expect(result()).not.toHaveTextContent("Moon castle");
  });
  it("cancels on clear, Escape, outside click and unmount without reopening stale success cards", () => {
    search("Underwater theme");
    advance(500);
    escape();
    advance(3000);
    expect(result()).toBeNull();
    expect(input.value).toBe("Underwater theme");
    expect(input.readOnly).toBe(false);
    search("Moon castle");
    advance(500);
    act(() => document.body.dispatchEvent(new Event("pointerdown", { bubbles: true })));
    advance(3000);
    expect(result()).toBeNull();
    search("Moon castle");
    search("");
    advance(3000);
    expect(input.value).toBe("");
    expect(result()).toHaveTextContent("🎈 Services");
    search("Moon castle");
    act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    root = createRoot(box);
  });
  it("keeps service navigation and location selection/toast working", () => {
    const target = document.createElement("div");
    target.id = "categories";
    document.body.append(target);
    const scroll = vi.fn();
    target.scrollIntoView = scroll;
    search("Corporate");
    act(() => box.querySelector("button")!.click());
    expect(scroll).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
    expect(input.value).toBe("");
    expect(result()).toBeNull();
    search("Vijay Nagar");
    act(() => box.querySelector("button")!.click());
    expect(onLocation).toHaveBeenCalledOnce();
    expect(toastSuccess).toHaveBeenCalledWith("Yes! We cover Vijay Nagar.");
  });
  it("renders arbitrary query content as text, never executable markup", () => {
    search("<img src=x onerror=alert(1)>");
    advance(2000);
    expect(result()).toHaveTextContent("<img src=x onerror=alert(1)>");
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
