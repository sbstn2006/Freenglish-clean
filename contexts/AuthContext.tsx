"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'admin'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Usuario de prueba temporal
const TEMP_USER = {
  id: '1',
  name: 'Estudiante Demo',
  email: 'estudiante@demo.com',
  role: 'student' as const
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('freenglish_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Credenciales de prueba
    if (email === 'estudiante@demo.com' && password === '123456') {
      setUser(TEMP_USER)
      localStorage.setItem('freenglish_user', JSON.stringify(TEMP_USER))
      setIsLoading(false)
      return true
    }
    
    // También permitir login con cualquier email que contenga "demo" y password "123456"
    if (email.includes('demo') && password === '123456') {
      const demoUser = {
        ...TEMP_USER,
        email,
        name: email.split('@')[0]
      }
      setUser(demoUser)
      localStorage.setItem('freenglish_user', JSON.stringify(demoUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role: 'student' as const
    }
    
    setUser(newUser)
    localStorage.setItem('freenglish_user', JSON.stringify(newUser))
    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('freenglish_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 