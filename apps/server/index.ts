import http from "node:http";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { prisma } from "./prisma";
import { checkAuth, socketAuth } from "./src/middleware/authMiddleware";
import { notFoundHandler } from "./src/middleware/notFoundHandler";
import { requireSocketId } from "./src/middleware/socketIdMiddleware";
import buildingRoutes from "./src/routes/buildingRoutes";
import dropTablesRoutes from "./src/routes/dropTablesRoutes";
import edgeRoutes from "./src/routes/edgeRoutes";
import floorRoutes from "./src/routes/floorRoutes";
import nodeRoutes from "./src/routes/nodeRoutes";
import poiRoutes from "./src/routes/poiRoutes";
import populateTableRoutes from "./src/routes/populateTableRoutes";
import roomRoutes from "./src/routes/roomRoutes";
import { WebSocketService } from "./src/services/webSocketService";

const app = express();
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS_REGEX?.split(",").map(
    (origin) => new RegExp(origin),
  ),
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "8mb" }));

// Create HTTP server with Express app attached
const server = http.createServer(app);

// Initialize Socket.IO with CORS and authentication middleware
// https://socket.io/docs/v4/handling-cors/
const io = new Server(server, {
  cors: corsOptions,
});
io.use(socketAuth);

// Initialize WebSocket service
export const webSocketService = new WebSocketService(io);

// Clerk middleware to authenticate requests
app.use(clerkMiddleware());

// Routes
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes for database population
app.use("/api/drop-tables", checkAuth, dropTablesRoutes);
app.use("/api/populate-table", checkAuth, populateTableRoutes);

app.use("/api/floors", checkAuth, floorRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/nodes", checkAuth, requireSocketId, nodeRoutes);
app.use("/api", checkAuth, edgeRoutes);
app.use("/api/rooms", checkAuth, requireSocketId, roomRoutes);
app.use("/api/pois", checkAuth, requireSocketId, poiRoutes);
app.use(notFoundHandler);

const port = process.env.PORT || 80;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
