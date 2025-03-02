import express from 'express';
import { buildingController } from '../controllers/buildingController.ts';

const buildingRouter = express.Router();

buildingRouter.get('/codes', buildingController.getBuildingCodes);
buildingRouter.get('/:id/defaultFloor', buildingController.getDefaultFloor);

export default buildingRouter;
