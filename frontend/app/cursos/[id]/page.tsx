"use client"
import MainNavigation from '@/components/MainNavigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, User, Clock, Star, BookOpen, Users, CheckCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { notFound, useParams } from 'next/navigation'
import { useCourses } from '@/contexts/CourseContext'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'

interface Schedule {
  id: number;
  teacher: string;
  schedule: string;
  students: number;
  maxStudents: number;
}

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  slug: string;
  duracion: string;
  estado: string;
  schedules: Schedule[];
  learnings: string[];
}

export default function CursoDetallePage() {
  const params = useParams()
  const { user } = useAuth()
  const { enrollInSchedule, isEnrolledInSchedule, isLoading, enrolledSchedules } = useCourses()
  const { toast } = useToast()
  const cursoSlug = params.id as string
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        setLoading(true)
        // Primero obtener todos los cursos para encontrar el ID por slug
        const response = await fetch('/api/cursos')
        if (!response.ok) {
          throw new Error('Error al obtener los cursos')
        }
        const cursos = await response.json()
        
        // Buscar el curso por slug
        const cursoEncontrado = cursos.find((c: any) => c.slug === cursoSlug)
        if (!cursoEncontrado) {
          setError('Curso no encontrado')
          setLoading(false)
          return
        }

        // Obtener el curso con sus horarios
        const cursoResponse = await fetch(`/api/cursos/${cursoEncontrado.id}/with-schedules`)
        if (!cursoResponse.ok) {
          throw new Error('Error al obtener el detalle del curso')
        }
        const cursoData = await cursoResponse.json()
        setCurso(cursoData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchCurso()
  }, [cursoSlug])

  const handleEnroll = async (scheduleId: number) => {
    const result = await enrollInSchedule(scheduleId.toString())
    if (result.success) {
      toast({
        title: '¡Inscripción exitosa!',
        description: result.message,
      })
      // El contexto ya se actualiza automáticamente, no necesitamos hacer nada más
    } else if ('error' in result && result.error === 'already-enrolled') {
      toast({
        title: 'Ya estás inscrito',
        description: result.message,
        variant: 'default',
      })
    } else {
      toast({
        title: 'Error al inscribirse',
        description: result.message,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <MainNavigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-lg">Cargando curso...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <MainNavigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-lg">{error || 'Curso no encontrado'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">{curso.nivel}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{curso.titulo}</h1>
          <p className="mt-4 text-lg text-gray-600">{curso.descripcion}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
            <ul className="space-y-3 mb-8">
              {curso.learnings && curso.learnings.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Horarios Disponibles</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Cupos</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curso.schedules && curso.schedules.length > 0 ? (
                    curso.schedules.map(schedule => {
                      const isFull = schedule.students >= schedule.maxStudents;
                      const enrolled = isEnrolledInSchedule(schedule.id.toString())
                      console.log('Debug - Schedule ID:', schedule.id, 'Enrolled:', enrolled, 'EnrolledSchedules:', enrolledSchedules)
                      return (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {schedule.teacher}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {schedule.schedule}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {schedule.students}/{schedule.maxStudents}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {enrolled ? (
                              <Badge 
                                className="bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer"
                                onClick={() => {
                                  toast({
                                    title: 'Ya estás inscrito',
                                    description: 'Ya estás inscrito en este horario. ¡Nos vemos en clase!',
                                    variant: 'default',
                                  })
                                }}
                              >
                                ✓ Inscrito
                              </Badge>
                            ) : (
                              <Button 
                                onClick={() => handleEnroll(schedule.id)}
                                disabled={isLoading || isFull}
                              >
                                {isFull ? 'Lleno' : 'Inscribirme'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <p className="text-gray-500">No hay horarios disponibles para este curso</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Detalles del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Nivel:</span>
                  <span>{curso.nivel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Duración:</span>
                  <span>{curso.duracion}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 