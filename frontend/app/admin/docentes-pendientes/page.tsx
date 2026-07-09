"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserCheck, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'
import { getPendingDocentes, activateDocente } from '@/lib/api'

interface DocentePendiente {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt?: string
}

export default function DocentesPendientesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [docentesPendientes, setDocentesPendientes] = useState<DocentePendiente[]>([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Verificar si es admin
    if (user.role !== 'admin') {
      router.push('/perfil')
      return
    }

    // Cargar docentes pendientes
    loadPendingDocentes()
  }, [user, router])

  const loadPendingDocentes = async () => {
    try {
      setIsLoading(true)
      const data = await getPendingDocentes()
      setDocentesPendientes(data)
    } catch (error) {
      console.error('Error al cargar docentes pendientes:', error)
      setMessage('Error al cargar los docentes pendientes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAprobar = async (id: number) => {
    try {
      await activateDocente(id)
      setMessage(`Docente ${id} aprobado exitosamente`)
      // Recargar la lista
      await loadPendingDocentes()
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error('Error al aprobar docente:', error)
      setMessage('Error al aprobar el docente')
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleRechazar = (id: number) => {
    // Por ahora solo simulamos el rechazo
    setDocentesPendientes(prev => 
      prev.filter(docente => docente.id !== id)
    )
    setMessage(`Docente ${id} rechazado`)
    setTimeout(() => setMessage(""), 3000)
  }

  if (!user) {
    return <div>No autorizado</div>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <MainNavigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando docentes pendientes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al panel principal
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Docentes Pendientes de Aprobación</h1>
          <p className="text-gray-600 mt-2">
            Revisa y aprueba las solicitudes de nuevos docentes
          </p>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pendientes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {docentesPendientes.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Esperando aprobación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobados Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-xs text-muted-foreground">
                En las últimas 24 horas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazados Hoy</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">0</div>
              <p className="text-xs text-muted-foreground">
                En las últimas 24 horas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Docentes Pendientes */}
        <div className="space-y-6">
          {docentesPendientes.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay docentes pendientes
                  </h3>
                  <p className="text-gray-600">
                    Todas las solicitudes han sido procesadas.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            docentesPendientes.map((docente) => (
              <Card key={docente.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {docente.name}
                        </h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pendiente
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Email:</strong> {docente.email}</p>
                          <p><strong>Rol:</strong> {docente.role}</p>
                        </div>
                        <div>
                          <p><strong>Estado:</strong> {docente.status}</p>
                          <p><strong>ID:</strong> {docente.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleAprobar(docente.id)}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button
                        onClick={() => handleRechazar(docente.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 