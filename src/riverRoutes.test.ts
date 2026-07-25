import { describe, expect, it } from "vitest";
import {
  RIVER_ROUTES,
  RIVER_ROUTE_SAFE_BOUNDS,
  type RiverRoute,
} from "./riverRoutes";
import type { MapPoint } from "./types";

function routePoints(route: RiverRoute): MapPoint[] {
  return [
    ...route.points,
    route.labelAt,
    ...route.branches.flatMap((branch) => [
      ...branch.points,
      ...(branch.labelAt ? [branch.labelAt] : []),
    ]),
  ];
}

describe("river routes", () => {
  it("defines a complete route for every river in the ready set", () => {
    expect(Object.keys(RIVER_ROUTES)).toHaveLength(17);

    Object.entries(RIVER_ROUTES).forEach(([id, route]) => {
      expect(route.id).toBe(id);
      expect(route.points.length).toBeGreaterThanOrEqual(2);
      expect(route.points.at(0)).not.toEqual(route.points.at(-1));
    });
  });

  it("keeps every route and label inside the map's safe coordinate area", () => {
    Object.entries(RIVER_ROUTES).forEach(([id, route]) => {
      routePoints(route).forEach((point) => {
        expect(point.x, `${id} x=${point.x}`).toBeGreaterThanOrEqual(
          RIVER_ROUTE_SAFE_BOUNDS.minX,
        );
        expect(point.x, `${id} x=${point.x}`).toBeLessThanOrEqual(
          RIVER_ROUTE_SAFE_BOUNDS.maxX,
        );
        expect(point.y, `${id} y=${point.y}`).toBeGreaterThanOrEqual(
          RIVER_ROUTE_SAFE_BOUNDS.minY,
        );
        expect(point.y, `${id} y=${point.y}`).toBeLessThanOrEqual(
          RIVER_ROUTE_SAFE_BOUNDS.maxY,
        );
      });
    });
  });
});
