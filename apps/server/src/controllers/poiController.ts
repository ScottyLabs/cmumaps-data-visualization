import type { Request, Response } from "express";
import { webSocketService } from "../../index";
import { handleControllerError } from "../errors/errorHandler";
import { poiService } from "../services/poiService";

export const poiController = {
  createPoi: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const { poiInfo } = req.body;
    const socketId = req.socketId;

    try {
      await poiService.createPoi(poiId, poiInfo);
      const payload = { poiId, poiInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating POI");
    }
  },

  deletePoi: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const socketId = req.socketId;

    try {
      await poiService.deletePoi(poiId);
      const payload = { poiId };
      webSocketService.broadcastToUserFloor(socketId, "delete-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting POI");
    }
  },

  updatePoiType: async (req: Request, res: Response) => {
    const poiId = req.params.id;
    const { poiType } = req.body;
    const socketId = req.socketId;

    try {
      await poiService.updatePoiType(poiId, poiType);
      const payload = { poiId, poiType };
      webSocketService.broadcastToUserFloor(socketId, "update-poi", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating POI");
    }
  },
};
