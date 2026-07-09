"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, UserCheck, GraduationCap, Settings, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    estudiantesActivos: 0,
    totalDocentes: 0,
    docentesActivos: 0,
    totalCursos: 0,
    cursosActivos: 0,
    totalInscripciones: 0
  })
  const [actividades, setActividades] = useState<any[]>([])

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    // Verificar si es admin
    const email = user.email.toLowerCase();
    if (!email.includes('admin') && !email.includes('administrador')) {
      router.push('/perfil');
      return;
    }

    // Fetch datos reales
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        // Estudiantes y docentes
        const usersRes = await fetch('http://localhost:4000/api/admin/estudiantes', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
          }
        });
        const users = usersRes.ok ? await usersRes.json() : [];
        const estudiantes = users.filter((u: any) => u.rol === 'estudiante');
        const docentes = users.filter((u: any) => u.rol === 'docente');
        // Cursos
        const cursosRes = await fetch('http://localhost:4000/api/cursos', { headers: { 'Content-Type': 'application/json' } });
        const cursos = cursosRes.ok ? await cursosRes.json() : [];
        // Inscripciones (nuevo endpoint global)
        const inscRes = await fetch('http://localhost:4000/api/horarios/inscripciones-enriquecidas', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token || ''}`
          }
        });
        const inscripciones = inscRes.ok ? await inscRes.json() : [];
        // Actividades recientes
        const actRes = await fetch('http://localhost:4000/api/actividades-recientes', {
          headers: { 'Content-Type': 'application/json' }
        });
        const actividades = actRes.ok ? await actRes.json() : [];
        setActividades(actividades);
        setStats({
          totalEstudiantes: estudiantes.length,
          estudiantesActivos: estudiantes.filter((e: any) => e.status === 'approved' || e.status === 'activo').length,
          totalDocentes: docentes.length,
          docentesActivos: docentes.filter((d: any) => d.status === 'approved' || d.status === 'activo').length,
          totalCursos: cursos.length,
          cursosActivos: cursos.filter((c: any) => c.estado === 'activo' || c.status === 'activo').length,
          totalInscripciones: inscripciones.length
        });
      } catch (e) {
        // fallback: todo 0
        setStats({
          totalEstudiantes: 0,
          estudiantesActivos: 0,
          totalDocentes: 0,
          docentesActivos: 0,
          totalCursos: 0,
          cursosActivos: 0,
          totalInscripciones: 0
        });
      }
    }
    fetchStats()
  }, [user, isLoading, router])

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
              <div className="text-2xl font-bold">{stats.totalEstudiantes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Docentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocentes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCursos}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscripciones</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInscripciones}</div>
            </CardContent>
          </Card>
        </div>

        {/* Enlaces de Gestión */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                {actividades.length === 0 ? (
                  <div className="text-gray-400 text-sm">No hay actividades recientes.</div>
                ) : (
                  actividades.slice(0, 10).map((actividad) => (
                    <div key={actividad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{actividad.accion}</p>
                          <p className="text-xs text-gray-500">{new Date(actividad.fecha).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{actividad.nombre} &lt;{actividad.email}&gt;</p>
                        </div>
                      </div>
                      <Badge variant="default">ID {actividad.usuario_id}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 