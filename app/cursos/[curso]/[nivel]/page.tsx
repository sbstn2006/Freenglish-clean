"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, ArrowLeft, Clock, Star, Users, Calendar, MapPin, BookOpen, Globe, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { docentesData, nivelInfo } from "@/data/cursos"
import { useAuth } from "@/contexts/AuthContext"

export default function NivelPage() {
  const params = useParams()
  const cursoId = params.curso as string
  const nivelId = params.nivel as string
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null)
  const { user, logout } = useAuth()

  const docentes = docentesData[cursoId]?.[nivelId] || []
  const nivel = nivelInfo[nivelId]

  if (!nivel) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nivel no encontrado</h1>
          <Link href="/cursos">
            <Button>Volver a Cursos</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header idéntico al de la página principal */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Globe className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">Freenglish</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <Link href="/#cursos" className="text-sm font-medium hover:text-green-600 transition-colors">
            Cursos
          </Link>
          <Link href="/#niveles" className="text-sm font-medium hover:text-green-600 transition-colors">
            Niveles
          </Link>
          <Link href="/#testimonios" className="text-sm font-medium hover:text-green-600 transition-colors">
            Testimonios
          </Link>
          <Link href="/#contacto" className="text-sm font-medium hover:text-green-600 transition-colors">
            Contacto
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-green-600 font-medium">{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-green-600 transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium hover:text-green-600 transition-colors">
                Registro
              </Link>
            </>
          )}
        </nav>
        <Button variant="outline" size="sm" className="ml-4 md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      {/* Contenido de la página */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/cursos/${cursoId}`}>
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Curso
              </Button>
            </Link>
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                {nivelId.toUpperCase()}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{nivel.nombre}</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{nivel.descripcion}</p>
            </div>
          </div>

          {/* Docentes */}
          <div className="space-y-8 max-w-6xl mx-auto">
            {docentes.map((docente) => (
              <Card key={docente.id} className="border-2 hover:border-green-300 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={docente.imagen} alt={docente.nombre} />
                        <AvatarFallback>{docente.nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{docente.nombre}</CardTitle>
                        <CardDescription className="text-base">{docente.especialidad}</CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{docente.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{docente.estudiantes} estudiantes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{docente.experiencia} experiencia</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">Horarios Disponibles</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {docente.horarios.map((horario) => (
                        <Card 
                          key={horario.id} 
                          className={`border-2 cursor-pointer transition-all ${
                            selectedHorario === horario.id 
                              ? 'border-green-500 bg-green-50' 
                              : 'hover:border-green-300'
                          }`}
                          onClick={() => setSelectedHorario(horario.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {horario.modalidad}
                                </Badge>
                                <Badge variant={horario.estado === 'disponible' ? 'default' : 'secondary'} className="text-xs">
                                  {horario.estado === 'disponible' ? 'Disponible' : 'Lleno'}
                                </Badge>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{horario.dia}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span>{horario.hora}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-gray-500" />
                                  <span>{horario.cupos} cupos disponibles</span>
                                </div>
                              </div>

                              <div className="pt-2 border-t">
                                <div className="text-lg font-bold text-green-600">{horario.precio}</div>
                              </div>

                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={horario.estado !== 'disponible'}
                              >
                                Inscribirse
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {docentes.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay docentes disponibles</h3>
              <p className="text-gray-600">Próximamente tendremos docentes para este nivel.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 