export type Coordinates = {
  latitude: number;
  longitude: number;
};

/** The part of an address the map needs; app address types are wider. */
export type MapPlace = {
  label: string;
  coordinates?: Coordinates;
};
