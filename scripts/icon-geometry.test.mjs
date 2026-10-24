import assert from "node:assert/strict";
import test from "node:test";

import { CHECK_POINTS, CHEVRON_POINTS, strokeStyle } from "../src/components/iconGeometry.ts";

// The stroke's end points, back from its absolute box and rotation.
function ends(style) {
  const angle = (Number.parseFloat(style.transform[0].rotate) * Math.PI) / 180;
  const half = (style.width - style.height) / 2;
  const cx = style.left + style.width / 2;
  const cy = style.top + style.height / 2;
  return [
    [cx - half * Math.cos(angle), cy - half * Math.sin(angle)],
    [cx + half * Math.cos(angle), cy + half * Math.sin(angle)],
  ];
}

function near(actual, expected) {
  assert.ok(Math.abs(actual[0] - expected[0]) < 1e-9 && Math.abs(actual[1] - expected[1]) < 1e-9,
    `${actual} != ${expected}`);
}

test("a stroke runs exactly between its two points", () => {
  for (const [from, to] of [[[0, 0], [10, 0]], [[8.5, 5], [15.5, 12]], [[15.5, 12], [8.5, 19]]]) {
    const [a, b] = ends(strokeStyle(from, to));
    near(a, from);
    near(b, to);
  }
});

test("chevron and check strokes share their joint", () => {
  for (const points of [CHEVRON_POINTS, CHECK_POINTS]) {
    const first = ends(strokeStyle(points[0], points[1]));
    const second = ends(strokeStyle(points[1], points[2]));
    near(first[1], second[0]);
  }
});

test("glyphs stay inside the 24 × 24 box, caps included", () => {
  for (const points of [CHEVRON_POINTS, CHECK_POINTS]) {
    for (const [x, y] of points) {
      assert.ok(x >= 1 && x <= 23 && y >= 1 && y <= 23, `${x},${y}`);
    }
  }
});
