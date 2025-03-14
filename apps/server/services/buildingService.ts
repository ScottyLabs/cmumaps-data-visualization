import { prisma } from "../index";
import { BuildingError } from "../errors/error";
import { ERROR_CODES } from "@cmumaps/common";

export const buildingService = {
  async getAllBuildingCodesAndNames() {
    const buildings = await prisma.building.findMany({
      select: { buildingCode: true, name: true },
    });
    return buildings.sort((a, b) => a.name.localeCompare(b.name));
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

  async getBuildingFloors(buildingCode: string) {
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

    const floors = await prisma.floor.findMany({
      where: { buildingCode },
      select: { floorLevel: true },
    });

    const floorLevelSort = (f1: string, f2: string) => {
      return floorCodeOrder.indexOf(f2) - floorCodeOrder.indexOf(f1);
    };

    return floors.map((floor) => floor.floorLevel).sort(floorLevelSort);
  },
};
