import type { Request, Response } from "express"
import type { Course } from "../types"

// Datos de ejemplo para cursos
const courses: Course[] = [
  {
    id: "1",
    title: "Inglés Básico para Principiantes",
    description: "Aprende los fundamentos del inglés desde cero",
    level: "principiante",
    lessons: 20,
    duration: "4 semanas",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Conversación en Inglés",
    description: "Mejora tu fluidez en conversaciones cotidianas",
    level: "intermedio",
    lessons: 15,
    duration: "3 semanas",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Inglés de Negocios",
    description: "Domina el inglés profesional y corporativo",
    level: "avanzado",
    lessons: 25,
    duration: "6 semanas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Gramática Intermedia",
    description: "Perfecciona tu gramática inglesa",
    level: "intermedio",
    lessons: 18,
    duration: "4 semanas",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    // Agregar progreso simulado para cada curso
    const coursesWithProgress = courses.map((course) => ({
      ...course,
      progress: Math.floor(Math.random() * 100), // Progreso aleatorio para demo
    }))

    res.json(coursesWithProgress)
  } catch (error) {
    console.error("Error fetching courses:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const course = courses.find((c) => c.id === id)

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" })
    }

    res.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const getCoursesByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params
    const filteredCourses = courses.filter((c) => c.level === level)

    res.json(filteredCourses)
  } catch (error) {
    console.error("Error fetching courses by level:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}
