import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}

export function authentication(request: Request, response: Response, next: NextFunction): void {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  console.log(token);

  if (!token) {
    response.status(401).json({ error: "Token não fornecido." });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    request.usuario = payload;
    next();
  } catch (err) {
    response.status(403).json({ error: "Token inválido ou expirado." });
  }
}