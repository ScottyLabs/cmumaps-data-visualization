import type { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { populateTableService } from "../services/populateTableService";

export const populateTableController = {
  populateBuildings: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateBuildings(data);
      res.status(200).json({ message: "Buildings populated" });
    } catch (error) {
      handleControllerError(res, error, "populating buildings");
    }
  },

  populateFloors: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateFloors(data);
      res.status(200).json({ message: "Floors populated" });
    } catch (error) {
      handleControllerError(res, error, "populating floors");
    }
  },

  populateRooms: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateRooms(data);
      res.status(200).json({ message: "Rooms populated" });
    } catch (error) {
      handleControllerError(res, error, "populating rooms");
    }
  },

  populateAlias: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateAlias(data);
      res.status(200).json({ message: "Alias populated" });
    } catch (error) {
      handleControllerError(res, error, "populating alias");
    }
  },

  populateNodes: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateNodes(data);
      res.status(200).json({ message: "Nodes populated" });
    } catch (error) {
      handleControllerError(res, error, "populating nodes");
    }
  },

  populateEdges: async (req: Request, res: Response) => {
    try {
      const data = req.body;
      await populateTableService.populateEdges(data);
      res.status(200).json({ message: "Edges populated" });
    } catch (error) {
      handleControllerError(res, error, "populating edges");
    }
  },
};
