"use client"
import MainNavigation from "@/components/MainNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock, Video, User } from "lucide-react"
import { useCourses } from "@/contexts/CourseContext"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import mockTeacherData from "../perfil/docente/page"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function CalendarioPage() {
  const { user } = useAuth()
  const { enrolledSchedules } = useCourses()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [horarios, setHorarios] = useState<any[]>([])
  const [showMeet, setShowMeet] = useState(false)
  const [meetUrl, setMeetUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === "docente") {
      fetch(`http://localhost:4000/api/horarios?docenteId=${user.id}`)
        .then(res => res.json())
        .then(data => setHorarios(data))
    }
  }, [user])

  // Usar los horarios correctos según el rol
  const horariosToShow = user?.role === 'estudiante' ? enrolledSchedules : horarios;

  // Generar fechas de las próximas clases (por cada horario), soportando múltiples días en un solo string
  const diasValidos = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const getProximasClases = () => {
    const eventos: { fecha: Date, horario: any }[] = []
    const hoy = new Date()
    const finDeRango = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate())
    horariosToShow.forEach(horario => {
      // Soportar múltiples días en un solo string
      const dias = horario.dia_semana
        .toLowerCase()
        .replace(/,/g, ' y ')
        .split(' y ')
        .map(d => d.trim())
        .filter(d => diasValidos.includes(d));
      dias.forEach(dia => {
        const dayMap: { [key: string]: number } = {
          "lunes": 1, "martes": 2, "miércoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "domingo": 0
        }
        const day = dayMap[dia]
        if (day === undefined) return
        let fecha = new Date(hoy)
        fecha.setDate(hoy.getDate() + ((day - hoy.getDay() + 7) % 7))
        while (fecha <= finDeRango) {
          eventos.push({ fecha: new Date(fecha), horario })
          fecha = new Date(fecha)
          fecha.setDate(fecha.getDate() + 7)
        }
      })
    })
    return eventos.sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
  }

  const proximasClases = getProximasClases()
  const fechasClases = proximasClases.map(ev => ev.fecha)

  // Helper para validar Date
  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

  const clasesDelDia = isValidDate(date)
    ? proximasClases.filter(ev => ev.fecha.toDateString() === date.toDateString())
    : []

  // Función para generar un link simulado de Google Meet
  function generarMeetUrl(horarioId: number, fecha: Date) {
    // Simula un link único por clase y fecha
    const random = btoa(`${horarioId}-${fecha.toISOString()}`).replace(/=/g, '').slice(0, 12)
    return `https://meet.google.com/${random.slice(0,3)}-${random.slice(3,7)}-${random.slice(7,12)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mi Calendario de Clases</h1>
          <p className="text-gray-600 mt-2 text-lg">Aquí tienes un resumen de tus próximas clases programadas.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Próximas Clases</h2>
            {proximasClases.length > 0 ? proximasClases.slice(0, 8).map((ev, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{ev.horario.curso_nombre || '-'}</CardTitle>
                    <Badge variant="secondary">{ev.fecha.toLocaleDateString('es-ES', { weekday: 'long' })}</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 pt-2">
                    <CalendarIcon className="h-4 w-4" /> {ev.fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    <Clock className="h-4 w-4" /> {ev.horario.hora_inicio} - {ev.horario.hora_fin}
                  </CardDescription>
                  <Button size="sm" className="mt-2" onClick={() => {
                    setMeetUrl(generarMeetUrl(ev.horario.id, ev.fecha));
                    setShowMeet(true);
                  }}>
                    Unirse a la clase
                  </Button>
                </CardHeader>
              </Card>
            )) : <p>No tienes clases próximas.</p>}
            {/* Clases del día seleccionado */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800">Clases del día</h2>
              {clasesDelDia.length === 0 ? (
                <p className="text-gray-500">No hay clases programadas para este día.</p>
              ) : (
                <ul className="space-y-4 mt-2">
                  {clasesDelDia.map((ev, idx) => (
                    <li key={idx} className="flex flex-col gap-2 border rounded-lg p-3 bg-white/80">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{ev.horario.curso_nombre || '-'}</span>
                        <Badge variant="outline">{ev.horario.hora_inicio} - {ev.horario.hora_fin}</Badge>
                      </div>
                      <Button size="sm" onClick={() => {
                        setMeetUrl(generarMeetUrl(ev.horario.id, ev.fecha));
                        setShowMeet(true);
                      }}>
                        Unirse a la clase
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0 md:p-6 flex justify-center">
                <Calendar
                  mode="multiple"
                  selected={fechasClases}
                  onSelect={setDate}
                  className="p-4 sm:p-0"
                  classNames={{
                    day_selected: "bg-green-600 text-white hover:bg-green-600 hover:text-white focus:bg-green-600 focus:text-white",
                    day_today: "bg-green-100 text-green-900",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Modal decorativo para el link de Meet */}
        <Dialog open={showMeet} onOpenChange={setShowMeet}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enlace de Google Meet</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 items-center">
              <a href={meetUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-green-700 underline text-lg break-all">{meetUrl}</a>
              <Button asChild>
                <a href={meetUrl || '#'} target="_blank" rel="noopener noreferrer">Abrir en nueva pestaña</a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 