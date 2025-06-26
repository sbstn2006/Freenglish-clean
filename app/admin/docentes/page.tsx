"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { UserCheck, Search, Star, Calendar, BookOpen, CheckCircle, XCircle, Eye, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog'
import { getAllDocentes, aprobarDocente, rechazarDocente, actualizarDocente, getCursosHorariosDocente } from '@/lib/api'

export default function AdminDocentesPage() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [specialtyFilter, setSpecialtyFilter] = useState("all")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
  const [cursosHorarios, setCursosHorarios] = useState<any[]>([])
  const [editForm, setEditForm] = useState({ name: '', email: '', status: '' })

  useEffect(() => {
    loadDocentes()
  }, [])

  const loadDocentes = async () => {
    setLoading(true)
    try {
      const docentes = await getAllDocentes()
      setTeachers(docentes)
    } catch (e) {
      // Manejo de error
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    await aprobarDocente(id)
    await loadDocentes()
  }

  const handleReject = async (id: number) => {
    await rechazarDocente(id)
    await loadDocentes()
  }

  const handleEditOpen = (teacher: any) => {
    setSelectedTeacher(teacher)
    setEditForm({ name: teacher.name, email: teacher.email, status: teacher.status })
    setEditModalOpen(true)
  }

  const handleEditSubmit = async (e: any) => {
    e.preventDefault()
    if (!selectedTeacher) return
    await actualizarDocente(selectedTeacher.id, editForm)
    setEditModalOpen(false)
    setSelectedTeacher(null)
    await loadDocentes()
  }

  const handleViewOpen = async (teacher: any) => {
    setSelectedTeacher(teacher)
    setViewModalOpen(true)
    try {
      const data = await getCursosHorariosDocente(teacher.id)
      setCursosHorarios(data)
    } catch (e) {
      setCursosHorarios([])
    }
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || teacher.status === statusFilter
    // specialtyFilter ignorado porque no hay campo specialty real
    return matchesSearch && matchesStatus
  })

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <TableHead>Estado</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>
                ) : filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(teacher.status)}>
                        {getStatusText(teacher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{teacher.students ?? 0} estudiantes</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{teacher.courses ?? 0} cursos</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={viewModalOpen && selectedTeacher?.id === teacher.id} onOpenChange={(open) => { setViewModalOpen(open); if (!open) setSelectedTeacher(null) }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleViewOpen(teacher)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cursos y Horarios de {teacher.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-2">
                              {cursosHorarios.length === 0 ? (
                                <p className="text-sm text-gray-600">No tiene cursos asignados.</p>
                              ) : (
                                cursosHorarios.map((curso: any) => (
                                  <div key={curso.id} className="border rounded p-2">
                                    <div className="font-semibold">{curso.curso}</div>
                                    <div className="text-xs text-gray-500">{curso.dia_semana} {curso.hora_inicio} - {curso.hora_fin}</div>
                                  </div>
                                ))
                              )}
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cerrar</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={editModalOpen && selectedTeacher?.id === teacher.id} onOpenChange={(open) => { setEditModalOpen(open); if (!open) setSelectedTeacher(null) }}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditOpen(teacher)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar Docente</DialogTitle>
                              <DialogDescription>Modifica los datos del docente y guarda los cambios.</DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4" onSubmit={handleEditSubmit}>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <Input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Correo</label>
                                <Input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Estado</label>
                                <Select value={editForm.status} onValueChange={v => setEditForm(f => ({ ...f, status: v }))}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approved">Aprobado</SelectItem>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="rejected">Rechazado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter>
                                <Button type="submit" className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        {teacher.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(teacher.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(teacher.id)}
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