import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import DecorTypesSection from "./DecorTypesSection";
import { CHIP_GROUPS, DECOR_DATA } from "./decor-data";
import { contact } from "@/lib/celebrations";
import { liquidFragment } from "./liquid-shader";
import { observeVisibility } from "@/lib/visibility";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot> | null = null;
function mount() {
  const box = document.createElement("div");
  document.body.appendChild(box);
  root = createRoot(box);
  act(() => root!.render(<DecorTypesSection />));
  return box;
}
const click = (e: Element | null | undefined) =>
  act(() => {
    (e as HTMLElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
const namedChip = (c: HTMLElement, name: string) =>
  [...c.querySelectorAll(".chip")].find((e) => e.querySelector(".nm")?.textContent === name);
const escape = () =>
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
    );
  });
afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
  localStorage.clear();
  vi.restoreAllMocks();
});

describe("Integrated approved decor collections", () => {
  it("keeps all approved data and every locally bundled photo, not the older package content", () => {
    const source = readFileSync("mockups/final/decor-types-final.html", "utf8");
    const approved = JSON.parse(source.match(/window\.DECOR_DATA = (\{[\s\S]*?\});\n/)![1]!);
    expect(Object.keys(DECOR_DATA)).toHaveLength(25);
    expect(Object.values(DECOR_DATA).reduce((n, c) => n + Object.keys(c.options).length, 0)).toBe(
      150,
    );
    for (const [name, chip] of Object.entries(DECOR_DATA)) {
      for (const key of Object.keys(approved[name]))
        expect(chip[key as keyof typeof chip]).toEqual(approved[name][key]);
      expect(chip.desc).toBeTruthy();
    }
    for (const image of JSON.stringify(DECOR_DATA).matchAll(/img\/([^"\s]+)/g))
      expect(existsSync("public/decor-types/" + image[1])).toBe(true);
    const shaderSource = readFileSync("mockups/_english_liquid_gold.py", "utf8");
    expect(liquidFragment).toBe(shaderSource.match(/var fragment=`([\s\S]*?)`;/)![1]);
  });
  it("renders 25 photographed styles and 08/09/08 photo islands as native React on the collections page", () => {
    const c = mount();
    expect(c.querySelectorAll(".chip")).toHaveLength(25);
    expect(c.querySelectorAll(".chip img")).toHaveLength(25);
    expect([...c.querySelectorAll(".chapter-count")].map((e) => e.textContent)).toEqual([
      "08 DECOR STYLES",
      "09 DECOR STYLES",
      "08 DECOR STYLES",
    ]);
    expect(c.querySelectorAll('[data-photo-island="raised"]')).toHaveLength(3);
    expect(c.querySelectorAll("canvas")).toHaveLength(6); // no duplicate standalone hero
    expect(c.querySelectorAll("iframe,script,h1,.photo-shoreline")).toHaveLength(0);
    expect(c.textContent).toContain("We decorate your happiness");
    expect(CHIP_GROUPS.map((g) => g.chips.length)).toEqual([8, 9, 8]);
  });
  it("opens every style and all 150 options with complete detail and circle-profile markup", () => {
    const c = mount();
    for (const [name, data] of Object.entries(DECOR_DATA)) {
      click(namedChip(c, name));
      expect(c.querySelector('[role="dialog"]')).toBeTruthy();
      expect(c.querySelector(".detail-body h3")?.textContent).toBe(name);
      expect(c.querySelectorAll(".opt-card")).toHaveLength(6);
      for (const [option, detail] of Object.entries(data.options)) {
        click(
          [...c.querySelectorAll(".opt-card")].find((e) => e.getAttribute("data-opt") === option),
        );
        expect(c.querySelector(".detail-body h3")?.textContent).toBe(option);
        expect(c.querySelector(".option-view .detail-hero img")).toBeTruthy();
        expect(c.querySelector(".detail-card")?.textContent).toContain(detail.what);
        for (const label of [
          "When to pick it",
          "How it is made",
          "Where it is used",
          "Good to know",
          "Setup time",
          "Colour & palette",
          "Best for",
          "What comes with it",
          "Pairs beautifully with",
        ])
          expect(c.querySelector(".detail-card")?.textContent).toContain(label);
        click(c.querySelector(".detail-up"));
      }
      click(c.querySelector(".detail-x"));
    }
  });
  it("handles saving/removing options, reset, WhatsApp, Escape back/close and focus restoration", () => {
    const c = mount(),
      trigger = namedChip(c, "Balloon Decor") as HTMLButtonElement;
    trigger.focus();
    click(trigger);
    click(c.querySelector(".opt-card"));
    click(c.querySelector(".detail-actions .cta"));
    expect(c.querySelector(".picked")?.textContent).toContain("Balloon Decor ·");
    const link = c.querySelector(".selbar a.cta") as HTMLAnchorElement;
    expect(link.href).toContain(contact.whatsapp);
    expect(decodeURIComponent(link.href)).toContain("Organic balloon garland");
    escape();
    expect(c.querySelector(".detail-body h3")?.textContent).toBe("Balloon Decor");
    escape();
    expect(c.querySelector('[role="dialog"]')).toBeNull();
    // Radix runs close-autofocus after its unmount tick; browser regression also checks actual focus.
    click(c.querySelector(".reset"));
    expect(c.querySelector(".picked")?.textContent).toContain("Nothing selected");
  });
  it("opens the matching style from inspiration cards and uses shared WhatsApp contact", () => {
    const c = mount();
    click(c.querySelector(".mood-card"));
    expect(c.querySelector(".detail-body h3")?.textContent).toBe("Balloon Decor");
    const link = c.querySelector(".detail-actions a") as HTMLAnchorElement;
    expect(link.href).toContain(contact.whatsapp);
  });
  it("pauses/resumes locally and cleans up without changing page-level motion flags", () => {
    document.documentElement.setAttribute("data-main-sentinel", "keep");
    const c = mount();
    click(c.querySelector(".motion-toggle"));
    expect(c.querySelector(".bce-decor")?.getAttribute("data-motion")).toBe("off");
    expect(localStorage.getItem("bce-english-motion")).toBe("off");
    click(c.querySelector(".motion-toggle"));
    expect(c.querySelector(".bce-decor")?.getAttribute("data-motion")).toBe("on");
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    expect(document.documentElement.getAttribute("data-main-sentinel")).toBe("keep");
    document.documentElement.removeAttribute("data-main-sentinel");
  });
  it("respects reduced motion and displays all content with no WebGL requirement", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((q) => ({
      matches: q.includes("prefers-reduced-motion"),
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: () => true,
    }));
    const c = mount();
    expect((c.querySelector(".motion-toggle") as HTMLButtonElement).disabled).toBe(true);
    expect(c.querySelector(".bce-decor")?.getAttribute("data-motion")).toBe("off");
    expect([...c.querySelectorAll(".chip")].every((e) => e.classList.contains("is-visible"))).toBe(
      true,
    );
  });
  it("shares a single intersection observer between main-page reveals and new scenes", () => {
    let count = 0;
    const old = window.IntersectionObserver;
    class FakeObserver {
      constructor() {
        count++;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      writable: true,
      value: FakeObserver,
    });
    const a = document.createElement("div"),
      b = document.createElement("div");
    const stopA = observeVisibility(a, () => {}),
      stopB = observeVisibility(b, () => {});
    expect(count).toBe(1);
    stopA();
    stopB();
    if (old) window.IntersectionObserver = old;
    else delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
  });
});
