import { Server } from "socket.io";

// Define the WebSocketEvent type
export type WebSocketEvent = string;

export class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers(): void {
    const { io } = this;

    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Echo message back to sender
      socket.on("message", (data) => {
        console.log(`Received message from ${socket.id}:`, data);
        socket.emit("message", data);
      });

      // Join a room
      socket.on("join", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
        socket.emit("joined", { room });
      });

      // Leave a room
      socket.on("leave", (room) => {
        socket.leave(room);
        console.log(`${socket.id} left room: ${room}`);
        socket.emit("left", { room });
      });

      // Send message to a room
      socket.on("room-message", ({ room, message }) => {
        console.log(`Message to room ${room}:`, message);
        io.to(room).emit("room-message", { room, message });
      });

      // Handle disconnections
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Send an event to clients in a specific room
   */
  public broadcastToRoom(
    room: string,
    event: WebSocketEvent,
    data: unknown
  ): void {
    this.io.to(room).emit(event, data);
  }
}
