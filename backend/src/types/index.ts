export interface User {
  id: string
  email: string
  name: string
  password: string
  level: "principiante" | "intermedio" | "avanzado"
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  title: string
  description: string
  level: "principiante" | "intermedio" | "avanzado"
  lessons: number
  duration: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  type: "video" | "audio" | "text" | "exercise"
  duration: number
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface UserProgress {
  id: string
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  score?: number
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthRequest extends Request {
  user?: User
}
