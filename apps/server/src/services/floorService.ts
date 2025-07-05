import type {
  EdgeInfo,
  GeoCoordinate,
  GeoRooms,
  Graph,
  Placement,
  Pois,
  PoiType,
  Rooms,
  RoomType,
} from "@cmumaps/common";
import { extractBuildingCode, extractFloorLevel } from "@cmumaps/common";

import { prisma } from "../../prisma";
import {
  geoCoordsToPdfCoords,
  geoPolygonToPdfPolygon,
} from "../utils/coordinates";

export const floorService = {
  getFloorGraph: async (floorCode: string, placement: Placement) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

    // Get all nodes on the floor with their neighbors
    const dbNodes = await prisma.node.findMany({
      where: { buildingCode, floorLevel },
      // include the out floor code of each neighbor
      // include the element of each node (both in and out)
      include: {
        outEdges: {
          include: {
            outNode: {
              select: {
                buildingCode: true,
                floorLevel: true,
              },
            },
          },
        },
      },
    });

    // Convert the nodes to the format expected by the frontend
    const nodes: Graph = {};
    for (const node of dbNodes) {
      // Convert the node's geo position to PDF position
      const position = {
        latitude: node.latitude,
        longitude: node.longitude,
      };
      const pos = geoCoordsToPdfCoordsHelper(position);

      // Create a mapping of neighbor node strings to edge info
      const neighbors: Record<string, EdgeInfo> = {};
      for (const edge of node.outEdges) {
        const outNode = edge.outNode;

        // Determine if cross floor edge
        const outFloorCode = `${outNode.buildingCode}-${outNode.floorLevel}`;
        neighbors[edge.outNodeId] = {};
        if (outFloorCode !== floorCode) {
          neighbors[edge.outNodeId].outFloorCode = outFloorCode;
        }
      }

      nodes[node.nodeId] = { pos, neighbors, roomId: node.roomId };
    }

    return nodes;
  },

  getFloorRooms: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const placement = await floorService.getFloorPlacement(floorCode);
    const geoCoordsToPdfCoordsHelper = geoCoordsToPdfCoords(placement);

    // Get all rooms on the floor from the database
    const dbRooms = await prisma.room.findMany({
      where: {
        buildingCode: buildingCode,
        floorLevel: floorLevel,
      },
      include: {
        aliases: true,
      },
    });

    // Convert the rooms to the format expected by the frontend
    const rooms: Rooms = {};
    for (const room of dbRooms) {
      rooms[room.roomId] = {
        name: room.name,
        labelPosition: geoCoordsToPdfCoordsHelper({
          latitude: room.labelLatitude,
          longitude: room.labelLongitude,
        }),
        type: room.type as RoomType,
        displayAlias: room.aliases.filter((a) => a.isDisplayAlias)[0]?.alias,
        aliases: room.aliases.map((a) => a.alias),
        polygon: geoPolygonToPdfPolygon(
          room.polygon as unknown as GeoCoordinate[][],
          placement,
        ),
      };
    }

    return rooms;
  },

  getFloorPois: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const dbPois = await prisma.poi.findMany({
      where: {
        node: {
          buildingCode: buildingCode,
          floorLevel: floorLevel,
        },
      },
    });

    const pois: Pois = {};
    for (const poi of dbPois) {
      pois[poi.poiId] = { type: poi.type as PoiType, nodeId: poi.nodeId };
    }

    return pois;
  },

  getFloorPlacement: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const floor = await prisma.floor.findUnique({
      where: { buildingCode_floorLevel: { buildingCode, floorLevel } },
    });

    if (!floor) {
      throw new Error("Floor not found");
    }

    const geoCenter = {
      latitude: floor.centerLatitude,
      longitude: floor.centerLongitude,
    };
    const pdfCenter = { x: floor.centerX, y: floor.centerY };

    return {
      geoCenter,
      pdfCenter,
      scale: floor.scale,
      angle: floor.angle,
    };
  },

  getFloorplan: async (floorCode: string) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    // Get all rooms on the floor from the database
    const dbRooms = await prisma.room.findMany({
      where: {
        buildingCode: buildingCode,
        floorLevel: floorLevel,
      },
      include: {
        aliases: true,
      },
    });

    // Convert the rooms to the format expected by the frontend
    const rooms: GeoRooms = {};
    for (const room of dbRooms) {
      rooms[room.name] = {
        labelPosition: {
          latitude: room.labelLatitude,
          longitude: room.labelLongitude,
        },
        floor: { buildingCode, level: floorLevel },
        type: room.type as RoomType,
        alias: room.aliases.filter((a) => a.isDisplayAlias)[0]?.alias,
        points: room.polygon as unknown as GeoCoordinate[][],
      };
    }

    return rooms;
  },
};
