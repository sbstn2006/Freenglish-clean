import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { AuthProvider } from '@/contexts/AuthContext'
import { CourseProvider } from '@/contexts/CourseContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FreeEnglish - Aprende Inglés Gratis',
  description: 'Plataforma gratuita para aprender inglés con profesores certificados',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <CourseProvider>
            {children}
          </CourseProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
