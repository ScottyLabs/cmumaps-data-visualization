import express from "express";

import { floorController } from "../controllers/floorController";

const floorRouter = express.Router();

floorRouter.get("/:id/graph", floorController.getFloorGraph);
floorRouter.get("/:id/rooms", floorController.getFloorRooms);
floorRouter.get("/:id/pois", floorController.getFloorPois);
floorRouter.get("/:id/floorplan", floorController.getFloorplan);

export default floorRouter;
