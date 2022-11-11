/**
 * Return the distance in meters between the two given coordinates
 * @param {*} coord1
 * @param {*} coord2
 * @returns distance in meters
 */
export const coordinatesDistance = (coord1, coord2) => {
  // meters
  const R = 6371e3;
  const φ1 = coord1.latitude * Math.PI / 180;
  const φ2 = coord2.latitude * Math.PI / 180;
  const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

  const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) + (Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
};
