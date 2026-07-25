import type { MapPoint } from "./types";

const ARROW_TIP_EXTENSION = 7;
const ARROW_HEAD_LENGTH = 16;
const ARROW_HEAD_HALF_WIDTH = 7;

export function getArrowGeometry(first: MapPoint, last: MapPoint) {
  const deltaX = last.x - first.x;
  const deltaY = last.y - first.y;
  const length = Math.hypot(deltaX, deltaY);
  const unitX = length > 0 ? deltaX / length : 1;
  const unitY = length > 0 ? deltaY / length : 0;
  const normalX = unitY;
  const normalY = -unitX;
  const tip = {
    x: last.x + unitX * ARROW_TIP_EXTENSION,
    y: last.y + unitY * ARROW_TIP_EXTENSION,
  };
  const baseCenter = {
    x: tip.x - unitX * ARROW_HEAD_LENGTH,
    y: tip.y - unitY * ARROW_HEAD_LENGTH,
  };

  return {
    tip,
    baseCenter,
    left: {
      x: baseCenter.x + normalX * ARROW_HEAD_HALF_WIDTH,
      y: baseCenter.y + normalY * ARROW_HEAD_HALF_WIDTH,
    },
    right: {
      x: baseCenter.x - normalX * ARROW_HEAD_HALF_WIDTH,
      y: baseCenter.y - normalY * ARROW_HEAD_HALF_WIDTH,
    },
  };
}
