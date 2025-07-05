import type {
  GeoCoordinate,
  PdfCoordinate,
  Placement,
  Polygon,
} from "@cmumaps/common";

// The number of meters in a degree.
// //Values computed for the Pittsburgh region using https://stackoverflow.com/a/51765950/4652564
const latitudeRatio = 111318.8450631976;
const longitudeRatio = 84719.3945182816;

/**
 * Converts PDF coordinates (x/y) to geographical coordinates (latitude/longitude)
 * @param pdfCoords - Object containing x and y PDF coordinates
 * @param geoCenter - Object containing center latitude and longitude
 * @param pdfCenter - Object containing center x and y coordinates
 * @param scale - Scale factor used in the conversion
 * @param angle - Rotation angle in radians
 * @returns Object with latitude and longitude geographical coordinates
 */
export const pdfCoordsToGeoCoords =
  ({ geoCenter, pdfCenter, scale, angle }: Placement) =>
  (pdfCoords: PdfCoordinate): GeoCoordinate => {
    const { x, y } = pdfCoords;

    // Apply translation
    const translatedX = x - pdfCenter.x;
    const translatedY = y - pdfCenter.y;

    // Apply rotation
    // We have to swap x and y because in Konva the y-axis is inverted
    const { x: ry, y: rx } = rotate(translatedX, translatedY, angle);

    // Apply scaling
    const scaledX = rx / scale;
    const scaledY = ry / scale;

    // Convert to geographical coordinates
    const longitude = scaledX / longitudeRatio + geoCenter.longitude;
    const latitude = scaledY / latitudeRatio + geoCenter.latitude;

    return { latitude, longitude };
  };

/**
 * Converts geographical coordinates (latitude/longitude) to PDF coordinates (x/y)
 * @param geoCoords - Object containing latitude and longitude
 * @param placement - Object containing center, scale, and angle
 * @param center - Tuple containing x and y coordinates of the center
 * @returns Object with x and y PDF coordinates
 */
export const geoCoordsToPdfCoords =
  ({ geoCenter, pdfCenter, scale, angle }: Placement) =>
  (geoCoords: GeoCoordinate): PdfCoordinate => {
    const { latitude, longitude } = geoCoords;

    // reverse the transform and scale
    const x = (longitude - geoCenter.longitude) * longitudeRatio * scale;
    const y = (latitude - geoCenter.latitude) * latitudeRatio * scale;

    // reverse the rotation
    // We have to swap x and y to make this function the inverse of pdfCoordsToGeoCoords
    const pos = rotate(y, x, -angle);

    // reverse the translation
    pos.x += pdfCenter.x;
    pos.y += pdfCenter.y;
    return pos;
  };

/**
 * Based on https://stackoverflow.com/a/17411276/4652564
 * Rotates a point around the origin by the given angle clockwise
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param angle - Angle in radians
 * @returns Tuple containing rotated x and y coordinates
 */
function rotate(x: number, y: number, angle: number): PdfCoordinate {
  const radians = (Math.PI / 180) * angle;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * x + sin * y;
  const ny = cos * y - sin * x;
  return { x: nx, y: ny };
}

export const pdfPolygonToGeoPolygon = (
  pdfPolygon: Polygon,
  placement: Placement,
): GeoCoordinate[][] => {
  return pdfPolygon.coordinates.map((ring) =>
    ring.map((coords) =>
      pdfCoordsToGeoCoords(placement)({ x: coords[0], y: coords[1] }),
    ),
  );
};

export const geoPolygonToPdfPolygon = (
  geoPolygon: GeoCoordinate[][],
  placement: Placement,
): Polygon => {
  return {
    type: "Polygon",
    coordinates: geoPolygon.map((ring) =>
      ring.map((coords) =>
        Object.values(
          geoCoordsToPdfCoords(placement)({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        ),
      ),
    ),
  };
};
