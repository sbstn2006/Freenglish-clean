"use client"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PerfilRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.rol === "docente") router.replace("/perfil/docente")
      else if (user.rol === "estudiante") router.replace("/perfil/estudiante")
      else if (user.rol === "admin") router.replace("/admin")
    }
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-gray-500">Redirigiendo...</span>
    </div>
  )
} 