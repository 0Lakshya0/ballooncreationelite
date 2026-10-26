import { act } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { TrustBand } from "./trust-band";
import { stats } from "@/lib/site-content";
vi.mock("@/lib/visibility", () => ({
  observeVisibility: (_element: Element, callback: (visible: boolean) => void) => {
    callback(true);
    return vi.fn();
  },
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function frames() {
  let id = 0;
  const pending = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    pending.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (key: number) => pending.delete(key));
  return {
    pending,
    advance(time: number) {
      const callbacks = [...pending.values()];
      pending.clear();
      act(() => callbacks.forEach((callback) => callback(time)));
    },
  };
}
const values = (container: HTMLElement) =>
  [...container.querySelectorAll(".trust-value")].map((element) =>
    Number(element.firstChild?.textContent?.replaceAll(",", "")),
  );
it("keeps embedded-preview counters bounded when frame and performance clocks have different origins", () => {
  vi.spyOn(performance, "now").mockReturnValue(1_000_000);
  const animation = frames();
  const { container } = render(<TrustBand />);
  for (const time of [0, 500, -100, 1000]) {
    animation.advance(time);
    values(container).forEach((value, index) => {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(stats[index]!.value);
    });
  }
  animation.advance(1500);
  expect(values(container)).toEqual(stats.map((stat) => stat.value));
  expect(animation.pending.size).toBe(0);
});
it("finishes counters and cancels their frames when the visitor pauses background motion", () => {
  const animation = frames();
  const { container, unmount } = render(
    <div className="site-liquid-backdrop" data-motion="on">
      <TrustBand />
    </div>,
  );
  animation.advance(0);
  container.querySelector<HTMLElement>(".site-liquid-backdrop")!.dataset["motion"] = "off";
  act(() => document.dispatchEvent(new Event("bce:motionchange")));
  expect(values(container)).toEqual(stats.map((stat) => stat.value));
  expect(animation.pending.size).toBe(0);
  unmount();
  expect(animation.pending.size).toBe(0);
});
