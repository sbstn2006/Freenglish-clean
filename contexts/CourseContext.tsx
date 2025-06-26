"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { useToast } from '@/components/ui/use-toast'

interface Curso {
  id: number
  titulo: string
  descripcion: string
  nivel: string
  slug: string
  duracion: string
  estado: string
}

// Interfaz actualizada para coincidir con los datos del backend
interface Horario {
  inscripcion_id: number
  id: number
  horario_id: number
  curso_id: number
  docente_id: number
  dia_semana: string
  hora_inicio: string
  hora_fin: string
  max_estudiantes: number
  estado: string
  curso_nombre: string
  docente_nombre: string
}

interface CourseContextType {
  enrolledSchedules: Horario[]
  enrollInSchedule: (scheduleId: string) => Promise<{ success: boolean, message: string, error?: string }>
  leaveSchedule: (inscripcionId: number) => Promise<{ success: boolean, message: string }>
  isEnrolledInSchedule: (scheduleId: string) => boolean
  isLoading: boolean
  cursos: Curso[]
  error: string | null
  fetchCursos: () => Promise<void>
  fetchCursosByNivel: (nivel: string) => Promise<void>
  createCurso: (curso: Omit<Curso, 'id'>) => Promise<boolean>
  updateCurso: (id: number, curso: Partial<Curso>) => Promise<boolean>
  deleteCurso: (id: number) => Promise<boolean>
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrolledSchedules, setEnrolledSchedules] = useState<Horario[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchCursos = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/cursos')
      if (response.ok) {
        const data = await response.json()
        setCursos(data)
      } else {
        setError('Error al cargar los cursos')
      }
    } catch (error) {
      console.error('Error fetching cursos:', error)
      setError('Error de conexión al cargar los cursos')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCursosByNivel = async (nivel: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/cursos/nivel/${nivel}`)
      if (response.ok) {
        const data = await response.json()
        setCursos(data)
      } else {
        setError('Error al cargar los cursos por nivel')
      }
    } catch (error) {
      console.error('Error fetching cursos by nivel:', error)
      setError('Error de conexión al cargar los cursos por nivel')
    } finally {
      setIsLoading(false)
    }
  }

  const createCurso = async (curso: Omit<Curso, 'id'>): Promise<boolean> => {
    try {
      const response = await fetch('/api/cursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
      })

      if (response.ok) {
        await fetchCursos() // Recargar la lista
        return true
      }
      return false
    } catch (error) {
      console.error('Error creating curso:', error)
      return false
    }
  }

  const updateCurso = async (id: number, curso: Partial<Curso>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(curso),
      })

      if (response.ok) {
        await fetchCursos() // Recargar la lista
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating curso:', error)
      return false
    }
  }

  const deleteCurso = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCursos() // Recargar la lista
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting curso:', error)
      return false
    }
  }

  // Cargar cursos al inicializar
  useEffect(() => {
    fetchCursos()
  }, [])

  // Cargar inscripciones reales del estudiante
  useEffect(() => {
    if (user && user.role === 'estudiante') {
      setIsLoading(true);
      fetch(`/api/horarios/inscripciones/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => setEnrolledSchedules(data))
        .catch(() => setEnrolledSchedules([]))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const enrollInSchedule = async (scheduleId: string): Promise<{ success: boolean, message: string, error?: string }> => {
    if (!user) {
      return {
        success: false,
        message: 'Debes iniciar sesión para inscribirte en un curso.',
        error: 'no-auth',
      };
    }

    try {
      // Hacer la inscripción real al backend
      const response = await fetch('/api/horarios/inscripciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        },
        body: JSON.stringify({
          estudiante_id: user.id,
          horario_id: scheduleId,
          estado: 'activa'
        }),
      });

      if (response.ok) {
        // Recargar las inscripciones del estudiante
        const inscripcionesResponse = await fetch(`/api/horarios/inscripciones?estudianteId=${user.id}`);
        if (inscripcionesResponse.ok) {
          const nuevasInscripciones = await inscripcionesResponse.json();
          setEnrolledSchedules(nuevasInscripciones);
        }
        return {
          success: true,
          message: '¡Te has inscrito exitosamente en el curso!'
        };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || 'Error desconocido',
          error: 'backend',
        };
      }
    } catch (error) {
      console.error('Error enrolling in schedule:', error);
      return {
        success: false,
        message: 'Error al inscribirse. Inténtalo de nuevo.',
        error: 'network',
      };
    }
  }

  const leaveSchedule = async (inscripcionId: number): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await fetch(`/api/horarios/inscripciones/${inscripcionId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      });
      if (response.ok) {
        await fetch(`/api/horarios/inscripciones/${user?.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => setEnrolledSchedules(data));
        return { success: true, message: 'Te has dado de baja correctamente.' };
      } else {
        const data = await response.json();
        return { success: false, message: data.error || 'Error al dar de baja.' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión al dar de baja.' };
    }
  }
  
  const isEnrolledInSchedule = (scheduleId: string) => {
    return enrolledSchedules.some(s => s.horario_id.toString() === scheduleId)
  }

  return (
    <CourseContext.Provider value={{
      enrolledSchedules,
      enrollInSchedule,
      leaveSchedule,
      isEnrolledInSchedule,
      isLoading,
      cursos,
      error,
      fetchCursos,
      fetchCursosByNivel,
      createCurso,
      updateCurso,
      deleteCurso
    }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (context === undefined) {
    // En lugar de throw error, retornar un objeto vacío para evitar errores de hooks
    return {
      enrolledSchedules: [],
      enrollInSchedule: async () => ({ success: false, message: 'Contexto no disponible' }),
      leaveSchedule: async () => ({ success: false, message: 'Contexto no disponible' }),
      isEnrolledInSchedule: () => false,
      isLoading: false,
      cursos: [],
      error: null,
      fetchCursos: async () => {},
      fetchCursosByNivel: async () => {},
      createCurso: async () => false,
      updateCurso: async () => false,
      deleteCurso: async () => false
    }
  }
  return context
} 