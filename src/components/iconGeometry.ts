/**
 * Strokes for the View-drawn glyphs, placed by their end points so the joints
 * of a chevron or a check meet exactly. Pure, so the node tests load it.
 */

export type Point = readonly [x: number, y: number];

/** Absolute style for a rounded stroke from `from` to `to`, `width` thick. */
export function strokeStyle(from: Point, to: Point, width = 2) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Caps of half the width at each end, so strokes sharing a point overlap.
  const length = Math.hypot(dx, dy) + width;

  return {
    borderRadius: width / 2,
    height: width,
    left: (x1 + x2) / 2 - length / 2,
    position: "absolute" as const,
    top: (y1 + y2) / 2 - width / 2,
    transform: [{ rotate: `${(Math.atan2(dy, dx) * 180) / Math.PI}deg` }],
    width: length,
  };
}

/** Disclosure chevron in a 24 × 24 box, pointing right. */
export const CHEVRON_POINTS: readonly Point[] = [
  [8.5, 5],
  [15.5, 12],
  [8.5, 19],
];

/** Check mark in a 24 × 24 box. */
export const CHECK_POINTS: readonly Point[] = [
  [5, 12.5],
  [10, 17.5],
  [19, 7.5],
];
