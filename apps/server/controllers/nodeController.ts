import type { Request, Response } from "express";

import { handleControllerError } from "../errors/errorHandler";
import { webSocketService } from "../index";
import { edgeService } from "../services/edgeService";
import { floorService } from "../services/floorService";
import { nodeService } from "../services/nodeService";

export const nodeController = {
  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const socketId = req.socketId;

    try {
      // create node in database
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);

      // create edges to neighbors if they don't already exist
      await edgeService.createEdges(nodeId, Object.keys(nodeInfo.neighbors));

      // broadcast to all users on the floor
      const payload = { nodeId, nodeInfo };
      webSocketService.broadcastToUserFloor(socketId, "create-node", payload);

      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating node");
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const socketId = req.socketId;

    try {
      await edgeService.deleteEdges(nodeId);
      await nodeService.deleteNode(nodeId);
      webSocketService.broadcastToUserFloor(socketId, "delete-node", {
        nodeId,
      });
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting node");
    }
  },

  updateNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const socketId = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.upsertNode(floorCode, nodeId, nodeInfo, placement);
      const payload = { nodeId, nodeInfo };
      webSocketService.broadcastToUserFloor(socketId, "update-node", payload);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating node");
    }
  },

  async getAllNodes(_req: Request, res: Response) {
    try {
      const nodes = await nodeService.getNodes();
      res.json(nodes);
    } catch (error) {
      handleControllerError(res, error, "getting all nodes");
    }
  },
};
