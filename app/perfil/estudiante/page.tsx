"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, BookOpen, Clock, User, Settings, Edit, Award, LogOut, Trash2, BookMarked, CircleUserRound } from 'lucide-react'
import MainNavigation from '@/components/MainNavigation'
import { useCourses } from "@/contexts/CourseContext"
import Link from 'next/link'
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EstudianteProfilePage() {
  const { user, logout } = useAuth()
  const { enrolledSchedules, leaveSchedule, isLoading } = useCourses()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user || user.role !== 'estudiante') {
    return (
      <div className='h-screen flex items-center justify-center'>
        <p>No tienes acceso.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CircleUserRound className="h-8 w-8 text-green-600" />
                Perfil de Estudiante
              </CardTitle>
              <CardDescription>Hola, {user.name}. Aquí puedes gestionar tus cursos.</CardDescription>
            </div>
            <Button onClick={handleLogout} variant="outline">Cerrar Sesión</Button>
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookMarked className="h-6 w-6" />
              Mis Cursos Inscritos
            </h2>
            {isLoading ? (
              <p>Cargando tus cursos...</p>
            ) : enrolledSchedules.length > 0 ? (
              <ul className="space-y-4">
                {enrolledSchedules.map(schedule => (
                  <li key={schedule.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-semibold">{schedule.teacher}</h3>
                      <p className="text-sm text-gray-600">{schedule.schedule}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => leaveSchedule(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Dar de baja
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">Aún no te has inscrito en ningún curso.</p>
                <Link href="/#niveles">
                  <Button>Explorar Cursos</Button>
                </Link>
              </div>
            )}

            <div className="mt-8 border-t pt-6 text-center">
              <h3 className="text-lg font-semibold mb-2">¿Quieres ver tu horario completo?</h3>
              <p className="text-gray-600 mb-4">Organiza tu semana y no te pierdas ninguna clase.</p>
              <Link href="/calendario">
                <Button variant="secondary">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver mi Calendario
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 