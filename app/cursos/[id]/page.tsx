"use client"
import MainNavigation from '@/components/MainNavigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, User, Clock, Star, BookOpen, Users, CheckCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cursos } from '@/data/cursos'
import { notFound, useParams } from 'next/navigation'
import { useCourses } from '@/contexts/CourseContext'
import { useAuth } from '@/contexts/AuthContext'

export default function CursoDetallePage() {
  const params = useParams()
  const { user } = useAuth()
  const { enrollInSchedule, isEnrolledInSchedule, isLoading } = useCourses()
  const cursoSlug = params.id as string
  const curso = cursos.find((c) => c.slug === cursoSlug)

  if (!curso) {
    notFound()
  }

  const handleEnroll = (scheduleId: string) => {
    if (user) {
      enrollInSchedule(scheduleId)
    } else {
      alert("Debes iniciar sesión para inscribirte.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">{curso.level}</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{curso.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{curso.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
            <ul className="space-y-3 mb-8">
              {curso.learnings.map((item, index) => (
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
                  {curso.schedules.map(schedule => {
                    const isFull = schedule.students >= schedule.maxStudents;
                    const enrolled = isEnrolledInSchedule(schedule.id)
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
                          <Button 
                            onClick={() => handleEnroll(schedule.id)}
                            disabled={isLoading || isFull || enrolled}
                          >
                            {enrolled ? 'Inscrito' : isFull ? 'Lleno' : 'Inscribirme'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
                  <span>{curso.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Duración:</span>
                  <span>{curso.duration}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 