"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface Curso {
  id: number
  titulo: string
  descripcion: string
  nivel: string
  slug: string
  duracion: string
  estado: string
}

interface CourseContextType {
  enrolledSchedules: Horario[]
  enrollInSchedule: (scheduleId: string) => void
  leaveSchedule: (scheduleId: string) => void
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
      const response = await fetch('http://localhost:4000/api/cursos')
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
      const response = await fetch(`http://localhost:4000/api/cursos/nivel/${nivel}`)
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
      const response = await fetch('http://localhost:4000/api/cursos', {
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
      const response = await fetch(`http://localhost:4000/api/cursos/${id}`, {
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
      const response = await fetch(`http://localhost:4000/api/cursos/${id}`, {
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

  const enrollInSchedule = (scheduleId: string) => {
    let scheduleToAdd: Horario | undefined;
    let courseTitle: string | undefined;

    for (const course of allCursosData) {
      const foundSchedule = course.schedules.find(s => s.id === scheduleId)
      if (foundSchedule) {
        scheduleToAdd = foundSchedule
        courseTitle = course.title
        break
      }
    }

    if (scheduleToAdd && !enrolledSchedules.some(s => s.id === scheduleId)) {
      setEnrolledSchedules(prevSchedules => [...prevSchedules, scheduleToAdd!])
      // alert(`¡Te has inscrito en ${courseTitle} (${scheduleToAdd.schedule})!`)
    }
  }

  const leaveSchedule = (scheduleId: string) => {
    let scheduleToRemove: Horario | undefined;
    let courseTitle: string | undefined;

    for (const course of allCursosData) {
        const foundSchedule = course.schedules.find(s => s.id === scheduleId)
        if (foundSchedule) {
            scheduleToRemove = foundSchedule
            courseTitle = course.title
            break
        }
    }

    if (scheduleToRemove) {
      // if(confirm(`¿Estás seguro que quieres dejar la clase de "${courseTitle}" del horario ${scheduleToRemove.schedule}?`)){
          setEnrolledSchedules(prevSchedules => prevSchedules.filter(s => s.id !== scheduleId))
          // alert(`Has dejado la clase.`)
      // }
    }
  }
  
  const isEnrolledInSchedule = (scheduleId: string) => {
    return enrolledSchedules.some(s => s.id === scheduleId)
  }

  // No renderizar contenido que dependa del estado del cliente hasta que esté listo
  if (!isClient) {
    return (
      <CourseContext.Provider value={{ 
        enrolledSchedules: [], 
        enrollInSchedule: () => {}, 
        leaveSchedule: () => {}, 
        isEnrolledInSchedule: () => false, 
        isLoading: true,
        cursos: [],
        error: null,
        fetchCursos: async () => {},
        fetchCursosByNivel: async (nivel: string) => {},
        createCurso: async (curso: Omit<Curso, 'id'>) => false,
        updateCurso: async (id: number, curso: Partial<Curso>) => false,
        deleteCurso: async (id: number) => false
      }}>
        {children}
      </CourseContext.Provider>
    )
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
    throw new Error('useCourses must be used within a CourseProvider')
  }
  return context
} 