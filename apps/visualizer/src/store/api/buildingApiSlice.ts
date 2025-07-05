import type { BuildingMetadata } from "@cmumaps/common";
import { apiSlice } from "./apiSlice";

export const buildingApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBuildingsMetadata: builder.query<BuildingMetadata[], void>({
      query: () => "buildings/metadata",
    }),
    getBuildingName: builder.query<string, string>({
      query: (id) => `buildings/${id}/name`,
    }),
    getDefaultFloor: builder.query<string, string>({
      query: (id) => `buildings/${id}/defaultFloor`,
    }),
    getBuildingFloors: builder.query<string[], string>({
      query: (id) => `buildings/${id}/floors`,
    }),
  }),
});

export const {
  useGetBuildingsMetadataQuery,
  useGetBuildingNameQuery,
  useGetDefaultFloorQuery,
  useGetBuildingFloorsQuery,
} = buildingApiSlice;
