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

export default function CalendarioPage() {
  const { user } = useAuth()
  const { enrolledSchedules, isLoading } = useCourses()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [teacherSchedules, setTeacherSchedules] = useState<any[]>([])

  useEffect(() => {
    if (user?.role === "docente") {
      setTeacherSchedules(mockTeacherData.horarios)
    }
  }, [user])

  const getEventsForSchedule = (schedule: any) => {
    const events = []
    const now = new Date()
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    const scheduleDays = schedule.schedule.split(',')[0].split(' y ').map((d: string) => {
        const dayMap: { [key: string]: number } = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábados': 6, 'Domingos': 0 };
        return dayMap[d.trim()];
    }).filter((d: number | undefined) => d !== undefined);
    
    if (scheduleDays.length === 0) return [];

    for (let i = 0; i < 4; i++) {
        scheduleDays.forEach((day: number) => {
            const nextDay = new Date(now)
            nextDay.setDate(now.getDate() + (day - now.getDay() + 7) % 7 + i * 7)
            events.push({
                date: nextDay,
                day: weekdays[day],
                time: schedule.schedule.split(',')[1]?.trim() || "Hora no especificada",
                teacher: schedule.teacher,
                scheduleId: schedule.id
            })
        })
    }
    return events
  }

  const getEventsForTeacherSchedule = (horario: any) => {
    const events = []
    const now = new Date()
    const dayMap: { [key: string]: number } = {
      "lunes": 1, "martes": 2, "miércoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "domingo": 0
    }
    const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    const day = dayMap[horario.dia.toLowerCase()]
    if (day === undefined) return []
    for (let i = 0; i < 4; i++) {
        const nextDay = new Date(now)
        nextDay.setDate(now.getDate() + (day - now.getDay() + 7) % 7 + i * 7)
        events.push({
            date: nextDay,
            day: weekdays[day],
            time: `${horario.horaInicio} - ${horario.horaFin}`,
            teacher: user?.name,
            scheduleId: horario.id,
            curso: horario.curso
        })
    }
    return events
  }

  const allEvents = user?.role === "docente"
    ? (Array.isArray(teacherSchedules) ? teacherSchedules.flatMap(getEventsForTeacherSchedule) : [])
    : (Array.isArray(enrolledSchedules) ? enrolledSchedules.flatMap(getEventsForSchedule) : [])

  const classDays = allEvents.map(event => event.date)

  const upcomingEvents = allEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5) 

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mi Calendario de Clases</h1>
          <p className="text-gray-600 mt-2 text-lg">Aquí tienes un resumen de tus próximas clases y eventos.</p>
        </div>
        
        {isLoading ? (
          <Card className="text-center py-16">
            <CardHeader>
              <CardTitle className="text-2xl">Cargando tu calendario...</CardTitle>
            </CardHeader>
          </Card>
        ) : user && enrolledSchedules.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Próximas Clases</h2>
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Clase de Inglés</CardTitle>
                      <Badge variant="secondary">{event.day}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 pt-2">
                      <CalendarIcon className="h-4 w-4" /> {event.date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                      <Clock className="h-4 w-4" /> {event.time}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" /> {event.teacher}
                      </div>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Unirse a Clase
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : <p>No tienes clases próximas.</p>}
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0 md:p-6 flex justify-center">
                 <Calendar
                    mode="multiple"
                    selected={classDays}
                    onSelect={() => {}}
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
        ) : (
          <Card className="text-center py-16">
            <CardHeader>
              <CardTitle className="text-2xl">No tienes clases programadas</CardTitle>
              <CardDescription className="mt-2">
                Parece que todavía no te has inscrito a ningún curso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/#niveles">
                <Button>Explorar Cursos</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 