export const ORB_SIZE = 64;
const MARGIN = 14;
export type Dock = { side: "left" | "right"; ratio: number };
export type Point = { x: number; y: number };
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, Math.max(min, max)));
export function dockPosition(dock: Dock, width: number, height: number): Point {
  return {
    x: dock.side === "left" ? MARGIN : Math.max(MARGIN, width - ORB_SIZE - MARGIN),
    y: MARGIN + clamp(dock.ratio, 0, 1) * Math.max(0, height - ORB_SIZE - 2 * MARGIN),
  };
}
export function snapDock(point: Point, width: number, height: number): Dock {
  return {
    side: point.x + ORB_SIZE / 2 < width / 2 ? "left" : "right",
    ratio: clamp((point.y - MARGIN) / Math.max(1, height - ORB_SIZE - 2 * MARGIN), 0, 1),
  };
}
export const DOCK_KEY = "bce-ai-orb-position";
export function readDock(): Dock {
  try {
    const value = JSON.parse(localStorage.getItem(DOCK_KEY) || "null");
    if (
      value &&
      (value.side === "left" || value.side === "right") &&
      typeof value.ratio === "number" &&
      Number.isFinite(value.ratio)
    )
      return { side: value.side, ratio: clamp(value.ratio, 0, 1) };
  } catch {
    /* Storage is optional; never stop the assistant from opening. */
  }
  return { side: "right", ratio: 0.84 };
}
