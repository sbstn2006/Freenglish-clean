"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Calendar } from "lucide-react"
import { docentesData } from "@/data/cursos"

interface HorariosResumenProps {
  cursoId: string
  nivelId: string
}

export default function HorariosResumen({ cursoId, nivelId }: HorariosResumenProps) {
  const docentes = docentesData[cursoId]?.[nivelId] || []
  
  // Obtener todos los horarios únicos
  const todosHorarios = docentes.flatMap(docente => 
    docente.horarios.map(horario => ({
      ...horario,
      docente: docente.nombre
    }))
  )

  // Agrupar por modalidad
  const horariosPorModalidad = todosHorarios.reduce((acc, horario) => {
    if (!acc[horario.modalidad]) {
      acc[horario.modalidad] = []
    }
    acc[horario.modalidad].push(horario)
    return acc
  }, {} as Record<string, typeof todosHorarios>)

  if (todosHorarios.length === 0) {
    return null
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Horarios Disponibles</h4>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(horariosPorModalidad).map(([modalidad, horarios]) => (
          <Card key={modalidad} className="border-2 border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {modalidad}
                </Badge>
                <span>{horarios.length} opciones</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {horarios.slice(0, 3).map((horario) => (
                  <div key={horario.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">{horario.dia}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span>{horario.hora}</span>
                    </div>
                  </div>
                ))}
                {horarios.length > 3 && (
                  <div className="text-xs text-gray-500 pt-1">
                    +{horarios.length - 3} horarios más disponibles
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 