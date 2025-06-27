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
import { crearCurso, actualizarCurso, eliminarCurso } from '@/lib/api'

type Course = {
  id: number;
  titulo: string;
  nivel: string;
  descripcion: string;
  duracion: string;
  estado: string;
  docente_id?: number;
  docente_nombre?: string;
};

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Estados para modales
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  
  // Estados para formularios
  const [newCourse, setNewCourse] = useState({
    titulo: '',
    nivel: '',
    descripcion: '',
    duracion: '',
    estado: 'activo'
  })

  const [editCourse, setEditCourse] = useState({
    titulo: '',
    nivel: '',
    descripcion: '',
    duracion: '',
    estado: ''
  })

  // Función para generar slug automáticamente
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim()
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:4000/api/cursos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Error al cargar los cursos",
        variant: "destructive",
      });
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación del lado del cliente
    if (!newCourse.titulo || newCourse.titulo.trim().length < 3) {
      toast({
        title: "Error",
        description: "El título debe tener al menos 3 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    if (!newCourse.descripcion || newCourse.descripcion.trim().length < 10) {
      toast({
        title: "Error",
        description: "La descripción debe tener al menos 10 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    if (!newCourse.nivel) {
      toast({
        title: "Error",
        description: "Debe seleccionar un nivel",
        variant: "destructive",
      });
      return;
    }
    
    if (!newCourse.duracion || newCourse.duracion.trim().length < 2) {
      toast({
        title: "Error",
        description: "La duración debe tener al menos 2 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    // Generar slug automáticamente basado en el título
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
        .trim()
        .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
    }
    
    const cursoData = {
      ...newCourse,
      slug: generateSlug(newCourse.titulo)
    }
    
    try {
      await crearCurso(cursoData)
      toast({
        title: "Éxito",
        description: "Curso creado correctamente",
      });
      setIsAddDialogOpen(false)
      setNewCourse({
        titulo: '', nivel: '', descripcion: '', duracion: '', estado: 'activo'
      })
      fetchCourses()
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Error al crear el curso",
        variant: "destructive",
      });
    }
  }

  const handleEditCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return
    
    try {
      await actualizarCurso(selectedCourse.id, editCourse)
      toast({
        title: "Éxito",
        description: "Curso actualizado correctamente",
      });
      setIsEditDialogOpen(false)
      setSelectedCourse(null)
      fetchCourses()
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Error al actualizar el curso",
        variant: "destructive",
      });
    }
  }

  const handleDeleteCourse = async (id: number) => {
    try {
      await eliminarCurso(id)
      toast({
        title: "Éxito",
        description: "Curso desactivado correctamente",
      });
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: "Error al desactivar el curso",
        variant: "destructive",
      });
    }
  }

  const openEditDialog = (course: Course) => {
    setSelectedCourse(course)
    setEditCourse({
      titulo: course.titulo,
      nivel: course.nivel,
      descripcion: course.descripcion,
      duracion: course.duracion,
      estado: course.estado
    })
    setIsEditDialogOpen(true)
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.docente_nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || course.nivel === levelFilter
    const matchesStatus = statusFilter === "all" || course.estado === statusFilter
    
    return matchesSearch && matchesLevel && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800'
      case 'inactivo': return 'bg-red-100 text-red-800'
      case 'borrador': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
    activos: courses.filter(c => c.estado === 'activo').length,
    inactivos: courses.filter(c => c.estado === 'inactivo').length,
    borradores: courses.filter(c => c.estado === 'borrador').length,
    totalEstudiantes: courses.reduce((acc, c) => acc + (c.estudiantes || 0), 0)
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactivos</CardTitle>
              <div className="h-4 w-4 bg-red-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactivos}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borradores</CardTitle>
              <div className="h-4 w-4 bg-gray-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.borradores}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEstudiantes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botón Crear Curso */}
        <div className="flex justify-between items-center mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Nuevo Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Curso</DialogTitle>
                <DialogDescription>
                  Completa la información del nuevo curso
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo">Título del Curso</Label>
                    <Input
                      id="titulo"
                      value={newCourse.titulo}
                      onChange={(e) => setNewCourse({...newCourse, titulo: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nivel">Nivel</Label>
                    <Select value={newCourse.nivel} onValueChange={(value) => setNewCourse({...newCourse, nivel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A1">A1 - Principiante</SelectItem>
                        <SelectItem value="A2">A2 - Básico</SelectItem>
                        <SelectItem value="B1">B1 - Intermedio</SelectItem>
                        <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                        <SelectItem value="C1">C1 - Avanzado</SelectItem>
                        <SelectItem value="C2">C2 - Maestría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={newCourse.descripcion}
                    onChange={(e) => setNewCourse({...newCourse, descripcion: e.target.value})}
                    placeholder="Describe el contenido del curso, objetivos de aprendizaje, metodología, etc. (mínimo 10 caracteres)"
                    minLength={10}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duracion">Duración</Label>
                    <Input
                      id="duracion"
                      value={newCourse.duracion}
                      onChange={(e) => setNewCourse({...newCourse, duracion: e.target.value})}
                      placeholder="ej: 8 semanas"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={newCourse.estado} onValueChange={(value) => setNewCourse({...newCourse, estado: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="borrador">Borrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Crear Curso
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Filtros */}
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabla de cursos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cursos ({filteredCourses.length})</CardTitle>
            <CardDescription>
              Gestiona todos los cursos disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No se encontraron cursos</TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{course.titulo}</div>
                          <div className="text-sm text-gray-500">{course.docente_nombre || 'Sin docente asignado'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(course.nivel)}>
                          {course.nivel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{course.duracion}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(course.estado)}>
                          {course.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog open={isEditDialogOpen && selectedCourse?.id === course.id} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(course)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Editar Curso</DialogTitle>
                                <DialogDescription>
                                  Modifica la información del curso
                                </DialogDescription>
                              </DialogHeader>
                              <form onSubmit={handleEditCourse} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-titulo">Título del Curso</Label>
                                    <Input
                                      id="edit-titulo"
                                      value={editCourse.titulo}
                                      onChange={(e) => setEditCourse({...editCourse, titulo: e.target.value})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-nivel">Nivel</Label>
                                    <Select value={editCourse.nivel} onValueChange={(value) => setEditCourse({...editCourse, nivel: value})}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="A1">A1 - Principiante</SelectItem>
                                        <SelectItem value="A2">A2 - Básico</SelectItem>
                                        <SelectItem value="B1">B1 - Intermedio</SelectItem>
                                        <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                                        <SelectItem value="C1">C1 - Avanzado</SelectItem>
                                        <SelectItem value="C2">C2 - Maestría</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="edit-descripcion">Descripción</Label>
                                  <Textarea
                                    id="edit-descripcion"
                                    value={editCourse.descripcion}
                                    onChange={(e) => setEditCourse({...editCourse, descripcion: e.target.value})}
                                    placeholder="Describe el contenido del curso, objetivos de aprendizaje, metodología, etc. (mínimo 10 caracteres)"
                                    minLength={10}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="edit-duracion">Duración</Label>
                                    <Input
                                      id="edit-duracion"
                                      value={editCourse.duracion}
                                      onChange={(e) => setEditCourse({...editCourse, duracion: e.target.value})}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="edit-estado">Estado</Label>
                                    <Select value={editCourse.estado} onValueChange={(value) => setEditCourse({...editCourse, estado: value})}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="activo">Activo</SelectItem>
                                        <SelectItem value="inactivo">Inactivo</SelectItem>
                                        <SelectItem value="borrador">Borrador</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                    Guardar Cambios
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción desactivará el curso "{course.titulo}". Los estudiantes no podrán inscribirse en horarios de este curso, pero los datos se mantendrán en el sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Desactivar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 