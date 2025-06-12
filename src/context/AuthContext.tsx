"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  email: string
  name: string
  level: "principiante" | "intermedio" | "avanzado"
  avatar?: string
  joinDate: string
  coursesCompleted: number
  totalLessons: number
  streak: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Usuario demo para pruebas
      if (email === "demo@freenglish.com" && password === "demo123") {
        const userData: User = {
          id: "1",
          email: "demo@freenglish.com",
          name: "Usuario Demo",
          level: "intermedio",
          joinDate: "2024-01-15",
          coursesCompleted: 3,
          totalLessons: 45,
          streak: 7,
        }

        await AsyncStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
        return true
      }

      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        level: "principiante",
        joinDate: new Date().toISOString().split("T")[0],
        coursesCompleted: 0,
        totalLessons: 0,
        streak: 0,
      }

      await AsyncStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData")
      setUser(null)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      AsyncStorage.setItem("userData", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
