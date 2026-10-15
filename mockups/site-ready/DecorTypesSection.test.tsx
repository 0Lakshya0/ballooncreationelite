import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import DecorTypesSection from "./DecorTypesSection";
import { CHIP_GROUPS, DECOR_DATA, WA_HREF } from "./decorTypesData";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: ReturnType<typeof createRoot> | null = null;

function mount(props: { imgBase?: string } = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(<DecorTypesSection {...props} />));
  return container;
}

const click = (el: Element | null | undefined) =>
  act(() => {
    (el as HTMLElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

const pick = (container: HTMLElement, name: string) =>
  [...container.querySelectorAll("button.chip")].find(
    (b) => b.querySelector(".nm")?.textContent === name,
  );

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

describe("DecorTypesSection", () => {
  it("renders all 25 chips, each with a photo and a description", () => {
    const c = mount();
    expect(c.querySelectorAll("button.chip").length).toBe(25);
    expect(c.querySelectorAll(".chip .thumb img").length).toBe(25);
    expect(c.querySelectorAll(".chip .ds").length).toBe(25);
    expect([...c.querySelectorAll(".group-no")].map((e) => e.textContent)).toEqual(["01", "02", "03"]);
    expect(CHIP_GROUPS.reduce((n, g) => n + g.chips.length, 0)).toBe(25);
  });

  it("opens a chip whose name has an ampersand, with all 6 options", () => {
    const c = mount();
    click(pick(c, "Drapes & Fabric"));
    const sheet = c.querySelector("#detail, .detail");
    expect((c.querySelector(".detail") as HTMLElement).hidden).toBe(false);
    expect(c.querySelector(".detail-card h3")?.textContent).toBe("Drapes & Fabric");
    expect(sheet).toBeTruthy();
    expect(c.querySelectorAll("#c-opts .opt-card").length).toBe(6);
    expect(c.querySelectorAll("#c-opts .opt-thumb img").length).toBe(6);
  });

  it("opens an option, then goes back with the floating back button", () => {
    const c = mount();
    click(pick(c, "Cold Pyro & Fountains"));
    const first = c.querySelector("#c-opts .opt-card") as HTMLElement;
    const name = first.getAttribute("data-opt");
    click(first);
    expect(first.getBoundingClientRect).toBeTruthy();
    expect(c.querySelector(".detail-body h3")?.textContent).toBe(name);
    expect(c.querySelector(".fact-card .fact-lead")?.textContent).toBeTruthy();
    expect(c.querySelectorAll("#opt-palette, .chip-row").length).toBeGreaterThan(0);
    expect(c.querySelectorAll(".detail-mini img").length).toBeGreaterThan(1);
    click(c.querySelector(".detail-up"));
    expect(c.querySelector(".detail-card h3")?.textContent).toBe("Cold Pyro & Fountains");
  });

  it("collects picks in the enquiry bar and builds a WhatsApp link", () => {
    const c = mount();
    click(pick(c, "Floral Decor"));
    const wa = c.querySelector(".detail-actions .ghost") as HTMLAnchorElement;
    expect(wa.getAttribute("href")?.startsWith(WA_HREF)).toBe(true);
    expect(decodeURIComponent(wa.getAttribute("href") ?? "")).toContain("Floral Decor");

    click(c.querySelector(".detail-actions .cta"));
    expect(c.querySelector(".picked")?.textContent).toContain("Floral Decor");

    click(c.querySelector(".reset"));
    expect(c.querySelector(".picked")?.textContent).toContain("Nothing selected");
  });

  it("can point its photos at a folder on the live site", () => {
    const c = mount({ imgBase: "/decor-types" });
    expect(c.querySelector(".chip .thumb img")?.getAttribute("src")).toMatch(/^\/decor-types\//);
  });

  it("reads like a finished page — no draft wording anywhere", () => {
    const c = mount();
    const text = (c.textContent ?? "").toLowerCase();
    ["draft", "mockup", "preview", "placeholder", "my note", "demo:"].forEach((w) =>
      expect(text).not.toContain(w),
    );
    const data = JSON.stringify(DECOR_DATA).toLowerCase();
    ["draft", "mockup", "preview", "placeholder"].forEach((w) => expect(data).not.toContain(w));
    expect(Object.keys(DECOR_DATA).length).toBe(25);
    expect(Object.values(DECOR_DATA).reduce((n, x) => n + Object.keys(x.options).length, 0)).toBe(150);
  });
});
