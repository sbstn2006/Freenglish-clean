"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Play, Star, Globe, Headphones, CheckCircle, ArrowRight, Menu, LogOut, User, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import MainNavigation from "@/components/MainNavigation"
import { cursos, Curso } from "@/data/cursos"

const levelStyles: any = {
  "A1-A2": {
    name: "Principiante",
    gradient: "from-green-400 to-green-600",
    bgColor: "bg-green-600",
    hoverBgColor: "hover:bg-green-700",
    borderColor: "hover:border-green-300",
    iconColor: "text-green-600"
  },
  "B1-B2": {
    name: "Intermedio",
    gradient: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-600",
    hoverBgColor: "hover:bg-orange-700",
    borderColor: "hover:border-orange-300",
    iconColor: "text-orange-600"
  },
  "C1-C2": {
    name: "Avanzado",
    gradient: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-600",
    hoverBgColor: "hover:bg-purple-700",
    borderColor: "hover:border-purple-300",
    iconColor: "text-purple-600"
  }
};

export default function FreenglishLanding() {
  const [year, setYear] = useState<number | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleComenzarAhora = () => {
    if (user) {
      router.push('/cursos');
    } else {
      router.push('/register');
    }
  };

  const handleComenzarNivel = (slug: string) => {
    if (user) {
      router.push(`/cursos/${slug}`);
    } else {
      router.push('/register');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <main className="flex-1">
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
                  <Button 
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleComenzarAhora}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {user ? 'Ir a Cursos' : 'Comenzar Ahora'}
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

        {/* caracteristicas */}
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

        {/* Sección de Niveles de Cursos */}
        <section id="niveles" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Nuestros Niveles</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Un Camino Para Cada Estudiante</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Desde principiantes hasta avanzados, tenemos un curso diseñado para tus necesidades.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {cursos.map((curso: Curso) => {
                const styles = levelStyles[curso.level] || levelStyles["A1-A2"];
                return (
                  <div key={curso.id} className="flex justify-center">
                    <Card className={`relative overflow-hidden border-2 h-full flex flex-col transition-all hover:shadow-lg w-full max-w-sm ${styles.borderColor}`}>
                      <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${styles.gradient}`}></div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="secondary">{curso.level}</Badge>
                          {styles.name}
                        </CardTitle>
                        <CardDescription>{curso.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <ul className="space-y-2 text-sm">
                          {curso.learnings.slice(0, 3).map((item: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className={`h-4 w-4 ${styles.iconColor}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full ${styles.bgColor} ${styles.hoverBgColor}`}
                          onClick={() => handleComenzarNivel(curso.slug)}
                        >
                          Ver Horarios
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Lo que dicen nuestros estudiantes</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Miles de estudiantes han mejorado su inglés con Freenglish
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-2 hover:border-green-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Freenglish me ayudó a aprender inglés desde cero. Los docentes son excelentes y los horarios muy flexibles."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">M</span>
                    </div>
                    <div>
                      <p className="font-semibold">María García</p>
                      <p className="text-sm text-gray-500">Estudiante A2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-orange-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "Gracias a Freenglish pude mejorar mi inglés para el trabajo. Los cursos son muy prácticos y útiles."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold">C</span>
                    </div>
                    <div>
                      <p className="font-semibold">Carlos López</p>
                      <p className="text-sm text-gray-500">Estudiante B2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-purple-200 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "La mejor plataforma gratuita para aprender inglés. Los docentes son profesionales y muy dedicados."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">A</span>
                    </div>
                    <div>
                      <p className="font-semibold">Ana Rodríguez</p>
                      <p className="text-sm text-gray-500">Estudiante C1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-green-50 to-orange-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Tienes preguntas?</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                Nuestro equipo está aquí para ayudarte en tu camino de aprendizaje
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <Input placeholder="Tu nombre" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input placeholder="tu@email.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mensaje</label>
                      <textarea 
                        placeholder="¿En qué podemos ayudarte?"
                        className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Enviar Mensaje
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white">
        <div className="container px-4 md:px-6 mx-auto py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Globe className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Freenglish</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="#cursos" className="hover:text-green-600 transition-colors">Cursos</Link>
              <Link href="#niveles" className="hover:text-green-600 transition-colors">Niveles</Link>
              <Link href="#testimonios" className="hover:text-green-600 transition-colors">Testimonios</Link>
              <Link href="#contacto" className="hover:text-green-600 transition-colors">Contacto</Link>
            </div>
          </div>
          <div className="border-t mt-6 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {year} Freenglish. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
