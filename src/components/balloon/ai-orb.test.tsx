import { readFileSync } from "node:fs";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { AIOrb } from "./ai-orb";
const reference = readFileSync("mockups/ai-bloon/bloon-demo.html", "utf8");
let media: {
  matches: boolean;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};
let change: () => void;
beforeEach(() => {
  localStorage.clear();
  change = () => {};
  media = {
    matches: false,
    addEventListener: vi.fn((_name, cb) => {
      change = cb;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal("matchMedia", () => media);
  vi.spyOn(globalThis, "fetch");
});
afterEach(() => {
  cleanup();
  document.querySelector(".site-liquid-backdrop")?.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function mount(paused = false) {
  return render(
    <button aria-label="Bloon" aria-describedby="original-help">
      <AIOrb paused={paused} />
    </button>,
  );
}
const root = () => document.querySelector<HTMLElement>(".bce-ai-bloon")!;
const tooltip = () => document.querySelector<HTMLElement>(".bce-ai-greeting-bubble")!;
function pointer(type: string, values: Record<string, unknown> = {}) {
  act(() => {
    const e = new Event(type, { bubbles: true });
    Object.assign(e, { pointerType: "mouse", clientX: 80, clientY: 80, ...values });
    screen.getByRole("button").dispatchEvent(e);
  });
}
it("preserves every SVG path and gradient stop colour from the uploaded demo, without WebGL", () => {
  mount();
  const doc = new DOMParser().parseFromString(reference, "text/html");
  expect([...root().querySelectorAll("path")].map((p) => p.getAttribute("d"))).toEqual(
    [...doc.querySelectorAll("svg path")].map((p) => p.getAttribute("d")),
  );
  expect([...root().querySelectorAll("stop")].map((p) => p.getAttribute("stop-color"))).toEqual(
    [...doc.querySelectorAll("stop")].map((p) => p.getAttribute("stop-color")),
  );
  expect(root().querySelector("svg")).toHaveAttribute("viewBox", "0 0 100 100");
  expect(root().querySelector("canvas")).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
});
it("cycles the same ten local greetings and reveals the waving/happy pose without API requests", () => {
  mount();
  pointer("pointerenter");
  expect(root()).toHaveAttribute("data-greeting", "true");
  expect(tooltip()).toHaveTextContent("Hey! What are we celebrating?");
  pointer("pointerleave");
  expect(tooltip()).toHaveAttribute("aria-hidden", "true");
  pointer("pointerenter");
  expect(tooltip()).toHaveTextContent("Hello—what mood are you imagining?");
  for (let i = 0; i < 9; i++) {
    pointer("pointerleave");
    pointer("pointerenter");
  }
  expect(tooltip()).toHaveTextContent("Hey! What are we celebrating?");
  expect(fetch).not.toHaveBeenCalled();
});
it("supports keyboard focus, Escape and blur while preserving the original help description", () => {
  mount();
  const button = screen.getByRole("button");
  fireEvent.focus(button);
  expect(root()).toHaveAttribute("data-greeting", "true");
  expect(button.getAttribute("aria-describedby")).toContain("original-help");
  expect(button.getAttribute("aria-describedby")).toContain(tooltip().id);
  fireEvent.keyDown(button, { key: "Escape" });
  expect(tooltip()).toHaveAttribute("aria-hidden", "true");
  fireEvent.blur(button);
  expect(root()).toHaveAttribute("data-greeting", "false");
  expect(fetch).not.toHaveBeenCalled();
});
it("clamps cursor-following pupils to the exact demo's 1.4px range and resets on leave", () => {
  mount();
  vi.spyOn(root(), "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    left: 0,
    top: 100,
    width: 160,
    height: 160,
    right: 160,
    bottom: 260,
    toJSON() {},
  });
  pointer("pointermove", { clientX: 999, clientY: -999 });
  expect(root().style.getPropertyValue("--x")).toBe("1.40px");
  expect(root().style.getPropertyValue("--y")).toBe("-1.40px");
  pointer("pointerleave");
  expect(root().style.getPropertyValue("--x")).toBe("0px");
  expect(fetch).not.toHaveBeenCalled();
});
it("touch hover does not consume a greeting or replace the existing tap-to-chat behaviour", () => {
  const click = vi.fn();
  render(
    <button onClick={click}>
      <AIOrb />
    </button>,
  );
  pointer("pointerenter", { pointerType: "touch" });
  expect(root()).toHaveAttribute("data-greeting", "false");
  fireEvent.click(screen.getByRole("button"));
  expect(click).toHaveBeenCalledTimes(1);
  expect(fetch).not.toHaveBeenCalled();
});
it("pauses and hides greetings while dragging/open; normal hover works again afterwards", () => {
  const view = mount();
  pointer("pointerenter");
  view.rerender(
    <button aria-label="Bloon">
      <AIOrb paused />
    </button>,
  );
  expect(root()).toHaveAttribute("data-motion", "off");
  expect(root()).toHaveAttribute("data-greeting", "false");
  pointer("pointerenter");
  expect(root()).toHaveAttribute("data-greeting", "false");
  view.rerender(
    <button aria-label="Bloon">
      <AIOrb />
    </button>,
  );
  pointer("pointerenter");
  expect(root()).toHaveAttribute("data-greeting", "true");
});
it("obeys shared site pause, reduced motion and hidden document without any animation timer", () => {
  const backdrop = document.createElement("div");
  backdrop.className = "site-liquid-backdrop";
  backdrop.dataset["motion"] = "on";
  document.body.append(backdrop);
  mount();
  expect(root()).toHaveAttribute("data-motion", "on");
  backdrop.dataset["motion"] = "off";
  fireEvent(document, new Event("bce:motionchange"));
  expect(root()).toHaveAttribute("data-motion", "off");
  backdrop.dataset["motion"] = "on";
  media.matches = true;
  act(() => change());
  expect(root()).toHaveAttribute("data-motion", "off");
  media.matches = false;
  act(() => change());
  expect(root()).toHaveAttribute("data-motion", "on");
  vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  fireEvent(document, new Event("visibilitychange"));
  expect(root()).toHaveAttribute("data-motion", "off");
  expect(fetch).not.toHaveBeenCalled();
});
it("honours an already-persisted site pause before the backdrop has mounted", () => {
  localStorage.setItem("bce-site-motion", "off");
  mount();
  expect(root()).toHaveAttribute("data-motion", "off");
});
it("uses unique SVG and tooltip IDs per instance so gradients cannot conflict", () => {
  render(
    <>
      <button>
        <AIOrb />
      </button>
      <button>
        <AIOrb />
      </button>
    </>,
  );
  const ids = [...document.querySelectorAll(".bce-ai-bloon [id]")].map((n) => n.id);
  expect(new Set(ids).size).toBe(ids.length);
});
it("removes the tooltip's description and native listeners when only the mascot unmounts", () => {
  const view = mount();
  view.rerender(<button aria-label="Bloon" aria-describedby="original-help" />);
  expect(screen.getByRole("button")).toHaveAttribute("aria-describedby", "original-help");
  expect(media.removeEventListener).toHaveBeenCalled();
});
