"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, User, LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function MainNavigation() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Detectar rol basado en el email
  const getUserRole = () => {
    if (!user) return null
    
    const email = user.email.toLowerCase()
    if (email.includes('admin') || email.includes('administrador')) {
      return 'admin'
    } else if (email.includes('docente') || email.includes('teacher')) {
      return 'docente'
    } else {
      return 'estudiante'
    }
  }

  const userRole = getUserRole()

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center">
        <Globe className="h-8 w-8 text-green-600 mr-2" />
        <span className="text-2xl font-bold text-gray-900">Freenglish</span>
      </Link>
      <nav className="ml-auto hidden md:flex items-center gap-4">
        {/* Opciones comunes para todos */}
        {!user && (
          <>
            <Link href="/#niveles" className="text-sm font-medium hover:text-green-600 transition-colors">
              Niveles
            </Link>
            <Link href="/#testimonios" className="text-sm font-medium hover:text-green-600 transition-colors">
              Testimonios
            </Link>
            <Link href="/#contacto" className="text-sm font-medium hover:text-green-600 transition-colors">
              Contáctanos
            </Link>
          </>
        )}

        {/* Opciones específicas según autenticación y rol */}
        {user ? (
          <>
            {/* Opciones específicas por rol */}
            {userRole === 'admin' ? (
              // Menú de Admin
              <>
                <Link href="/admin/estudiantes" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Estudiantes
                </Link>
                <Link href="/admin/docentes" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Docentes
                </Link>
                <Link href="/admin/cursos" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Cursos
                </Link>
                <Link href="/admin/inscripciones" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Inscripciones
                </Link>
                <Link href="/admin/material" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Material
                </Link>
                <Link href="/admin" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Panel
                </Link>
              </>
            ) : (
              // Menú para estudiantes y docentes
              <>
                <Link href="/#niveles" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Cursos
                </Link>
                <Link href="/calendario" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Calendario
                </Link>
                <Link href="/material" className="text-sm font-medium hover:text-green-600 transition-colors">
                  Material
                </Link>
              </>
            )}

            {/* Información del usuario */}
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="text-green-600 font-medium">{user.name}</span>
            </div>

            {/* Botón de perfil (solo para estudiantes y docentes) */}
            {userRole !== 'admin' && (
              <Link href="/perfil">
                <Button variant="outline" size="sm" className="text-sm">
                  Mi Perfil
                </Button>
              </Link>
            )}

            {/* Botón de cerrar sesión */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="text-sm"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Cerrar Sesión
            </Button>
          </>
        ) : (
          // Menú para usuarios no autenticados
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
  )
} 