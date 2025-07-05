import express from "express";

import { nodeController } from "../controllers/nodeController";

const nodeRouter = express.Router();

nodeRouter.post("/:id", nodeController.createNode);
nodeRouter.put("/:id", nodeController.updateNode);
nodeRouter.delete("/:id", nodeController.deleteNode);

export default nodeRouter;
