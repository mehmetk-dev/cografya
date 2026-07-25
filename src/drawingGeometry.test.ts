import { describe, expect, it } from "vitest";
import { getArrowGeometry } from "./drawingGeometry";

describe("getArrowGeometry", () => {
  it("ok ucunu bırakılan noktanın biraz ilerisine taşır", () => {
    const geometry = getArrowGeometry(
      { x: 10, y: 20 },
      { x: 110, y: 20 },
    );

    expect(geometry.tip).toEqual({ x: 117, y: 20 });
    expect(geometry.baseCenter.x).toBeLessThan(110);
    expect(geometry.left.y).toBeLessThan(20);
    expect(geometry.right.y).toBeGreaterThan(20);
  });

  it("dikey ve sıfır uzunluklu oklarda geçerli koordinatlar üretir", () => {
    const vertical = getArrowGeometry(
      { x: 30, y: 80 },
      { x: 30, y: 20 },
    );
    const stationary = getArrowGeometry(
      { x: 42, y: 42 },
      { x: 42, y: 42 },
    );

    expect(vertical.tip).toEqual({ x: 30, y: 13 });
    expect(Object.values(stationary).flatMap(({ x, y }) => [x, y]))
      .toSatisfy((values: number[]) => values.every(Number.isFinite));
  });
});
