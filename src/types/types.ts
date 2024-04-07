export type Feature = {
  properties: {
    meters: number;
    latitude: number;
    longitude: number;
    name: string;
  };
};

export type MarkerInfo = {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
};

export type MapFeature = {
  altitude: number;
  latitude: number;
  longitude: number;
  name: string;
};
