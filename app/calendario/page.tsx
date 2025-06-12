"use client"
import { useState } from "react";

const eventos = [
  { fecha: "2024-06-15", titulo: "Clase de Inglés Básico" },
  { fecha: "2024-06-18", titulo: "Clase de Conversación" },
  { fecha: "2024-06-22", titulo: "Examen de Nivel Intermedio" },
];

function getHoy() {
  return new Date().toISOString().slice(0, 10);
}

export default function CalendarioPage() {
  const [selected, setSelected] = useState(getHoy());

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Calendario de Clases</h1>
      <input
        type="date"
        value={selected}
        onChange={e => setSelected(e.target.value)}
        className="mb-6 p-2 border rounded"
      />
      <div className="w-full max-w-lg space-y-4">
        {eventos.filter(ev => ev.fecha === selected).length === 0 ? (
          <p className="text-gray-600 text-center">No hay eventos para este día.</p>
        ) : (
          eventos.filter(ev => ev.fecha === selected).map((ev, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4">
              <h2 className="text-lg font-semibold text-green-700">{ev.titulo}</h2>
              <p className="text-gray-600">{ev.fecha}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 