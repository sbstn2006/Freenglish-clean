import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata: Metadata = {
  title: 'Freenglish - Aprende Inglés Gratis',
  description: 'La plataforma más completa para aprender inglés sin costo',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
