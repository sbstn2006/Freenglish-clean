"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GraduationCap, Search, Calendar, DollarSign, Users, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState } from 'react'

// Datos simulados de inscripciones
const mockEnrollments = [
  { id: 1, student: "María González", course: "Inglés Básico A1", teacher: "Prof. Sarah Johnson", enrollmentDate: "2024-01-15", status: "active", paymentStatus: "paid", amount: "$150", progress: 75 },
  { id: 2, student: "Carlos Rodríguez", course: "Conversación Intermedia B1", teacher: "Prof. Michael Chen", enrollmentDate: "2024-01-14", status: "active", paymentStatus: "paid", amount: "$200", progress: 45 },
  { id: 3, student: "Ana Martínez", course: "Gramática Avanzada C1", teacher: "Prof. Elena Rodriguez", enrollmentDate: "2024-01-10", status: "completed", paymentStatus: "paid", amount: "$250", progress: 100 },
  { id: 4, student: "Luis Pérez", course: "Inglés Básico A1", teacher: "Prof. Sarah Johnson", enrollmentDate: "2024-01-16", status: "pending", paymentStatus: "pending", amount: "$150", progress: 0 },
  { id: 5, student: "Sofia Herrera", course: "Preparación TOEFL", teacher: "Prof. Carlos Mendez", enrollmentDate: "2024-01-12", status: "active", paymentStatus: "paid", amount: "$300", progress: 60 },
  { id: 6, student: "Diego Silva", course: "Pronunciación y Fluidez A2", teacher: "Prof. David Wilson", enrollmentDate: "2024-01-08", status: "cancelled", paymentStatus: "refunded", amount: "$120", progress: 20 },
  { id: 7, student: "Laura Torres", course: "Inglés para Negocios B2", teacher: "Prof. Lisa Thompson", enrollmentDate: "2024-01-13", status: "active", paymentStatus: "paid", amount: "$180", progress: 30 },
  { id: 8, student: "Roberto Jiménez", course: "Conversación Intermedia B1", teacher: "Prof. Michael Chen", enrollmentDate: "2024-01-11", status: "pending", paymentStatus: "pending", amount: "$200", progress: 0 },
]

export default function AdminInscripcionesPage() {
  const [enrollments, setEnrollments] = useState(mockEnrollments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || enrollment.status === statusFilter
    const matchesPayment = paymentFilter === "all" || enrollment.paymentStatus === paymentFilter
    const matchesCourse = courseFilter === "all" || enrollment.course === courseFilter
    
    return matchesSearch && matchesStatus && matchesPayment && matchesCourse
  })

  const approveEnrollment = (enrollmentId: number) => {
    setEnrollments(prev => prev.map(enrollment => 
      enrollment.id === enrollmentId 
        ? { ...enrollment, status: 'active', paymentStatus: 'paid' }
        : enrollment
    ))
  }

  const rejectEnrollment = (enrollmentId: number) => {
    setEnrollments(prev => prev.map(enrollment => 
      enrollment.id === enrollmentId 
        ? { ...enrollment, status: 'cancelled', paymentStatus: 'refunded' }
        : enrollment
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'refunded': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'completed': return 'Completada'
      case 'pending': return 'Pendiente'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const getPaymentText = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid': return 'Pagado'
      case 'pending': return 'Pendiente'
      case 'refunded': return 'Reembolsado'
      default: return paymentStatus
    }
  }

  const stats = {
    total: enrollments.length,
    active: enrollments.filter(e => e.status === 'active').length,
    completed: enrollments.filter(e => e.status === 'completed').length,
    pending: enrollments.filter(e => e.status === 'pending').length,
    totalRevenue: enrollments.filter(e => e.paymentStatus === 'paid').reduce((acc, e) => acc + parseFloat(e.amount.replace('$', '')), 0),
    averageProgress: Math.round(enrollments.filter(e => e.status === 'active').reduce((acc, e) => acc + e.progress, 0) / enrollments.filter(e => e.status === 'active').length || 0)
  }

  const uniqueCourses = [...new Set(enrollments.map(e => e.course))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Inscripciones</h1>
          <p className="text-gray-600 mt-2">Administra todas las inscripciones de estudiantes a los cursos</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activas</CardTitle>
              <div className="h-4 w-4 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.averageProgress}%</div>
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
                    placeholder="Buscar por estudiante o curso..."
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
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los pagos</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  {uniqueCourses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de inscripciones */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Inscripciones ({filteredEnrollments.length})</CardTitle>
            <CardDescription>
              Gestiona el estado y la información de las inscripciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead>Fecha de Inscripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div className="font-medium">{enrollment.student}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{enrollment.course}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{enrollment.teacher}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{enrollment.enrollmentDate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {getStatusText(enrollment.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentColor(enrollment.paymentStatus)}>
                        {getPaymentText(enrollment.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{enrollment.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{enrollment.amount}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {enrollment.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => approveEnrollment(enrollment.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => rejectEnrollment(enrollment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {enrollment.status === 'active' && (
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
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