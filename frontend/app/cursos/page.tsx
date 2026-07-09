"use client"
import Link from 'next/link'
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useCourses } from '@/contexts/CourseContext'
import { useEffect } from 'react'

const levelStyles: any = {
  "A1": {
    name: "Principiante",
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-600",
    hoverBgColor: "hover:bg-green-700",
    borderColor: "hover:border-green-300",
    iconColor: "text-green-600"
  },
  "A2": {
    name: "Principiante",
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-600",
    hoverBgColor: "hover:bg-green-700",
    borderColor: "hover:border-green-300",
    iconColor: "text-green-600"
  },
  "B1": {
    name: "Intermedio",
    gradient: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-600",
    hoverBgColor: "hover:bg-orange-700",
    borderColor: "hover:border-orange-300",
    iconColor: "text-orange-600"
  },
  "B2": {
    name: "Intermedio",
    gradient: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-600",
    hoverBgColor: "hover:bg-orange-700",
    borderColor: "hover:border-orange-300",
    iconColor: "text-orange-600"
  },
  "C1": {
    name: "Avanzado",
    gradient: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-600",
    hoverBgColor: "hover:bg-purple-700",
    borderColor: "hover:border-purple-300",
    iconColor: "text-purple-600"
  },
  "C2": {
    name: "Avanzado",
    gradient: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-600",
    hoverBgColor: "hover:bg-purple-700",
    borderColor: "hover:border-purple-300",
    iconColor: "text-purple-600"
  }
};

export default function CursosPage() {
  const { cursos, isLoading, error, fetchCursos } = useCourses()

  useEffect(() => {
    fetchCursos()
  }, [fetchCursos])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <MainNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Cargando cursos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        <MainNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchCursos}>Reintentar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Explora Nuestros Cursos
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Tenemos una variedad de cursos diseñados para llevar tu conocimiento
            del inglés al siguiente nivel. Encuentra el que mejor se adapte a ti.
          </p>
        </div>

        {cursos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No hay cursos disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cursos.map((curso) => {
              const styles = levelStyles[curso.nivel] || levelStyles["A1"];
              return (
                <Card key={curso.id} className={`relative overflow-hidden border-2 h-full flex flex-col transition-all hover:shadow-lg ${styles.borderColor}`}>
                  <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${styles.gradient}`}></div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge variant="secondary">{curso.nivel}</Badge>
                      {styles.name}
                    </CardTitle>
                    <CardDescription>{curso.descripcion}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{curso.duracion}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Horarios disponibles</span>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${styles.iconColor}`} />
                        <span>Curso completo de {curso.nivel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${styles.iconColor}`} />
                        <span>Duración: {curso.duracion}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/cursos/${curso.slug}`} className="w-full">
                      <Button className={`w-full ${styles.bgColor} ${styles.hoverBgColor}`}>
                        Ver Horarios
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
} 