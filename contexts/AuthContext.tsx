"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
  rol: 'estudiante' | 'docente' | 'admin'
  status: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User | null>
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.user && data.token) {
          // Verificar si es docente pendiente
          if (data.user.rol === 'docente' && data.user.status === 'pendiente') {
            // No establecer usuario ni token, solo retornar null
            // El componente de login manejará este caso
            return null
          }
          setUser(data.user)
          localStorage.setItem('authToken', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          return data.user
        }
      } else {
        // Manejar errores específicos
        if (data.error && data.error.includes('pendiente')) {
          // Lanzar el mensaje para que el componente de login lo capture
          throw new Error(data.error)
        }
        throw new Error(data.error || 'Error en credenciales')
      }
      return null
    } catch (error) {
      console.error('Error during login:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    console.log('Context: Iniciando registro para:', { name, email, role });
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:4000/api/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()
      console.log('Context: Respuesta del backend:', data);

      if (response.ok) {
        console.log('Context: Registro exitoso, rol:', role);
        // Solo iniciar sesión automáticamente si es estudiante (estado activo)
        if (role === 'estudiante') {
          // Crear nuevo usuario para estudiantes
          const newUser: User = {
            id: data.userId || Date.now(),
            name,
            email,
            rol: role as 'estudiante' | 'docente' | 'admin',
            status: 'activo'
          }
          setUser(newUser)
        }
        
        return true
      } else {
        // Si hay error, retornar false en lugar de lanzar excepción
        console.error('Context: Error en registro:', data.error)
        return false
      }
    } catch (error) {
      console.error('Context: Error during registration:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // En lugar de throw error, retornar un objeto vacío para evitar errores de hooks
    return {
      user: null,
      login: async () => null,
      register: async () => false,
      logout: () => {},
      isLoading: false
    }
  }
  return context
} 