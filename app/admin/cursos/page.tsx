"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Search, Plus, Edit, Trash2, Users, Calendar, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/use-toast'

type Course = {
  id: number;
  title: string;
  level: string;
  teacher: string;
  students: number;
  maxStudents: number;
  status: string;
  rating: number;
  duration: string;
  price: string;
  startDate: string;
  description: string;
};

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState({
    title: '',
    level: '',
    teacher: '',
    maxStudents: '',
    duration: '',
    price: '',
    startDate: '',
    description: ''
  })

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:4000/api/cursos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.map((c: any) => ({
          id: c.id,
          title: c.titulo,
          level: c.nivel,
          teacher: c.docente_nombre || '',
          students: c.estudiantes || 0,
          maxStudents: c.max_estudiantes || 0,
          status: c.estado || 'active',
          rating: c.rating || 0,
          duration: c.duracion,
          price: c.precio || '',
          startDate: c.fecha_inicio || '',
          description: c.descripcion
        })));
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    
    return matchesSearch && matchesLevel && matchesStatus
  })

  const handleAddCourse = () => {
    const course = {
      id: Date.now(),
      title: newCourse.title,
      level: newCourse.level,
      teacher: newCourse.teacher,
      students: 0,
      maxStudents: parseInt(newCourse.maxStudents),
      status: "draft",
      rating: 0,
      duration: newCourse.duration,
      price: newCourse.price,
      startDate: newCourse.startDate,
      description: newCourse.description
    }

    setCourses(prev => [...prev, course])
    setNewCourse({
      title: '', level: '', teacher: '', maxStudents: '', duration: '', price: '', startDate: '', description: ''
    })
    setIsAddDialogOpen(false)
  }

  const toggleCourseStatus = (courseId: number) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, status: course.status === 'active' ? 'draft' : 'active' }
        : course
    ))
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-100 text-green-800'
      case 'A2': return 'bg-green-100 text-green-800'
      case 'B1': return 'bg-orange-100 text-orange-800'
      case 'B2': return 'bg-orange-100 text-orange-800'
      case 'C1': return 'bg-purple-100 text-purple-800'
      case 'C2': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: courses.length,
    active: courses.filter(c => c.status === 'active').length,
    draft: courses.filter(c => c.status === 'draft').length,
    totalStudents: courses.reduce((acc, c) => acc + c.students, 0),
    averageRating: (courses.filter(c => c.rating > 0).reduce((acc, c) => acc + c.rating, 0) / courses.filter(c => c.rating > 0).length || 0).toFixed(1)
  }

  const leaveSchedule = async (inscripcionId: string) => {
   
    console.log('Intentando dar de baja inscripción:', inscripcionId);
    if (!inscripcionId) {
      toast({
        title: 'Error',
        description: 'No se encontró el ID de la inscripción.',
        variant: 'destructive',
      });
      return { success: false, message: 'No se encontró el ID de la inscripción.' };
    }
    
    return { success: true, message: 'Baja exitosa' };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título y botón de volver */}
        <div className="flex flex-col sm:items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-2">Administra todos los cursos de la plataforma</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>

        {/* Estadísticas: solo Total Cursos */}
        <div className="flex justify-center mb-8">
          <Card className="w-64">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">{stats.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botón Crear Curso arriba de la lista */}
        {/* Eliminado */}

        {/* Filtros y búsqueda: solo búsqueda por nombre */}
        {/* Eliminado */}

        {/* Tabla de cursos simplificada */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cursos</CardTitle>
            <CardDescription>
              Gestiona todos los cursos disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Nivel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="font-medium">{course.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">{course.duration}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(course.level)}>
                        {course.level}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 