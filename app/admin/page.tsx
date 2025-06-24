"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, UserCheck, GraduationCap, Settings, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'

// Datos simulados para el dashboard de admin
const mockAdminData = {
  estadisticas: {
    totalEstudiantes: 156,
    totalDocentes: 12,
    totalCursos: 8,
    totalInscripciones: 342,
    estudiantesActivos: 142,
    docentesActivos: 10,
    cursosActivos: 6
  },
  actividadesRecientes: [
    {
      id: 1,
      tipo: 'inscripcion',
      descripcion: 'María González se inscribió en Inglés Básico',
      fecha: '2024-03-15 14:30',
      estado: 'completado'
    },
    {
      id: 2,
      tipo: 'docente',
      descripcion: 'Nuevo docente registrado: Prof. Emily Davis',
      fecha: '2024-03-14 09:15',
      estado: 'pendiente'
    },
    {
      id: 3,
      tipo: 'curso',
      descripcion: 'Curso "Conversación Avanzada" creado',
      fecha: '2024-03-13 16:45',
      estado: 'completado'
    },
    {
      id: 4,
      tipo: 'estudiante',
      descripcion: 'Carlos Rodríguez completó el nivel A1',
      fecha: '2024-03-12 11:20',
      estado: 'completado'
    }
  ]
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Verificar si es admin
    const email = user.email.toLowerCase()
    if (!email.includes('admin') && !email.includes('administrador')) {
      router.push('/perfil')
      return
    }
  }, [user, router])

  if (!user) {
    return <div>No autorizado</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona estudiantes, docentes, cursos e inscripciones</p>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.estadisticas.totalEstudiantes}</div>
              <p className="text-xs text-muted-foreground">
                {mockAdminData.estadisticas.estudiantesActivos} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Docentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.estadisticas.totalDocentes}</div>
              <p className="text-xs text-muted-foreground">
                {mockAdminData.estadisticas.docentesActivos} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.estadisticas.totalCursos}</div>
              <p className="text-xs text-muted-foreground">
                {mockAdminData.estadisticas.cursosActivos} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscripciones</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminData.estadisticas.totalInscripciones}</div>
              <p className="text-xs text-muted-foreground">
                Total de inscripciones
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enlaces de Gestión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Link href="/admin/estudiantes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Gestionar Estudiantes</CardTitle>
                <CardDescription>
                  Ver, editar y gestionar todos los estudiantes
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/docentes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <UserCheck className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Gestionar Docentes</CardTitle>
                <CardDescription>
                  Administrar docentes y sus horarios
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/docentes-pendientes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <UserCheck className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Docentes Pendientes</CardTitle>
                <CardDescription>
                  Aprobar o rechazar solicitudes de docentes
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/cursos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Gestionar Cursos</CardTitle>
                <CardDescription>
                  Crear y administrar cursos disponibles
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/inscripciones">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="min-h-[88px]">
                <GraduationCap className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Inscripciones</CardTitle>
                <CardDescription>
                  Ver y gestionar todas las inscripciones
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/material">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-pink-600 mb-2" />
                <CardTitle>Gestionar Material</CardTitle>
                <CardDescription>
                  Administrar recursos y materiales de estudio
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Actividades Recientes */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Actividades Recientes</h2>
            <Badge variant="secondary">Últimas 24 horas</Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Actividad del Sistema</CardTitle>
              <CardDescription>
                Últimas acciones realizadas en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdminData.actividadesRecientes.map((actividad) => (
                  <div key={actividad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        actividad.estado === 'completado' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{actividad.descripcion}</p>
                        <p className="text-xs text-gray-500">{actividad.fecha}</p>
                      </div>
                    </div>
                    <Badge variant={actividad.estado === 'completado' ? 'default' : 'secondary'}>
                      {actividad.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 