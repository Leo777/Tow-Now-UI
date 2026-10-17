import assert from "node:assert/strict";
import test from "node:test";

import {
  isSheetDrag,
  sheetDragOffset,
  sheetExpandedAfterDrag,
} from "../src/components/sheetSnap.ts";

test("only a mostly vertical move past the slop starts a drag", () => {
  assert.equal(isSheetDrag(0, 4), false);
  assert.equal(isSheetDrag(30, 12), false);
  assert.equal(isSheetDrag(2, -12), true);
});

test("the sheet follows the finger towards the other state and barely the wrong way", () => {
  assert.equal(sheetDragOffset(120, true), 120);
  assert.equal(sheetDragOffset(-120, true), -24);
  assert.equal(sheetDragOffset(-120, false), -120);
  assert.equal(sheetDragOffset(120, false), 24);
});

test("a long drag or a flick switches the sheet; a short slow drag does not", () => {
  assert.equal(sheetExpandedAfterDrag(60, 0, true), false);
  assert.equal(sheetExpandedAfterDrag(-60, 0, false), true);
  assert.equal(sheetExpandedAfterDrag(20, 0.9, true), false);
  assert.equal(sheetExpandedAfterDrag(-20, -0.9, false), true);
  assert.equal(sheetExpandedAfterDrag(20, 0.1, true), true);
  assert.equal(sheetExpandedAfterDrag(-20, -0.1, false), false);
});

test("dragging the wrong way keeps the state", () => {
  assert.equal(sheetExpandedAfterDrag(-80, -1, true), true);
  assert.equal(sheetExpandedAfterDrag(80, 1, false), false);
});
