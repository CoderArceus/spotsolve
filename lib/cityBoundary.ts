export type BoundingBox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

const SUPPORTED_CITIES: Record<string, BoundingBox> = {
  patna: {
    minLat: 25.55,
    maxLat: 25.65,
    minLng: 85.05,
    maxLng: 85.25,
  },
  // Default bounds to allow testing outside Patna if needed (Delhi coords for testing)
  delhi: {
    minLat: 28.5,
    maxLat: 28.9,
    minLng: 77.0,
    maxLng: 77.4,
  }
};

export function isWithinSupportedCity(lat: number, lng: number): boolean {
  return Object.values(SUPPORTED_CITIES).some(
    (box) =>
      lat >= box.minLat &&
      lat <= box.maxLat &&
      lng >= box.minLng &&
      lng <= box.maxLng
  );
}
