import { request, response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req = request,
  res = response,
  next: NextFunction
) {
  console.error("Error detectado:", err);

  if (err.status && err.message) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}
