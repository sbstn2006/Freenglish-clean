"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GraduationCap, Search, Calendar, DollarSign, Users, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  const [enrollments, setEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [courseFilter, setCourseFilter] = useState("all")

  useEffect(() => {
    setLoading(true)
    fetch('/api/inscripciones/all-enriched')
      .then(res => res.json())
      .then((data) => {
        setEnrollments(data)
        setLoading(false)
      })
  }, [])

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = (enrollment.student?.toLowerCase() || '') + (enrollment.course?.toLowerCase() || '')
      .includes(searchTerm.toLowerCase())
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

  const handleDeleteEnrollment = async (enrollmentId: number) => {
    const res = await fetch(`/api/horarios/inscripciones/${enrollmentId}`, { method: 'DELETE' })
    if (res.ok) {
      setEnrollments(prev => prev.filter(e => e.id !== enrollmentId))
    }
  }

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
        <div className="flex justify-center mb-8">
          <Card className="w-64">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inscripciones</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">{stats.total}</div>
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
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  {uniqueCourses.map((course, idx) => (
                    <SelectItem key={course || idx} value={course}>{course}</SelectItem>
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
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnrollments.map((row) => (
                  <TableRow key={row.inscripcion_id || row.id}>
                    <TableCell>{row.estudiante_nombre}</TableCell>
                    <TableCell>{row.curso_titulo}</TableCell>
                    <TableCell>{row.docente_nombre}</TableCell>
                    <TableCell>{row.fecha_inscripcion}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteEnrollment(row.inscripcion_id || row.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
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