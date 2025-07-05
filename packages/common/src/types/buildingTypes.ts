import type { GeoCoordinate, PdfCoordinate } from "./coordTypes";

export type BuildingMetadata = {
  buildingCode: string;
  name: string;
  defaultFloor: string | null;
};

export interface Building {
  code: string;
  name: string;
  isMapped: boolean;
  defaultOrdinal: number | null;
  defaultFloor: string | null;
  floors: string[];
  labelLatitude: number;
  labelLongitude: number;
  shape: GeoCoordinate[][];
  hitbox: GeoCoordinate[];
}

export interface Placement {
  geoCenter: GeoCoordinate;
  pdfCenter: PdfCoordinate;
  scale: number;
  angle: number;
}

export type Buildings = Record<string, Building>;
