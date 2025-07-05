import type { Response } from "express";

export const handleControllerError = (
  res: Response,
  error: unknown,
  operation: string,
) => {
  console.error(`Error ${operation}`, error);
  res.status(500).json({
    error: `Error ${operation}`,
    details: error instanceof Error ? error.message : "Unknown error",
  });
};
