"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  role: 'estudiante' | 'docente' | 'admin'
  status: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isClient) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    }
  }, [user, isClient])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Asumiendo que el backend devuelve el usuario en la respuesta
        if (data.user) {
          setUser(data.user)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Determinar el estado inicial según el rol
        const initialStatus = role === 'docente' ? 'pendiente' : 'activo';

        // Crear nuevo usuario
        const newUser: User = {
          id: data.userId || Date.now(),
          name,
          email,
          role: role as 'estudiante' | 'docente' | 'admin',
          status: initialStatus
        }

        // Solo iniciar sesión automáticamente si es estudiante (estado activo)
        if (role === 'estudiante') {
          setUser(newUser)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error during registration:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
  }

  // No renderizar contenido que dependa del estado del cliente hasta que esté listo
  if (!isClient) {
    return (
      <AuthContext.Provider value={{ 
        user: null, 
        login: async () => false, 
        register: async () => false,
        logout: () => {}, 
        isLoading: true 
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 