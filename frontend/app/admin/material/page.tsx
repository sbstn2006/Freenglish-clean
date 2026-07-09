"use client"
import MainNavigation from '@/components/MainNavigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { FileText, PlayCircle, Book, Plus, Edit, Trash2, Download } from 'lucide-react'
import { useState } from 'react'

// Datos simulados de materiales
const initialMaterials = {
  "a1-a2": [
    { id: 1, title: "Guía de Vocabulario Básico", type: "pdf", size: "2.5 MB", downloads: 156, date: "2024-01-15" },
    { id: 2, title: "Video: Saludos y Presentaciones", type: "video", duration: "10:32", views: 89, date: "2024-01-10" },
    { id: 3, title: "Ejercicios: Verbo 'To Be'", type: "interactive", exercises: 20, completions: 45, date: "2024-01-08" },
  ],
  "b1-b2": [
    { id: 4, title: "Manual de Gramática Intermedia", type: "pdf", size: "5.1 MB", downloads: 203, date: "2024-01-12" },
    { id: 5, title: "Podcast: 'English Conversations'", type: "video", duration: "25:45", views: 134, date: "2024-01-05" },
    { id: 6, title: "Ejercicios: Tiempos Perfectos", type: "interactive", exercises: 30, completions: 67, date: "2024-01-03" },
  ],
  "c1-c2": [
    { id: 7, title: "Guía de Escritura Académica", type: "pdf", size: "4.8 MB", downloads: 98, date: "2024-01-14" },
    { id: 8, title: "Debate: 'Technology in Education'", type: "video", duration: "45:10", views: 76, date: "2024-01-07" },
    { id: 9, title: "Ejercicios: 'Phrasal Verbs'", type: "interactive", exercises: 50, completions: 34, date: "2024-01-02" },
  ]
}

export default function AdminMaterialPage() {
  const [materials, setMaterials] = useState(initialMaterials)
  const [editingMaterial, setEditingMaterial] = useState<any>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    type: '',
    level: 'a1-a2'
  })

  const handleAddMaterial = () => {
    const id = Date.now()
    const material = {
      id,
      title: newMaterial.title,
      type: newMaterial.type,
      level: newMaterial.level,
      date: new Date().toISOString().split('T')[0],
      ...(newMaterial.type === 'pdf' && { size: '1.2 MB', downloads: 0 }),
      ...(newMaterial.type === 'video' && { duration: '00:00', views: 0 }),
      ...(newMaterial.type === 'interactive' && { exercises: 10, completions: 0 })
    }

    setMaterials(prev => ({
      ...prev,
      [newMaterial.level]: [...prev[newMaterial.level as keyof typeof prev], material]
    }))

    setNewMaterial({ title: '', type: '', level: 'a1-a2' })
    setIsAddDialogOpen(false)
  }

  const handleEditMaterial = (material: any) => {
    setEditingMaterial(material)
  }

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return

    setMaterials(prev => ({
      ...prev,
      [editingMaterial.level]: prev[editingMaterial.level as keyof typeof prev].map(m => 
        m.id === editingMaterial.id ? editingMaterial : m
      )
    }))

    setEditingMaterial(null)
  }

  const handleDeleteMaterial = (material: any) => {
    setMaterials(prev => ({
      ...prev,
      [material.level]: prev[material.level as keyof typeof prev].filter(m => m.id !== material.id)
    }))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'video': return PlayCircle
      case 'interactive': return Book
      default: return FileText
    }
  }

  const getStats = (material: any) => {
    if (material.type === 'pdf') return `${material.downloads} descargas`
    if (material.type === 'video') return `${material.views} visualizaciones`
    if (material.type === 'interactive') return `${material.completions} completados`
    return ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <a href="/admin">Volver al panel principal</a>
          </Button>
        </div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Material de Estudio</h1>
            <p className="text-gray-600 mt-2">Administra todos los recursos de aprendizaje por nivel</p>
          </div>
        </div>

        <Tabs defaultValue="a1-a2" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="a1-a2">Nivel A1-A2 (Principiante)</TabsTrigger>
            <TabsTrigger value="b1-b2">Nivel B1-B2 (Intermedio)</TabsTrigger>
            <TabsTrigger value="c1-c2">Nivel C1-C2 (Avanzado)</TabsTrigger>
          </TabsList>
          
          {(['a1-a2', 'b1-b2', 'c1-c2'] as const).map((level) => (
            <TabsContent key={level} value={level}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {materials[level].map((material) => {
                  const Icon = getIcon(material.type)
                  return (
                    <Card key={material.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Icon className="h-8 w-8 text-green-600" />
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => handleEditMaterial(material)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Material</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-title">Título</Label>
                                    <Input
                                      id="edit-title"
                                      value={editingMaterial?.title || ''}
                                      onChange={(e) => setEditingMaterial(prev => prev ? { ...prev, title: e.target.value } : null)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleUpdateMaterial}>
                                    Actualizar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. El material será eliminado permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteMaterial(material)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        <CardTitle className="text-base">{material.title}</CardTitle>
                        <CardDescription>
                          {material.type === 'pdf' && `Tamaño: ${material.size}`}
                          {material.type === 'video' && `Duración: ${material.duration}`}
                          {material.type === 'interactive' && `${material.exercises} ejercicios`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{getStats(material)}</span>
                          <span>{material.date}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <Button className="flex items-center gap-2 mt-4" disabled>
          <Plus className="h-4 w-4" />
          Agregar Material
        </Button>
      </div>
    </div>
  )
} 