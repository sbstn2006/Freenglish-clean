"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService, LoginData, RegisterData, User } from '@/lib/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar si hay un token guardado
    const token = localStorage.getItem('authToken')
    if (token) {
      // Aquí podrías verificar el token con el backend
      // Por ahora, cargamos datos básicos del localStorage
      const savedUser = localStorage.getItem('freenglish_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.login({ email, password })
      
      if (response.token) {
        // Guardar token
        apiService.setToken(response.token)
        
        // Crear objeto usuario (el backend no devuelve datos del usuario en login)
        const userData: User = {
          id: 0, // Se actualizará cuando obtengamos los datos del usuario
          name: email.split('@')[0], // Nombre temporal
          email,
          status: 1
        }
        
        setUser(userData)
        localStorage.setItem('freenglish_user', JSON.stringify(userData))
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Error en login:', error)
      setError(error instanceof Error ? error.message : 'Error en el login')
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.register({ 
        name, 
        email, 
        password, 
        status: 1 
      })
      
      if (response.userId) {
        // Crear objeto usuario
        const userData: User = {
          id: response.userId,
          name,
          email,
          status: 1
        }
        
        setUser(userData)
        localStorage.setItem('freenglish_user', JSON.stringify(userData))
        setIsLoading(false)
        return true
      }
      
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Error en registro:', error)
      setError(error instanceof Error ? error.message : 'Error en el registro')
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    apiService.removeToken()
    localStorage.removeItem('freenglish_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
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