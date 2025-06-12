"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Play, Star, Globe, Headphones, CheckCircle, ArrowRight, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function FreenglishLanding() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header restaurado y extendido */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <Globe className="h-8 w-8 text-green-600 mr-2" />
          <span className="text-2xl font-bold text-gray-900">Freenglish</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-6">
          <Link href="#cursos" className="text-sm font-medium hover:text-green-600 transition-colors">
            Cursos
          </Link>
          <Link href="#niveles" className="text-sm font-medium hover:text-green-600 transition-colors">
            Niveles
          </Link>
          <Link href="#testimonios" className="text-sm font-medium hover:text-green-600 transition-colors">
            Testimonios
          </Link>
          <Link href="#contacto" className="text-sm font-medium hover:text-green-600 transition-colors">
            Contacto
          </Link>
          <Link href="/login" className="text-sm font-medium hover:text-green-600 transition-colors">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:text-green-600 transition-colors">
            Registro
          </Link>
        </nav>
        <Button variant="outline" size="sm" className="ml-4 md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">100% Gratuito</Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
                    Aprende Inglés Gratis con Freenglish
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    La plataforma más completa para aprender inglés sin costo. Desde principiante hasta avanzado, con
                    lecciones interactivas, ejercicios prácticos y certificados gratuitos.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    <Play className="mr-2 h-4 w-4" />
                    Comenzar Ahora
                  </Button>
                  <Button variant="outline" size="lg">
                    Ver Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>+50,000 estudiantes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9/5 estrellas</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-orange-400 rounded-3xl blur-3xl opacity-30"></div>
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width={600}
                    height={400}
                    alt="Estudiantes aprendiendo inglés"
                    className="relative rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="cursos" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Por qué elegir Freenglish?</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Ofrecemos la mejor experiencia de aprendizaje de inglés completamente gratuita
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <BookOpen className="h-12 w-12 text-green-600 mb-2" />
                  <CardTitle>Lecciones Interactivas</CardTitle>
                  <CardDescription>
                    Aprende con lecciones dinámicas que se adaptan a tu ritmo de aprendizaje
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardHeader>
                  <Headphones className="h-12 w-12 text-orange-600 mb-2" />
                  <CardTitle>Práctica de Pronunciación</CardTitle>
                  <CardDescription>
                    Mejora tu pronunciación con ejercicios de audio y reconocimiento de voz
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <Award className="h-12 w-12 text-green-600 mb-2" />
                  <CardTitle>Certificados Gratuitos</CardTitle>
                  <CardDescription>
                    Obtén certificados oficiales al completar cada nivel sin costo adicional
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section id="niveles" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-50 to-orange-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Niveles de Aprendizaje</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Desde principiante hasta avanzado, tenemos el curso perfecto para ti
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="relative overflow-hidden border-2 hover:border-green-300 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">A1-A2</Badge>
                    Principiante
                  </CardTitle>
                  <CardDescription>Perfecto para quienes empiezan desde cero</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Vocabulario básico (500+ palabras)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Gramática fundamental
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Conversaciones simples
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Pronunciación básica
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Comenzar Nivel</Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 hover:border-orange-300 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">B1-B2</Badge>
                    Intermedio
                  </CardTitle>
                  <CardDescription>Para estudiantes con conocimientos básicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      Vocabulario ampliado (2000+ palabras)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      Gramática intermedia
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      Conversaciones fluidas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                      Comprensión auditiva
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700">Comenzar Nivel</Button>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-2 hover:border-green-300 transition-all hover:shadow-lg">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-600 to-green-800"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="secondary">C1-C2</Badge>
                    Avanzado
                  </CardTitle>
                  <CardDescription>Para alcanzar la fluidez completa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Vocabulario profesional (5000+ palabras)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Gramática avanzada
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Inglés de negocios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Preparación para exámenes
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Comenzar Nivel</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonios" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Lo que dicen nuestros estudiantes</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">M</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">María González</CardTitle>
                      <CardDescription>Estudiante de Nivel Intermedio</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "Freenglish me ayudó a conseguir mi trabajo soñado. Las lecciones son muy claras y el hecho de que
                    sea gratuito lo hace increíble."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">C</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">Carlos Rodríguez</CardTitle>
                      <CardDescription>Estudiante de Nivel Avanzado</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "La calidad de los cursos es excelente. He probado muchas plataformas pagadas y Freenglish supera a
                    todas."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">A</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">Ana Martínez</CardTitle>
                      <CardDescription>Estudiante Principiante</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    "Empecé sin saber nada de inglés y ahora puedo mantener conversaciones básicas. ¡Totalmente
                    recomendado!"
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-600 to-orange-600 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold">50,000+</div>
                <div className="text-green-100">Estudiantes Activos</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">1,000+</div>
                <div className="text-green-100">Lecciones Disponibles</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">95%</div>
                <div className="text-green-100">Tasa de Satisfacción</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">24/7</div>
                <div className="text-green-100">Acceso Completo</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  ¿Listo para comenzar tu aventura en inglés?
                </h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Únete a miles de estudiantes que ya están aprendiendo inglés gratis con Freenglish
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input type="email" placeholder="Tu correo electrónico" className="max-w-lg flex-1" />
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Comenzar
                  </Button>
                </form>
                <p className="text-xs text-gray-500">100% gratuito. Sin tarjeta de crédito requerida.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        id="contacto"
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50"
      >
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-xl font-bold">Freenglish</span>
              </div>
              <p className="text-sm text-gray-600">
                La plataforma líder en educación de inglés gratuita para hispanohablantes.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Cursos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Principiante
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Intermedio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Avanzado
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Inglés de Negocios
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Ejercicios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Certificados
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Comunidad
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Soporte
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Términos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-green-600">
                    Privacidad
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; {year ?? ""} Freenglish. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
