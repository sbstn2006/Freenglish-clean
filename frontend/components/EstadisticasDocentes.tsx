"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Star, Clock, BookOpen } from "lucide-react"
import { docentesData } from "@/data/cursos"

interface EstadisticasDocentesProps {
  cursoId: string
  nivelId: string
}

export default function EstadisticasDocentes({ cursoId, nivelId }: EstadisticasDocentesProps) {
  const docentes = docentesData[cursoId]?.[nivelId] || []
  
  if (docentes.length === 0) {
    return <div style={{ display: 'none' }}></div>
  }

  // Calcular estadísticas
  const totalEstudiantes = docentes.reduce((sum, docente) => sum + docente.estudiantes, 0)
  const promedioRating = docentes.reduce((sum, docente) => sum + docente.rating, 0) / docentes.length
  const totalHorarios = docentes.reduce((sum, docente) => sum + docente.horarios.length, 0)
  const totalExperiencia = docentes.reduce((sum, docente) => {
    const años = parseInt(docente.experiencia.split(' ')[0])
    return sum + años
  }, 0)

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Estadísticas de Docentes</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-2 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm font-medium">{docentes.length}</div>
                <div className="text-xs text-gray-500">Docentes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">{promedioRating.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Rating Promedio</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm font-medium">{totalHorarios}</div>
                <div className="text-xs text-gray-500">Horarios</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm font-medium">{totalExperiencia}</div>
                <div className="text-xs text-gray-500">Años Exp.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 