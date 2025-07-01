import type { NodeInfo, Placement } from "@cmumaps/common";
import { extractBuildingCode, extractFloorLevel } from "@cmumaps/common";

import { prisma } from "../prisma";
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

  async getNodes() {
    const dbNodes = await prisma.node.findMany({
      include: {
        outEdges: true,
      },
    });

    const nodes = {};
    for (const dbNode of dbNodes) {
      (nodes as any)[dbNode.nodeId] = {
        id: dbNode.nodeId,
        roomId: dbNode.roomId,
        latitude: dbNode.latitude,
        longitude: dbNode.longitude,
        buildingCode: dbNode.buildingCode,
        floorLevel: dbNode.floorLevel,
        neighbors: dbNode.outEdges.map((edge) => edge.outNodeId),
      };
    }
    return nodes;
  },
};
