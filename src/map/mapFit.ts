type FitCoordinate = {
  latitude: number;
  longitude: number;
};

type FitPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type MapFitState = {
  lastFitSignature: string | null;
};

type MapFitInput = {
  fitSignature: string | null;
  isMapReady: boolean;
  layoutWidth: number;
  layoutHeight: number;
};

export const initialMapFitState: MapFitState = {
  lastFitSignature: null,
};

export function createMapFitSignature(
  coordinates: readonly FitCoordinate[] | undefined,
  padding: FitPadding | undefined,
): string | null {
  if (
    !coordinates?.length ||
    !coordinates.every(
      ({ latitude, longitude }) =>
        Number.isFinite(latitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        Number.isFinite(longitude) &&
        longitude >= -180 &&
        longitude <= 180,
    )
  ) {
    return null;
  }

  const resolvedPadding = padding ?? { top: 0, right: 0, bottom: 0, left: 0 };
  if (
    !Object.values(resolvedPadding).every(
      (value) => Number.isFinite(value) && value >= 0,
    )
  ) {
    return null;
  }

  return JSON.stringify([
    coordinates.flatMap(({ latitude, longitude }) => [latitude, longitude]),
    [
      resolvedPadding.top,
      resolvedPadding.right,
      resolvedPadding.bottom,
      resolvedPadding.left,
    ],
  ]);
}

export function advanceMapFitState(
  state: MapFitState,
  input: MapFitInput,
): { state: MapFitState; shouldFit: boolean } {
  if (input.fitSignature === null) {
    return {
      state:
        state.lastFitSignature === null
          ? state
          : { lastFitSignature: null },
      shouldFit: false,
    };
  }

  const shouldFit =
    input.isMapReady &&
    input.layoutWidth > 0 &&
    input.layoutHeight > 0 &&
    input.fitSignature !== state.lastFitSignature;

  if (!shouldFit) {
    return { state, shouldFit: false };
  }

  return {
    state: { lastFitSignature: input.fitSignature },
    shouldFit: true,
  };
}
