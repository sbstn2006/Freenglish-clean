"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Users, Search, Edit, Calendar } from 'lucide-react'
import { useState } from 'react'

// Datos simulados de estudiantes
const mockStudents = [
  { id: 1, name: "María González", email: "maria@email.com", level: "B1", progress: 75, lastActivity: "2024-01-15", courses: 3, joinDate: "2023-09-15" },
  { id: 2, name: "Carlos Rodríguez", email: "carlos@email.com", level: "A2", progress: 45, lastActivity: "2024-01-14", courses: 2, joinDate: "2023-10-20" },
  { id: 3, name: "Ana Martínez", email: "ana@email.com", level: "C1", progress: 90, lastActivity: "2024-01-10", courses: 4, joinDate: "2023-08-05" },
  { id: 4, name: "Luis Pérez", email: "luis@email.com", level: "A1", progress: 20, lastActivity: "2024-01-16", courses: 1, joinDate: "2024-01-02" },
  { id: 5, name: "Sofia Herrera", email: "sofia@email.com", level: "B2", progress: 60, lastActivity: "2024-01-13", courses: 3, joinDate: "2023-11-12" },
  { id: 6, name: "Diego Silva", email: "diego@email.com", level: "A2", progress: 30, lastActivity: "2024-01-08", courses: 2, joinDate: "2023-12-01" },
]

export default function AdminEstudiantesPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === "all" || student.level === levelFilter
    
    return matchesSearch && matchesLevel
  })

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
    total: students.length,
    averageProgress: Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length),
    totalCourses: students.reduce((acc, s) => acc + s.courses, 0),
    activeThisWeek: students.filter(s => {
      const lastActivity = new Date(s.lastActivity)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return lastActivity >= weekAgo
    }).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
          <p className="text-gray-600 mt-2">Administra todos los estudiantes registrados en la plataforma</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
              <div className="h-4 w-4 bg-blue-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCourses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.activeThisWeek}</div>
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
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="A1">A1 - Principiante</SelectItem>
                  <SelectItem value="A2">A2 - Básico</SelectItem>
                  <SelectItem value="B1">B1 - Intermedio</SelectItem>
                  <SelectItem value="B2">B2 - Intermedio Alto</SelectItem>
                  <SelectItem value="C1">C1 - Avanzado</SelectItem>
                  <SelectItem value="C2">C2 - Maestría</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de estudiantes */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estudiantes ({filteredStudents.length})</CardTitle>
            <CardDescription>
              Información detallada de todos los estudiantes registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(student.level)}>
                        {student.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{student.courses} cursos</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{student.lastActivity}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{student.joinDate}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
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