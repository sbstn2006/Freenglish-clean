"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { UserCheck, Search, Star, Calendar, BookOpen, CheckCircle, XCircle, Eye, Edit } from 'lucide-react'
import { useState } from 'react'

// Datos simulados de docentes
const mockTeachers = [
  { id: 1, name: "Prof. Sarah Johnson", email: "sarah@email.com", specialty: "Gramática", status: "approved", rating: 4.8, students: 45, courses: 8, experience: "5 años", lastActivity: "2024-01-15" },
  { id: 2, name: "Prof. Michael Chen", email: "michael@email.com", specialty: "Conversación", status: "pending", rating: 4.6, students: 32, courses: 6, experience: "3 años", lastActivity: "2024-01-14" },
  { id: 3, name: "Prof. Elena Rodriguez", email: "elena@email.com", specialty: "Literatura", status: "approved", rating: 4.9, students: 58, courses: 10, experience: "7 años", lastActivity: "2024-01-16" },
  { id: 4, name: "Prof. David Wilson", email: "david@email.com", specialty: "Pronunciación", status: "rejected", rating: 4.2, students: 28, courses: 4, experience: "2 años", lastActivity: "2024-01-10" },
  { id: 5, name: "Prof. Lisa Thompson", email: "lisa@email.com", specialty: "Negocios", status: "approved", rating: 4.7, students: 39, courses: 7, experience: "4 años", lastActivity: "2024-01-13" },
  { id: 6, name: "Prof. Carlos Mendez", email: "carlos@email.com", specialty: "TOEFL/IELTS", status: "pending", rating: 4.5, students: 25, courses: 5, experience: "6 años", lastActivity: "2024-01-12" },
]

export default function AdminDocentesPage() {
  const [teachers, setTeachers] = useState(mockTeachers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || teacher.status === statusFilter
    const matchesSpecialty = specialtyFilter === "all" || teacher.specialty === specialtyFilter
    
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  const approveTeacher = (teacherId: number) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: 'approved' }
        : teacher
    ))
  }

  const rejectTeacher = (teacherId: number) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { ...teacher, status: 'rejected' }
        : teacher
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado'
      case 'pending': return 'Pendiente'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const stats = {
    total: teachers.length,
    approved: teachers.filter(t => t.status === 'approved').length,
    pending: teachers.filter(t => t.status === 'pending').length,
    rejected: teachers.filter(t => t.status === 'rejected').length,
    averageRating: (teachers.reduce((acc, t) => acc + t.rating, 0) / teachers.length).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Docentes</h1>
          <p className="text-gray-600 mt-2">Administra y aprueba las solicitudes de docentes</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Docentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <div className="h-4 w-4 bg-yellow-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.averageRating}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="approved">Aprobados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las especialidades</SelectItem>
                  <SelectItem value="Gramática">Gramática</SelectItem>
                  <SelectItem value="Conversación">Conversación</SelectItem>
                  <SelectItem value="Literatura">Literatura</SelectItem>
                  <SelectItem value="Pronunciación">Pronunciación</SelectItem>
                  <SelectItem value="Negocios">Negocios</SelectItem>
                  <SelectItem value="TOEFL/IELTS">TOEFL/IELTS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de docentes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Docentes ({filteredTeachers.length})</CardTitle>
            <CardDescription>
              Gestiona las solicitudes y el estado de los docentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Docente</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Experiencia</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{teacher.specialty}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(teacher.status)}>
                        {getStatusText(teacher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{teacher.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{teacher.students} estudiantes</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{teacher.courses} cursos</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{teacher.experience}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {teacher.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => approveTeacher(teacher.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => rejectTeacher(teacher.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
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