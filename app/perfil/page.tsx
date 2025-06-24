"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PerfilPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (!isLoading && user) {
      // Simular roles basados en el email para demostración
      // En producción esto vendría de la base de datos
      const email = user.email.toLowerCase()
      
      if (email.includes('admin') || email.includes('administrador')) {
        router.push('/admin')
      } else if (email.includes('docente') || email.includes('teacher')) {
        router.push('/perfil/docente')
      } else {
        // Por defecto, asumimos que es estudiante
        router.push('/perfil/estudiante')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>
  )
} 