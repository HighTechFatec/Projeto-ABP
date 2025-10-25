import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/auth";

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
  email: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as TokenPayload;
    req.user = { id: decoded.id, email: decoded.email };
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};
