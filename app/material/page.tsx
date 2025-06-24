"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, PlayCircle, Book } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'

// Datos simulados de materiales de estudio
const mockMaterials = {
  "a1-a2": [
    { title: "Guía de Vocabulario Básico", type: "pdf", icon: FileText, size: "2.5 MB" },
    { title: "Video: Saludos y Presentaciones", type: "video", icon: PlayCircle, duration: "10:32" },
    { title: "Ejercicios: Verbo 'To Be'", type: "interactive", icon: Book, exercises: 20 },
    { title: "Lectura: 'My First Day'", type: "pdf", icon: FileText, size: "1.2 MB" },
  ],
  "b1-b2": [
    { title: "Manual de Gramática Intermedia", type: "pdf", icon: FileText, size: "5.1 MB" },
    { title: "Podcast: 'English Conversations'", type: "video", icon: PlayCircle, duration: "25:45" },
    { title: "Ejercicios: Tiempos Perfectos", type: "interactive", icon: Book, exercises: 30 },
    { title: "Artículo: 'Cultural Differences'", type: "pdf", icon: FileText, size: "3.4 MB" },
  ],
  "c1-c2": [
    { title: "Guía de Escritura Académica", type: "pdf", icon: FileText, size: "4.8 MB" },
    { title: "Debate: 'Technology in Education'", type: "video", icon: PlayCircle, duration: "45:10" },
    { title: "Ejercicios: 'Phrasal Verbs'", type: "interactive", icon: Book, exercises: 50 },
    { title: "Análisis Literario: '1984'", type: "pdf", icon: FileText, size: "2.1 MB" },
  ]
}

export default function MaterialPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Material de Estudio</h1>
          <p className="text-gray-600 mt-2 text-lg">Recursos de aprendizaje para cada nivel</p>
        </div>

        <Tabs defaultValue="a1-a2" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="a1-a2">Nivel A1-A2 (Principiante)</TabsTrigger>
            <TabsTrigger value="b1-b2">Nivel B1-B2 (Intermedio)</TabsTrigger>
            <TabsTrigger value="c1-c2">Nivel C1-C2 (Avanzado)</TabsTrigger>
          </TabsList>
          {(['a1-a2', 'b1-b2', 'c1-c2'] as const).map((nivel) => (
            <TabsContent key={nivel} value={nivel}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {mockMaterials[nivel].map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <item.icon className={`h-8 w-8 ${nivel === 'a1-a2' ? 'text-green-600' : nivel === 'b1-b2' ? 'text-orange-600' : 'text-purple-600'} mb-2`} />
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-gray-500">
                        {item.type === 'pdf' ? item.size : item.type === 'video' ? item.duration : `${item.exercises} ejercicios`}
                      </p>
                      <button
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                        onClick={() => toast({ title: 'Descarga iniciada', description: 'Tu material se está descargando.' })}
                      >
                        Descargar
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
} 