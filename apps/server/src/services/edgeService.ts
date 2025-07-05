import { prisma } from "../../prisma";

export const edgeService = {
  createEdge: async (inNodeId: string, outNodeId: string) => {
    await prisma.edge.create({
      data: { inNodeId, outNodeId },
    });
    await prisma.edge.create({
      data: { inNodeId: outNodeId, outNodeId: inNodeId },
    });
  },

  deleteEdge: async (inNodeId: string, outNodeId: string) => {
    await prisma.edge.delete({
      where: { inNodeId_outNodeId: { inNodeId, outNodeId } },
    });
    await prisma.edge.delete({
      where: {
        inNodeId_outNodeId: { inNodeId: outNodeId, outNodeId: inNodeId },
      },
    });
  },

  createEdges: async (nodeId: string, neighborIds: string[]) => {
    for (const neighborId of neighborIds) {
      await edgeService.createEdge(nodeId, neighborId);
    }
  },

  // delete all edges connected to a node
  deleteEdges: async (nodeId: string) => {
    await prisma.edge.deleteMany({
      where: { OR: [{ inNodeId: nodeId }, { outNodeId: nodeId }] },
    });
  },
};
