"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calendar, BookOpen, Clock, User, Settings, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'
import MainNavigation from '@/components/MainNavigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Video, Users } from "lucide-react"
import Link from 'next/link'
import { useRouter } from "next/navigation"

const diasSemana = [
  { value: "lunes", label: "Lunes" },
  { value: "martes", label: "Martes" },
  { value: "miércoles", label: "Miércoles" },
  { value: "jueves", label: "Jueves" },
  { value: "viernes", label: "Viernes" },
  { value: "sábado", label: "Sábado" },
  { value: "domingo", label: "Domingo" }
]

// Tipos para los datos reales

type Horario = {
  id: number;
  curso_id: number;
  docente_id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  max_estudiantes: number;
  estado: string;
};

type Estudiante = {
  id: number;
  nombre: string;
  email: string;
  // Puedes agregar más campos si tu backend los devuelve
};

export default function PerfilDocentePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [estudiantesPorHorario, setEstudiantesPorHorario] = useState<{[horarioId: number]: Estudiante[]}>({})
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddSchedule, setShowAddSchedule] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [newSchedule, setNewSchedule] = useState({
    dia: '',
    horaInicio: '',
    horaFin: '',
    curso: ''
  })
  const [selectedCourse, setSelectedCourse] = useState<string>('Todos')
  const [attendanceRecords, setAttendanceRecords] = useState<{[studentId: number]: string[]}>({})

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:4000/api/horarios?docenteId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setHorarios(data)
          // Para cada horario, obtener estudiantes
          data.forEach((horario: any) => {
            fetch(`http://localhost:4000/api/horarios/${horario.id}/estudiantes`)
              .then(res => res.json())
              .then(estudiantes => {
                setEstudiantesPorHorario(prev => ({ ...prev, [horario.id]: estudiantes }))
              })
          })
        })
    }
  }, [user])

  // Obtener cursos únicos
  const uniqueCourses = useMemo(() => {
    const cursos = Object.values(estudiantesPorHorario).flat().map(e => e.curso)
    return ["Todos", ...Array.from(new Set(cursos))]
  }, [estudiantesPorHorario])

  // Filtrar estudiantes por curso
  const filteredStudents = useMemo(() => {
    if (selectedCourse === "Todos") return Object.values(estudiantesPorHorario).flat()
    return Object.values(estudiantesPorHorario).flat().filter(e => e.curso === selectedCourse)
  }, [selectedCourse, estudiantesPorHorario])

  const today = new Date().toISOString().slice(0, 10)

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar los cambios del perfil
    console.log('Guardando cambios del perfil:', editForm)
    setShowEditProfile(false)
  }

  const handleAddSchedule = () => {
    // Aquí iría la lógica para agregar un nuevo horario
    console.log('Agregando horario:', newSchedule)
    const newScheduleData = {
      id: Date.now(),
      ...newSchedule,
      estudiantes: 0
    }
    setHorarios([...horarios, newScheduleData])
    setNewSchedule({ dia: "", horaInicio: "", horaFin: "", curso: "" })
    setShowAddSchedule(false)
  }

  const handleDeleteSchedule = (scheduleId: number) => {
    setHorarios(horarios.filter(h => h.id !== scheduleId))
  }

  const handleMarkAttendance = (studentId: number, present: boolean) => {
    setAttendanceRecords(prev => {
      const prevDates = prev[studentId] || []
      if (!prevDates.includes(today)) {
        return { ...prev, [studentId]: [...prevDates, today] }
      }
      return prev
    })
    setShowAttendance(false)
    setSelectedStudent(null)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No estás autorizado. Por favor, <Link href="/login" className="text-green-600 hover:underline">inicia sesión</Link>.</p>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getStatusBadge = (status: string, students: number, maxStudents: number) => {
    if (status === 'full' || students === maxStudents) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lleno</Badge>
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
    }
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">Docente - {user?.especialidad}</p>
            </div>
          </div>
          <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Perfil</DialogTitle>
                <DialogDescription>
                  Actualiza tu información personal
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEditProfile(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.values(estudiantesPorHorario).flat().length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horarios Activos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{horarios.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(Object.values(attendanceRecords).flat().length / Object.values(estudiantesPorHorario).flat().length * 100)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clases Impartidas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.values(estudiantesPorHorario).flat().length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedules">
          <TabsList>
            <TabsTrigger value="schedules">Mis Horarios</TabsTrigger>
            <TabsTrigger value="students">Mis Estudiantes</TabsTrigger>
          </TabsList>
          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <CardTitle>Horarios de Clase</CardTitle>
                <CardDescription>Esta es la lista de tus clases programadas y su estado actual.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Inscritos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {horarios.map((horario) => (
                      <TableRow key={horario.id}>
                        <TableCell>
                          <div className="font-medium">{horario.curso_id}</div>
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {diasSemana.find(d => d.value === horario.dia_semana)?.label} • {horario.hora_inicio} - {horario.hora_fin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            {estudiantesPorHorario[horario.id]?.length || 0}/{horario.max_estudiantes}
                          </div>
                        </TableCell>
                        <TableCell>
                          {estudiantesPorHorario[horario.id]?.length >= horario.max_estudiantes ? (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lleno</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar horario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Al eliminar este horario, los estudiantes no podrán inscribirse en esta clase.
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteSchedule(horario.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Sí, eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Mis Estudiantes</CardTitle>
                <CardDescription>Aquí aparecerá la lista de todos tus estudiantes.</CardDescription>
                {/* Filtro por curso */}
                <div className="mt-4 mb-2 flex items-center gap-2">
                  <label htmlFor="filtro-curso" className="text-sm font-medium">Filtrar por curso:</label>
                  <select
                    id="filtro-curso"
                    className="border rounded px-2 py-1"
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                  >
                    {uniqueCourses.map(curso => (
                      <option key={curso} value={curso}>{curso}</option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asistencia</TableHead>
                      <TableHead>Última Clase</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((estudiante) => (
                      <TableRow key={estudiante.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{(estudiante.nombre || '').charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{estudiante.nombre}</div>
                              <div className="text-sm text-gray-500">{estudiante.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{(estudiante.curso || '')}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {attendanceRecords[estudiante.id]?.length || ''}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.round(((attendanceRecords[estudiante.id]?.length || 0) / 0) * 100)}% asistencia
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {attendanceRecords[estudiante.id]?.length
                              ? today.split("-").reverse().join("/")
                              : new Date(estudiante.ultimaAsistencia).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAttendance(estudiante.id, true)}
                            disabled={attendanceRecords[estudiante.id]?.includes(today)}
                          >
                            Marcar Asistencia
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 