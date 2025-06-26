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
import { Calendar as UiCalendar } from '@/components/ui/calendar'

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
  curso_nombre?: string | null;
  estudiantes?: number;
};

type Estudiante = {
  id: number;
  nombre: string;
  email: string;
  curso_id: number;
  curso_nombre: string;
  asistencia: number;
  ultimaAsistencia: string | null;
  presenteHoy?: boolean;
  totalClasesProgramadas?: number;
  asistenciasReales?: number;
};

export default function PerfilDocentePage() {
  const { user, logout, isLoading } = useAuth()
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
  const [cursos, setCursos] = useState<any[]>([])
  const [editHorario, setEditHorario] = useState<Horario | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHorario, setSelectedHorario] = useState<Horario | null>(null)
  const [horariosDia, setHorariosDia] = useState<Horario[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [clasesImpartidas, setClasesImpartidas] = useState<number>(0)
  const [showEstadisticasModal, setShowEstadisticasModal] = useState(false)
  const [estadisticasEstudiante, setEstadisticasEstudiante] = useState<any>(null)
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null)
  const [formHorario, setFormHorario] = useState({
    curso_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    max_estudiantes: 10
  })

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
    }
  }, [user, router, isLoading])

  useEffect(() => {
    if (user) {
      fetch(`/api/horarios/docente/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener horarios');
        return res.json();
      })
      .then(data => {
        setHorarios(data)
        // Para cada horario, obtener estudiantes
        data.forEach((horario: any) => {
          fetch(`/api/horarios/${horario.id}/estudiantes`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
              'Content-Type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(estudiantes => {
              setEstudiantesPorHorario(prev => ({ ...prev, [horario.id]: estudiantes }))
            })
        })
      })
    }
  }, [user])

  useEffect(() => {
    fetch('http://localhost:4000/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
  }, [])

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/horarios/clases-impartidas/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener clases impartidas');
        return res.json();
      })
      .then(data => setClasesImpartidas(data.clasesImpartidas ?? 0));
    }
  }, [user?.id]);

  // --- AÑADIR LÓGICA PARA FILTRAR CLASES DEL DÍA SELECCIONADO ---
  useEffect(() => {
    if (!selectedDate || horarios.length === 0) {
      setHorariosDia([]);
      setSelectedHorario(null);
      setEstudiantes([]);
      return;
    }
    // Obtener el día de la semana en español
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaSemana = dias[selectedDate.getDay()];
    // Filtrar los horarios de ese día (soportando múltiples días en un string)
    const horariosDelDia = horarios.filter(h => {
      const diasHorario = h.dia_semana
        .toLowerCase()
        .replace(/,/g, ' y ')
        .split(' y ')
        .map(d => d.trim());
      return diasHorario.includes(diaSemana);
    });
    setHorariosDia(horariosDelDia);
    // Si hay alguno, seleccionar el primero automáticamente
    if (horariosDelDia.length > 0) {
      setSelectedHorario(horariosDelDia[0]);
    } else {
      setSelectedHorario(null);
      setEstudiantes([]);
    }
  }, [selectedDate, horarios]);

  // --- CARGAR ESTUDIANTES AL SELECCIONAR HORARIO ---
  useEffect(() => {
    if (selectedHorario) {
      fetch(`/api/horarios/${selectedHorario.id}/estudiantes?fecha=${selectedDate?.toISOString().slice(0, 10)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => setEstudiantes(data));
    } else {
      setEstudiantes([]);
    }
  }, [selectedHorario, selectedDate]);

  // Obtener cursos únicos
  const uniqueCourses = useMemo(() => {
    return ["Todos"]
  }, [estudiantesPorHorario])

  // Filtrar estudiantes por curso
  const filteredStudents = useMemo(() => {
    return Object.values(estudiantesPorHorario).flat().filter(e => e && e.id && e.nombre && e.email)
  }, [selectedCourse, estudiantesPorHorario])

  // Generar fechas de clases para todos los días de la semana de los horarios, de hoy a 1 año
  const hoy = new Date();
  const finDeRango = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate());
  const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const fechasClases: Date[] = useMemo(() => {
    const fechas: Date[] = [];
    horarios.forEach(horario => {
      // Soportar múltiples días en un solo string
      const dias = horario.dia_semana
        .toLowerCase()
        .replace(/,/g, ' y ')
        .split(' y ')
        .map(d => d.trim())
        .filter(d => diasValidos.includes(d));
      dias.forEach(dia => {
        const dayMap: { [key: string]: number } = {
          "lunes": 1, "martes": 2, "miércoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "domingo": 0
        };
        const day = dayMap[dia];
        if (day === undefined) return;
        let fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() + ((day - hoy.getDay() + 7) % 7));
        while (fecha <= finDeRango) {
          fechas.push(new Date(fecha));
          fecha = new Date(fecha);
          fecha.setDate(fecha.getDate() + 7);
        }
      });
    });
    return fechas;
  }, [horarios]);

  const today = new Date().toISOString().slice(0, 10)

  // Función para verificar si una fecha es válida para marcar asistencia
  const isDateValidForAttendance = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    return selectedDate <= today;
  };

  // Función para obtener el estado de la fecha seleccionada
  const getDateStatus = (date: Date | null): 'past' | 'today' | 'future' | 'no-date' => {
    if (!date) return 'no-date';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return 'past';
    if (selectedDate.getTime() === today.getTime()) return 'today';
    return 'future';
  };

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar los cambios del perfil
    console.log('Guardando cambios del perfil:', editForm)
    setShowEditProfile(false)
  }

  const handleAddSchedule = () => {
    // Aquí iría la lógica para agregar un nuevo horario
    console.log('Agregando horario:', newSchedule)
    // Solo cerrar el modal y limpiar el formulario, sin agregar un horario falso
    setNewSchedule({ dia: "", horaInicio: "", horaFin: "", curso: "" })
    setShowAddSchedule(false)
  }

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      const response = await fetch(`/api/horarios/horarios/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setHorarios(horarios.filter(h => h.id !== scheduleId));
      } else {
        const error = await response.json();
        console.error('Error al eliminar horario:', error);
        // Aquí podrías mostrar un toast de error
      }
    } catch (error) {
      console.error('Error al eliminar horario:', error);
      // Aquí podrías mostrar un toast de error
    }
  }

  const handleMarkAttendance = async (studentId: number, horarioId: number, presente: boolean) => {
    const today = new Date().toISOString().slice(0, 10);
    await fetch('/api/horarios/asistencias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
      },
      body: JSON.stringify({ estudiante_id: studentId, horario_id: horarioId, fecha: today, presente })
    });
    // Refrescar estudiantes del horario
    fetch(`/api/horarios/${horarioId}/estudiantes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(estudiantes => {
        setEstudiantesPorHorario(prev => ({ ...prev, [horarioId]: estudiantes }))
      });
  };

  const handleVerEstadisticas = async (estudiante: Estudiante) => {
    setEstudianteSeleccionado(estudiante);
    setShowEstadisticasModal(true);
    
    // Buscar el horario del estudiante
    const horarioId = Object.keys(estudiantesPorHorario).find(key => 
      estudiantesPorHorario[parseInt(key)].some(e => e.id === estudiante.id)
    );
    
    if (horarioId) {
      try {
        const response = await fetch(`http://localhost:4000/api/horarios/estadisticas-asistencia/${estudiante.id}?horarioId=${horarioId}`);
        const data = await response.json();
        setEstadisticasEstudiante(data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    }
  };

  // Cuando se selecciona un horario para editar, poblar el formulario
  useEffect(() => {
    if (editHorario) {
      setFormHorario({
        curso_id: editHorario.curso_id?.toString() || '',
        dia_semana: editHorario.dia_semana || '',
        hora_inicio: editHorario.hora_inicio || '',
        hora_fin: editHorario.hora_fin || '',
        max_estudiantes: editHorario.max_estudiantes || 10
      });
    } else {
      setFormHorario({ curso_id: '', dia_semana: '', hora_inicio: '', hora_fin: '', max_estudiantes: 10 });
    }
  }, [editHorario]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div style={{ display: 'none' }}></div>
  }

  const handleLogout = () => {
    // Primero hacer la redirección
    router.push('/login')
    // Luego limpiar el estado después de un pequeño delay
    setTimeout(() => {
      logout()
    }, 50)
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
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">Docente - {user?.rol}</p>
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
        <div className="flex justify-center w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto text-center">
            <Card>
              <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.values(estudiantesPorHorario).flat().length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Horarios Activos</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{horarios.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clases Impartidas</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clasesImpartidas}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="horarios">
          <TabsList>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
            <TabsTrigger value="asistencia">Asistencia</TabsTrigger>
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
          </TabsList>
          <TabsContent value="horarios">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Horarios de Clase</CardTitle>
                    <CardDescription>Esta es la lista de tus clases programadas y su estado actual.</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => {
                    setEditHorario(null);
                    setNewSchedule({ dia: '', horaInicio: '', horaFin: '', curso: '' });
                    setShowAddSchedule(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" /> Agregar Horario
                  </Button>
                </div>
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
                          <div className="font-medium">{horario.curso_nombre || '-'}</div>
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="inline h-4 w-4 mr-1" />
                            {diasSemana.find(d => d.value === horario.dia_semana)?.label} • {horario.hora_inicio} - {horario.hora_fin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            {(horario.estudiantes ?? 0)}/{horario.max_estudiantes}
                          </div>
                        </TableCell>
                        <TableCell>
                          {((horario.estudiantes ?? 0) >= horario.max_estudiantes) ? (
                            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lleno</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Disponible</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditHorario(horario); setShowAddSchedule(true); }}>
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
          <TabsContent value="asistencia">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Asistencia</CardTitle>
                <CardDescription>Selecciona un día con clase para marcar asistencia.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div>
                    <Label>Calendario de clases:</Label>
                    <UiCalendar
                      mode="single"
                      selected={selectedDate ?? undefined}
                      onSelect={setSelectedDate as (date: Date | undefined) => void}
                      modifiers={{
                        available: fechasClases,
                        past: fechasClases.filter(fecha => getDateStatus(fecha) === 'past'),
                        today: fechasClases.filter(fecha => getDateStatus(fecha) === 'today'),
                        future: fechasClases.filter(fecha => getDateStatus(fecha) === 'future')
                      }}
                      modifiersClassNames={{
                        available: "bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
                        past: "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        today: "bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
                        future: "bg-yellow-600 text-white hover:bg-yellow-600 hover:text-white focus:bg-yellow-600 focus:text-white"
                      }}
                      disabled={(date) => !fechasClases.some(f => f.toDateString() === date.toDateString())}
                    />
                    
                    {/* Leyenda del calendario */}
                    <div className="mt-3 text-xs text-gray-600">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-600 rounded"></div>
                          <span>Clases pasadas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <span>Clase de hoy</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                          <span>Clases futuras</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">Clases del día</h3>
                    {horariosDia.length === 0 ? <p>No hay clases programadas para este día.</p> : (
                      <ul className="mb-4">
                        {horariosDia.map(horario => (
                          <li key={horario.id}>
                            <Button variant={selectedHorario?.id === horario.id ? 'default' : 'outline'} className="mb-2 w-full text-left" onClick={() => setSelectedHorario(horario)}>
                              {horario.curso_nombre || '-'} | {horario.hora_inicio} - {horario.hora_fin}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {selectedHorario && (
                      <>
                        <h4 className="font-semibold mb-2">Estudiantes inscritos</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Estudiante</TableHead>
                              <TableHead>Asistencia</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {estudiantes.map(est => (
                              <TableRow key={est.id}>
                                <TableCell>{est.nombre}</TableCell>
                                <TableCell>{est.presenteHoy ? 'Presente' : 'Ausente'}</TableCell>
                                <TableCell>
                                  {isDateValidForAttendance(selectedDate) ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        onClick={async () => {
                                          const fechaStr = selectedDate?.toISOString().slice(0, 10)
                                          await fetch('/api/horarios/asistencias', {
                                            method: 'POST',
                                            headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                                            },
                                            body: JSON.stringify({ estudiante_id: est.id, horario_id: selectedHorario.id, fecha: fechaStr, presente: true })
                                          })
                                          // Refrescar estudiantes
                                          fetch(`/api/horarios/${selectedHorario.id}/estudiantes`, {
                                            headers: {
                                              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                                              'Content-Type': 'application/json'
                                            }
                                          })
                                            .then(res => res.json())
                                            .then(data => setEstudiantes(data))
                                        }}
                                      >
                                        Marcar Asistencia
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="ml-2" 
                                        onClick={async () => {
                                          const fechaStr = selectedDate?.toISOString().slice(0, 10)
                                          await fetch('/api/horarios/asistencias', {
                                            method: 'POST',
                                            headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                                            },
                                            body: JSON.stringify({ estudiante_id: est.id, horario_id: selectedHorario.id, fecha: fechaStr, presente: false })
                                          })
                                          // Refrescar estudiantes
                                          fetch(`/api/horarios/${selectedHorario.id}/estudiantes`, {
                                            headers: {
                                              'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                                              'Content-Type': 'application/json'
                                            }
                                          })
                                            .then(res => res.json())
                                            .then(data => setEstudiantes(data))
                                        }}
                                      >
                                        Marcar Inasistencia
                                      </Button>
                                    </>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      {getDateStatus(selectedDate) === 'future' ? 'Clase futura' : 'Fecha no válida'}
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="estudiantes">
            <Card>
              <CardHeader>
                <CardTitle>Estudiantes</CardTitle>
                <CardDescription>Lista de todos tus estudiantes. Puedes filtrar por curso.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Asistencia</TableHead>
                      <TableHead>Detalle Asistencia</TableHead>
                      <TableHead>Última Clase</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(estudiantesPorHorario).map(([horarioId, estudiantes]) => (
                      estudiantes.filter(e => e && e.id && e.nombre && e.email).map((estudiante, idx) => (
                        <TableRow key={estudiante.id ? `estudiante-${estudiante.id}` : `idx-${idx}`}>
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
                            <Badge variant="outline">{estudiante.curso_nombre || '-'}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {typeof estudiante.asistencia === 'number' ? (
                                <div className="flex items-center gap-2">
                                  <div className={`font-semibold ${
                                    estudiante.asistencia >= 80 ? 'text-green-600' :
                                    estudiante.asistencia >= 60 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {estudiante.asistencia}%
                                  </div>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        estudiante.asistencia >= 80 ? 'bg-green-500' :
                                        estudiante.asistencia >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${estudiante.asistencia}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-600">
                              {estudiante.asistenciasReales !== undefined && estudiante.totalClasesProgramadas !== undefined ? (
                                <div>
                                  <div>{estudiante.asistenciasReales} de {estudiante.totalClasesProgramadas} clases</div>
                                  <div className="text-gray-400">
                                    {estudiante.totalClasesProgramadas - estudiante.asistenciasReales} ausencias
                                  </div>
                                </div>
                              ) : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {estudiante.ultimaAsistencia ? new Date(estudiante.ultimaAsistencia).toLocaleDateString() : '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVerEstadisticas(estudiante)}
                            >
                              Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAddSchedule} onOpenChange={setShowAddSchedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editHorario ? 'Editar Horario' : 'Agregar Horario'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const diasSeleccionados = formData.getAll('dia_semana');
            if (editHorario) {
              await fetch(`/api/horarios/horarios/${editHorario.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                },
                body: JSON.stringify({
                  curso_id: formData.get('curso_id'),
                  dia_semana: diasSeleccionados.join(','),
                  hora_inicio: formData.get('hora_inicio'),
                  hora_fin: formData.get('hora_fin'),
                  max_estudiantes: formData.get('max_estudiantes'),
                  estado: 'activo'
                })
              });
            } else {
              await Promise.all(diasSeleccionados.map(dia =>
                fetch('/api/horarios/horarios', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
                  },
                  body: JSON.stringify({
                    ...Object.fromEntries(formData.entries()),
                    dia_semana: dia,
                    docente_id: user.id
                  })
                })
              ));
            }
            setShowAddSchedule(false);
            setEditHorario(null);
            // Refrescar horarios
            fetch(`/api/horarios/docente/${user.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
                'Content-Type': 'application/json'
              }
            })
            .then(res => {
              if (!res.ok) throw new Error('Error al obtener horarios');
              return res.json();
            })
            .then(data => setHorarios(data))
          }} className="space-y-4">
            {!editHorario && (
              <div>
                <Label>Curso</Label>
                <select
                  name="curso_id"
                  value={formHorario.curso_id}
                  onChange={e => setFormHorario(f => ({ ...f, curso_id: e.target.value }))}
                  required
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecciona un curso</option>
                  {cursos.map(curso => (
                    <option key={curso.id} value={curso.id}>{curso.titulo}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label>Día(s) de la semana</Label>
              <div className="flex flex-wrap gap-2">
                {diasSemana.map(dia => (
                  <label key={dia.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="dia_semana"
                      value={dia.value}
                      checked={formHorario.dia_semana.split(',').includes(dia.value)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setFormHorario(f => {
                          let dias = f.dia_semana ? f.dia_semana.split(',') : [];
                          if (checked) {
                            dias = [...dias, dia.value];
                          } else {
                            dias = dias.filter(d => d !== dia.value);
                          }
                          return { ...f, dia_semana: dias.join(',') };
                        });
                      }}
                    />
                    {dia.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Hora de inicio</Label>
              <div className="relative">
                <input
                  name="hora_inicio"
                  type="time"
                  className="w-full border rounded px-2 py-1 pr-10"
                  value={formHorario.hora_inicio}
                  onChange={e => setFormHorario(f => ({ ...f, hora_inicio: e.target.value }))}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div>
              <Label>Hora de fin</Label>
              <div className="relative">
                <input
                  name="hora_fin"
                  type="time"
                  className="w-full border rounded px-2 py-1 pr-10"
                  value={formHorario.hora_fin}
                  onChange={e => setFormHorario(f => ({ ...f, hora_fin: e.target.value }))}
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <Clock className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div>
              <Label>Máx. estudiantes</Label>
              <Input
                name="max_estudiantes"
                type="number"
                min="1"
                value={formHorario.max_estudiantes}
                onChange={e => setFormHorario(f => ({ ...f, max_estudiantes: Number(e.target.value) }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { setShowAddSchedule(false); setEditHorario(null); }}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Estadísticas Detalladas */}
      <Dialog open={showEstadisticasModal} onOpenChange={setShowEstadisticasModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Estadísticas de Asistencia - {estudianteSeleccionado?.nombre}</DialogTitle>
            <DialogDescription>
              Información detallada sobre la asistencia del estudiante
            </DialogDescription>
          </DialogHeader>
          
          {estadisticasEstudiante && (
            <div className="space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">{estadisticasEstudiante.curso_nombre}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Fecha de Inscripción</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold">
                      {new Date(estadisticasEstudiante.fecha_inscripcion).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Estadísticas principales */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Porcentaje Asistencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        estadisticasEstudiante.porcentaje_asistencia >= 80 ? 'text-green-600' :
                        estadisticasEstudiante.porcentaje_asistencia >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {estadisticasEstudiante.porcentaje_asistencia}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            estadisticasEstudiante.porcentaje_asistencia >= 80 ? 'bg-green-500' :
                            estadisticasEstudiante.porcentaje_asistencia >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${estadisticasEstudiante.porcentaje_asistencia}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Asistencias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {estadisticasEstudiante.asistencias_reales}
                      </div>
                      <p className="text-sm text-gray-600">de {estadisticasEstudiante.total_clases_programadas} clases</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Ausencias</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {estadisticasEstudiante.ausencias}
                      </div>
                      <p className="text-sm text-gray-600">registradas</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Fechas de asistencia y ausencia */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Fechas de Asistencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-32 overflow-y-auto">
                      {estadisticasEstudiante.fechas_asistencia.length > 0 ? (
                        <div className="space-y-1">
                          {estadisticasEstudiante.fechas_asistencia.map((fecha: string, index: number) => (
                            <div key={index} className="text-sm text-green-600">
                              ✓ {new Date(fecha).toLocaleDateString()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No hay asistencias registradas</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Fechas de Ausencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-32 overflow-y-auto">
                      {estadisticasEstudiante.fechas_ausencia.length > 0 ? (
                        <div className="space-y-1">
                          {estadisticasEstudiante.fechas_ausencia.map((fecha: string, index: number) => (
                            <div key={index} className="text-sm text-red-600">
                              ✗ {new Date(fecha).toLocaleDateString()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No hay ausencias registradas</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Últimas actividades */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Últimas Actividades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {estadisticasEstudiante.ultima_asistencia && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          Última asistencia: {new Date(estadisticasEstudiante.ultima_asistencia).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {estadisticasEstudiante.ultima_ausencia && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm">
                          Última ausencia: {new Date(estadisticasEstudiante.ultima_ausencia).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setShowEstadisticasModal(false)}>
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 