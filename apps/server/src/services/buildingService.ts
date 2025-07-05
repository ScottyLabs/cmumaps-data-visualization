import {
  type BuildingMetadata,
  type Buildings,
  ERROR_CODES,
  type GeoCoordinate,
} from "@cmumaps/common";
import { prisma } from "../../prisma";
import { BuildingError } from "../errors/error";

export const buildingService = {
  async getBuildings(): Promise<Buildings> {
    // get all buildings and their floors and default floor
    const dbBuildings = await prisma.building.findMany({
      include: { floors: true },
    });

    const buildings: Buildings = {};
    for (const dbBuilding of dbBuildings) {
      buildings[dbBuilding.buildingCode] = {
        code: dbBuilding.buildingCode,
        name: dbBuilding.name,
        defaultOrdinal: dbBuilding.defaultOrdinal,
        defaultFloor:
          dbBuilding.floors.find((floor) => floor.isDefault)?.floorLevel ??
          null,
        labelLatitude: dbBuilding.labelLatitude,
        labelLongitude: dbBuilding.labelLongitude,
        shape: dbBuilding.shape as unknown as GeoCoordinate[][],
        hitbox: dbBuilding.hitbox as unknown as GeoCoordinate[],
        floors: this.sortFloors(
          dbBuilding.floors.map((floor) => floor.floorLevel),
        ),
        // TODO: need to add isMapped field to the database
        isMapped: true,
      };
    }
    return buildings;
  },

  async getBuildingsMetadata(): Promise<BuildingMetadata[]> {
    const buildings = await prisma.building.findMany({
      select: {
        buildingCode: true,
        name: true,
        floors: { select: { isDefault: true, floorLevel: true } },
      },
    });
    return buildings
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((building) => {
        return {
          buildingCode: building.buildingCode,
          name: building.name,
          defaultFloor:
            building.floors.find((floor) => floor.isDefault)?.floorLevel ??
            null,
        };
      });
  },

  async getBuildingName(buildingCode: string) {
    const building = await prisma.building.findUnique({
      where: { buildingCode },
      select: { name: true },
    });
    return building?.name;
  },

  async getDefaultFloor(buildingCode: string) {
    const floor = await prisma.floor.findFirst({
      where: { buildingCode, isDefault: true },
    });

    if (!floor) {
      throw new BuildingError(ERROR_CODES.NO_DEFAULT_FLOOR);
    }

    return floor.floorLevel;
  },

  sortFloors(floors: string[]) {
    const floorCodeOrder = [
      "PH",
      "9",
      "8",
      "7",
      "6",
      "5",
      "4",
      "3",
      "2",
      "M",
      "1",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "LL",
      "EV",
    ];
    const floorLevelSort = (f1: string, f2: string) => {
      return floorCodeOrder.indexOf(f2) - floorCodeOrder.indexOf(f1);
    };

    return floors.sort(floorLevelSort);
  },

  async getBuildingFloors(buildingCode: string) {
    const floors = await prisma.floor.findMany({
      where: { buildingCode },
      select: { floorLevel: true },
    });

    return this.sortFloors(floors.map((floor) => floor.floorLevel));
  },
};
