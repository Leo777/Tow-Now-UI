/**
 * Drag maths for the collapsible bottom sheet. Pure, so the node tests load it.
 */

/** Movement before the handle claims a vertical drag (taps stay taps). */
export const SHEET_DRAG_SLOP = 8;
/** A drag this long switches the sheet, whatever its speed. */
export const SHEET_SNAP_DISTANCE = 40;
/** A flick this fast (px/ms) switches the sheet even when short. */
export const SHEET_SNAP_VELOCITY = 0.5;
/** How far the sheet follows a drag the wrong way before it stops. */
export const SHEET_OVERDRAG = 24;

/** True when the gesture is mostly vertical and past the slop. */
export function isSheetDrag(dx: number, dy: number) {
  return Math.abs(dy) > SHEET_DRAG_SLOP && Math.abs(dy) > Math.abs(dx);
}

/**
 * Where the sheet sits while the finger moves (positive = down). An expanded
 * sheet follows the finger down; a compact one follows it up. The other way it
 * gives a little and stops.
 */
export function sheetDragOffset(dy: number, expanded: boolean) {
  return expanded
    ? Math.max(-SHEET_OVERDRAG, dy)
    : Math.min(SHEET_OVERDRAG, dy);
}

/** The state the sheet settles in when the finger lifts. */
export function sheetExpandedAfterDrag(dy: number, vy: number, expanded: boolean) {
  const towardsCompact = dy > SHEET_SNAP_DISTANCE || (dy > SHEET_DRAG_SLOP && vy > SHEET_SNAP_VELOCITY);
  const towardsExpanded =
    dy < -SHEET_SNAP_DISTANCE || (dy < -SHEET_DRAG_SLOP && vy < -SHEET_SNAP_VELOCITY);

  if (expanded && towardsCompact) {
    return false;
  }

  if (!expanded && towardsExpanded) {
    return true;
  }

  return expanded;
}
