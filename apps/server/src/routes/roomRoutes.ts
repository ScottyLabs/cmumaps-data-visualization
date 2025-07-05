import express from "express";

import { roomController } from "../controllers/roomController";

const roomRouter = express.Router();

roomRouter.post("/:id", roomController.createRoom);
roomRouter.patch("/:id", roomController.updateRoom);
roomRouter.delete("/:id", roomController.deleteRoom);

export default roomRouter;
