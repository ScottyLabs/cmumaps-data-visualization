import type { Request, Response } from "express";
import { Get, Route } from "tsoa";

import { BuildingError } from "../errors/error";
import { handleControllerError } from "../errors/errorHandler";
import { buildingService } from "../services/buildingService";

@Route("buildings")
export class BuildingController {
  @Get("/")
  async getBuildings() {
    return await buildingService.getBuildings();
  }

  async getBuildingsMetadata(_req: Request, res: Response) {
    try {
      const buildingMetadata = await buildingService.getBuildingsMetadata();
      res.json(buildingMetadata);
    } catch (error) {
      handleControllerError(res, error, "fetching building metadata");
    }
  }

  async getBuildingName(req: Request, res: Response) {
    try {
      const buildingName = await buildingService.getBuildingName(req.params.id);
      res.json(buildingName);
    } catch (error) {
      handleControllerError(res, error, "getting building name");
    }
  }

  async getDefaultFloor(req: Request, res: Response) {
    try {
      const defaultFloor = await buildingService.getDefaultFloor(req.params.id);

      res.json(defaultFloor);
    } catch (error) {
      if (error instanceof BuildingError) {
        res.status(404).json({ code: error.code });
        return;
      }

      handleControllerError(res, error, "getting default floor");
    }
  }

  async getBuildingFloors(req: Request, res: Response) {
    try {
      const buildingFloors = await buildingService.getBuildingFloors(
        req.params.id,
      );

      res.json(buildingFloors);
    } catch (error) {
      if (error instanceof BuildingError) {
        res.status(404).json({ code: error.code });
        return;
      }

      handleControllerError(res, error, "getting building floors");
    }
  }
}
