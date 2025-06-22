import {
  extractBuildingCode,
  extractFloorLevel,
  type GeoCoordinate,
  type Placement,
  type RoomInfo,
} from "@cmumaps/common";

import type { InputJsonValue } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import {
  pdfCoordsToGeoCoords,
  pdfPolygonToGeoPolygon,
} from "../utils/coordinates";

export const roomService = {
  createRoom: async (
    floorCode: string,
    roomId: string,
    roomNodes: string[],
    roomInfo: RoomInfo,
    placement: Placement,
  ) => {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const { labelPosition, polygon } = roomInfo;
    const geoCoords = pdfCoordsToGeoCoords(placement)(labelPosition);
    const geoPolygon = pdfPolygonToGeoPolygon(polygon, placement);

    // also need to add room id to every node in this room
    await prisma.$transaction(async (tx) => {
      await prisma.room.create({
        data: {
          roomId,
          type: roomInfo.type,
          buildingCode,
          floorLevel,
          name: roomInfo.name,
          labelLatitude: geoCoords.latitude,
          labelLongitude: geoCoords.longitude,
          polygon: geoPolygon as unknown as InputJsonValue,
        },
      });

      for (const nodeId of roomNodes) {
        await tx.node.update({
          where: { nodeId },
          data: { roomId },
        });
      }
    });
  },

  deleteRoom: async (roomId: string) => {
    await prisma.$transaction(async (tx) => {
      await tx.room.delete({
        where: { roomId },
      });
    });
  },

  updateRoom: async (
    roomId: string,
    roomInfo: Partial<RoomInfo>,
    placement: Placement,
  ) => {
    const { labelPosition, polygon } = roomInfo;
    const geoCoords = labelPosition
      ? pdfCoordsToGeoCoords(placement)(labelPosition)
      : undefined;

    const geoPolygon = polygon
      ? pdfPolygonToGeoPolygon(polygon, placement)
      : undefined;

    const data = {
      name: roomInfo.name,
      labelLatitude: geoCoords?.latitude,
      labelLongitude: geoCoords?.longitude,
      polygon: geoPolygon as InputJsonValue | undefined,
    };

    await prisma.room.update({
      where: { roomId },
      data,
    });
  },

  async getRoomIds(floorCode: string) {
    const buildingCode = extractBuildingCode(floorCode);
    const floorLevel = extractFloorLevel(floorCode);

    const rooms = await prisma.room.findMany({
      where: {
        buildingCode: buildingCode,
        floorLevel: floorLevel,
      },
      select: {
        roomId: true,
      },
    });

    return rooms.map((room) => room.roomId);
  },

  async getRooms(roomId?: string) {
    // If a specific room ID is provided, find only that room.
    if (roomId) {
      const dbRoom = await prisma.room.findUnique({
        where: { roomId },
        include: {
          aliases: true,
        },
      });

      // If no room is found with that ID, return an empty object.
      if (!dbRoom) {
        return {};
      }

      // Return an object containing only the single requested room.
      return {
        [dbRoom.roomId]: {
          id: dbRoom.roomId,
          name: dbRoom.name,
          type: dbRoom.type,
          labelLatitude: dbRoom.labelLatitude,
          labelLongitude: dbRoom.labelLongitude,
          polygon: dbRoom.polygon as unknown as GeoCoordinate[][],
          buildingCode: dbRoom.buildingCode,
          floorLevel: dbRoom.floorLevel,
          aliases: dbRoom.aliases.map((alias) => alias.alias),
          displayAlias:
            dbRoom.aliases.find((alias) => alias.isDisplayAlias)?.alias ?? null,
        },
      };
    } else {
      // If no ID is provided, get all rooms (original behavior).
      const dbRooms = await prisma.room.findMany({
        include: {
          aliases: true,
        },
      });

      const rooms = {};
      for (const dbRoom of dbRooms) {
        (rooms as any)[dbRoom.roomId] = {
          id: dbRoom.roomId,
          name: dbRoom.name,
          type: dbRoom.type,
          labelLatitude: dbRoom.labelLatitude,
          labelLongitude: dbRoom.labelLongitude,
          polygon: dbRoom.polygon as unknown as GeoCoordinate[][],
          buildingCode: dbRoom.buildingCode,
          floorLevel: dbRoom.floorLevel,
          aliases: dbRoom.aliases.map((alias) => alias.alias),
          displayAlias:
            dbRoom.aliases.find((alias) => alias.isDisplayAlias)?.alias ?? null,
        };
      }
      return rooms;
    }
  },
};
