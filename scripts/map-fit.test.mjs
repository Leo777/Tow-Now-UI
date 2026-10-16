import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  advanceMapFitState,
  createMapFitSignature,
  initialMapFitState,
} from "../src/map/mapFit.ts";

const coordinates = [
  { latitude: 50.063, longitude: 19.935 },
  { latitude: 50.0617, longitude: 19.9373 },
];
const padding = { top: 80, right: 24, bottom: 360, left: 24 };

test("delayed map readiness and layout permit exactly one fit", () => {
  const fitSignature = createMapFitSignature(coordinates, padding);
  let state = initialMapFitState;

  let transition = advanceMapFitState(state, {
    fitSignature,
    isMapReady: false,
    layoutWidth: 0,
    layoutHeight: 0,
  });
  assert.equal(transition.shouldFit, false);
  state = transition.state;

  transition = advanceMapFitState(state, {
    fitSignature,
    isMapReady: true,
    layoutWidth: 0,
    layoutHeight: 600,
  });
  assert.equal(transition.shouldFit, false);
  state = transition.state;

  transition = advanceMapFitState(state, {
    fitSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  assert.equal(transition.shouldFit, true);
  state = transition.state;

  transition = advanceMapFitState(state, {
    fitSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  assert.equal(transition.shouldFit, false);
});

test("unchanged numeric fit values do not refit on animation renders", () => {
  const firstSignature = createMapFitSignature(coordinates, padding);
  const equivalentSignature = createMapFitSignature(
    coordinates.map((coordinate) => ({ ...coordinate })),
    { ...padding },
  );
  const firstFit = advanceMapFitState(initialMapFitState, {
    fitSignature: firstSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  const animationRender = advanceMapFitState(firstFit.state, {
    fitSignature: equivalentSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });

  assert.equal(firstSignature, equivalentSignature);
  assert.equal(firstFit.shouldFit, true);
  assert.equal(animationRender.shouldFit, false);
});

test("changed coordinates or numeric padding permit a new fit", () => {
  const firstSignature = createMapFitSignature(coordinates, padding);
  const firstFit = advanceMapFitState(initialMapFitState, {
    fitSignature: firstSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  const coordinateChange = advanceMapFitState(firstFit.state, {
    fitSignature: createMapFitSignature(
      [...coordinates, { latitude: 50.0616, longitude: 19.9372 }],
      padding,
    ),
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  const paddingChange = advanceMapFitState(coordinateChange.state, {
    fitSignature: createMapFitSignature(coordinates, {
      ...padding,
      bottom: 400,
    }),
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });

  assert.equal(coordinateChange.shouldFit, true);
  assert.equal(paddingChange.shouldFit, true);
});

test("clearing fit coordinates permits the same bounds after retry", () => {
  const fitSignature = createMapFitSignature(coordinates, padding);
  const firstFit = advanceMapFitState(initialMapFitState, {
    fitSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  const loading = advanceMapFitState(firstFit.state, {
    fitSignature: null,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });
  const retrySuccess = advanceMapFitState(loading.state, {
    fitSignature,
    isMapReady: true,
    layoutWidth: 390,
    layoutHeight: 600,
  });

  assert.equal(loading.shouldFit, false);
  assert.equal(retrySuccess.shouldFit, true);
});

test("map fit helper stays alias-free for direct pure tests", async () => {
  const source = await readFile(
    new URL("../src/map/mapFit.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(source, /from\s+["']@\//);
});
