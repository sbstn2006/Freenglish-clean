"use client"
import { Button } from "@/components/ui/button";

const cursos = [
  { titulo: "Inglés Básico", descripcion: "Comienza desde cero y aprende lo esencial." },
  { titulo: "Inglés Intermedio", descripcion: "Mejora tu gramática y vocabulario." },
  { titulo: "Inglés Avanzado", descripcion: "Perfecciona tu fluidez y comprensión." },
];

export default function CursosPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Nuestros Cursos</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {cursos.map((curso, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start">
            <h2 className="text-xl font-semibold text-green-700 mb-2">{curso.titulo}</h2>
            <p className="text-gray-600 mb-4">{curso.descripcion}</p>
            <Button className="bg-green-600 hover:bg-green-700">Ver más</Button>
          </div>
        ))}
      </div>
    </div>
  );
} 