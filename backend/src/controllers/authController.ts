import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import type { User } from "../types"

// Simulamos una base de datos en memoria (en producción usarías una DB real)
const users: User[] = [
  {
    id: "1",
    email: "demo@freenglish.com",
    name: "Usuario Demo",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    level: "intermedio",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // Validar datos
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" })
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear nuevo usuario
    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
      level: "principiante",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)

    // Generar token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Responder sin la contraseña
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" })
    }

    // Buscar usuario
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Generar token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "fallback-secret", { expiresIn: "7d" })

    // Responder sin la contraseña
    const { password: _, ...userWithoutPassword } = user
    res.json({
      message: "Login exitoso",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }
    const user = users.find((u) => u.id === decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error("Token verification error:", error)
    res.status(401).json({ message: "Token inválido" })
  }
}
