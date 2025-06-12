import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { AuthRequest } from "../types"

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Token de acceso requerido" })
  }

  jwt.verify(token, process.env.JWT_SECRET || "fallback-secret", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" })
    }

    req.user = decoded as any
    next()
  })
}
