import type { NextFunction, Request, Response } from "express";

export const requireSocketId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const socketId = req.header("X-Socket-ID");

  if (!socketId) {
    res.status(400).json({ message: "X-Socket-ID header is required" });
    return;
  }

  req.socketId = socketId;
  return next();
};
