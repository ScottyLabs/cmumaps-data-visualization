import express from "express";

import { roomController } from "../controllers/roomController";

const roomRouter = express.Router();

roomRouter.post("/:id", roomController.createRoom);
roomRouter.patch("/:id", roomController.updateRoom);
roomRouter.delete("/:id", roomController.deleteRoom);
roomRouter.get("/by-floor/:floorCode", roomController.getRoomIdsByFloor);
roomRouter.get("/:roomId", roomController.getRoom);
roomRouter.get("/", roomController.getAllRooms);

export default roomRouter;
