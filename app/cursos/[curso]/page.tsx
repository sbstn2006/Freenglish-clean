"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Clock, Users, Star, Globe, Menu, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cursosData } from "@/data/cursos"
import HorariosResumen from "@/components/HorariosResumen"
import EstadisticasDocentes from "@/components/EstadisticasDocentes"
import { useAuth } from "@/contexts/AuthContext"

export default function CursoPage() {
  const params = useParams()
  const cursoId = params.curso as string
  const curso = cursosData[cursoId]
  const { user, logout } = useAuth()

  if (!curso) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <div className="flex flex-col items-center justify-center flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
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
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{curso.titulo}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{curso.descripcion}</p>
          </div>

          {/* Niveles */}
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {curso.niveles.map((nivel) => (
              <Card key={nivel.id} className="border-2 hover:border-green-300 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-sm">
                      {nivel.id.toUpperCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{nivel.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{nivel.nombre}</CardTitle>
                  <CardDescription className="text-base">{nivel.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{nivel.duracion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{nivel.estudiantes} estudiantes</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">Incluye:</p>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {nivel.lecciones} lecciones interactivas
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Ejercicios de práctica
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Certificado de finalización
                        </li>
                      </ul>
                    </div>

                    {/* Estadísticas de docentes */}
                    <EstadisticasDocentes cursoId={cursoId} nivelId={nivel.id} />

                    {/* Resumen de horarios */}
                    <HorariosResumen cursoId={cursoId} nivelId={nivel.id} />

                    <Link href={`/cursos/${cursoId}/${nivel.id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Ver Docentes y Horarios
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Botón de regreso */}
          <div className="text-center mt-12">
            <Link href="/cursos">
              <Button variant="outline">
                ← Volver a Todos los Cursos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
} 