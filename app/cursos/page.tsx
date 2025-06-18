"use client"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Menu, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const cursos = [
  { 
    id: "ingles-basico",
    titulo: "Inglés Básico", 
    descripcion: "Comienza desde cero y aprende lo esencial." 
  },
  { 
    id: "ingles-intermedio",
    titulo: "Inglés Intermedio", 
    descripcion: "Mejora tu gramática y vocabulario." 
  },
  { 
    id: "ingles-avanzado",
    titulo: "Inglés Avanzado", 
    descripcion: "Perfecciona tu fluidez y comprensión." 
  },
];

export default function CursosPage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header idéntico al de la página principal */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Globe className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">Freenglish</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <Link href="/#cursos" className="text-sm font-medium hover:text-green-600 transition-colors">
            Cursos
          </Link>
          <Link href="/#niveles" className="text-sm font-medium hover:text-green-600 transition-colors">
            Niveles
          </Link>
          <Link href="/#testimonios" className="text-sm font-medium hover:text-green-600 transition-colors">
            Testimonios
          </Link>
          <Link href="/#contacto" className="text-sm font-medium hover:text-green-600 transition-colors">
            Contacto
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="text-green-600 font-medium">{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar Sesión
              </Button>
            </div>
          ) : (
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

      {/* Contenido de la página */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">Todos los Cursos</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Cursos de Inglés</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde principiante hasta avanzado, tenemos el curso perfecto para tu nivel de inglés
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl mx-auto">
            {cursos.map((curso, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold text-green-700 mb-2">{curso.titulo}</h2>
                <p className="text-gray-600 mb-4">{curso.descripcion}</p>
                <Link href={`/cursos/${curso.id}`}>
                  <Button className="bg-green-600 hover:bg-green-700">Ver más</Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Botón de regreso */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline">
                ← Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 