import type { Request, Response } from "express";
import { webSocketService } from "../../index";
import { handleControllerError } from "../errors/errorHandler";
import { floorService } from "../services/floorService";
import { roomService } from "../services/roomService";

export const roomController = {
  createRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const { floorCode, roomNodes, roomInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.createRoom(
        floorCode,
        roomId,
        roomNodes,
        roomInfo,
        placement,
      );
      const payload = { roomId, roomNodes, roomInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating room");
    }
  },

  deleteRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const socketId = req.socketId;

    try {
      await roomService.deleteRoom(roomId);
      const payload = { roomId };
      webSocketService.broadcastToUserFloor(socketId, "delete-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting room");
    }
  },

  updateRoom: async (req: Request, res: Response) => {
    const roomId = req.params.id;
    const { floorCode, roomInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await roomService.updateRoom(roomId, roomInfo, placement);
      const payload = { roomId, roomInfo };
      webSocketService.broadcastToUserFloor(socketId, "update-room", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating room");
    }
  },
};
