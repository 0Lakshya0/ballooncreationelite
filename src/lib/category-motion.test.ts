import type { EmblaCarouselType } from "embla-carousel";
import { afterEach, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { bindCategoryMotion } from "./category-motion";
const disposers: (() => void)[] = [];
afterEach(() => {
  disposers.splice(0).forEach((dispose) => dispose());
  vi.useRealTimers();
  vi.restoreAllMocks();
});
function setup() {
  vi.useFakeTimers();
  const events = new Map<string, () => void>();
  const auto = { play: vi.fn(), stop: vi.fn() };
  const media = Object.assign(new EventTarget(), { matches: false });
  vi.spyOn(window, "matchMedia").mockReturnValue(media as unknown as MediaQueryList);
  const api = {
    plugins: () => ({ autoScroll: auto }),
    on: (name: string, fn: () => void) => {
      events.set(name, fn);
      return api;
    },
    off: (name: string) => {
      events.delete(name);
      return api;
    },
  };
  const dispose = bindCategoryMotion(api as unknown as EmblaCarouselType);
  disposers.push(dispose);
  return { events, auto, media, dispose, emit: (name: string) => events.get(name)?.() };
}
it("disables hover/focus stopping and the plugin's delayed settle-based restart", () => {
  const code = readFileSync("src/components/balloon/category-marquee.tsx", "utf8");
  for (const option of [
    "startDelay: 0",
    "stopOnMouseEnter: false",
    "stopOnFocusIn: false",
    "stopOnInteraction: true",
  ])
    expect(code).toContain(option);
});
it("pauses a real hold and immediately resumes on release, without a trailing timer", () => {
  const { auto, emit } = setup();
  emit("pointerDown");
  expect(auto.stop).toHaveBeenCalledOnce();
  vi.advanceTimersByTime(200);
  expect(auto.play).not.toHaveBeenCalled();
  emit("pointerUp");
  expect(auto.play).toHaveBeenCalledExactlyOnceWith(0);
  vi.advanceTimersByTime(4000);
  expect(auto.play).toHaveBeenCalledOnce();
});
it("resumes at three seconds even while still held; another finger does not extend it", () => {
  const { auto, emit } = setup();
  emit("pointerDown");
  vi.advanceTimersByTime(2000);
  emit("pointerDown");
  vi.advanceTimersByTime(999);
  expect(auto.play).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(auto.play).toHaveBeenCalledExactlyOnceWith(0);
});
it("does not get stuck if another pointer starts after the three-second cap", () => {
  const { auto, emit } = setup();
  emit("pointerDown");
  vi.advanceTimersByTime(3500);
  // The plugin's own pointerDown handler stops first, before our callback.
  auto.stop();
  emit("pointerDown");
  expect(auto.play).toHaveBeenCalledTimes(2);
  expect(auto.play).toHaveBeenLastCalledWith(0);
});
it.each(["pointerup", "pointercancel", "touchend", "touchcancel"])(
  "resumes on document %s, including release outside the strip",
  (event) => {
    const { auto, emit } = setup();
    emit("pointerDown");
    document.dispatchEvent(new Event(event));
    expect(auto.play).toHaveBeenCalledExactlyOnceWith(0);
  },
);
it("resumes on window blur and clears a pending hold when the document hides", () => {
  const { auto, emit } = setup();
  emit("pointerDown");
  window.dispatchEvent(new Event("blur"));
  expect(auto.play).toHaveBeenCalledOnce();
  emit("pointerDown");
  const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
  document.dispatchEvent(new Event("visibilitychange"));
  vi.advanceTimersByTime(4000);
  expect(auto.play).toHaveBeenCalledOnce();
  hidden.mockReturnValue(false);
  document.dispatchEvent(new Event("visibilitychange"));
  expect(auto.play).toHaveBeenCalledTimes(2);
});
it("keeps the original deadline through responsive reinitialisation", () => {
  const { auto, emit } = setup();
  emit("pointerDown");
  vi.advanceTimersByTime(2100);
  emit("reInit");
  vi.advanceTimersByTime(899);
  expect(auto.play).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(auto.play).toHaveBeenCalledExactlyOnceWith(0);
});
it("never restarts when OS reduced motion is requested, and reacts to changes", () => {
  const { auto, media, emit } = setup();
  emit("pointerDown");
  media.matches = true;
  media.dispatchEvent(new Event("change"));
  vi.advanceTimersByTime(3000);
  emit("pointerUp");
  expect(auto.play).not.toHaveBeenCalled();
  media.matches = false;
  media.dispatchEvent(new Event("change"));
  expect(auto.play).toHaveBeenCalledExactlyOnceWith(0);
});
it("cleans timers/listeners on navigation, so old pages cannot restart the row", () => {
  const { auto, events, emit, dispose } = setup();
  emit("pointerDown");
  dispose();
  vi.advanceTimersByTime(4000);
  document.dispatchEvent(new Event("pointerup"));
  window.dispatchEvent(new Event("blur"));
  expect(events.size).toBe(0);
  expect(auto.play).not.toHaveBeenCalled();
});
