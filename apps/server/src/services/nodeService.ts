import type { NodeInfo, Placement } from "@cmumaps/common";
import { extractBuildingCode, extractFloorLevel } from "@cmumaps/common";

import { prisma } from "../../prisma";
import { pdfCoordsToGeoCoords } from "../utils/coordinates";

export const nodeService = {
  upsertNode: async (
    floorCode: string,
    nodeId: string,
    nodeInfo: NodeInfo,
    placement: Placement,
  ) => {
    const { pos, roomId } = nodeInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(pos);

    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const data = {
      ...geoCoords,
      buildingCode,
      floorLevel,
      ...(roomId ? { roomId } : {}),
    };

    await prisma.node.upsert({
      where: { nodeId },
      create: {
        nodeId,
        ...data,
      },
      update: data,
    });
  },

  deleteNode: async (nodeId: string) => {
    await prisma.node.delete({ where: { nodeId } });
  },
};
