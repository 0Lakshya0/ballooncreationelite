import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { SiteLiquidBackground } from "./site-liquid-background";

const { mountRenderer, disposeRenderer } = vi.hoisted(() => ({
  mountRenderer: vi.fn(),
  disposeRenderer: vi.fn(),
}));
vi.mock("./decor/liquid-renderer", () => ({ mountLiquidSurfaces: mountRenderer }));
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot> | null = null;
async function mount() {
  mountRenderer.mockReturnValue(disposeRenderer);
  const box = document.createElement("div");
  document.body.append(box);
  root = createRoot(box);
  await act(async () => {
    root!.render(<SiteLiquidBackground />);
  });
  return box;
}
afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
  localStorage.clear();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("Full-home approved liquid background and collection entry", () => {
  it("keeps large copy with softer shared ink and readable contrast on pearl surfaces", () => {
    const home = readFileSync("src/components/balloon/readability.css", "utf8");
    const english = readFileSync("mockups/_english_readability.py", "utf8");
    for (const colour of ["#73614f", "#80694f", "#62503c", "#fff8ecf5"]) {
      expect(home).toContain(colour);
      expect(english).toContain(colour);
    }
    expect(home).toContain("clamp(16px, 1.15vw, 18px)");
    expect(home).toContain("font-weight: 400");
    const luminance = (hex: string) => {
      const c = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
      return c[0]! * 0.2126 + c[1]! * 0.7152 + c[2]! * 0.0722;
    };
    for (const [ink, paper] of [
      ["#73614f", "#fff8ec"],
      ["#80694f", "#fff8ec"],
      ["#62503c", "#e8bfa8"],
      ["#73614f", "#f3e0c0"],
    ]) {
      expect((luminance(paper!) + 0.05) / (luminance(ink!) + 0.05)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("replaces the original strip text with a routed button, not an inline collection", () => {
    const home = readFileSync("src/routes/index.tsx", "utf8");
    expect(home).toContain("<DecorCollectionsButton />");
    expect(home).toContain("<SiteLiquidBackground />");
    expect(home).not.toContain("<DecorTypesSection");
    expect(home).not.toContain('href="#decor-types"');
    expect(home).not.toContain("FLOWERS <span");
    const entry = readFileSync("src/components/balloon/decor-collections-button.tsx", "utf8");
    expect(entry).toContain('to="/decor-collections"');
    const page = readFileSync("src/routes/decor-collections.tsx", "utf8");
    expect(page).toContain("<DecorTypesSection />");
    expect(page).toContain("We decorate your happiness");
  });
  it("keeps the approved colour gradients and reuses the same bounded shader renderer", () => {
    const approved = readFileSync("src/components/balloon/decor/approved-decor.css", "utf8");
    const site = readFileSync("src/components/balloon/site-liquid-background.css", "utf8");
    for (const colour of [
      "#e9bb71",
      "#e2ae58",
      "#f4d397",
      "#e8b59d",
      "#dc9f89",
      "#f1c9ae",
      "#fff5e699",
    ]) {
      expect(approved).toContain(colour);
      expect(site).toContain(colour);
    }
    expect(site).toContain("opacity: 0.52");
    expect(site).toContain("opacity: 0.58");
  });
  it("mounts one decorative canvas, persists pause separately from the English collection and disposes", async () => {
    const box = await mount();
    expect(box.querySelectorAll("canvas")).toHaveLength(1);
    expect(box.querySelector(".site-liquid-backdrop")?.getAttribute("aria-hidden")).toBe("true");
    expect(mountRenderer).toHaveBeenCalledTimes(1);
    const button = box.querySelector("button")!;
    act(() => button.click());
    expect(box.querySelector(".site-liquid-backdrop")?.getAttribute("data-motion")).toBe("off");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(localStorage.getItem("bce-site-motion")).toBe("off");
    expect(localStorage.getItem("bce-english-motion")).toBeNull();
    act(() => button.click());
    expect(button.getAttribute("aria-label")).toBe("Pause background animation");
    act(() => root!.unmount());
    root = null;
    expect(disposeRenderer).toHaveBeenCalledTimes(1);
  });
  it("honours saved pause and reduced motion before the optional renderer starts", async () => {
    localStorage.setItem("bce-site-motion", "off");
    const box = await mount();
    expect(box.querySelector(".site-liquid-backdrop")?.getAttribute("data-motion")).toBe("off");
    act(() => root!.unmount());
    root = null;
    const matchMedia = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...matchMedia(query),
      matches: true,
    }));
    localStorage.clear();
    const reduced = await mount();
    expect(reduced.querySelector("button")?.disabled).toBe(true);
    expect(reduced.querySelector(".site-liquid-backdrop")?.getAttribute("data-motion")).toBe("off");
  });
  it("stops motion when the document is hidden and restores it on visibility", async () => {
    const box = await mount();
    const hidden = vi.spyOn(document, "hidden", "get");
    hidden.mockReturnValue(true);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(box.querySelector(".site-liquid-backdrop")?.hasAttribute("data-motion-suspended")).toBe(
      true,
    );
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(box.querySelector(".site-liquid-backdrop")?.hasAttribute("data-motion-suspended")).toBe(
      false,
    );
  });
});
