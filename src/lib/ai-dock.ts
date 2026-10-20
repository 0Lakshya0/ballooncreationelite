export const ORB_SIZE = 96;
export const ORB_HEIGHT = 122; // Includes the owner's under-mascot caption.
const MARGIN = 14;
export function orbDimensions(viewportWidth: number) {
  const width = viewportWidth <= 480 ? 84 : ORB_SIZE;
  return { width, height: width + (ORB_HEIGHT - ORB_SIZE) };
}
export type Dock = { side: "left" | "right"; ratio: number };
export type Point = { x: number; y: number };
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, Math.max(min, max)));
export function dockPosition(
  dock: Dock,
  width: number,
  height: number,
  leftBottomClearance = MARGIN,
  rightBottomClearance = MARGIN,
): Point {
  const size = orbDimensions(width);
  return {
    x: dock.side === "left" ? MARGIN : Math.max(MARGIN, width - size.width - MARGIN),
    y:
      MARGIN +
      clamp(dock.ratio, 0, 1) *
        Math.max(
          0,
          height -
            size.height -
            MARGIN -
            (dock.side === "left" ? leftBottomClearance : rightBottomClearance),
        ),
  };
}
export function snapDock(
  point: Point,
  width: number,
  height: number,
  leftBottomClearance = MARGIN,
  rightBottomClearance = MARGIN,
): Dock {
  const size = orbDimensions(width);
  const side = point.x + size.width / 2 < width / 2 ? "left" : "right";
  return {
    side,
    ratio: clamp(
      (point.y - MARGIN) /
        Math.max(
          1,
          height -
            size.height -
            MARGIN -
            (side === "left" ? leftBottomClearance : rightBottomClearance),
        ),
      0,
      1,
    ),
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
