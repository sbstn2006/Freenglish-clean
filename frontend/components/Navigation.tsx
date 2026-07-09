"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Globe, LogOut, Home, BookOpen, Calendar, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface NavigationProps {
  userData?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
}

export default function Navigation({ userData }: NavigationProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2">
              <Globe className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Freenglish</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
              <Link href="/cursos" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Cursos</span>
              </Link>
              <Link href="/calendario" className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors">
                <Calendar className="h-4 w-4" />
                <span>Calendario</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {userData && (
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                  <div className="text-xs text-gray-500">{userData.role || 'Usuario'}</div>
                </div>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 