import type { Request, Response } from 'express';
import { buildingService } from '../services/buildingService.ts';

export const buildingController = {
  async getBuildingCodesAndNames(req: Request, res: Response) {
    try {
      const buildingCodesAndNames =
        await buildingService.getAllBuildingCodesAndNames();

      res.json(buildingCodesAndNames);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching building codes and names',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },

  async getDefaultFloor(req: Request, res: Response) {
    try {
      const defaultFLoor = await buildingService.getDefaultFloor(req.params.id);

      res.json(defaultFLoor);
    } catch (error) {
      res.status(500).json({
        error: 'Error fetching building codes',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
};
