import express from "express";
import { edgeController } from "../controllers/edgeController";
import { requireSocketId } from "../middleware/socketIdMiddleware";

const edgeRouter = express.Router();

edgeRouter.post("/edge", requireSocketId, edgeController.createEdge);
edgeRouter.delete("/edge", requireSocketId, edgeController.deleteEdge);
edgeRouter.post(
  "/cross-floor-edge",
  requireSocketId,
  edgeController.createEdgeAcrossFloors,
);
edgeRouter.delete(
  "/cross-floor-edge",
  requireSocketId,
  edgeController.deleteEdgeAcrossFloors,
);

export default edgeRouter;
