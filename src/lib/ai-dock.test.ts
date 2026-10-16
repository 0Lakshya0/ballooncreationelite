import { expect, it } from "vitest";
import { dockPosition, readDock, snapDock } from "./ai-dock";
it("snaps to the nearest side while preserving vertical placement", () => {
  const left = snapDock({ x: 30, y: 235 }, 390, 844);
  expect(left.side).toBe("left");
  expect(dockPosition(left, 390, 844)).toEqual({ x: 14, y: 235 });
  const right = snapDock({ x: 290, y: 235 }, 390, 844);
  expect(right.side).toBe("right");
  expect(dockPosition(right, 390, 844)).toEqual({ x: 312, y: 235 });
});
it("clamps out-of-viewport positions and malformed stored state", () => {
  const bottom = dockPosition(snapDock({ x: 2000, y: 4000 }, 320, 568), 320, 568);
  expect(bottom).toEqual({ x: 242, y: 490 });
  localStorage.setItem("bce-ai-orb-position", '{"side":"left","ratio":999}');
  expect(readDock()).toEqual({ side: "left", ratio: 1 });
  localStorage.setItem("bce-ai-orb-position", "{");
  expect(readDock().side).toBe("right");
});
it("keeps a remembered side and relative height when orientation changes", () => {
  const point = dockPosition({ side: "left", ratio: 0.5 }, 844, 390);
  expect(point).toEqual({ x: 14, y: 163 });
});
