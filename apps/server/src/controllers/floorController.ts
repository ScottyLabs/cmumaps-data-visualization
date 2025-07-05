import type { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { floorService } from "../services/floorService";

export const floorController = {
  getFloorGraph: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      const graph = await floorService.getFloorGraph(floorCode, placement);
      res.json(graph);
    } catch (error) {
      handleControllerError(res, error, "getting floor nodes");
    }
  },

  getFloorRooms: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const rooms = await floorService.getFloorRooms(floorCode);
      res.json(rooms);
    } catch (error) {
      handleControllerError(res, error, "getting floor rooms");
    }
  },

  getFloorPois: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const pois = await floorService.getFloorPois(floorCode);
      res.json(pois);
    } catch (error) {
      handleControllerError(res, error, "getting floor pois");
    }
  },

  getFloorplan: async (req: Request, res: Response) => {
    const floorCode = req.params.id;

    try {
      const floorPlan = await floorService.getFloorplan(floorCode);
      res.json(floorPlan);
    } catch (error) {
      handleControllerError(res, error, "getting floor plan");
    }
  },
};
